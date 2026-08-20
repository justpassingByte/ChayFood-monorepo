import { OrdersService } from './orders.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderStatus, PaymentMethod, StockTransactionType } from '@chayfood/shared-types';
import { PrismaService } from '../prisma/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockPrisma: {
    menuItem: { findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    order: { create: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    recipe: { findUnique: jest.Mock };
    ingredient: { update: jest.Mock };
    stockTransaction: { create: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(() => {
    mockPrisma = {
      menuItem: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      order: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      recipe: {
        findUnique: jest.fn(),
      },
      ingredient: {
        update: jest.fn(),
      },
      stockTransaction: {
        create: jest.fn(),
      },
      $transaction: jest.fn((callback: (tx: typeof mockPrisma) => Promise<unknown>) => callback(mockPrisma)),
    };

    service = new OrdersService(mockPrisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('phải ném lỗi BadRequestException nếu giỏ hàng rỗng', async () => {
      await expect(
        service.create('user-1', {
          items: [],
          deliveryAddress: { street: '123 Đỗ Xuân Hợp', city: 'Thủ Đức', state: 'TP.HCM', postalCode: '70000' },
          paymentMethod: PaymentMethod.COD,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('phải tạo đơn hàng thành công và tính đúng tổng tiền dựa trên giá cơ sở dữ liệu', async () => {
      mockPrisma.menuItem.findMany.mockResolvedValue([
        { id: 'item-1', name: 'Đậu Hũ Sốt Nấm', price: 45000 },
        { id: 'item-2', name: 'Canh Chua Chay', price: 35000 },
      ]);

      mockPrisma.order.create.mockImplementation(({ data }: { data: { totalAmount: number } }) =>
        Promise.resolve({
          id: 'order-1',
          ...data,
          items: [],
        }),
      );

      const result = await service.create('user-1', {
        items: [
          { menuItemId: 'item-1', quantity: 2 },
          { menuItemId: 'item-2', quantity: 1 },
        ],
        deliveryAddress: { street: '123 Đỗ Xuân Hợp', city: 'Thủ Đức', state: 'TP.HCM', postalCode: '70000' },
        paymentMethod: PaymentMethod.COD,
      });

      expect(mockPrisma.menuItem.findMany).toHaveBeenCalled();
      expect(mockPrisma.order.create).toHaveBeenCalled();
      expect(result.totalAmount).toBe(45000 * 2 + 35000 * 1); // 125,000 VND
    });

    it('phải ném lỗi nếu menuItemId không tồn tại trong DB', async () => {
      mockPrisma.menuItem.findMany.mockResolvedValue([
        { id: 'item-1', name: 'Đậu Hũ Sốt Nấm', price: 45000 },
      ]);

      await expect(
        service.create('user-1', {
          items: [
            { menuItemId: 'item-1', quantity: 1 },
            { menuItemId: 'item-nonexistent', quantity: 1 },
          ],
          deliveryAddress: { street: '123 Đỗ Xuân Hợp', city: 'Thủ Đức', state: 'TP.HCM', postalCode: '70000' },
          paymentMethod: PaymentMethod.COD,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateStatus & BOM Auto Deduction', () => {
    it('phải tự động trừ kho nguyên liệu theo định mức BOM khi đơn chuyển sang CONFIRMED', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 'order-10',
        orderNumber: 'CF-123456-789',
        status: OrderStatus.PENDING,
        items: [
          {
            menuItemId: 'item-1',
            quantity: 2,
            menuItem: { id: 'item-1', name: 'Đậu Hũ Sốt Nấm' },
          },
        ],
      });

      mockPrisma.recipe.findUnique.mockResolvedValue({
        name: 'Công Thức Đậu Hũ Sốt Nấm',
        items: [
          {
            ingredientId: 'ing-tofu',
            quantity: 150, // 150g đậu / phần
            ingredient: {
              id: 'ing-tofu',
              name: 'Đậu Hũ Non',
              currentStock: 1000,
              costPerUnit: 25,
            },
          },
        ],
      });

      mockPrisma.order.update.mockResolvedValue({
        id: 'order-10',
        status: OrderStatus.CONFIRMED,
      });

      const updated = await service.updateStatus('order-10', {
        status: OrderStatus.CONFIRMED,
      });

      expect(mockPrisma.stockTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ingredientId: 'ing-tofu',
            type: StockTransactionType.EXPORT_ORDER,
            quantity: 300, // 150g * 2
            previousStock: 1000,
            newStock: 700,
          }),
        }),
      );

      expect(mockPrisma.ingredient.update).toHaveBeenCalledWith({
        where: { id: 'ing-tofu' },
        data: { currentStock: 700 },
      });

      expect(updated.status).toBe(OrderStatus.CONFIRMED);
    });
  });
});
