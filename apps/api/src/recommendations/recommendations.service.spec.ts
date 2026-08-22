import { RecommendationsService } from './recommendations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RecommendationsService (Macros & Preferences)', () => {
  let service: RecommendationsService;
  let mockPrisma: {
    userPreference: { findUnique: jest.Mock; upsert: jest.Mock };
    menuItem: { findMany: jest.Mock };
  };

  beforeEach(() => {
    mockPrisma = {
      userPreference: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
      menuItem: {
        findMany: jest.fn(),
      },
    };

    service = new RecommendationsService(mockPrisma as unknown as PrismaService);
  });

  describe('getRecommendations', () => {
    it('phải áp dụng bộ lọc calo và protein từ sở thích của người dùng', async () => {
      mockPrisma.userPreference.findUnique.mockResolvedValue({
        userId: 'user-1',
        maxCalories: 600,
        minProtein: 20,
      });

      mockPrisma.menuItem.findMany.mockResolvedValue([
        {
          id: 'dish-1',
          name: 'Đậu Hũ Sốt Nấm Đông Cô',
          price: 55000,
          calories: 450,
          protein: 22,
          carbs: 35,
          fat: 12,
          isAvailable: true,
        },
      ]);

      const items = await service.getRecommendations('user-1');
      expect(mockPrisma.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isAvailable: true,
            calories: { lte: 600 },
            protein: { gte: 20 },
          },
        }),
      );
      expect(items).toHaveLength(1);
      expect(items[0].protein).toBe(22);
    });

    it('phải trả về món ăn khả dụng mặc định nếu người dùng chưa cấu hình sở thích', async () => {
      mockPrisma.userPreference.findUnique.mockResolvedValue(null);
      mockPrisma.menuItem.findMany.mockResolvedValue([]);

      await service.getRecommendations('user-no-pref');
      expect(mockPrisma.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isAvailable: true },
        }),
      );
    });
  });

  describe('updatePreference', () => {
    it('phải upsert sở thích người dùng với đầy đủ danh mục và ràng buộc ăn kiêng', async () => {
      mockPrisma.userPreference.upsert.mockResolvedValue({
        userId: 'user-1',
        favoriteCategories: ['main'],
        dislikedIngredients: ['ớt'],
        minProtein: 25,
        maxCalories: 700,
      });

      const result = await service.updatePreference('user-1', {
        favoriteCategories: ['main'],
        dislikedIngredients: ['ớt'],
        minProtein: 25,
        maxCalories: 700,
      });

      expect(mockPrisma.userPreference.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          update: expect.objectContaining({
            favoriteCategories: ['main'],
            dislikedIngredients: ['ớt'],
            minProtein: 25,
            maxCalories: 700,
          }),
        }),
      );
      expect(result.userId).toBe('user-1');
    });
  });
});
