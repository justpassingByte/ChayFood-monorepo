import { z } from 'zod';

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  DELIVERING: 'DELIVERING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentMethod = {
  COD: 'COD',
  CARD: 'CARD',
  BANKING: 'BANKING',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const OrderStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'DELIVERING',
  'READY',
  'DELIVERED',
  'CANCELLED',
]);

export const PaymentMethodSchema = z.enum(['COD', 'CARD', 'BANKING'], {
  required_error: 'Vui lòng chọn phương thức thanh toán',
  invalid_type_error: 'Phương thức thanh toán phải là COD, CARD hoặc BANKING',
  message: 'Phương thức thanh toán phải là COD, CARD hoặc BANKING',
});

export const PaymentStatusSchema = z.enum(['PENDING', 'PAID', 'FAILED']);

export const DeliveryAddressSchema = z.object({
  street: z
    .string({
      required_error: 'Vui lòng nhập địa chỉ nhận hàng (số nhà, tên đường)',
      invalid_type_error: 'Địa chỉ nhận hàng phải là chuỗi ký tự',
    })
    .min(3, { message: 'Địa chỉ nhận hàng quá ngắn (tối thiểu 3 ký tự)' }),
  city: z
    .string({
      required_error: 'Vui lòng nhập Tỉnh/Thành phố',
      invalid_type_error: 'Tỉnh/Thành phố phải là chuỗi ký tự',
    })
    .min(2, { message: 'Tỉnh/Thành phố không hợp lệ' }),
  state: z.string().optional().default('Việt Nam'),
  postalCode: z.string().optional().default('70000'),
  additionalInfo: z.string().optional(),
});
export type DeliveryAddressInput = z.infer<typeof DeliveryAddressSchema>;

export const CreateOrderItemSchema = z.object({
  menuItemId: z
    .string({
      required_error: 'Món ăn trong giỏ hàng không hợp lệ. Vui lòng chọn lại món',
      invalid_type_error: 'Mã món ăn không đúng định dạng',
    })
    .min(1, { message: 'Món ăn trong giỏ hàng không hợp lệ. Vui lòng chọn lại món' }),
  quantity: z
    .number({
      required_error: 'Số lượng không được để trống',
      invalid_type_error: 'Số lượng phải là số',
    })
    .int({ message: 'Số lượng phải là số nguyên' })
    .positive({ message: 'Số lượng món phải lớn hơn 0' }),
  specialInstructions: z.string().optional(),
});
export type CreateOrderItemInput = z.infer<typeof CreateOrderItemSchema>;

export const CreateOrderSchema = z.object({
  items: z
    .array(CreateOrderItemSchema, {
      required_error: 'Giỏ hàng của bạn đang trống',
      invalid_type_error: 'Danh sách món ăn không đúng định dạng',
    })
    .min(1, { message: 'Giỏ hàng của bạn đang trống. Vui lòng chọn món trước khi đặt hàng' }),
  deliveryAddress: DeliveryAddressSchema,
  paymentMethod: PaymentMethodSchema,
  specialInstructions: z.string().optional(),
});
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
