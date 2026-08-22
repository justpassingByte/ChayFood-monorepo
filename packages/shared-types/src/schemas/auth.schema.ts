import { z } from 'zod';

export const Role = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  USER: 'CUSTOMER',
  RESTAURANT_OWNER: 'ADMIN',
  SHIPPER: 'STAFF',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const RoleSchema = z.enum(['CUSTOMER', 'ADMIN', 'STAFF']);

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Địa chỉ email không đúng định dạng' }).max(255, { message: 'Email tối đa 255 ký tự' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có tối thiểu 6 ký tự' }).max(100, { message: 'Mật khẩu tối đa 100 ký tự' }),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Họ và tên phải có tối thiểu 2 ký tự' }).max(100, { message: 'Họ và tên tối đa 100 ký tự' }),
  email: z.string().email({ message: 'Địa chỉ email không đúng định dạng' }).max(255, { message: 'Email tối đa 255 ký tự' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có tối thiểu 6 ký tự' }).max(100, { message: 'Mật khẩu tối đa 100 ký tự' }),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng (VD: 0912345678)',
  }).optional().or(z.literal('')),
  address: z.string().max(255, { message: 'Địa chỉ tối đa 255 ký tự' }).optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * Schema cập nhật hồ sơ người dùng thông thường.
 * Tuyệt đối không bao gồm trường role để ngăn chặn lỗ hổng Privilege Escalation qua Mass Assignment.
 */
export const UpdateProfileSchema = z.object({
  name: z.string().min(2, { message: 'Họ và tên phải có tối thiểu 2 ký tự' }).max(100, { message: 'Họ và tên tối đa 100 ký tự' }).optional(),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng (VD: 0912345678)',
  }).optional().or(z.literal('')),
  address: z.string().max(255, { message: 'Địa chỉ tối đa 255 ký tự' }).optional(),
  avatar: z.string().url({ message: 'Đường dẫn ảnh đại diện không hợp lệ' }).max(1000).optional().or(z.literal('')),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
