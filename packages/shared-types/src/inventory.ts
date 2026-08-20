export type IngredientUnit =
  | 'GRAM'
  | 'KILOGRAM'
  | 'MILLILITER'
  | 'LITER'
  | 'PIECE'
  | 'PORTION';

export const IngredientUnit = {
  GRAM: 'GRAM',
  KILOGRAM: 'KILOGRAM',
  MILLILITER: 'MILLILITER',
  LITER: 'LITER',
  PIECE: 'PIECE',
  PORTION: 'PORTION',
} as const;

export type StockTransactionType =
  | 'IMPORT'
  | 'EXPORT_ORDER'
  | 'EXPORT_WASTE'
  | 'ADJUSTMENT';

export const StockTransactionType = {
  IMPORT: 'IMPORT',
  EXPORT_ORDER: 'EXPORT_ORDER',
  EXPORT_WASTE: 'EXPORT_WASTE',
  ADJUSTMENT: 'ADJUSTMENT',
} as const;

export interface Ingredient {
  id: string;
  name: string;
  code: string;
  unit: IngredientUnit;
  currentStock: number;
  minThreshold: number;
  costPerUnit: number;
  supplier?: string | null;
  category?: string | null;
  isAvailable: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateIngredientDto {
  name: string;
  code: string;
  unit: IngredientUnit;
  currentStock?: number;
  minThreshold?: number;
  costPerUnit: number;
  supplier?: string;
  category?: string;
  isAvailable?: boolean;
}

export interface UpdateIngredientDto {
  name?: string;
  code?: string;
  unit?: IngredientUnit;
  currentStock?: number;
  minThreshold?: number;
  costPerUnit?: number;
  supplier?: string;
  category?: string;
  isAvailable?: boolean;
}

export interface StockTransaction {
  id: string;
  ingredientId: string;
  ingredient?: Ingredient;
  type: StockTransactionType;
  quantity: number;
  previousStock: number;
  newStock: number;
  unitCost?: number | null;
  totalCost?: number | null;
  referenceId?: string | null;
  notes?: string | null;
  performedBy?: string | null;
  createdAt: string | Date;
}

export interface CreateStockTransactionDto {
  ingredientId: string;
  type: StockTransactionType;
  quantity: number;
  unitCost?: number;
  referenceId?: string;
  notes?: string;
  performedBy?: string;
}

export interface InventoryOverviewStats {
  totalIngredients: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
}
