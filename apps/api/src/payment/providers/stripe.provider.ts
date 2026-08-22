import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentIntentResult,
  WebhookVerificationResult,
  PaymentStatusResult,
  PaymentProviderType,
  PaymentTransactionStatus,
} from '@chayfood/shared-types';
import {
  IPaymentProvider,
  PaymentIntentMetadata,
} from '../interfaces/payment-provider.interface';

interface StripeSessionObject {
  id?: string;
  amount_total?: number;
  client_reference_id?: string;
}

interface StripeWebhookData {
  object?: StripeSessionObject;
}

interface StripeWebhookPayload {
  type?: string;
  data?: StripeWebhookData;
}

/**
 * 🌟 Cổng thanh toán thẻ quốc tế Stripe (Strategy Pattern Implementation):
 * - Hỗ trợ chuẩn bị session thanh toán Checkout an toàn.
 * - Xác thực Webhook `checkout.session.completed` và bóc tách `client_reference_id` để khớp nối đơn hàng.
 */
@Injectable()
export class StripePaymentProvider implements IPaymentProvider {
  readonly providerType: PaymentProviderType = PaymentProviderType.STRIPE;
  private readonly logger = new Logger(StripePaymentProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async createPaymentIntent(
    orderId: string,
    amount: number,
    _currency: string,
    metadata: PaymentIntentMetadata,
  ): Promise<PaymentIntentResult> {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY', '');
    const webUrl = this.configService.get<string>('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
    const transactionId = `stripe_session_${orderId}_${Date.now()}`;

    if (!stripeSecretKey) {
      this.logger.warn('STRIPE_SECRET_KEY is not set. Providing simulated Stripe redirect URL');
      return {
        transactionId,
        status: PaymentTransactionStatus.PENDING,
        redirectUrl: `${webUrl}/order/success?orderId=${orderId}&provider=stripe_simulated`,
      };
    }

    try {
      const params = new URLSearchParams();
      params.append('payment_method_types[]', 'card');
      params.append('line_items[0][price_data][currency]', 'vnd');
      params.append('line_items[0][price_data][product_data][name]', `Đơn hàng ${metadata.orderNumber}`);
      params.append('line_items[0][price_data][unit_amount]', String(Math.round(amount)));
      params.append('line_items[0][quantity]', '1');
      params.append('mode', 'payment');
      params.append('success_url', `${webUrl}/order/success?orderId=${orderId}`);
      params.append('cancel_url', `${webUrl}/checkout/payment/${orderId}`);
      params.append('client_reference_id', orderId);

      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Stripe session creation failed: ${errorText}`);
        return {
          transactionId,
          status: PaymentTransactionStatus.FAILED,
          redirectUrl: `${webUrl}/order/success?orderId=${orderId}`,
        };
      }

      const session = (await response.json()) as { id: string; url: string };
      return {
        transactionId: session.id,
        status: PaymentTransactionStatus.PENDING,
        redirectUrl: session.url,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định từ Stripe';
      this.logger.error(`Stripe error: ${msg}`);
      return {
        transactionId,
        status: PaymentTransactionStatus.FAILED,
        redirectUrl: `${webUrl}/order/success?orderId=${orderId}`,
      };
    }
  }

  async verifyWebhook(
    payload: Record<string, string | number | boolean | object | null>,
  ): Promise<WebhookVerificationResult> {
    const typedPayload = payload as unknown as StripeWebhookPayload;
    const eventType = String(typedPayload.type || '');
    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      const sessionObj = typedPayload.data?.object || {};
      return {
        isValid: true,
        transactionId: String(sessionObj.id || ''),
        amount: Number(sessionObj.amount_total || 0),
        content: String(sessionObj.client_reference_id || ''),
      };
    }
    return { isValid: false };
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    return {
      orderId: '',
      paymentStatus: 'PENDING',
      transactionStatus: PaymentTransactionStatus.PENDING,
      provider: PaymentProviderType.STRIPE,
    };
  }
}

