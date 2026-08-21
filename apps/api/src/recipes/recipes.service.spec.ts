import { RecipesService } from './recipes.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IngredientUnit, MenuCategory } from '@chayfood/db';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

describe('RecipesService', () => {
  let service: RecipesService;
  let mockPrisma: {
    recipe: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    menuItem: {
      findUnique: jest.Mock;
    };
    recipeItem: {
      deleteMany: jest.Mock;
      createMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const sampleDbRecipe = {
    id: 'rec-1',
    menuItemId: 'dish-1',
    name: 'Công Thức Chuẩn: Đậu Sốt Nấm',
    description: 'Quy trình chuẩn hóa',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servingSize: 1,
    instructions: [{ stepNumber: 1, title: 'Sơ chế', description: 'Cắt đậu' }],
    notes: 'Bảo quản mát',
    createdAt: new Date(),
    updatedAt: new Date(),
    menuItem: {
      id: 'dish-1',
      name: 'Đậu Sốt Nấm Đông Cô',
      price: new Decimal(55000),
      image: '/dau-nam.jpg',
      category: MenuCategory.MAIN,
      isAvailable: true,
    },
    items: [
      {
        id: 'item-1',
        recipeId: 'rec-1',
        ingredientId: 'ing-1',
        quantity: new Decimal(200),
        unit: IngredientUnit.GRAM,
        isOptional: false,
        notes: null,
        createdAt: new Date(),
        ingredient: {
          id: 'ing-1',
          name: 'Đậu Hũ Non',
          code: 'ING_DAU_HU',
          unit: IngredientUnit.GRAM,
          costPerUnit: new Decimal(40), // 200 * 40 = 8000
          currentStock: new Decimal(5000),
          minThreshold: new Decimal(1000),
          isAvailable: true,
        },
      },
      {
        id: 'item-2',
        recipeId: 'rec-1',
        ingredientId: 'ing-2',
        quantity: new Decimal(80),
        unit: IngredientUnit.GRAM,
        isOptional: false,
        notes: null,
        createdAt: new Date(),
        ingredient: {
          id: 'ing-2',
          name: 'Nấm Đông Cô',
          code: 'ING_NAM_DONG_CO',
          unit: IngredientUnit.GRAM,
          costPerUnit: new Decimal(90), // 80 * 90 = 7200
          currentStock: new Decimal(3000),
          minThreshold: new Decimal(500),
          isAvailable: true,
        },
      },
    ],
  };

  beforeEach(() => {
    mockPrisma = {
      recipe: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      menuItem: {
        findUnique: jest.fn(),
      },
      recipeItem: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      $transaction: jest.fn(async (callback: (tx: typeof mockPrisma) => Promise<unknown>) => callback(mockPrisma)),
    };

    service = new RecipesService(mockPrisma as unknown as PrismaService);
  });

  describe('mapRecipeWithCost (Unit Conversion, Costing & Margins)', () => {
    it('tính toán chính xác tổng giá vốn BOM, % Food Cost và % Lợi Nhuận Gộp', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(sampleDbRecipe);

      const result = await service.findById('rec-1');

      // Total Cost = 8000 + 7200 = 15200 VND
      expect(result.costAnalysis.totalCost).toBe(15200);
      expect(result.costAnalysis.sellingPrice).toBe(55000);
      // Gross Margin = 55000 - 15200 = 39800 VND
      expect(result.costAnalysis.grossMargin).toBe(39800);
      // Gross Margin % = (39800 / 55000) * 100 = 72.36 => 72.4%
      expect(result.costAnalysis.grossMarginPercentage).toBe(72.4);
      // Food Cost % = (15200 / 55000) * 100 = 27.63 => 27.6%
      expect(result.costAnalysis.foodCostPercentage).toBe(27.6);
      expect(result.isCookable).toBe(true);
    });

    it('quy đổi chính xác đơn vị tính khi công thức dùng GRAM nhưng kho lưu KILOGRAM (Unit Conversion)', async () => {
      const recipeWithKgIngredient = {
        ...sampleDbRecipe,
        items: [
          {
            id: 'item-1',
            recipeId: 'rec-1',
            ingredientId: 'ing-kg-1',
            quantity: new Decimal(50), // 50 GRAM
            unit: IngredientUnit.GRAM,
            isOptional: false,
            notes: null,
            createdAt: new Date(),
            ingredient: {
              id: 'ing-kg-1',
              name: 'Nấm Thượng Hạng',
              code: 'ING_NAM_VIP',
              unit: IngredientUnit.KILOGRAM, // Đơn vị kho là KG
              costPerUnit: new Decimal(250000), // 250,000đ / kg
              currentStock: new Decimal(10),
              minThreshold: new Decimal(2),
              isAvailable: true,
            },
          },
        ],
      };

      mockPrisma.recipe.findUnique.mockResolvedValue(recipeWithKgIngredient);

      const result = await service.findById('rec-1');

      // 50g quy đổi ra kg = 0.05kg * 250,000đ = 12,500đ (KHÔNG PHẢI 12.5 triệu!)
      expect(result.costAnalysis.totalCost).toBe(12500);
      expect(result.items[0].totalCost).toBe(12500);
    });

    it('bảo toàn chi phí thực tế cho món tặng kèm 0đ (Gross Margin âm chi phí)', async () => {
      const freeItemRecipe = {
        ...sampleDbRecipe,
        menuItem: {
          ...sampleDbRecipe.menuItem,
          price: new Decimal(0), // Món 0đ tặng kèm
        },
      };

      mockPrisma.recipe.findUnique.mockResolvedValue(freeItemRecipe);

      const result = await service.findById('rec-1');

      expect(result.costAnalysis.sellingPrice).toBe(0);
      expect(result.costAnalysis.totalCost).toBe(15200);
      expect(result.costAnalysis.grossMargin).toBe(-15200); // Lỗ 15,200đ tiền vốn
      expect(result.costAnalysis.grossMarginPercentage).toBe(0);
      expect(result.costAnalysis.foodCostPercentage).toBe(0);
    });

    it('tính toán chính xác theo hệ số nhân khẩu phần (Batch Scaling)', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(sampleDbRecipe);

      // Tính cho 10 suất ăn (targetServings = 10, servingSize chuẩn = 1)
      const result = await service.findById('rec-1', 10);

      expect(result.costAnalysis.sellingPrice).toBe(550000); // 55,000 * 10
      expect(result.costAnalysis.totalCost).toBe(152000); // 15,200 * 10
      expect(result.costAnalysis.grossMargin).toBe(398000);
      expect(result.items[0].quantity).toBe(2000); // 200g * 10 = 2000g
      expect(result.costAnalysis.servingCount).toBe(10);
    });

    it('cảnh báo isCookable = false khi có nguyên liệu bắt buộc bị tạm khóa trong kho', async () => {
      const unavailableRecipe = {
        ...sampleDbRecipe,
        items: [
          {
            ...sampleDbRecipe.items[0],
            ingredient: {
              ...sampleDbRecipe.items[0].ingredient,
              isAvailable: false, // Hết hàng trong kho
            },
          },
        ],
      };

      mockPrisma.recipe.findUnique.mockResolvedValue(unavailableRecipe);

      const result = await service.findById('rec-1');

      expect(result.isCookable).toBe(false);
      expect(result.hasUnavailableIngredients).toBe(true);
      expect(result.items[0].isUnavailable).toBe(true);
    });
  });

  describe('create & update (Error Handling & Relations)', () => {
    it('bắt lỗi Prisma P2002 và ném BadRequestException khi tạo trùng công thức cho 1 món', async () => {
      mockPrisma.menuItem.findUnique.mockResolvedValue({ id: 'dish-1' });
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
      });
      mockPrisma.recipe.create.mockRejectedValue(prismaError);

      await expect(
        service.create({
          menuItemId: 'dish-1',
          name: 'Công Thức Trùng',
        }),
      ).rejects.toThrow(new BadRequestException('Món ăn này đã có công thức định lượng (BOM)'));
    });

    it('bắt lỗi Prisma P2003 và ném BadRequestException khi truyền ingredientId không tồn tại', async () => {
      mockPrisma.menuItem.findUnique.mockResolvedValue({ id: 'dish-1' });
      const prismaError = new Prisma.PrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        clientVersion: '5.0.0',
      });
      mockPrisma.recipe.create.mockRejectedValue(prismaError);

      await expect(
        service.create({
          menuItemId: 'dish-1',
          name: 'Công Thức Lỗi',
          items: [{ ingredientId: 'invalid-ing', quantity: 100, unit: IngredientUnit.GRAM }],
        }),
      ).rejects.toThrow(new BadRequestException('Một hoặc nhiều nguyên liệu không tồn tại trong hệ thống'));
    });

    it('ném lỗi NotFoundException khi không tìm thấy món ăn lúc tạo công thức', async () => {
      mockPrisma.menuItem.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          menuItemId: 'non-existent',
          name: 'Công Thức',
        }),
      ).rejects.toThrow(new NotFoundException('Không tìm thấy món ăn với mã non-existent'));
    });
  });

  describe('findAll & delete', () => {
    it('lấy danh sách công thức có phân trang và tìm kiếm', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([sampleDbRecipe]);
      mockPrisma.recipe.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20, query: 'Đậu sốt' });

      expect(result.recipes.length).toBe(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('xóa công thức và dọn sạch các bản ghi con trong transaction', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(sampleDbRecipe);
      mockPrisma.recipeItem.deleteMany.mockResolvedValue({ count: 2 });
      mockPrisma.recipe.delete.mockResolvedValue(sampleDbRecipe);

      const result = await service.delete('rec-1');

      expect(result.success).toBe(true);
      expect(mockPrisma.recipeItem.deleteMany).toHaveBeenCalledWith({ where: { recipeId: 'rec-1' } });
      expect(mockPrisma.recipe.delete).toHaveBeenCalledWith({ where: { id: 'rec-1' } });
    });
  });
});
