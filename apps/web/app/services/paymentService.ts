import api from '../lib/services/apiClient';
import type { PaymentIntentResult, PaymentStatusResult } from '@chayfood/shared-types';

export const paymentService = {
  /**
   * Tạo Payment Intent (VietQR URL / Stripe Session / COD) cho đơn hàng
   */
  createPaymentIntent: async (orderId: string): Promise<PaymentIntentResult> => {
    const response = await api.post<PaymentIntentResult>(`/payment/create-intent/${orderId}`);
    return response.data;
  },

  /**
   * Tra cứu trạng thái thanh toán đơn hàng (Frontend Polling)
   */
  getPaymentStatus: async (orderId: string): Promise<PaymentStatusResult> => {
    const response = await api.get<PaymentStatusResult>(`/payment/status/${orderId}`);
    return response.data;
  },
};