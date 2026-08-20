import { InventoryService } from './inventory.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StockTransactionType } from '@chayfood/db';

describe('InventoryService', () => {
  let service: InventoryService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      ingredient: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      stockTransaction: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(mockPrisma)),
    };
    service = new InventoryService(mockPrisma);
  });

  describe('createTransaction (Stock In/Out & ACID Logic)', () => {
    it('cộng dồn số lượng tồn kho chính xác khi lập phiếu Nhập Kho (IMPORT)', async () => {
      mockPrisma.ingredient.findUnique.mockResolvedValue({
        id: 'ing-1',
        name: 'Đậu Hũ Non',
        unit: 'GRAM',
        currentStock: '5000',
        costPerUnit: '40',
      });

      mockPrisma.stockTransaction.create.mockImplementation(({ data }: any) => ({
        id: 'tx-1',
        ...data,
      }));

      mockPrisma.ingredient.update.mockResolvedValue({
        id: 'ing-1',
        currentStock: '7000',
        costPerUnit: '42',
      });

      const result = await service.createTransaction({
        ingredientId: 'ing-1',
        type: StockTransactionType.IMPORT,
        quantity: 2000,
        unitCost: 42,
        notes: 'Nhập hàng đợt mới từ HTX',
      });

      expect(result.previousStock).toBe(5000);
      expect(result.newStock).toBe(7000);
      expect(result.totalCost).toBe(84000); // 2000 * 42
      expect(mockPrisma.ingredient.update).toHaveBeenCalledWith({
        where: { id: 'ing-1' },
        data: {
          currentStock: 7000,
          costPerUnit: 42,
        },
      });
    });

    it('trừ tồn kho chính xác khi lập phiếu Xuất Kho Đơn Hàng (EXPORT_ORDER)', async () => {
      mockPrisma.ingredient.findUnique.mockResolvedValue({
        id: 'ing-1',
        name: 'Đậu Hũ Non',
        unit: 'GRAM',
        currentStock: '5000',
        costPerUnit: '40',
      });

      mockPrisma.stockTransaction.create.mockImplementation(({ data }: any) => ({
        id: 'tx-2',
        ...data,
      }));

      mockPrisma.ingredient.update.mockResolvedValue({
        id: 'ing-1',
        currentStock: '4500',
      });

      const result = await service.createTransaction({
        ingredientId: 'ing-1',
        type: StockTransactionType.EXPORT_ORDER,
        quantity: 500,
        notes: 'Xuất nấu 5 suất cơm',
      });

      expect(result.previousStock).toBe(5000);
      expect(result.newStock).toBe(4500);
      expect(result.totalCost).toBe(20000); // 500 * 40
    });

    it('chặn hoàn toàn và ném BadRequestException khi số lượng xuất vượt quá tồn kho hiện có', async () => {
      mockPrisma.ingredient.findUnique.mockResolvedValue({
        id: 'ing-1',
        name: 'Đậu Hũ Non',
        unit: 'GRAM',
        currentStock: '300', // Tồn kho chỉ có 300g
        costPerUnit: '40',
      });

      await expect(
        service.createTransaction({
          ingredientId: 'ing-1',
          type: StockTransactionType.EXPORT_WASTE,
          quantity: 500, // Yêu cầu xuất 500g
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('ném NotFoundException khi thao tác trên nguyên liệu không tồn tại', async () => {
      mockPrisma.ingredient.findUnique.mockResolvedValue(null);

      await expect(
        service.createTransaction({
          ingredientId: 'invalid-id',
          type: StockTransactionType.IMPORT,
          quantity: 100,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOverviewStats', () => {
    it('tính toán chính xác tổng giá trị tài sản tồn kho và số lượng cảnh báo', async () => {
      const mockIngredients = [
        { id: '1', currentStock: '1000', costPerUnit: '50', minThreshold: '2000' }, // Low stock: 1000 * 50 = 50,000
        { id: '2', currentStock: '0', costPerUnit: '100', minThreshold: '500' },    // Out of stock: 0
        { id: '3', currentStock: '5000', costPerUnit: '20', minThreshold: '1000' },  // Normal: 5000 * 20 = 100,000
      ];

      mockPrisma.ingredient.findMany.mockResolvedValue(mockIngredients);

      const stats = await service.getOverviewStats();

      expect(stats.totalIngredients).toBe(3);
      expect(stats.lowStockCount).toBe(1);
      expect(stats.outOfStockCount).toBe(1);
      expect(stats.totalStockValue).toBe(150000); // 50,000 + 100,000
    });
  });
});
