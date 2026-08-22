import { PaymentProviderFactory } from './payment.factory';
import { ConfigService } from '@nestjs/config';
import { SepayPaymentProvider } from './providers/sepay.provider';
import { StripePaymentProvider } from './providers/stripe.provider';
import { CodPaymentProvider } from './providers/cod.provider';
import { MockPaymentProvider } from './providers/mock.provider';
import { PaymentMethod } from '@chayfood/db';

describe('PaymentProviderFactory (Strategy & Factory Pattern)', () => {
  let factory: PaymentProviderFactory;
  let mockConfigService: { get: jest.Mock };
  let mockSepayProvider: SepayPaymentProvider;
  let mockStripeProvider: StripePaymentProvider;
  let mockCodProvider: CodPaymentProvider;
  let mockMockProvider: MockPaymentProvider;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn(),
    };

    mockSepayProvider = { providerType: 'sepay' } as unknown as SepayPaymentProvider;
    mockStripeProvider = { providerType: 'stripe' } as unknown as StripePaymentProvider;
    mockCodProvider = { providerType: 'cod' } as unknown as CodPaymentProvider;
    mockMockProvider = { providerType: 'mock' } as unknown as MockPaymentProvider;

    factory = new PaymentProviderFactory(
      mockConfigService as unknown as ConfigService,
      mockSepayProvider,
      mockStripeProvider,
      mockCodProvider,
      mockMockProvider,
    );
  });

  it('phải trả về StripePaymentProvider khi paymentMethod là CARD', () => {
    const provider = factory.getProvider(PaymentMethod.CARD);
    expect(provider).toBe(mockStripeProvider);
  });

  it('phải trả về CodPaymentProvider khi paymentMethod là COD', () => {
    const provider = factory.getProvider(PaymentMethod.COD);
    expect(provider).toBe(mockCodProvider);
  });

  it('phải trả về SepayPaymentProvider khi paymentMethod là BANKING và BANKING_PROVIDER=sepay', () => {
    mockConfigService.get.mockReturnValue('sepay');
    const provider = factory.getProvider(PaymentMethod.BANKING);
    expect(provider).toBe(mockSepayProvider);
  });

  it('phải trả về MockPaymentProvider khi paymentMethod là BANKING và BANKING_PROVIDER=mock', () => {
    mockConfigService.get.mockReturnValue('mock');
    const provider = factory.getProvider(PaymentMethod.BANKING);
    expect(provider).toBe(mockMockProvider);
  });

  it('phải lấy đúng provider theo tên cho Webhook router', () => {
    expect(factory.getProviderByName('sepay')).toBe(mockSepayProvider);
    expect(factory.getProviderByName('stripe')).toBe(mockStripeProvider);
    expect(factory.getProviderByName('cod')).toBe(mockCodProvider);
    expect(factory.getProviderByName('mock')).toBe(mockMockProvider);
    expect(factory.getProviderByName('unknown')).toBeNull();
  });
});
