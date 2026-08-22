import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod } from '@chayfood/db';

describe('SubscriptionsService (Lifecycle & Security Invariants)', () => {
  let service: SubscriptionsService;
  let mockPrisma: {
    plan: { findUnique: jest.Mock };
    subscription: { create: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
  };

  beforeEach(() => {
    mockPrisma = {
      plan: { findUnique: jest.fn() },
      subscription: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    service = new SubscriptionsService(mockPrisma as unknown as PrismaService);
  });

  describe('create (Server-Authoritative Pricing & Date Invariants)', () => {
    it('phải tạo subscription với ngày kết thúc và giá chuẩn từ database', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);

      mockPrisma.plan.findUnique.mockResolvedValue({
        id: 'plan-1',
        name: 'Gói Chay Thanh Tịnh Tuần',
        price: 350000,
        duration: 7,
        isActive: true,
      });

      mockPrisma.subscription.create.mockResolvedValue({
        id: 'sub-1',
        userId: 'user-1',
        planId: 'plan-1',
        totalAmount: 350000,
        isActive: true,
      });

      const result = await service.create('user-1', {
        planId: 'plan-1',
        startDate: futureDate.toISOString(),
        deliveryAddress: {
          street: '123 Nguyễn Thị Minh Khai',
          city: 'TP. Hồ Chí Minh',
        },
        paymentMethod: PaymentMethod.CARD,
      });

      expect(mockPrisma.plan.findUnique).toHaveBeenCalledWith({ where: { id: 'plan-1' } });
      expect(mockPrisma.subscription.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            planId: 'plan-1',
            totalAmount: 350000,
          }),
        }),
      );
      expect(result.id).toBe('sub-1');
    });

    it('phải từ chối đăng ký nếu gói ăn không tồn tại hoặc đã ngừng kinh doanh (isActive = false)', async () => {
      mockPrisma.plan.findUnique.mockResolvedValue({
        id: 'plan-inactive',
        isActive: false,
      });

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);

      await expect(
        service.create('user-1', {
          planId: 'plan-inactive',
          startDate: futureDate.toISOString(),
          deliveryAddress: { street: '123 ABC', city: 'HCM' },
          paymentMethod: PaymentMethod.COD,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('phải từ chối đăng ký nếu ngày bắt đầu ở trong quá khứ', async () => {
      mockPrisma.plan.findUnique.mockResolvedValue({
        id: 'plan-1',
        isActive: true,
        duration: 7,
      });

      await expect(
        service.create('user-1', {
          planId: 'plan-1',
          startDate: '2020-01-01T00:00:00.000Z',
          deliveryAddress: { street: '123 ABC', city: 'HCM' },
          paymentMethod: PaymentMethod.CARD,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('toggleSubscription (IDOR Ownership Defense)', () => {
    it('phải cho phép chủ sở hữu tạm dừng hoặc kích hoạt lại gói ăn của chính mình', async () => {
      mockPrisma.subscription.findUnique.mockResolvedValue({
        id: 'sub-1',
        userId: 'user-1',
        isActive: true,
      });

      mockPrisma.subscription.update.mockResolvedValue({
        id: 'sub-1',
        userId: 'user-1',
        isActive: false,
      });

      const result = await service.toggleSubscription('sub-1', 'user-1', false);
      expect(result.isActive).toBe(false);
      expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: { isActive: false },
        include: { plan: true },
      });
    });

    it('phải ném ForbiddenException nếu người dùng cố thao tác trên gói ăn của người khác (IDOR Defense)', async () => {
      mockPrisma.subscription.findUnique.mockResolvedValue({
        id: 'sub-1',
        userId: 'user-victim',
        isActive: true,
      });

      await expect(service.toggleSubscription('sub-1', 'user-attacker', false)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('phải cho phép Admin thay đổi trạng thái gói ăn của bất kỳ người dùng nào', async () => {
      mockPrisma.subscription.findUnique.mockResolvedValue({
        id: 'sub-1',
        userId: 'user-victim',
        isActive: true,
      });

      mockPrisma.subscription.update.mockResolvedValue({
        id: 'sub-1',
        isActive: false,
      });

      const result = await service.toggleSubscription('sub-1', 'admin-user', true);
      expect(result.isActive).toBe(false);
    });
  });
});
