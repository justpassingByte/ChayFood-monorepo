import { describe, it, expect } from 'vitest';
import { calculateBMI, calculateTargetCalories, NutritionProfile } from './nutritionEngine';

describe('NutritionEngine (Plant-Based Clinical Nutrition Calculation)', () => {
  describe('calculateBMI', () => {
    it('phải tính đúng BMI và phân loại Bình thường cho 60kg, 165cm', () => {
      const result = calculateBMI(60, 165);
      expect(result.bmi).toBe(22);
      expect(result.category).toBe('Bình thường');
    });

    it('phải cảnh báo Tiền béo phì theo chuẩn WHO Châu Á cho 65kg, 165cm (BMI >= 23)', () => {
      const result = calculateBMI(65, 165);
      expect(result.bmi).toBe(23.9);
      expect(result.category).toBe('Tiền béo phì (WHO Châu Á)');
    });
  });

  describe('calculateTargetCalories', () => {
    it('phải tính đúng calo giảm mỡ thâm hụt 18% so với TDEE', () => {
      const profile: NutritionProfile = {
        age: 30,
        gender: 'male',
        heightCm: 170,
        weightKg: 70,
        activityLevel: 'MODERATELY_ACTIVE',
        goal: 'WEIGHT_LOSS',
      };

      const result = calculateTargetCalories(profile);
      expect(result.bmr).toBe(1618);
      expect(result.tdee).toBe(2507);
      expect(result.targetCalories).toBe(2056); // 2507 * 0.82
      expect(result.macros.proteinGrams).toBeGreaterThan(100);
    });

    it('phải tính đúng calo tăng cơ thặng dư 12% so với TDEE', () => {
      const profile: NutritionProfile = {
        age: 25,
        gender: 'female',
        heightCm: 160,
        weightKg: 50,
        activityLevel: 'LIGHTLY_ACTIVE',
        goal: 'MUSCLE_GAIN',
      };

      const result = calculateTargetCalories(profile);
      expect(result.targetCalories).toBe(Math.round(result.tdee * 1.12));
    });
  });
});
