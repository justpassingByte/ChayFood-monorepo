import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo Payment Intent (VietQR URL / Stripe Session / COD) cho đơn hàng' })
  async createIntent(@Param('orderId') orderId: string) {
    return this.paymentService.createPaymentIntent(orderId);
  }

  @Get('status/:orderId')
  @ApiOperation({ summary: 'Tra cứu trạng thái thanh toán đơn hàng (Frontend Polling)' })
  async getStatus(@Param('orderId') orderId: string) {
    return this.paymentService.getPaymentStatus(orderId);
  }

  @Post('webhook/:provider')
  @ApiOperation({ summary: 'Webhook tiếp nhận thông báo thanh toán (Sepay / Stripe)' })
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() payload: Record<string, string | number | boolean | object | null>,
    @Headers('authorization') authHeader?: string,
    @Headers('stripe-signature') stripeSignature?: string,
  ) {
    const signature = stripeSignature || authHeader;
    return this.paymentService.handleWebhook(provider, payload, signature);
  }
}
