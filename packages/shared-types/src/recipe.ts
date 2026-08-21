import { Ingredient, IngredientUnit } from './inventory';

export interface RecipeStep {
  stepNumber: number;
  title: string;
  description: string;
  timeInMinutes?: number;
}

export interface RecipeItem {
  id: string;
  recipeId: string;
  ingredientId: string;
  ingredient?: Ingredient;
  quantity: number;
  unit: IngredientUnit;
  isOptional: boolean;
  notes?: string | null;
  createdAt?: string | Date;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  menuItem?: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
  };
  name: string;
  description?: string | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servingSize: number;
  instructions: RecipeStep[];
  notes?: string | null;
  items?: RecipeItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateRecipeItemDto {
  ingredientId: string;
  quantity: number;
  unit: IngredientUnit;
  isOptional?: boolean;
  notes?: string;
}

export interface CreateRecipeDto {
  menuItemId: string;
  name: string;
  description?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servingSize?: number;
  instructions?: RecipeStep[];
  notes?: string;
  items?: CreateRecipeItemDto[];
}

export interface UpdateRecipeDto {
  name?: string;
  description?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servingSize?: number;
  instructions?: RecipeStep[];
  notes?: string;
  items?: CreateRecipeItemDto[];
}

export interface FoodCostItemAnalysis {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: IngredientUnit;
  unitCost: number;
  totalCost: number;
  costPercentage: number;
}

export interface FoodCostAnalysis {
  recipeId: string;
  recipeName: string;
  menuItemId: string;
  menuItemName: string;
  sellingPrice: number;
  totalCost: number;
  grossMargin: number;
  grossMarginPercentage: number;
  itemCosts: FoodCostItemAnalysis[];
}
