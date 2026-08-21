import api from '../lib/services/apiClient';

export interface CheckoutPayload {
  cart?: {
    items: Array<{
      menuItemId?: string;
      menuItem?: string;
      quantity: number;
      price?: number;
      specialInstructions?: string;
    }>;
    totalAmount: number;
  };
  items?: Array<{
    menuItemId?: string;
    menuItem?: string;
    quantity: number;
    price?: number;
    specialInstructions?: string;
  }>;
  deliveryAddress?: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    additionalInfo?: string;
  };
  address?: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    additionalInfo?: string;
  };
  notes?: string;
  specialInstructions?: string;
  userId?: string;
  user?: {
    _id?: string;
    id?: string;
    email?: string;
    name?: string;
  };
  paymentMethod: 'COD' | 'CARD' | 'BANKING' | 'cod' | 'banking' | 'stripe' | 'card';
}

export const paymentService = {
  // Tạo payment intent cho order
  createPaymentIntent: async (orderId: string) => {
    const response = await api.post(`/payment/create-intent/${orderId}`);
    return response.data;
  },

  // Xác nhận thanh toán thành công
  confirmPayment: async (orderId: string, paymentIntentId: string) => {
    const response = await api.post(`/payment/confirm/${orderId}`, { paymentIntentId });
    return response.data;
  },

  // Refund thanh toán (admin)
  refundPayment: async (orderId: string, amount?: number, reason?: string) => {
    const response = await api.post(`/payment/refund/${orderId}`, { amount, reason });
    return response.data;
  },

  // Tạo Stripe Checkout Session cho order
  createCheckoutSession: async (orderId: string) => {
    const response = await api.post(`/payment/checkout-session/${orderId}`);
    return response.data;
  },

  // Tạo Stripe Checkout Session với metadata cart, address, notes, user
  createCheckoutSessionWithCart: async (payload: CheckoutPayload) => {
    const response = await api.post('/payment/checkout-session', payload);
    return response.data;
  },
};