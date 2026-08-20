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
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  images: string[];
  categoryId: string;
  category?: Category;
  isAvailable: boolean;
  isFeatured: boolean;
  calories?: number | null;
  ingredients?: string[];
  rating: number;
  ratingCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateFoodDto {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  categoryId: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  calories?: number;
  ingredients?: string[];
}

export interface UpdateFoodDto extends Partial<CreateFoodDto> {}
