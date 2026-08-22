import { FoodItem } from './food';
import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  CreateOrderInput,
  CreateOrderItemInput,
  DeliveryAddressInput,
} from './schemas/order.schema';

export type { CreateOrderInput, CreateOrderItemInput, DeliveryAddressInput };

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  foodId?: string;
  food?: FoodItem;
  quantity: number;
  price: number;
  specialInstructions?: string | null;
  note?: string | null;
}

export interface Order {
  id: string;
  sequenceNumber?: number;
  orderNumber?: string;
  userId: string;
  totalAmount: number;
  shippingFee?: number;
  discountAmount?: number;
  finalAmount?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: DeliveryAddressInput | string;
  shippingAddress?: string;
  phoneNumber?: string;
  recipientName?: string;
  specialInstructions?: string | null;
  note?: string | null;
  items: OrderItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

/** Alias chuẩn hóa từ Zod CreateOrderInput để đảm bảo SSOT */
export type CreateOrderDto = CreateOrderInput;
