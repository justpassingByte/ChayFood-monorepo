import { FamilyNutritionService } from './family-nutrition.service';
import { ActivityLevel, FamilyMember, FamilyRelation } from '@chayfood/shared-types';
import { PrismaService } from '../prisma/prisma.service';

describe('FamilyNutritionService', () => {
  let service: FamilyNutritionService;
  let mockPrisma: {
    menuItem: {
      findMany: jest.Mock;
    };
  };

  beforeEach(() => {
    mockPrisma = {
      menuItem: {
        findMany: jest.fn(),
      },
    };
    service = new FamilyNutritionService(mockPrisma as unknown as PrismaService);
  });

  describe('estimateDailyCalories (Mifflin-St Jeor & Pediatric)', () => {
    it('tính toán chính xác TDEE cho nam giới theo công thức Mifflin-St Jeor', () => {
      // Nam, 34 tuổi, 172cm, 68kg, Moderately active (multiplier 1.55)
      // BMR = 10*68 + 6.25*172 - 5*34 + 5 = 680 + 1075 - 170 + 5 = 1590
      // TDEE = 1590 * 1.55 = 2464.5 => round 2465
      const calories = service.estimateDailyCalories(34, 'male', 172, 68, ActivityLevel.MODERATELY_ACTIVE);
      expect(calories).toBe(2465);
    });

    it('tính toán chính xác TDEE cho nữ giới theo công thức Mifflin-St Jeor', () => {
      // Nữ, 32 tuổi, 160cm, 52kg, Lightly active (multiplier 1.375)
      // BMR = 10*52 + 6.25*160 - 5*32 - 161 = 520 + 1000 - 160 - 161 = 1199
      // TDEE = 1199 * 1.375 = 1648.625 => round 1649
      const calories = service.estimateDailyCalories(32, 'female', 160, 52, ActivityLevel.LIGHTLY_ACTIVE);
      expect(calories).toBe(1649);
    });

    it('áp dụng chuẩn năng lượng nhi khoa WHO cho trẻ em dưới 10 tuổi', () => {
      // Trẻ 6 tuổi: 1000 + 6 * 100 = 1600 kcal
      const calories = service.estimateDailyCalories(6, 'male', 115, 20, ActivityLevel.MODERATELY_ACTIVE);
      expect(calories).toBe(1600);
    });

    it('sử dụng giá trị mặc định hợp lý khi thiếu tham số thể trạng', () => {
      const calories = service.estimateDailyCalories();
      expect(calories).toBeGreaterThanOrEqual(1500);
      expect(calories).toBeLessThan(2500);
    });
  });

  describe('extractCrossAllergens (Sanitization & Tokenization)', () => {
    it('làm sạch tiền tố và tổng hợp dị ứng giao thoa 2 chiều không bị trùng lặp', () => {
      const sampleMembers: FamilyMember[] = [
        {
          id: '1',
          familyGroupId: 'grp-1',
          name: 'Bố',
          relation: FamilyRelation.SELF,
          activityLevel: ActivityLevel.SEDENTARY,
          isManaged: false,
          medicalConditions: [],
          dietaryRestrictions: ['Dị ứng đậu phộng', 'Kiêng ớt'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          familyGroupId: 'grp-1',
          name: 'Con',
          relation: FamilyRelation.CHILD,
          activityLevel: ActivityLevel.SEDENTARY,
          isManaged: true,
          medicalConditions: [],
          dietaryRestrictions: ['đậu phộng', 'Không ăn hạt điều'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const allergens = service.extractCrossAllergens(sampleMembers);
      expect(allergens).toContain('đậu phộng');
      expect(allergens).toContain('ớt');
      expect(allergens).toContain('hạt điều');
      expect(allergens.length).toBe(3);
    });
  });

  describe('deriveClinicalSafeguards (Multi-lingual Disease Dictionary)', () => {
    it('tự động nhận diện bệnh lý tiểu đường, huyết áp, gout qua từ khóa đa ngôn ngữ', () => {
      const sampleMembers: FamilyMember[] = [
        {
          id: '1',
          familyGroupId: 'grp-1',
          name: 'Ông',
          age: 70,
          relation: FamilyRelation.PARENT,
          activityLevel: ActivityLevel.SEDENTARY,
          isManaged: true,
          medicalConditions: ['Type 2 Diabetes', 'Huyết áp cao', 'Gout cấp tính'],
          dietaryRestrictions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          familyGroupId: 'grp-1',
          name: 'Cháu',
          age: 8,
          relation: FamilyRelation.CHILD,
          activityLevel: ActivityLevel.SEDENTARY,
          isManaged: true,
          medicalConditions: [],
          dietaryRestrictions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const safeguards = service.deriveClinicalSafeguards(sampleMembers);
      expect(safeguards.some((s) => s.includes('GI thấp'))).toBe(true);
      expect(safeguards.some((s) => s.includes('DASH'))).toBe(true);
      expect(safeguards.some((s) => s.includes('Gout'))).toBe(true);
      expect(safeguards.some((s) => s.includes('Canxi'))).toBe(true);
      expect(safeguards.some((s) => s.includes('Chế biến mềm'))).toBe(true);
    });
  });

  describe('generateHarmonizedMealPlan (Harmonized Engine & Safety)', () => {
    it('loại trừ triệt để món ăn chứa chất gây dị ứng và phân bổ khẩu phần chính xác', async () => {
      const mockDishes = [
        {
          id: 'd1',
          name: 'Đậu Sốt Nấm Đông Cô',
          category: 'MAIN',
          image: '/img1.jpg',
          price: 55000,
          calories: 320,
          protein: 16,
          carbs: 25,
          fat: 8,
          allergens: ['nấm'],
          isAvailable: true,
        },
        {
          id: 'd2',
          name: 'Gỏi Cuốn Sốt Đậu Phộng',
          category: 'MAIN',
          image: '/img2.jpg',
          price: 45000,
          calories: 280,
          protein: 10,
          carbs: 30,
          fat: 12,
          allergens: ['đậu phộng'],
          isAvailable: true,
        },
        {
          id: 'd3',
          name: 'Canh Rong Biển Đậu Hũ',
          category: 'SIDE',
          image: '/img3.jpg',
          price: 35000,
          calories: 120,
          protein: 6,
          carbs: 15,
          fat: 2,
          allergens: [],
          isAvailable: true,
        },
        {
          id: 'd4',
          name: 'Cải Thìa Xào Tỏi',
          category: 'SIDE',
          image: '/img4.jpg',
          price: 35000,
          calories: 140,
          protein: 5,
          carbs: 18,
          fat: 3,
          allergens: [],
          isAvailable: true,
        },
        {
          id: 'd5',
          name: 'Trà Hoa Cúc Mật Ong',
          category: 'BEVERAGE',
          image: '/img5.jpg',
          price: 25000,
          calories: 60,
          protein: 1,
          carbs: 14,
          fat: 0,
          allergens: [],
          isAvailable: true,
        },
      ];

      mockPrisma.menuItem.findMany.mockResolvedValue(mockDishes);

      const members: FamilyMember[] = [
        {
          id: 'm1',
          familyGroupId: 'grp-1',
          name: 'Bé Linh',
          relation: FamilyRelation.CHILD,
          age: 9,
          dailyCalories: 1400,
          activityLevel: ActivityLevel.SEDENTARY,
          isManaged: true,
          medicalConditions: [],
          dietaryRestrictions: ['Dị ứng đậu phộng'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const result = await service.generateHarmonizedMealPlan('grp-1', members);

      expect(result.servingCount).toBe(1);
      // Món d2 chứa đậu phộng bị loại trừ hoàn toàn
      const dishNames = result.dishes.map((d) => d.name);
      expect(dishNames).not.toContain('Gỏi Cuốn Sốt Đậu Phộng');
      expect(dishNames).toContain('Đậu Sốt Nấm Đông Cô');
      expect(result.crossEliminatedAllergens).toContain('đậu phộng');
      expect(result.memberPortionAdvice.length).toBe(1);
      expect(result.memberPortionAdvice[0].recommendedPortionPercentage).toBe(100);
    });
  });
});
