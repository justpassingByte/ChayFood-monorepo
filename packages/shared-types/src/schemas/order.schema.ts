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

// ─── 🛡️ SSOT Order Schemas & Trust Boundary Invariants (RULE-CODE-002) ───────────

/**
 * Ranh giới địa chỉ nhận hàng:
 * Giới hạn độ dài chuỗi tối đa để chống tấn công tràn bộ đệm và lưu trữ rác.
 */
export const DeliveryAddressSchema = z.object({
  street: z
    .string({
      required_error: 'Vui lòng nhập địa chỉ nhận hàng',
      invalid_type_error: 'Địa chỉ nhận hàng phải là chuỗi ký tự',
    })
    .min(3, { message: 'Địa chỉ nhận hàng quá ngắn (tối thiểu 3 ký tự)' })
    .max(255, { message: 'Địa chỉ nhận hàng tối đa 255 ký tự' }),
  city: z
    .string({
      required_error: 'Vui lòng nhập Tỉnh hoặc Thành phố',
      invalid_type_error: 'Tỉnh hoặc Thành phố phải là chuỗi ký tự',
    })
    .min(2, { message: 'Tỉnh hoặc Thành phố không hợp lệ' })
    .max(100, { message: 'Tỉnh hoặc Thành phố tối đa 100 ký tự' }),
  state: z.string().max(100, { message: 'Quận huyện tối đa 100 ký tự' }).optional().default('Việt Nam'),
  postalCode: z.string().max(20, { message: 'Mã bưu điện tối đa 20 ký tự' }).optional().default('70000'),
  additionalInfo: z.string().max(255, { message: 'Ghi chú địa chỉ tối đa 255 ký tự' }).optional(),
});
export type DeliveryAddressInput = z.infer<typeof DeliveryAddressSchema>;

/**
 * Ranh giới món ăn trong đơn hàng:
 * - Không nhận trường `price` từ client (Server-Authoritative Pricing).
 * - Ràng buộc `int` và `1 <= quantity <= 99` để chống số lượng âm/phân số gây sai lệch trừ kho BOM.
 */
export const CreateOrderItemSchema = z.object({
  menuItemId: z
    .string({
      required_error: 'Mã món ăn không được để trống',
      invalid_type_error: 'Mã món ăn không đúng định dạng',
    })
    .min(1, { message: 'Mã món ăn không hợp lệ, vui lòng chọn lại món' }),
  quantity: z
    .number({
      required_error: 'Số lượng không được để trống',
      invalid_type_error: 'Số lượng phải là số',
    })
    .int({ message: 'Số lượng phải là số nguyên' })
    .min(1, { message: 'Số lượng món phải từ 1 trở lên' })
    .max(99, { message: 'Số lượng món tối đa là 99 phần' }),
  specialInstructions: z
    .string()
    .max(255, { message: 'Ghi chú món ăn tối đa 255 ký tự' })
    .optional(),
});
export type CreateOrderItemInput = z.infer<typeof CreateOrderItemSchema>;

/**
 * Ranh giới tạo đơn hàng tổng thể:
 * - Giới hạn tối đa 50 món khác nhau để chống tấn công cạn kiệt RAM NodeJS (Array DoS).
 * - Hỗ trợ `idempotencyKey` để chống tạo trùng đơn khi mạng di động chập chờn.
 */
export const CreateOrderSchema = z.object({
  items: z
    .array(CreateOrderItemSchema, {
      required_error: 'Giỏ hàng của bạn đang trống',
      invalid_type_error: 'Danh sách món ăn không đúng định dạng',
    })
    .min(1, { message: 'Giỏ hàng đang trống, vui lòng chọn món trước khi đặt hàng' })
    .max(50, { message: 'Giỏ hàng tối đa 50 món khác nhau' }),
  deliveryAddress: DeliveryAddressSchema,
  paymentMethod: PaymentMethodSchema,
  specialInstructions: z
    .string()
    .max(500, { message: 'Ghi chú đơn hàng tối đa 500 ký tự' })
    .optional(),
  idempotencyKey: z
    .string()
    .max(100, { message: 'Khóa chống trùng lặp tối đa 100 ký tự' })
    .optional(),
});
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

/**
 * Schema cập nhật trạng thái đơn hàng (Dành cho Admin State Machine Transition)
 */
export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema,
  paymentStatus: PaymentStatusSchema.optional(),
});
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;


