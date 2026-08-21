import type {
  CreateMenuItemInput,
  UpdateMenuItemInput,
  MenuCategory,
  NutritionInfo,
} from './schemas/menu.schema';

export type { CreateMenuItemInput, UpdateMenuItemInput, MenuCategory, NutritionInfo };

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface FoodItem {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  image?: string;
  images?: string[];
  category?: MenuCategory | string;
  categoryId?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  calories?: number | null;
  protein?: number;
  carbs?: number;
  fat?: number;
  preparationTime?: number;
  ingredients?: string[];
  allergens?: string[];
  rating?: number;
  ratingCount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CreateFoodDto = CreateMenuItemInput;
export type UpdateFoodDto = UpdateMenuItemInput;
