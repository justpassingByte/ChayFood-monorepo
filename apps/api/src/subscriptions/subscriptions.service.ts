import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@chayfood/db';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 🌟 Đăng ký gói ăn định kỳ (Server-Authoritative Pricing & Date Invariant):
   * 1. Kiểm tra gói ăn tồn tại và đang hoạt động (`plan.isActive === true`).
   * 2. Validate ngày bắt đầu không ở trong quá khứ.
   * 3. Tính `endDate = startDate + duration ngày`.
   * 4. Tính giá trực tiếp từ `plan.price` trong Database (Server-Authoritative Pricing).
   */
  async create(userId: string, dto: CreateSubscriptionDto) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan || !plan.isActive) {
      throw new NotFoundException('Gói ăn không tồn tại hoặc đã tạm ngừng kinh doanh');
    }

    const startDate = new Date(dto.startDate);
    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Ngày bắt đầu không hợp lệ');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      throw new BadRequestException('Ngày bắt đầu không được ở trong quá khứ');
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    // 🛡️ Type-safe JSON Object (Không sử dụng as unknown)
    const deliveryAddressJson: Prisma.InputJsonObject = {
      street: dto.deliveryAddress.street,
      city: dto.deliveryAddress.city,
      state: dto.deliveryAddress.state || 'Việt Nam',
      postalCode: dto.deliveryAddress.postalCode || '70000',
      ...(dto.deliveryAddress.additionalInfo ? { additionalInfo: dto.deliveryAddress.additionalInfo } : {}),
    };

    return this.prisma.subscription.create({
      data: {
        userId,
        planId: dto.planId,
        startDate,
        endDate,
        deliveryAddress: deliveryAddressJson,
        paymentMethod: dto.paymentMethod,
        totalAmount: plan.price,
        specialInstructions: dto.specialInstructions,
        ...(dto.selectedMenuItems
          ? { selectedMenuItems: dto.selectedMenuItems as Prisma.InputJsonValue }
          : {}),
      },
      include: {
        plan: true,
      },
    });

  }

  /**
   * 🛡️ Lấy danh sách gói ăn của người dùng (IDOR Scoped)
   */
  async findUserSubscriptions(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 🛡️ Tạm dừng hoặc kích hoạt lại gói ăn định kỳ (IDOR Defense):
   * - Chỉ chủ sở hữu gói ăn hoặc Admin mới được phép thao tác.
   */
  async toggleSubscription(id: string, userId: string, isAdmin = false) {
    const sub = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!sub) {
      throw new NotFoundException('Không tìm thấy thông tin gói ăn');
    }

    if (!isAdmin && sub.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền thay đổi trạng thái gói ăn này');
    }

    return this.prisma.subscription.update({
      where: { id },
      data: { isActive: !sub.isActive },
      include: { plan: true },
    });
  }

  /**
   * Lấy toàn bộ danh sách gói ăn (Admin Portal)
   */
  async findAll() {
    return this.prisma.subscription.findMany({
      include: {
        plan: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

