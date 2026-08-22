import { Injectable } from '@nestjs/common';
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

@Injectable()
export class CodPaymentProvider implements IPaymentProvider {
  readonly providerType: PaymentProviderType = PaymentProviderType.COD;

  async createPaymentIntent(
    orderId: string,
    _amount: number,
    _currency: string,
    metadata: PaymentIntentMetadata,
  ): Promise<PaymentIntentResult> {
    return {
      transactionId: `cod_${orderId}_${Date.now()}`,
      status: PaymentTransactionStatus.PENDING,
      transferContent: `COD - Thu tiền khi giao hàng (${metadata.orderNumber})`,
    };
  }

  async verifyWebhook(): Promise<WebhookVerificationResult> {
    return { isValid: false };
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    return {
      orderId: '',
      paymentStatus: 'PENDING',
      transactionStatus: PaymentTransactionStatus.PENDING,
      provider: PaymentProviderType.COD,
    };
  }
}
