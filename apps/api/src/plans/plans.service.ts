import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/plan.dto';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const plans = await this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    return plans.map((p) => ({
      ...p,
      price: Number(p.price),
    }));
  }

  async findById(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Không tìm thấy gói ăn này');
    }

    return {
      ...plan,
      price: Number(plan.price),
    };
  }


  async create(dto: CreatePlanDto) {
    const plan = await this.prisma.plan.create({
      data: dto,
    });

    return {
      ...plan,
      price: Number(plan.price),
    };
  }
}
