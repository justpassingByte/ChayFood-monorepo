import { FamilyNutritionService } from './family-nutrition.service';
import { ActivityLevel, FamilyMember, FamilyRelation } from '@chayfood/shared-types';

describe('FamilyNutritionService', () => {
  let service: FamilyNutritionService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      menuItem: {
        findMany: jest.fn(),
      },
    };
    service = new FamilyNutritionService(mockPrisma);
  });

  describe('estimateDailyCalories', () => {
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

    it('sử dụng giá trị mặc định hợp lý khi thiếu tham số thể trạng', () => {
      const calories = service.estimateDailyCalories();
      expect(calories).toBeGreaterThan(1500);
      expect(calories).toBeLessThan(2500);
    });
  });

  describe('extractCrossAllergens', () => {
    it('tổng hợp toàn bộ dị ứng giao thoa từ các thành viên gia đình và loại bỏ trùng lặp', () => {
      const sampleMembers: Partial<FamilyMember>[] = [
        {
          id: '1',
          name: 'Bố',
          dietaryRestrictions: ['Dị ứng đậu phộng', 'Ít muối'],
        },
        {
          id: '2',
          name: 'Con',
          dietaryRestrictions: ['Dị ứng đậu phộng', 'Không ăn cay'],
        },
        {
          id: '3',
          name: 'Mẹ',
          dietaryRestrictions: ['Dị ứng gluten'],
        },
      ];

      const allergens = service.extractCrossAllergens(sampleMembers as FamilyMember[]);
      expect(allergens).toContain('dị ứng đậu phộng');
      expect(allergens).toContain('ít muối');
      expect(allergens).toContain('không ăn cay');
      expect(allergens).toContain('dị ứng gluten');
      expect(allergens.length).toBe(4);
    });
  });

  describe('deriveClinicalSafeguards', () => {
    it('tự động phát hiện bệnh lý tiểu đường và huyết áp để áp dụng phác đồ DASH & Low GI', () => {
      const sampleMembers: Partial<FamilyMember>[] = [
        {
          id: '1',
          name: 'Ông',
          age: 70,
          relation: FamilyRelation.PARENT,
          medicalConditions: ['Tiểu đường type 2', 'Tăng huyết áp'],
        },
        {
          id: '2',
          name: 'Cháu',
          age: 8,
          relation: FamilyRelation.CHILD,
          medicalConditions: [],
        },
      ];

      const safeguards = service.deriveClinicalSafeguards(sampleMembers as FamilyMember[]);
      expect(safeguards.some((s) => s.includes('GI thấp'))).toBe(true);
      expect(safeguards.some((s) => s.includes('DASH'))).toBe(true);
      expect(safeguards.some((s) => s.includes('Canxi'))).toBe(true);
      expect(safeguards.some((s) => s.includes('Chế biến mềm'))).toBe(true);
    });
  });

  describe('generateHarmonizedMealPlan', () => {
    it('loại trừ các món ăn chứa chất gây dị ứng và sinh mâm cơm đủ 4 nhóm món', async () => {
      const mockDishes = [
        {
          id: 'd1',
          name: 'Đậu Sốt Nấm',
          category: 'MAIN',
          image: '/img1.jpg',
          price: 55000,
          calories: 320,
          protein: 16,
          carbs: 25,
          fat: 8,
          allergens: ['nấm'],
        },
        {
          id: 'd2',
          name: 'Gỏi Cuốn Bơ Đậu Phộng',
          category: 'MAIN',
          image: '/img2.jpg',
          price: 45000,
          calories: 280,
          protein: 10,
          carbs: 30,
          fat: 12,
          allergens: ['đậu phộng'],
        },
        {
          id: 'd3',
          name: 'Canh Rong Biển',
          category: 'SIDE',
          image: '/img3.jpg',
          price: 35000,
          calories: 120,
          protein: 6,
          carbs: 15,
          fat: 2,
          allergens: [],
        },
        {
          id: 'd4',
          name: 'Cải Thìa Xào Nấm',
          category: 'SIDE',
          image: '/img4.jpg',
          price: 35000,
          calories: 140,
          protein: 5,
          carbs: 18,
          fat: 3,
          allergens: [],
        },
        {
          id: 'd5',
          name: 'Trà Hoa Cúc Táo Đỏ',
          category: 'BEVERAGE',
          image: '/img5.jpg',
          price: 25000,
          calories: 60,
          protein: 1,
          carbs: 14,
          fat: 0,
          allergens: [],
        },
      ];

      mockPrisma.menuItem.findMany.mockResolvedValue(mockDishes);

      const members: Partial<FamilyMember>[] = [
        {
          id: 'm1',
          name: 'Bé Linh',
          relation: FamilyRelation.CHILD,
          age: 9,
          dailyCalories: 1400,
          medicalConditions: [],
          dietaryRestrictions: ['đậu phộng'],
        },
      ];

      const result = await service.generateHarmonizedMealPlan('group-1', members as FamilyMember[]);

      expect(result.servingCount).toBe(1);
      // Món d2 chứa 'đậu phộng' nên phải bị loại trừ
      const dishNames = result.dishes.map((d) => d.name);
      expect(dishNames).not.toContain('Gỏi Cuốn Bơ Đậu Phộng');
      expect(dishNames).toContain('Đậu Sốt Nấm');
      expect(result.crossEliminatedAllergens).toContain('đậu phộng');
      expect(result.memberPortionAdvice.length).toBe(1);
    });
  });
});
