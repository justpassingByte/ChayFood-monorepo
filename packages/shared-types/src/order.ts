import { FoodItem } from './food';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'DELIVERING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  DELIVERING: 'DELIVERING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const;

export type PaymentMethod = 'COD' | 'CARD' | 'BANKING';

export const PaymentMethod = {
  COD: 'COD',
  CARD: 'CARD',
  BANKING: 'BANKING',
} as const;

export interface OrderItem {
  id: string;
  orderId: string;
  foodId: string;
  food?: FoodItem;
  quantity: number;
  price: number;
  note?: string | null;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  phoneNumber: string;
  recipientName: string;
  note?: string | null;
  items: OrderItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateOrderDto {
  items: Array<{
    foodId: string;
    quantity: number;
    note?: string;
  }>;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  phoneNumber: string;
  recipientName: string;
  note?: string;
}
