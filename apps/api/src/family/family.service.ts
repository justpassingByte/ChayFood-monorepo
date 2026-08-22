import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateFamilyMemberDto,
  GenerateHarmonizedFamilyPlanDto,
  JoinFamilyGroupDto,
  UpdateFamilyMemberDto,
} from './dto/family.dto';
import { ActivityLevel, FamilyMember as SharedFamilyMember, FamilyRelation } from '@chayfood/shared-types';
import { FamilyNutritionService } from './family-nutrition.service';
import { FamilyGroup as DbFamilyGroup, FamilyMember as DbFamilyMember } from '@chayfood/db';

const MAX_FAMILY_MEMBERS = 10;

type FamilyGroupWithMembers = DbFamilyGroup & {
  members?: DbFamilyMember[];
};

@Injectable()
export class FamilyService {
  constructor(
    private prisma: PrismaService,
    private nutritionService: FamilyNutritionService,
  ) {}

  /**
   * 🔑 Tạo Mã Mời Gia Đình 8 Ký Tự Ngẫu Nhiên Bảo Mật Cao (Chống Brute-Force)
   */
  private generateSecureInviteCode(): string {
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `FAM-${randomHex}`;
  }

  async getOrCreateFamilyGroup(userId: string) {
    let group = await this.prisma.familyGroup.findFirst({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        members: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!group) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const inviteCode = this.generateSecureInviteCode();

      group = await this.prisma.familyGroup.create({
        data: {
          ownerId: userId,
          name: `Gia Đình ${user?.name || 'ChayFood'}`,
          inviteCode,
          members: {
            create: {
              userId,
              name: user?.name || 'Chủ Hộ',
              relation: FamilyRelation.SELF,
              isManaged: false,
              activityLevel: ActivityLevel.MODERATELY_ACTIVE,
            },
          },
        },
        include: {
          members: true,
        },
      });
    }

    return this.mapGroup(group);
  }

  async getMembers(userId: string) {
    const group = await this.getOrCreateFamilyGroup(userId);
    return group.members || [];
  }

  async addMember(userId: string, dto: CreateFamilyMemberDto) {
    const group = await this.getOrCreateFamilyGroup(userId);

    // 🛡️ Chặn Bơm Thành Viên Ma (Family Member Cap DoS Defense)
    if (group.members && group.members.length >= MAX_FAMILY_MEMBERS) {
      throw new BadRequestException(`Nhóm gia đình đã đạt giới hạn tối đa ${MAX_FAMILY_MEMBERS} thành viên`);
    }

    const calculatedCalories = this.nutritionService.estimateDailyCalories(
      dto.age,
      dto.gender,
      dto.heightCm,
      dto.weightKg,
      dto.activityLevel,
    );

    const member = await this.prisma.familyMember.create({
      data: {
        familyGroupId: group.id,
        name: dto.name,
        relation: dto.relation,
        age: dto.age,
        gender: dto.gender,
        heightCm: dto.heightCm,
        weightKg: dto.weightKg,
        activityLevel: dto.activityLevel || ActivityLevel.SEDENTARY,
        dailyCalories: calculatedCalories,
        medicalConditions: dto.medicalConditions || [],
        dietaryRestrictions: dto.dietaryRestrictions || [],
        isManaged: dto.isManaged ?? true,
        notes: dto.notes,
      },
    });

    return this.mapMember(member);
  }

  async updateMember(userId: string, memberId: string, dto: UpdateFamilyMemberDto) {
    const group = await this.getOrCreateFamilyGroup(userId);

    // 🛡️ Chống Lỗ Hổng IDOR: Xác thực thành viên thực sự thuộc về nhóm gia đình của user
    const existing = await this.prisma.familyMember.findFirst({
      where: { id: memberId, familyGroupId: group.id },
    });

    if (!existing) {
      throw new NotFoundException(`Không tìm thấy thành viên với mã ${memberId} trong gia đình`);
    }

    const calculatedCalories = this.nutritionService.estimateDailyCalories(
      dto.age ?? existing.age ?? undefined,
      dto.gender ?? existing.gender ?? undefined,
      dto.heightCm ? Number(dto.heightCm) : existing.heightCm ? Number(existing.heightCm) : undefined,
      dto.weightKg ? Number(dto.weightKg) : existing.weightKg ? Number(existing.weightKg) : undefined,
      (dto.activityLevel ?? existing.activityLevel) as ActivityLevel,
    );

    const updated = await this.prisma.familyMember.update({
      where: { id: memberId },
      data: {
        name: dto.name,
        relation: dto.relation,
        age: dto.age,
        gender: dto.gender,
        heightCm: dto.heightCm,
        weightKg: dto.weightKg,
        activityLevel: dto.activityLevel,
        dailyCalories: calculatedCalories,
        medicalConditions: dto.medicalConditions,
        dietaryRestrictions: dto.dietaryRestrictions,
        isManaged: dto.isManaged,
        notes: dto.notes,
      },
    });

    return this.mapMember(updated);
  }

  async deleteMember(userId: string, memberId: string) {
    const group = await this.getOrCreateFamilyGroup(userId);

    // 🛡️ Chống Lỗ Hổng IDOR: Xác thực quyền sở hữu nhóm
    const existing = await this.prisma.familyMember.findFirst({
      where: { id: memberId, familyGroupId: group.id },
    });

    if (!existing) {
      throw new NotFoundException(`Không tìm thấy thành viên với mã ${memberId} trong gia đình`);
    }

    // 👑 Bất Biến Chủ Hộ (Self-Demotion / Last Admin Standing Defense)
    if (existing.relation === FamilyRelation.SELF || existing.userId === userId) {
      throw new BadRequestException('Không thể xóa tài khoản chủ hộ khỏi nhóm gia đình');
    }

    await this.prisma.familyMember.delete({ where: { id: memberId } });
    return { success: true, message: 'Đã xóa thành viên thành công' };
  }

  async joinByCode(userId: string, dto: JoinFamilyGroupDto) {
    const targetGroup = await this.prisma.familyGroup.findUnique({
      where: { inviteCode: dto.inviteCode.trim() },
      include: { members: true },
    });

    if (!targetGroup) {
      throw new NotFoundException('Mã mời gia đình không hợp lệ hoặc không tồn tại');
    }

    // 🛡️ Chặn Bơm Thành Viên Quá Giới Hạn
    if (targetGroup.members.length >= MAX_FAMILY_MEMBERS) {
      throw new BadRequestException(`Nhóm gia đình đã đạt giới hạn tối đa ${MAX_FAMILY_MEMBERS} thành viên`);
    }

    // 🛡️ Chống Gia Nhập Trùng Lặp (Duplicate Join Defense)
    const isAlreadyIn = targetGroup.members.some((m) => m.userId === userId);
    if (isAlreadyIn) {
      throw new BadRequestException('Bạn đã là thành viên trong nhóm gia đình này');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const member = await this.prisma.familyMember.create({
      data: {
        familyGroupId: targetGroup.id,
        userId,
        name: user?.name || 'Thành Viên Mới',
        relation: dto.relation || FamilyRelation.OTHER,
        isManaged: false,
      },
    });

    return this.mapMember(member);
  }

  async generateHarmonizedPlan(userId: string, dto: GenerateHarmonizedFamilyPlanDto) {
    const group = await this.getOrCreateFamilyGroup(userId);
    let members = group.members || [];

    if (dto.memberIds && dto.memberIds.length > 0) {
      members = members.filter((m) => dto.memberIds?.includes(m.id));
    }

    if (members.length === 0) {
      members = group.members || [];
    }

    const sharedMembers: SharedFamilyMember[] = members.map((m) => ({
      ...m,
      gender: (m.gender === 'male' || m.gender === 'female' || m.gender === 'other') ? m.gender : null,
      relation: m.relation as FamilyRelation,
      activityLevel: m.activityLevel as ActivityLevel,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));

    return this.nutritionService.generateHarmonizedMealPlan(group.id, sharedMembers);
  }

  private mapGroup(group: FamilyGroupWithMembers) {
    return {
      ...group,
      members: (group.members || []).map((m) => this.mapMember(m)),
    };
  }

  private mapMember(member: DbFamilyMember) {
    return {
      ...member,
      heightCm: member.heightCm ? Number(member.heightCm) : null,
      weightKg: member.weightKg ? Number(member.weightKg) : null,
    };
  }
}
