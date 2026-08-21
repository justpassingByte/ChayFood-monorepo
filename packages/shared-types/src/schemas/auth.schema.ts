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
  email: z.string().email({ message: 'Địa chỉ email không đúng định dạng' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có tối thiểu 6 ký tự' }),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Họ và tên phải có tối thiểu 2 ký tự' }),
  email: z.string().email({ message: 'Địa chỉ email không đúng định dạng' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có tối thiểu 6 ký tự' }),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng (VD: 0912345678)',
  }).optional().or(z.literal('')),
  address: z.string().optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, { message: 'Họ và tên phải có tối thiểu 2 ký tự' }).optional(),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng (VD: 0912345678)',
  }).optional().or(z.literal('')),
  address: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
