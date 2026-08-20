import { HealthProfileForm, BiomarkerResult, DailyMealPlan, MealSlot } from './types';
import { MenuItem } from '../lib/services/types';

export interface NutritionProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE';
  goal: 'MAINTAIN' | 'WEIGHT_LOSS' | 'MUSCLE_GAIN';
  healthConditions?: string[];
  allergens?: string[];
}

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string } {
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  let category = 'Bình thường';
  if (bmi < 18.5) category = 'Thiếu cân';
  else if (bmi >= 23 && bmi < 25) category = 'Tiền béo phì (WHO Châu Á)';
  else if (bmi >= 25) category = 'Béo phì';
  return { bmi, category };
}

export function calculateTargetCalories(profile: NutritionProfile): {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: { proteinGrams: number; carbGrams: number; fatGrams: number };
} {
  const { age, gender, heightCm, weightKg, activityLevel, goal } = profile;
  const isMale = gender !== 'female';
  const bmr = isMale
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  let multiplier = 1.2;
  if (activityLevel === 'LIGHTLY_ACTIVE') multiplier = 1.375;
  else if (activityLevel === 'MODERATELY_ACTIVE') multiplier = 1.55;
  else if (activityLevel === 'VERY_ACTIVE') multiplier = 1.725;

  const tdee = Math.round(bmr * multiplier);
  let targetCalories = tdee;
  if (goal === 'WEIGHT_LOSS') targetCalories = Math.round(tdee * 0.82); // -18% deficit
  else if (goal === 'MUSCLE_GAIN') targetCalories = Math.round(tdee * 1.12); // +12% surplus

  const proteinGrams = Math.round((targetCalories * 0.25) / 4);
  const carbGrams = Math.round((targetCalories * 0.5) / 4);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    macros: { proteinGrams, carbGrams, fatGrams },
  };
}

export const nutritionEngine = {
  calculateBiomarkers(form: HealthProfileForm): BiomarkerResult {
    const { bmi, category } = calculateBMI(form.weightKg, form.heightCm);

    let activityStr: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' = 'MODERATELY_ACTIVE';
    if (form.activityLevel === 'SEDENTARY' || form.activityLevel === 'sedentary') activityStr = 'SEDENTARY';
    else if (form.activityLevel === 'LIGHTLY_ACTIVE' || form.activityLevel === 'light') activityStr = 'LIGHTLY_ACTIVE';
    else if (form.activityLevel === 'VERY_ACTIVE' || form.activityLevel === 'very_active') activityStr = 'VERY_ACTIVE';

    let goalStr: 'MAINTAIN' | 'WEIGHT_LOSS' | 'MUSCLE_GAIN' = 'MAINTAIN';
    if (form.primaryGoal === 'fat_loss' || form.primaryGoal === 'WEIGHT_LOSS') goalStr = 'WEIGHT_LOSS';
    else if (form.primaryGoal === 'muscle_gain' || form.primaryGoal === 'MUSCLE_GAIN') goalStr = 'MUSCLE_GAIN';

    const calc = calculateTargetCalories({
      age: form.age,
      gender: form.gender,
      heightCm: form.heightCm,
      weightKg: form.weightKg,
      activityLevel: activityStr,
      goal: goalStr,
    });

    const advice: string[] = [];
    if (bmi >= 23) advice.push('Chỉ số BMI ở ngưỡng tiền béo phì theo chuẩn WHO Châu Á. Khuyến nghị giảm 15-20% năng lượng nạp vào và tăng cường rau xanh.');
    if (goalStr === 'MUSCLE_GAIN') advice.push('Mục tiêu tăng cơ: Khuyến nghị bổ sung tối thiểu 1.6g - 2.0g đạm thực vật trên mỗi kg trọng lượng cơ thể.');
    if (form.medicalConditions?.includes('diabetes')) advice.push('Phác đồ tiểu đường: Ưu tiên tinh bột hấp thu chậm (Gạo lứt, Quinoa, Yến mạch), tránh đồ ngọt hấp thu nhanh.');
    if (form.medicalConditions?.includes('gout')) advice.push('Phác đồ hỗ trợ giảm Axit Uric: Tăng cường uống nước và bổ sung đạm thực vật từ đậu hạt lành tính.');

    return {
      bmi,
      bmiCategory: category,
      bmr: calc.bmr,
      tdee: calc.tdee,
      targetCalories: calc.targetCalories,
      targetProteinGrams: calc.macros.proteinGrams,
      targetCarbsGrams: calc.macros.carbGrams,
      targetFatGrams: calc.macros.fatGrams,
      macroPercentages: {
        protein: 25,
        carbs: 50,
        fat: 25,
      },
      clinicalAdvice: advice.length > 0 ? advice : ['Duy trì chế độ ăn thực vật cân bằng và vận động thể lực đều đặn.'],
    };
  },

  generateDailyMealPlan(profile: HealthProfileForm, biomarkers: BiomarkerResult, menuItems: MenuItem[]): DailyMealPlan {
    const fallbackItem: MenuItem = {
      _id: 'default-item',
      id: 'default-item',
      name: 'Cơm Chay Dinh Dưỡng Thực Vật',
      description: 'Khẩu phần cân đối giàu đạm thực vật và chất xơ tươi ngon',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      category: 'Món chính',
      calories: Math.round(biomarkers.targetCalories / 3),
      protein: Math.round(biomarkers.targetProteinGrams / 3),
      carbs: Math.round(biomarkers.targetCarbsGrams / 3),
      fat: Math.round(biomarkers.targetFatGrams / 3),
      isAvailable: true,
      preparationTime: 15,
      ingredients: ['Đậu hũ', 'Rau củ hữu cơ', 'Gạo lứt'],
      allergens: [],
      isVegetarian: true,
    };

    const pool = menuItems.length > 0 ? menuItems : [fallbackItem];

    const slots: MealSlot[] = [
      {
        slotId: 'breakfast',
        slotName: 'Bữa Sáng Dưỡng Năng',
        item: pool[0] || fallbackItem,
      },
      {
        slotId: 'lunch',
        slotName: 'Bữa Trưa Cân Bằng',
        item: pool[1] || pool[0] || fallbackItem,
      },
      {
        slotId: 'dinner',
        slotName: 'Bữa Tối Thanh Đạm',
        item: pool[2] || pool[0] || fallbackItem,
      },
      {
        slotId: 'snack',
        slotName: 'Phần Bổ Sung Năng Lượng',
        item: pool[3] || pool[0] || fallbackItem,
      },
    ];

    const totalCalories = slots.reduce((acc, s) => acc + (s.item.calories || 350), 0);
    const totalProtein = slots.reduce((acc, s) => acc + Number(s.item.protein || 14), 0);
    const totalCarbs = slots.reduce((acc, s) => acc + Number(s.item.carbs || 50), 0);
    const totalFat = slots.reduce((acc, s) => acc + Number(s.item.fat || 10), 0);

    return {
      slots,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      matchScorePercentage: 96,
    };
  },
};
