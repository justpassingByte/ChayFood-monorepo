import { z } from 'zod';
import { IngredientUnit } from '../inventory';

export const RecipeStepSchema = z.object({
  stepNumber: z.number().int().min(1, 'Số thứ tự bước tối thiểu là 1').max(100, 'Tối đa 100 bước thực hiện'),
  title: z.string().min(1, 'Tiêu đề bước không được để trống').max(150, 'Tiêu đề bước tối đa 150 ký tự'),
  description: z.string().min(1, 'Mô tả bước không được để trống').max(1000, 'Mô tả bước tối đa 1000 ký tự'),
  timeInMinutes: z.number().int().min(0, 'Thời gian không được âm').max(1440, 'Thời gian tối đa 1440 phút (24 giờ)').optional(),
});

export const CreateRecipeItemSchema = z.object({
  ingredientId: z.string().min(1, 'Mã nguyên liệu không được để trống'),
  quantity: z
    .number()
    .min(0.001, 'Định lượng nguyên liệu tối thiểu là 0.001')
    .max(1000000, 'Định lượng nguyên liệu tối đa là 1.000.000'),
  unit: z.nativeEnum(IngredientUnit, { errorMap: () => ({ message: 'Đơn vị tính không hợp lệ' }) }),
  isOptional: z.boolean().default(false).optional(),
  notes: z.string().max(200, 'Ghi chú nguyên liệu tối đa 200 ký tự').optional(),
});

export const CreateRecipeSchema = z.object({
  menuItemId: z.string().min(1, 'Mã món ăn không được để trống'),
  name: z.string().min(1, 'Tên công thức không được để trống').max(150, 'Tên công thức tối đa 150 ký tự'),
  description: z.string().max(1000, 'Mô tả công thức tối đa 1000 ký tự').optional(),
  prepTimeMinutes: z
    .number()
    .int()
    .min(0, 'Thời gian sơ chế không được âm')
    .max(1440, 'Thời gian sơ chế tối đa 1440 phút (24 giờ)')
    .default(15)
    .optional(),
  cookTimeMinutes: z
    .number()
    .int()
    .min(0, 'Thời gian nấu không được âm')
    .max(1440, 'Thời gian nấu tối đa 1440 phút (24 giờ)')
    .default(15)
    .optional(),
  servingSize: z
    .number()
    .int()
    .min(1, 'Khẩu phần ăn tối thiểu cho 1 người')
    .max(100, 'Khẩu phần ăn tối đa cho 100 người')
    .default(1)
    .optional(),
  instructions: z.array(RecipeStepSchema).max(50, 'Tối đa 50 bước thực hiện quy trình').optional(),
  notes: z.string().max(500, 'Ghi chú công thức tối đa 500 ký tự').optional(),
  items: z.array(CreateRecipeItemSchema).max(50, 'Công thức tối đa 50 nguyên liệu').optional(),
});

export const UpdateRecipeSchema = CreateRecipeSchema.omit({ menuItemId: true }).partial();

export const QueryRecipeSchema = z.object({
  query: z.string().max(100, 'Từ khóa tìm kiếm tối đa 100 ký tự').optional(),
  page: z.number().int().min(1, 'Trang tối thiểu là 1').default(1).optional(),
  limit: z.number().int().min(1, 'Số lượng tối thiểu là 1').max(100, 'Số lượng tối đa là 100').default(20).optional(),
  servings: z.number().int().min(1, 'Khẩu phần tính toán tối thiểu là 1').max(1000, 'Khẩu phần tính toán tối đa là 1000').optional(),
});

export type RecipeStepInput = z.infer<typeof RecipeStepSchema>;
export type CreateRecipeItemInput = z.infer<typeof CreateRecipeItemSchema>;
export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof UpdateRecipeSchema>;
export type QueryRecipeInput = z.infer<typeof QueryRecipeSchema>;
