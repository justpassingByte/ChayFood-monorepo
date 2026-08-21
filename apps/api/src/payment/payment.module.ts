import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentProviderFactory } from './payment.factory';
import { SepayPaymentProvider } from './providers/sepay.provider';
import { StripePaymentProvider } from './providers/stripe.provider';
import { CodPaymentProvider } from './providers/cod.provider';
import { MockPaymentProvider } from './providers/mock.provider';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentProviderFactory,
    SepayPaymentProvider,
    StripePaymentProvider,
    CodPaymentProvider,
    MockPaymentProvider,
  ],
  exports: [PaymentService, PaymentProviderFactory],
})
export class PaymentModule {}
