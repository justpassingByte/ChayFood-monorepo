import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser, JwtAuthGuard } from '../auth/jwt.strategy';
import { FamilyService } from './family.service';
import {
  CreateFamilyMemberDto,
  GenerateHarmonizedFamilyPlanDto,
  JoinFamilyGroupDto,
  UpdateFamilyMemberDto,
} from './dto/family.dto';

@ApiTags('Family Accounts')
@Controller('family')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin nhóm gia đình và danh sách thành viên của tài khoản' })
  getFamilyGroup(@CurrentUser() user: AuthenticatedUser) {
    return this.familyService.getOrCreateFamilyGroup(user.id);
  }

  @Get('members')
  @ApiOperation({ summary: 'Lấy danh sách thành viên trong gia đình' })
  getMembers(@CurrentUser() user: AuthenticatedUser) {
    return this.familyService.getMembers(user.id);
  }

  @Post('members')
  @ApiOperation({ summary: 'Thêm thành viên mới vào gia đình (Người già, trẻ nhỏ, người thân)' })
  addMember(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateFamilyMemberDto) {
    return this.familyService.addMember(user.id, dto);
  }

  @Patch('members/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin thể trạng & bệnh lý của thành viên' })
  updateMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateFamilyMemberDto,
  ) {
    return this.familyService.updateMember(user.id, id, dto);
  }

  @Delete('members/:id')
  @ApiOperation({ summary: 'Xóa thành viên khỏi gia đình' })
  deleteMember(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.familyService.deleteMember(user.id, id);
  }

  @Post('join')
  @ApiOperation({ summary: 'Tham gia vào nhóm gia đình bằng Mã Mời (Invite Code)' })
  joinByCode(@CurrentUser() user: AuthenticatedUser, @Body() dto: JoinFamilyGroupDto) {
    return this.familyService.joinByCode(user.id, dto);
  }

  @Post('harmonized-plan')
  @ApiOperation({ summary: 'Sinh thực đơn Mâm Cơm Gia Đình Hài Hòa đa thế hệ và phân bổ khẩu phần' })
  generateHarmonizedPlan(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GenerateHarmonizedFamilyPlanDto,
  ) {
    return this.familyService.generateHarmonizedPlan(user.id, dto);
  }
}
