import { InventoryService } from './inventory.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IngredientUnit, StockTransactionType } from '@chayfood/db';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let mockPrisma: {
    ingredient: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    stockTransaction: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const sampleIngredient = {
    id: 'ing-1',
    name: 'Đậu Hũ Non Hữu Cơ',
    code: 'ING_DAU_HU',
    unit: IngredientUnit.GRAM,
    currentStock: new Decimal(5000),
    minThreshold: new Decimal(2000),
    costPerUnit: new Decimal(40),
    supplier: 'HTX Nông Trại Xanh',
    category: 'Đạm thực vật',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: [],
  };

  beforeEach(() => {
    mockPrisma = {
      ingredient: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      stockTransaction: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn(async (callback: (tx: typeof mockPrisma) => Promise<unknown>) => callback(mockPrisma)),
    };

    service = new InventoryService(mockPrisma as unknown as PrismaService);
  });

  describe('createTransaction (Stock In/Out, WAC & Idempotency)', () => {
    it('cộng dồn số lượng và tính giá vốn bình quân gia quyền (WAC) khi lập phiếu Nhập Kho (IMPORT)', async () => {
      mockPrisma.ingredient.findUnique.mockResolvedValue({
        ...sampleIngredient,
        currentStock: new Decimal(100), // 100 kg
        costPerUnit: new Decimal(10000), // 10,000đ/kg -> Giá trị kho = 1,000,000đ
      });
      mockPrisma.stockTransaction.findFirst.mockResolvedValue(null);

      mockPrisma.stockTransaction.create.mockImplementation((args: { data: Record<string, unknown> }) => ({
        id: 'tx-1',
        ...args.data,
      }));

      mockPrisma.ingredient.update.mockResolvedValue({
        ...sampleIngredient,
        currentStock: new Decimal(110),
        costPerUnit: new Decimal(11818),
      });

      // Nhập thêm 10 kg giá 30,000đ/kg -> WAC = (100*10k + 10*30k)/110 = 11,818đ
      const result = await service.createTransaction(
        {
          ingredientId: 'ing-1',
          type: StockTransactionType.IMPORT,
          quantity: 10,
          unitCost: 30000,
          notes: 'Nhập khẩn cấp đợt mới',
        },
        'Nguyễn Văn A (Admin)',
      );

      expect(result.previousStock).toBe(100);
      expect(result.newStock).toBe(110);
      expect(result.totalCost).toBe(300000); // 10 * 30,000
      expect(mockPrisma.ingredient.update).toHaveBeenCalledWith({
        where: { id: 'ing-1' },
        data: {
          currentStock: 110,
          costPerUnit: 11818, // WAC rounded
        },
      });
    });

    it('ngăn chặn nhập trùng phiếu khi referenceId đã tồn tại (Idempotency Defense)', async () => {
      mockPrisma.ingredient.findUnique.mockResolvedValue(sampleIngredient);
      mockPrisma.stockTransaction.findFirst.mockResolvedValue({ id: 'tx-old-1', referenceId: 'INV-2026-001' });

      await expect(
        service.createTransaction({
          ingredientId: 'ing-1',
          type: StockTransactionType.IMPORT,
          quantity: 100,
          referenceId: 'INV-2026-001',
        }),
      ).rejects.toThrow(new BadRequestException("Giao dịch với mã tham chiếu 'INV-2026-001' đã được xử lý trước đó"));
    });

    it('trừ tồn kho chính xác khi lập phiếu Xuất Kho Đơn Hàng (EXPORT_ORDER)', async () => {
      mockPrisma.ingredient.findUnique.mockResolvedValue(sampleIngredient);
      mockPrisma.stockTransaction.findFirst.mockResolvedValue(null);

      mockPrisma.stockTransaction.create.mockImplementation((args: { data: Record<string, unknown> }) => ({
        id: 'tx-2',
        ...args.data,
      }));

      mockPrisma.ingredient.update.mockResolvedValue({
        ...sampleIngredient,
        currentStock: new Decimal(4500),
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
        ...sampleIngredient,
        currentStock: new Decimal(300), // Tồn kho chỉ có 300g
      });

      await expect(
        service.createTransaction({
          ingredientId: 'ing-1',
          type: StockTransactionType.EXPORT_WASTE,
          quantity: 500, // Yêu cầu xuất 500g
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('chặn kiểm kê số lượng âm trong phiếu ADJUSTMENT', async () => {
      await expect(
        service.createTransaction({
          ingredientId: 'ing-1',
          type: StockTransactionType.ADJUSTMENT,
          quantity: -10,
        }),
      ).rejects.toThrow(new BadRequestException('Số lượng kiểm kê thực tế không được âm'));
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

  describe('create & update (P2002 Unique Collision Handling)', () => {
    it('bắt lỗi Prisma P2002 và ném BadRequestException khi tạo trùng mã nguyên liệu', async () => {
      mockPrisma.ingredient.findUnique.mockResolvedValue(null);
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
      });
      mockPrisma.ingredient.create.mockRejectedValue(prismaError);

      await expect(
        service.create({
          name: 'Đậu hũ',
          code: 'ING_DAU_HU',
          unit: IngredientUnit.GRAM,
          costPerUnit: 40,
        }),
      ).rejects.toThrow(new BadRequestException("Mã nguyên liệu 'ING_DAU_HU' đã tồn tại trong hệ thống"));
    });
  });

  describe('getOverviewStats', () => {
    it('tính toán chính xác tổng giá trị tài sản tồn kho và số lượng cảnh báo', async () => {
      const mockIngredients = [
        { id: '1', currentStock: new Decimal(1000), costPerUnit: new Decimal(50), minThreshold: new Decimal(2000) },
        { id: '2', currentStock: new Decimal(0), costPerUnit: new Decimal(100), minThreshold: new Decimal(500) },
        { id: '3', currentStock: new Decimal(5000), costPerUnit: new Decimal(20), minThreshold: new Decimal(1000) },
      ];

      mockPrisma.ingredient.findMany.mockResolvedValue(mockIngredients);

      const stats = await service.getOverviewStats();

      expect(stats.totalIngredients).toBe(3);
      expect(stats.lowStockCount).toBe(1);
      expect(stats.outOfStockCount).toBe(1);
      expect(stats.totalStockValue).toBe(150000); // 50,000 + 100,000
    });
  });

  describe('findAll & getTransactions (Pagination & Filtering)', () => {
    it('lấy danh sách nguyên liệu phân trang chính xác', async () => {
      mockPrisma.ingredient.findMany.mockResolvedValue([sampleIngredient]);
      mockPrisma.ingredient.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 50 });

      expect(result.items.length).toBe(1);
      expect(result.pagination.total).toBe(1);
      expect(result.items[0].currentStock).toBe(5000);
    });

    it('lấy danh sách giao dịch kho có phân trang và format đầy đủ', async () => {
      mockPrisma.stockTransaction.findMany.mockResolvedValue([
        {
          id: 'tx-1',
          ingredientId: 'ing-1',
          type: StockTransactionType.IMPORT,
          quantity: new Decimal(100),
          previousStock: new Decimal(0),
          newStock: new Decimal(100),
          unitCost: new Decimal(40),
          totalCost: new Decimal(4000),
          referenceId: 'INV-01',
          notes: 'Test',
          performedBy: 'Admin',
          createdAt: new Date(),
          ingredient: sampleIngredient,
        },
      ]);
      mockPrisma.stockTransaction.count.mockResolvedValue(1);

      const result = await service.getTransactions({ page: 1, limit: 50 });

      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].totalCost).toBe(4000);
      expect(result.pagination.total).toBe(1);
    });
  });
});
