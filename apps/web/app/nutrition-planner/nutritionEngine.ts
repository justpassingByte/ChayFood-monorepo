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

  // Macro split: 25% Protein, 50% Carbs, 25% Fat
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
