import { MenuItem } from '../lib/services/types';

export type ActivityLevel = 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'sedentary' | 'light' | 'moderate' | 'very_active';

export interface HealthProfileForm {
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  primaryGoal: 'fat_loss' | 'muscle_gain' | 'maintenance' | 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'MAINTAIN';
  medicalConditions: string[];
  dietaryRestrictions: string[];
  mealsPerDay?: number;
  dailyWaterLitres?: number;
}

export interface BiomarkerResult {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatGrams: number;
  macroPercentages: {
    protein: number;
    carbs: number;
    fat: number;
  };
  clinicalAdvice: string[];
}

export interface MealSlot {
  slotId: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  slotName: string;
  item: MenuItem;
}

export interface DailyMealPlan {
  slots: MealSlot[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  matchScorePercentage: number;
}

export interface FamilyMemberProfile {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: 'male' | 'female';
  targetCalories: number;
  allergies: string[];
  dietaryNotes: string;
}
