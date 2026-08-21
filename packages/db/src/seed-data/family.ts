import { ActivityLevel, FamilyRelation } from '@prisma/client';

export interface SeedFamilyMemberData {
  name: string;
  relation: FamilyRelation;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  dailyCalories: number;
  medicalConditions: string[];
  dietaryRestrictions: string[];
  isManaged: boolean;
  notes?: string;
}

export const seedFamilyMembers: SeedFamilyMemberData[] = [
  {
    name: 'Nguyễn Văn Minh (Chủ Hộ)',
    relation: 'SELF',
    age: 34,
    gender: 'male',
    heightCm: 172,
    weightKg: 68,
    activityLevel: 'MODERATELY_ACTIVE',
    dailyCalories: 2150,
    medicalConditions: [],
    dietaryRestrictions: ['Ưa thích nấm đùi gà', 'Giàu Protein'],
    isManaged: false,
  },
  {
    name: 'Lê Thu Trang (Vợ)',
    relation: 'SPOUSE',
    age: 32,
    gender: 'female',
    heightCm: 160,
    weightKg: 52,
    activityLevel: 'LIGHTLY_ACTIVE',
    dailyCalories: 1680,
    medicalConditions: [],
    dietaryRestrictions: ['Thanh nhiệt dưỡng nhan', 'Ít dầu mỡ'],
    isManaged: true,
  },
  {
    name: 'Bác Nguyễn Văn An (Bố)',
    relation: 'PARENT',
    age: 68,
    gender: 'male',
    heightCm: 165,
    weightKg: 62,
    activityLevel: 'SEDENTARY',
    dailyCalories: 1550,
    medicalConditions: ['Tiểu đường type 2', 'Tăng huyết áp'],
    dietaryRestrictions: ['Ăn nhạt (DASH)', 'Carb GI thấp', 'Không đường'],
    isManaged: true,
    notes: 'Thức ăn cần mềm, hạn chế đồ chiên xào',
  },
  {
    name: 'Bé Nguyễn Minh Anh (Con Gái)',
    relation: 'CHILD',
    age: 8,
    gender: 'female',
    heightCm: 125,
    weightKg: 24,
    activityLevel: 'VERY_ACTIVE',
    dailyCalories: 1450,
    medicalConditions: [],
    dietaryRestrictions: ['Dị ứng đậu phộng', 'Không ăn cay'],
    isManaged: true,
    notes: 'Cần bổ sung canxi và chất xơ phát triển',
  },
];
