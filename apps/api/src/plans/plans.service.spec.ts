import { NotFoundException } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PlansService (Catalog & Pricing)', () => {
  let service: PlansService;
  let mockPrisma: {
    plan: { findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock };
  };

  beforeEach(() => {
    mockPrisma = {
      plan: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    service = new PlansService(mockPrisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('chỉ trả về các gói ăn đang kích hoạt (isActive = true)', async () => {
      mockPrisma.plan.findMany.mockResolvedValue([
        {
          id: 'plan-1',
          name: 'Gói Chay Tuần',
          price: 350000,
          duration: 7,
          isActive: true,
        },
      ]);

      const result = await service.findAll();
      expect(mockPrisma.plan.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { price: 'asc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(350000);
    });
  });

  describe('findById', () => {
    it('phải trả về gói ăn theo ID', async () => {
      mockPrisma.plan.findUnique.mockResolvedValue({
        id: 'plan-1',
        name: 'Gói Chay Tháng',
        price: 1200000,
        duration: 30,
      });

      const result = await service.findById('plan-1');
      expect(result.name).toBe('Gói Chay Tháng');
      expect(result.price).toBe(1200000);
    });

    it('phải ném NotFoundException nếu ID gói ăn không tồn tại', async () => {
      mockPrisma.plan.findUnique.mockResolvedValue(null);
      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
