import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateSubscriptionDto) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan) {
      throw new NotFoundException('Không tìm thấy gói ăn này');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    return this.prisma.subscription.create({
      data: {
        userId,
        planId: dto.planId,
        startDate,
        endDate,
        deliveryAddress: dto.deliveryAddress as unknown as Prisma.InputJsonValue,
        paymentMethod: dto.paymentMethod,
        totalAmount: plan.price,
        selectedMenuItems: (dto.selectedMenuItems as unknown as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        specialInstructions: dto.specialInstructions,
      },
      include: {
        plan: true,
      },
    });
  }

  async findUserSubscriptions(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

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
