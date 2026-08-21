import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentMethod } from '@chayfood/db';
import { IPaymentProvider } from './interfaces/payment-provider.interface';
import { SepayPaymentProvider } from './providers/sepay.provider';
import { StripePaymentProvider } from './providers/stripe.provider';
import { CodPaymentProvider } from './providers/cod.provider';
import { MockPaymentProvider } from './providers/mock.provider';

@Injectable()
export class PaymentProviderFactory {
  private readonly logger = new Logger(PaymentProviderFactory.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly sepayProvider: SepayPaymentProvider,
    private readonly stripeProvider: StripePaymentProvider,
    private readonly codProvider: CodPaymentProvider,
    private readonly mockProvider: MockPaymentProvider,
  ) {}

  /**
   * Chọn Payment Provider phù hợp dựa trên phương thức thanh toán và biến môi trường
   */
  getProvider(paymentMethod: PaymentMethod): IPaymentProvider {
    switch (paymentMethod) {
      case PaymentMethod.CARD:
        return this.stripeProvider;

      case PaymentMethod.COD:
        return this.codProvider;

      case PaymentMethod.BANKING: {
        const bankingConfig = this.configService
          .get<string>('BANKING_PROVIDER', 'mock')
          .toLowerCase();

        if (bankingConfig === 'sepay') {
          this.logger.log('Routing BANKING payment to SepayPaymentProvider');
          return this.sepayProvider;
        }

        this.logger.log('Routing BANKING payment to MockPaymentProvider (dev/test mode)');
        return this.mockProvider;
      }

      default:
        this.logger.warn(`Unknown payment method: ${paymentMethod}. Falling back to Mock.`);
        return this.mockProvider;
    }
  }

  /**
   * Lấy provider trực tiếp theo tên (dùng cho Webhook Router)
   */
  getProviderByName(providerName: string): IPaymentProvider | null {
    switch (providerName.toLowerCase()) {
      case 'sepay':
        return this.sepayProvider;
      case 'stripe':
        return this.stripeProvider;
      case 'cod':
        return this.codProvider;
      case 'mock':
        return this.mockProvider;
      default:
        return null;
    }
  }
}
