import {
  PaymentIntentResult,
  WebhookVerificationResult,
  PaymentStatusResult,
  PaymentProviderType,
} from '@chayfood/shared-types';

export interface PaymentIntentMetadata {
  orderSequenceNumber: number;
  orderNumber: string;
  transferContent: string;
  customerEmail?: string;
  customerName?: string;
}

export interface IPaymentProvider {
  readonly providerType: PaymentProviderType;

  /**
   * Tạo Payment Intent hoặc phiên thanh toán
   */
  createPaymentIntent(
    orderId: string,
    amount: number,
    currency: string,
    metadata: PaymentIntentMetadata,
  ): Promise<PaymentIntentResult>;

  /**
   * Xác thực và phân tích Webhook payload từ cổng thanh toán
   */
  verifyWebhook(
    payload: Record<string, string | number | boolean | object | null>,
    signature?: string,
  ): Promise<WebhookVerificationResult>;

  /**
   * Tra cứu trạng thái giao dịch từ phía nhà cung cấp
   */
  getPaymentStatus(transactionId: string): Promise<PaymentStatusResult>;
}
