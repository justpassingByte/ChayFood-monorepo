import api from '../lib/services/apiClient';

export interface Order {
  _id: string;
  id?: string;
  orderNumber?: string;
  user: string | {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    menuItem: string | {
      _id: string;
      id?: string;
      name: string;
      price: number;
      image?: string;
    };
    quantity: number;
    price: number;
    specialInstructions?: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    additionalInfo?: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'COD' | 'CARD' | 'BANKING' | 'cod' | 'card' | 'banking' | 'stripe';
  deliveryTime?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateData {
  user?: string;
  items: Array<{
    menuItemId?: string;
    menuItem?: string;
    quantity: number;
    price?: number;
    specialInstructions?: string;
  }>;
  totalAmount?: number;
  deliveryAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    additionalInfo?: string;
  };
  paymentMethod: 'COD' | 'CARD' | 'BANKING' | 'cod' | 'card' | 'banking' | 'stripe';
  specialInstructions?: string;
}

export interface OrderResponse {
  status: 'success' | 'error';
  data?: Order;
  message?: string;
}

export interface ApiError {
  status?: string;
  message?: string;
  response?: {
    data?: {
      message?: string | string[];
      status?: string;
      error?: string;
    };
  };
}

export const orderService = {
  // Lấy tất cả đơn hàng (admin)
  getAll: async (): Promise<Order[]> => {
    try {
      const response = await api.get('/orders');
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

  // Cập nhật trạng thái đơn hàng (admin)
  updateStatus: async (id: string, status: Order['status']): Promise<Order | null> => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating order status ${id}:`, error);
      return null;
    }
  },

  // Hủy đơn hàng (admin hoặc user)
  cancelOrder: async (id: string): Promise<boolean> => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status: 'cancelled' });
      return response.status === 200;
    } catch (error) {
      console.error(`Error cancelling order ${id}:`, error);
      return false;
    }
  },

  // Lọc đơn hàng theo trạng thái
  filterByStatus: async (status: Order['status']): Promise<Order[]> => {
    try {
      const response = await api.get('/orders', { params: { status } });
      return response.data.data || response.data.items || response.data || [];
    } catch (error) {
      console.error(`Error filtering orders by status ${status}:`, error);
      return [];
    }
  },

  // Tìm kiếm đơn hàng
  search: async (query: string): Promise<Order[]> => {
    try {
      const response = await api.get('/orders', { params: { query } });
      return response.data.data || response.data.items || response.data || [];
    } catch (error) {
      console.error(`Error searching orders with query ${query}:`, error);
      return [];
    }
  },

  // Tạo đơn hàng mới với tự động chuẩn hóa DTO
  create: async (orderData: OrderCreateData): Promise<OrderResponse> => {
    try {
      const rawPayment = String(orderData.paymentMethod || '').toUpperCase();
      const normalizedPayment =
        rawPayment === 'BANKING' ? 'BANKING' : rawPayment === 'STRIPE' || rawPayment === 'CARD' ? 'CARD' : 'COD';

      const normalizedPayload = {
        items: orderData.items.map((it) => ({
          menuItemId: it.menuItemId || it.menuItem || '',
          quantity: Number(it.quantity || 1),
          specialInstructions: it.specialInstructions || undefined,
        })),
        deliveryAddress: {
          street: orderData.deliveryAddress.street,
          city: orderData.deliveryAddress.city,
          state: orderData.deliveryAddress.state || 'Việt Nam',
          postalCode: orderData.deliveryAddress.postalCode || '70000',
          additionalInfo: orderData.deliveryAddress.additionalInfo || undefined,
        },
        paymentMethod: normalizedPayment,
        specialInstructions: orderData.specialInstructions || undefined,
      };

      const response = await api.post('/orders', normalizedPayload);
      return { status: 'success', data: response.data.data || response.data };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.data) {
        const dataObj = apiError.response.data as {
          message?: string | string[];
          issues?: Array<{ field?: string; message: string }>;
          error?: string;
        };

        if (dataObj.issues && Array.isArray(dataObj.issues) && dataObj.issues.length > 0) {
          return {
            status: 'error',
            message: dataObj.issues.map((i) => i.message).join('. '),
          };
        }

        const msg = dataObj.message || dataObj.error;
        return {
          status: 'error',
          message: Array.isArray(msg) ? msg.join(', ') : typeof msg === 'string' ? msg : 'Lỗi khi khởi tạo đơn hàng',
        };
      }
      return { status: 'error', message: apiError.message || 'Lỗi khi khởi tạo đơn hàng' };
    }
  },

  // Lấy đơn hàng theo Stripe sessionId
  getBySessionId: async (sessionId: string): Promise<Order | null> => {
    try {
      const response = await api.get(`/orders/by-session/${sessionId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching order by sessionId ${sessionId}:`, error);
      return null;
    }
  },
};