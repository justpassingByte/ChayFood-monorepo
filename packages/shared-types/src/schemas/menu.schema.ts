import { z } from 'zod';

export const MenuCategory = {
  MAIN: 'MAIN',
  SIDE: 'SIDE',
  DESSERT: 'DESSERT',
  BEVERAGE: 'BEVERAGE',
} as const;
export type MenuCategory = (typeof MenuCategory)[keyof typeof MenuCategory];

export const MenuCategorySchema = z.enum(['MAIN', 'SIDE', 'DESSERT', 'BEVERAGE']);

export const NutritionInfoSchema = z.object({
  calories: z.number().min(0, { message: 'Calories không được âm' }).max(10000, { message: 'Calories không hợp lệ' }),
  protein: z.number().min(0, { message: 'Protein không được âm' }).max(1000, { message: 'Protein không hợp lệ' }),
  carbs: z.number().min(0, { message: 'Carbs không được âm' }).max(1000, { message: 'Carbs không hợp lệ' }),
  fat: z.number().min(0, { message: 'Fat không được âm' }).max(1000, { message: 'Fat không hợp lệ' }),
});
export type NutritionInfo = z.infer<typeof NutritionInfoSchema>;

export const CreateMenuItemSchema = z.object({
  name: z
    .string({
      required_error: 'Vui lòng nhập tên món ăn',
      invalid_type_error: 'Tên món ăn phải là chuỗi ký tự',
    })
    .min(2, { message: 'Tên món ăn phải có tối thiểu 2 ký tự' })
    .max(150, { message: 'Tên món ăn tối đa 150 ký tự' }),
  description: z
    .string({
      required_error: 'Vui lòng nhập mô tả món ăn',
      invalid_type_error: 'Mô tả món ăn phải là chuỗi ký tự',
    })
    .min(5, { message: 'Mô tả món ăn phải có tối thiểu 5 ký tự' })
    .max(1000, { message: 'Mô tả món ăn tối đa 1000 ký tự' }),
  price: z
    .number({
      required_error: 'Vui lòng nhập giá món ăn',
      invalid_type_error: 'Giá món ăn phải là số',
    })
    .positive({ message: 'Giá món ăn phải lớn hơn 0' })
    .max(100000000, { message: 'Giá món ăn vượt quá giới hạn cho phép' }),
  category: MenuCategorySchema,
  image: z.string().url({ message: 'Đường dẫn hình ảnh không hợp lệ' }).max(1000),
  calories: z.number().min(0).max(10000).default(400),
  protein: z.number().min(0).max(1000).default(15),
  carbs: z.number().min(0).max(1000).default(55),
  fat: z.number().min(0).max(1000).default(10),
  isAvailable: z.boolean().default(true),
  preparationTime: z.number().min(1).max(1440).default(15),
  ingredients: z.array(z.string().max(100)).max(50).default([]),
  allergens: z.array(z.string().max(100)).max(50).default([]),
});
export type CreateMenuItemInput = z.infer<typeof CreateMenuItemSchema>;

export const UpdateMenuItemSchema = CreateMenuItemSchema.partial();
export type UpdateMenuItemInput = z.infer<typeof UpdateMenuItemSchema>;
