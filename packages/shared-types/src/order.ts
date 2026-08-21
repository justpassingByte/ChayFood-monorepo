import { FoodItem } from './food';
import type { OrderStatus, PaymentMethod, PaymentStatus } from './schemas/order.schema';

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
