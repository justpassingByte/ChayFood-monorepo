import { RecipesService } from './recipes.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RecipesService', () => {
  let service: RecipesService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      recipe: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
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
      $transaction: jest.fn((callback) => callback(mockPrisma)),
    };
    service = new RecipesService(mockPrisma);
  });

  describe('mapRecipeWithCost (Food Costing Math)', () => {
    it('tính toán chính xác tổng giá vốn BOM, % Food Cost và % Lợi Nhuận Gộp', async () => {
      const mockDbRecipe = {
        id: 'rec-1',
        menuItemId: 'dish-1',
        name: 'Công Thức Chuẩn: Đậu Sốt Nấm',
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        servingSize: 1,
        menuItem: {
          id: 'dish-1',
          name: 'Đậu Sốt Nấm Đông Cô',
          price: '55000',
          image: '/dau-nam.jpg',
          category: 'MAIN',
        },
        items: [
          {
            id: 'item-1',
            ingredientId: 'ing-1',
            quantity: '200',
            unit: 'GRAM',
            isOptional: false,
            ingredient: {
              name: 'Đậu Hũ Non',
              costPerUnit: '40', // 200 * 40 = 8000
              currentStock: '5000',
              minThreshold: '1000',
            },
          },
          {
            id: 'item-2',
            ingredientId: 'ing-2',
            quantity: '80',
            unit: 'GRAM',
            isOptional: false,
            ingredient: {
              name: 'Nấm Đông Cô',
              costPerUnit: '90', // 80 * 90 = 7200
              currentStock: '3000',
              minThreshold: '500',
            },
          },
          {
            id: 'item-3',
            ingredientId: 'ing-3',
            quantity: '20',
            unit: 'GRAM',
            isOptional: false,
            ingredient: {
              name: 'Hạt Nêm Nấm',
              costPerUnit: '60', // 20 * 60 = 1200
              currentStock: '2000',
              minThreshold: '400',
            },
          },
        ],
      };

      mockPrisma.recipe.findUnique.mockResolvedValue(mockDbRecipe);

      const result = await service.findById('rec-1');

      // Total Cost = 8000 + 7200 + 1200 = 16400 VND
      expect(result.costAnalysis.totalCost).toBe(16400);
      expect(result.costAnalysis.sellingPrice).toBe(55000);
      // Gross Margin = 55000 - 16400 = 38600 VND
      expect(result.costAnalysis.grossMargin).toBe(38600);
      // Gross Margin % = (38600 / 55000) * 100 = 70.18 => 70.2%
      expect(result.costAnalysis.grossMarginPercentage).toBe(70.2);
      // Food Cost % = (16400 / 55000) * 100 = 29.81 => 29.8%
      expect(result.costAnalysis.foodCostPercentage).toBe(29.8);
    });

    it('ném lỗi NotFoundException khi không tìm thấy mã công thức', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(null);
      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('ném lỗi BadRequestException khi tạo công thức cho món đã có công thức sẵn', async () => {
      mockPrisma.menuItem.findUnique.mockResolvedValue({
        id: 'dish-1',
        name: 'Đậu Sốt Nấm',
      });
      mockPrisma.recipe.findUnique.mockResolvedValue({
        id: 'existing-recipe',
        menuItemId: 'dish-1',
      });

      await expect(
        service.create({
          menuItemId: 'dish-1',
          name: 'Công Thức Trùng',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
