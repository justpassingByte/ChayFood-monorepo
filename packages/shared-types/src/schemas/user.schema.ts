import { z } from 'zod';

/**
 * Schema quản lý sổ địa chỉ giao hàng (Address Book Contract).
 * Đặt chặn biên chặt chẽ trên mọi trường ký tự để ngăn chặn DoS và dữ liệu rác.
 */
export const AddressSchema = z.object({
  id: z.string().max(100).optional(),
  name: z.string().max(100, { message: 'Tên gợi nhớ tối đa 100 ký tự' }).optional(),
  street: z.string().min(1, { message: 'Địa chỉ đường phố không được để trống' }).max(255, { message: 'Địa chỉ đường phố tối đa 255 ký tự' }),
  city: z.string().min(1, { message: 'Thành phố không được để trống' }).max(100, { message: 'Thành phố tối đa 100 ký tự' }),
  state: z.string().max(100, { message: 'Quận huyện tối đa 100 ký tự' }).optional(),
  postalCode: z.string().max(20, { message: 'Mã bưu chính tối đa 20 ký tự' }).optional(),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng (VD: 0912345678)',
  }).optional().or(z.literal('')),
  additionalInfo: z.string().max(500, { message: 'Ghi chú giao hàng tối đa 500 ký tự' }).optional(),
  isDefault: z.boolean().optional(),
});
export type AddressInput = z.infer<typeof AddressSchema>;

/**
 * Schema cập nhật sở thích dinh dưỡng & mục tiêu Macro (Clinical Nutrition Engine Invariant).
 * Bắt buộc chặn biên thực tế để ngăn ngừa số âm/quá lớn làm đổ vỡ thuật toán tính toán khẩu phần ăn.
 */
export const UserPreferenceSchema = z.object({
  maxCalories: z.number().int({ message: 'Lượng calo phải là số nguyên' }).min(500, { message: 'Lượng calo tối thiểu từ 500 kcal' }).max(10000, { message: 'Lượng calo tối đa 10000 kcal' }).optional(),
  minProtein: z.number().min(0, { message: 'Lượng đạm không được âm' }).max(500, { message: 'Lượng đạm tối đa 500g' }).optional(),
  dislikedIngredients: z.array(z.string().max(100, { message: 'Tên nguyên liệu tối đa 100 ký tự' })).max(50, { message: 'Danh sách nguyên liệu kiêng tối đa 50 mục' }).optional(),
  favoriteCategories: z.array(z.string().max(100, { message: 'Tên danh mục tối đa 100 ký tự' })).max(20, { message: 'Danh mục yêu thích tối đa 20 mục' }).optional(),
  dietaryRestrictions: z.array(z.string().max(100, { message: 'Tên chế độ ăn kiêng tối đa 100 ký tự' })).max(20, { message: 'Chế độ ăn kiêng tối đa 20 mục' }).optional(),
});
export type UserPreferenceInput = z.infer<typeof UserPreferenceSchema>;

/**
 * Schema đổi mật khẩu (Re-Authentication & Account Takeover Defense).
 * Bắt buộc nhập mật khẩu hiện tại (currentPassword) để xác thực chủ sở hữu trước khi cập nhật.
 */
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Mật khẩu hiện tại phải có tối thiểu 6 ký tự' }).max(100, { message: 'Mật khẩu hiện tại tối đa 100 ký tự' }),
  newPassword: z.string().min(6, { message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' }).max(100, { message: 'Mật khẩu mới tối đa 100 ký tự' }),
});
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
