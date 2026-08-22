import { z } from 'zod';
import { DeliveryAddressSchema, PaymentMethod } from './order.schema';


// ─── Plan Schemas ─────────────────────────────────────────────────────────────

/**
 * 🌟 Schema tạo gói ăn định kỳ (Plan Creation Contract):
 * - Ràng buộc giá trị số và độ dài chuỗi chống DoS và dữ liệu âm (RULE-SEC-002).
 * - Tuyệt đối không để dấu chấm cuối câu trong thông báo lỗi (RULE-UI-003).
 */
export const CreatePlanSchema = z.object({
  name: z
    .string({ required_error: 'Tên gói ăn không được để trống' })
    .min(2, 'Tên gói ăn tối thiểu 2 ký tự')
    .max(100, 'Tên gói ăn tối đa 100 ký tự')
    .trim(),
  code: z
    .string({ required_error: 'Mã gói ăn không được để trống' })
    .min(2, 'Mã gói ăn tối thiểu 2 ký tự')
    .max(50, 'Mã gói ăn tối đa 50 ký tự')
    .regex(/^[A-Z0-9_-]+$/, 'Mã gói ăn chỉ chứa chữ hoa, số, gạch dưới và gạch ngang')
    .trim(),
  price: z
    .number({ required_error: 'Giá gói ăn không được để trống' })
    .int('Giá gói ăn phải là số nguyên')
    .min(0, 'Giá gói ăn không được âm')
    .max(100_000_000, 'Giá gói ăn tối đa 100 triệu VND'),
  duration: z
    .number({ required_error: 'Thời hạn gói ăn không được để trống' })
    .int('Thời hạn gói ăn phải là số nguyên ngày')
    .min(1, 'Thời hạn gói ăn tối thiểu 1 ngày')
    .max(365, 'Thời hạn gói ăn tối đa 365 ngày'),
  description: z
    .string({ required_error: 'Mô tả gói ăn không được để trống' })
    .min(5, 'Mô tả gói ăn tối thiểu 5 ký tự')
    .max(1000, 'Mô tả gói ăn tối đa 1000 ký tự')
    .trim(),
  mealsPerDay: z
    .number({ required_error: 'Số bữa ăn mỗi ngày không được để trống' })
    .int('Số bữa ăn mỗi ngày phải là số nguyên')
    .min(1, 'Số bữa ăn mỗi ngày tối thiểu 1 bữa')
    .max(10, 'Số bữa ăn mỗi ngày tối đa 10 bữa'),
  snacksPerDay: z
    .number()
    .int('Số bữa phụ mỗi ngày phải là số nguyên')
    .min(0, 'Số bữa phụ không được âm')
    .max(10, 'Số bữa phụ tối đa 10 bữa')
    .optional(),
  features: z
    .array(z.string().min(1, 'Đặc tính không được rỗng').max(200, 'Đặc tính tối đa 200 ký tự'))
    .max(20, 'Tối đa 20 đặc tính cho một gói ăn')
    .optional(),
  isRecommended: z.boolean().optional(),
});

export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;

export const UpdatePlanSchema = CreatePlanSchema.partial();
export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;

// ─── Subscription Schemas ──────────────────────────────────────────────────────

/**
 * 🌟 Schema đăng ký gói ăn định kỳ (Subscription Checkout Contract):
 * - Kế thừa cấu trúc địa chỉ giao hàng từ DeliveryAddressSchema (SSOT).
 * - Chặn ngày bắt đầu rỗng hoặc không hợp lệ.
 */
export const CreateSubscriptionSchema = z.object({
  planId: z
    .string({ required_error: 'Mã gói ăn không được để trống' })
    .uuid('Mã gói ăn phải là định dạng UUID hợp lệ'),
  startDate: z
    .string({ required_error: 'Ngày bắt đầu không được để trống' })
    .datetime('Ngày bắt đầu phải là chuỗi ngày ISO 8601 hợp lệ'),
  deliveryAddress: DeliveryAddressSchema,
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Phương thức thanh toán không hợp lệ' }),
  }),
  selectedMenuItems: z
    .union([
      z.array(z.string().uuid('ID món ăn phải là định dạng UUID hợp lệ')).max(50, 'Tối đa 50 món ăn được chọn'),
      z.record(z.array(z.string().uuid('ID món ăn phải là định dạng UUID hợp lệ')).max(20, 'Tối đa 20 món ăn mỗi ngày')),
    ])
    .optional(),
  specialInstructions: z
    .string()
    .max(500, 'Ghi chú giao hàng tối đa 500 ký tự')
    .trim()
    .optional(),
});

export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;

// ─── User Preference Schemas ─────────────────────────────────────────────────

/**
 * 🌟 Schema sở thích dinh dưỡng & lọc thông minh (Recommendation Preferences):
 * - Ràng buộc calo và protein cận trên và cận dưới.
 * - Giới hạn kích thước mảng danh mục và thành phần kiêng kị chống Array DoS.
 */
export const UpdatePreferenceSchema = z.object({
  favoriteCategories: z
    .array(z.string().min(1, 'Danh mục không được rỗng').max(50, 'Tên danh mục tối đa 50 ký tự'))
    .max(20, 'Tối đa 20 danh mục yêu thích')
    .optional(),
  dislikedIngredients: z
    .array(z.string().min(1, 'Tên nguyên liệu không được rỗng').max(100, 'Tên nguyên liệu tối đa 100 ký tự'))
    .max(30, 'Tối đa 30 nguyên liệu kiêng kị')
    .optional(),
  minProtein: z
    .number()
    .min(0, 'Lượng đạm tối thiểu không được âm')
    .max(300, 'Lượng đạm tối thiểu tối đa 300g')
    .optional(),
  maxCalories: z
    .number()
    .int('Lượng calo phải là số nguyên')
    .min(0, 'Lượng calo tối đa không được âm')
    .max(5000, 'Lượng calo tối đa 5000 kcal')
    .optional(),
  dietaryRestrictions: z
    .array(z.string().min(1, 'Ràng buộc ăn kiêng không được rỗng').max(100, 'Tên ràng buộc tối đa 100 ký tự'))
    .max(20, 'Tối đa 20 ràng buộc ăn kiêng')
    .optional(),
});

export type UpdatePreferenceInput = z.infer<typeof UpdatePreferenceSchema>;
