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
export class SepayPaymentProvider implements IPaymentProvider {
  readonly providerType: PaymentProviderType = PaymentProviderType.SEPAY;
  private readonly logger = new Logger(SepayPaymentProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async createPaymentIntent(
    orderId: string,
    amount: number,
    _currency: string,
    metadata: PaymentIntentMetadata,
  ): Promise<PaymentIntentResult> {
    const bankBin = this.configService.get<string>('NEXT_PUBLIC_BANK_BIN', '970418');
    const bankAccount = this.configService.get<string>('NEXT_PUBLIC_BANK_ACCOUNT', '3148149311');
    const accountName = this.configService.get<string>('NEXT_PUBLIC_BANK_ACCOUNT_NAME', 'NGUYEN HUU THANG');
    const expiryMinutes = parseInt(this.configService.get<string>('PAYMENT_QR_EXPIRY_MINUTES', '15'), 10);

    const transferContent = metadata.transferContent;
    const qrUrl = `https://img.vietqr.io/image/${bankBin}-${bankAccount}-qr_only.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;

    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();

    return {
      transactionId: `sepay_${orderId}_${Date.now()}`,
      status: PaymentTransactionStatus.PENDING,
      qrUrl,
      transferContent,
      expiresAt,
    };
  }

  async verifyWebhook(
    payload: Record<string, string | number | boolean | object | null>,
    signature?: string,
  ): Promise<WebhookVerificationResult> {
    const webhookSecret = this.configService.get<string>('SEPAY_WEBHOOK_SECRET', '');
    const apiKey = this.configService.get<string>('SEPAY_API_KEY', '');

    // Xác thực token từ header / signature
    const expectedSecret = webhookSecret || apiKey;
    if (expectedSecret && signature) {
      const cleanSignature = signature.replace(/^Apikey\s+/i, '').trim();
      if (cleanSignature !== expectedSecret) {
        this.logger.warn(`Sepay webhook signature mismatch: expected ${expectedSecret}, got ${cleanSignature}`);
        return { isValid: false };
      }
    }

    const transferType = String(payload.transferType || '');
    if (transferType && transferType.toLowerCase() !== 'in') {
      return { isValid: false };
    }

    const content = String(payload.content || payload.description || '');
    const amount = Number(payload.transferAmount || payload.amount || 0);
    const transactionId = String(payload.id || payload.referenceCode || Date.now());

    return {
      isValid: true,
      transactionId,
      amount,
      content,
    };
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResult> {
    return {
      orderId: '',
      paymentStatus: 'PENDING',
      transactionStatus: PaymentTransactionStatus.PENDING,
      provider: PaymentProviderType.SEPAY,
    };
  }
}
