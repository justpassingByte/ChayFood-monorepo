import api from './apiClient';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // số ngày
  mealsPerDay: number;
  isActive: boolean;
  features?: string[];
  tag?: string;
  recommended?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  deliveryAddress: {
    street: string;
    city: string;
    phone?: string;
    additionalInfo?: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  isActive: boolean;
  specialInstructions?: string | null;
  plan: Plan;
  createdAt: string;
}

export interface CreateSubscriptionPayload {
  planId: string;
  startDate: string;
  deliveryAddress: {
    street: string;
    city: string;
    phone?: string;
    additionalInfo?: string;
  };
  paymentMethod: string;
  specialInstructions?: string;
  selectedMenuItems?: Array<{
    day: number;
    mealTime: string;
    menuItemId: string;
  }>;
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