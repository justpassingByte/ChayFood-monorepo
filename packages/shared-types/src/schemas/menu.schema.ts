import { z } from 'zod';

export const MenuCategorySchema = z.enum([
  'RICE',
  'NOODLE',
  'SOUP',
  'HOTPOT',
  'SNACK',
  'DRINK',
  'DESSERT',
  'COMBO',
]);
export type MenuCategory = z.infer<typeof MenuCategorySchema>;

export const NutritionInfoSchema = z.object({
  calories: z.number().min(0, { message: 'Calories không được âm' }),
  protein: z.number().min(0, { message: 'Protein không được âm' }),
  carbs: z.number().min(0, { message: 'Carbs không được âm' }),
  fat: z.number().min(0, { message: 'Fat không được âm' }),
});
export type NutritionInfo = z.infer<typeof NutritionInfoSchema>;

export const CreateMenuItemSchema = z.object({
  name: z.string().min(2, { message: 'Tên món ăn phải có tối thiểu 2 ký tự' }),
  description: z.string().min(5, { message: 'Mô tả món ăn phải có tối thiểu 5 ký tự' }),
  price: z.number().positive({ message: 'Giá món ăn phải lớn hơn 0' }),
  category: MenuCategorySchema,
  image: z.string().url({ message: 'Đường dẫn hình ảnh không hợp lệ' }),
  calories: z.number().min(0).default(400),
  protein: z.number().min(0).default(15),
  carbs: z.number().min(0).default(55),
  fat: z.number().min(0).default(10),
  isAvailable: z.boolean().default(true),
  preparationTime: z.number().min(1).default(15),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
});
export type CreateMenuItemInput = z.infer<typeof CreateMenuItemSchema>;

export const UpdateMenuItemSchema = CreateMenuItemSchema.partial();
export type UpdateMenuItemInput = z.infer<typeof UpdateMenuItemSchema>;
