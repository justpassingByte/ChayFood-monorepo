import api from './apiClient';
import type { PaymentMethod, PaymentStatus, DeliveryAddressInput } from '@chayfood/shared-types';

export interface Plan {
  id: string;
  name: string;
  code?: string;
  description: string;
  price: number;
  duration: number; // số ngày
  mealsPerDay: number;
  snacksPerDay?: number;
  isActive: boolean;
  features?: string[];
  tag?: string;
  isRecommended?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  deliveryAddress: DeliveryAddressInput;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  isActive: boolean;
  pausedAt?: string | null;
  specialInstructions?: string | null;
  selectedMenuItems?: string[] | Record<string, string[]> | null;
  plan: Plan;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSubscriptionPayload {
  planId: string;
  startDate: string;
  deliveryAddress: DeliveryAddressInput;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
  selectedMenuItems?: string[] | Record<string, string[]>;
}


export const planService = {
  // Lấy tất cả gói ăn
  getAll: async (): Promise<Plan[]> => {
    const response = await api.get('/plans');
    return response.data.data || response.data || [];
  },

  // Lấy chi tiết gói ăn
  getById: async (id: string): Promise<Plan | null> => {
    const response = await api.get(`/plans/${id}`);
    return response.data.data || response.data;
  },
};

export const subscriptionService = {
  // Lấy các gói đăng ký của người dùng
  getMySubscriptions: async (): Promise<UserSubscription[]> => {
    const response = await api.get('/subscriptions/my-subscriptions');
    return response.data.data || response.data || [];
  },

  // Đăng ký gói ăn mới
  create: async (payload: CreateSubscriptionPayload): Promise<UserSubscription> => {
    const response = await api.post('/subscriptions', payload);
    return response.data.data || response.data;
  },

  // Tạm dừng / Kích hoạt lại gói ăn
  toggle: async (id: string): Promise<UserSubscription> => {
    const response = await api.patch(`/subscriptions/${id}/toggle`);
    return response.data.data || response.data;
  },
};