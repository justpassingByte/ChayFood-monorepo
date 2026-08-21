export type FamilyRelation =
  | 'SELF'
  | 'SPOUSE'
  | 'PARENT'
  | 'CHILD'
  | 'GRANDPARENT'
  | 'OTHER';

export const FamilyRelation = {
  SELF: 'SELF',
  SPOUSE: 'SPOUSE',
  PARENT: 'PARENT',
  CHILD: 'CHILD',
  GRANDPARENT: 'GRANDPARENT',
  OTHER: 'OTHER',
} as const;

export type ActivityLevel =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE';

export const ActivityLevel = {
  SEDENTARY: 'SEDENTARY',
  LIGHTLY_ACTIVE: 'LIGHTLY_ACTIVE',
  MODERATELY_ACTIVE: 'MODERATELY_ACTIVE',
  VERY_ACTIVE: 'VERY_ACTIVE',
} as const;

export interface FamilyMember {
  id: string;
  familyGroupId: string;
  userId?: string | null;
  name: string;
  relation: FamilyRelation;
  age?: number | null;
  gender?: 'male' | 'female' | 'other' | null;
  heightCm?: number | null;
  weightKg?: number | null;
  activityLevel: ActivityLevel;
  dailyCalories?: number | null;
  medicalConditions: string[];
  dietaryRestrictions: string[];
  isManaged: boolean;
  avatar?: string | null;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FamilyGroup {
  id: string;
  ownerId: string;
  name: string;
  inviteCode: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  members?: FamilyMember[];
}

export interface CreateFamilyMemberDto {
  name: string;
  relation: FamilyRelation;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  heightCm?: number;
  weightKg?: number;
  activityLevel?: ActivityLevel;
  medicalConditions?: string[];
  dietaryRestrictions?: string[];
  isManaged?: boolean;
  notes?: string;
}

export interface UpdateFamilyMemberDto {
  name?: string;
  relation?: FamilyRelation;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  heightCm?: number;
  weightKg?: number;
  activityLevel?: ActivityLevel;
  medicalConditions?: string[];
  dietaryRestrictions?: string[];
  isManaged?: boolean;
  notes?: string;
}

export interface JoinFamilyByCodeDto {
  inviteCode: string;
  relation: FamilyRelation;
}

export interface MemberPortionAdvice {
  memberId: string;
  memberName: string;
  relation: FamilyRelation;
  targetCalories: number;
  targetProtein: number;
  specialDietNote: string;
  recommendedPortionPercentage: number;
  specificGuidance: string[];
}

export interface HarmonizedFamilyMealPlan {
  familyGroupId?: string;
  servingCount: number;
  participatingMembers: {
    id: string;
    name: string;
    relation: FamilyRelation;
    age?: number | null;
    medicalConditions: string[];
    dietaryRestrictions: string[];
  }[];
  totalMealCalories: number;
  macroSummary: {
    protein: number;
    carbs: number;
    fat: number;
  };
  crossEliminatedAllergens: string[];
  clinicalSafeguards: string[];
  dishes: {
    id: string;
    name: string;
    category: string;
    image: string;
    price: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingRole: string; // 'Món Đạm Chính' | 'Canh Thanh Nhiệt' | 'Rau Củ Tươi Lành' | 'Tinh Bột Phức Hợp' | 'Tráng Miệng'
  }[];
  memberPortionAdvice: MemberPortionAdvice[];
}
