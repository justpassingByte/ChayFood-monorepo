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

@Injectable()
export class MockPaymentProvider implements IPaymentProvider {
  readonly providerType: PaymentProviderType = PaymentProviderType.MOCK;
  private readonly logger = new Logger(MockPaymentProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async createPaymentIntent(
    orderId: string,
    amount: number,
    _currency: string,
    metadata: PaymentIntentMetadata,
  ): Promise<PaymentIntentResult> {
    const bankBin = this.configService.get<string>('NEXT_PUBLIC_BANK_BIN', '970418');
    const bankAccount = this.configService.get<string>('NEXT_PUBLIC_BANK_ACCOUNT', '3148149311');
    const accountName = this.configService.get<string>('NEXT_PUBLIC_BANK_ACCOUNT_NAME', 'NGUYEN HUU THANG (MOCK)');
    const expiryMinutes = 15;

    const transferContent = metadata.transferContent;
    const qrUrl = `https://img.vietqr.io/image/${bankBin}-${bankAccount}-qr_only.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();
    const transactionId = `mock_tx_${orderId}_${Date.now()}`;

    this.logger.log(`[MOCK] Created payment intent for order ${metadata.orderNumber} (Amount: ${amount} VND)`);

    return {
      transactionId,
      status: PaymentTransactionStatus.PENDING,
      qrUrl,
      transferContent,
      expiresAt,
    };
  }

  async verifyWebhook(
    payload: Record<string, string | number | boolean | object | null>,
  ): Promise<WebhookVerificationResult> {
    return {
      isValid: true,
      transactionId: String(payload.transactionId || `mock_${Date.now()}`),
      amount: Number(payload.amount || 0),
      content: String(payload.content || ''),
    };
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    return {
      orderId: '',
      paymentStatus: 'PAID',
      transactionStatus: PaymentTransactionStatus.COMPLETED,
      provider: PaymentProviderType.MOCK,
      paidAt: new Date().toISOString(),
    };
  }
}
