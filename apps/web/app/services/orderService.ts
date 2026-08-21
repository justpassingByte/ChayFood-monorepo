import api from '../lib/services/apiClient';
import type { OrderStatus, PaymentStatus, PaymentMethod } from '@chayfood/shared-types';

export interface OrderItem {
  id?: string;
  menuItemId?: string;
  quantity: number;
  price: number;
  specialInstructions?: string | null;
  menuItem?: {
    id?: string;
    _id?: string;
    name: string;
    price: number;
    image?: string;
  };
}

export interface PaymentTransactionInfo {
  id: string;
  provider: string;
  providerTxId?: string | null;
  amount: number;
  status: string;
  expiresAt?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber: string;
  sequenceNumber?: number;
  userId?: string;
  user?: {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: {
    street: string;
    city: string;
    phone?: string;
    state?: string;
    postalCode?: string;
    additionalInfo?: string;
  };
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryTime?: string | null;
  specialInstructions?: string | null;
  paymentTransactions?: PaymentTransactionInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderFilters {
  status?: OrderStatus | string;
  paymentStatus?: PaymentStatus | string;
  paymentMethod?: PaymentMethod | string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateOrderPayload {
  items: Array<{
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    additionalInfo?: string;
  };
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
}

export interface OrderResponse {
  status: 'success' | 'error';
  data?: Order;
  message?: string;
}

export const orderService = {
  // Lấy tất cả đơn hàng kèm bộ lọc (Admin)
  getAll: async (filters?: AdminOrderFilters): Promise<Order[]> => {
    try {
      const response = await api.get('/orders', { params: filters });
      return response.data.data || response.data.items || response.data || [];
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  },

  // Lấy lịch sử đơn hàng của user
  getMyOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get('/orders/my-orders');
      return response.data.data || response.data.items || response.data || [];
    } catch (error) {
      console.error('Error fetching my orders:', error);
      return [];
    }
  },

  // Lấy đơn hàng theo ID
  getById: async (id: string): Promise<Order | null> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      return null;
    }
  },

  // Cập nhật trạng thái đơn hàng theo State Machine (Admin)
  updateStatus: async (id: string, status: OrderStatus): Promise<Order | null> => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating order status ${id}:`, error);
      throw error;
    }
  },

  // Hủy đơn hàng (User khi PENDING hoặc Admin)
  cancel: async (id: string, _feedback?: string): Promise<boolean> => {
    try {
      const response = await api.patch(`/orders/${id}/cancel`);
      return response.status === 200;
    } catch (error) {
      console.error(`Error cancelling order ${id}:`, error);
      throw error;
    }
  },

  // Xác nhận nhận hàng (User khi DELIVERING)
  markAsReceived: async (id: string, _feedback?: string): Promise<boolean> => {
    try {
      const response = await api.patch(`/orders/${id}/received`);
      return response.status === 200;
    } catch (error) {
      console.error(`Error confirming order delivery ${id}:`, error);
      throw error;
    }
  },

  // Tạo đơn hàng mới
  create: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    try {
      const response = await api.post('/orders', payload);
      return { status: 'success', data: response.data.data || response.data };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { status: 'error', message: error.message };
      }
      return { status: 'error', message: 'Lỗi khi tạo đơn hàng' };
    }
  },
};