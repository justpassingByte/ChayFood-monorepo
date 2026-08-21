import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentProviderFactory } from './payment.factory';
import {
  PaymentStatus,
  OrderStatus,
  PaymentTransactionStatus,
  PaymentIntentResult,
  PaymentStatusResult,
  generateTransferContent,
  parseTransferContent,
} from '@chayfood/shared-types';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentFactory: PaymentProviderFactory,
  ) {}

  /**
   * Tạo Payment Intent cho đơn hàng
   */
  async createPaymentIntent(orderId: string): Promise<PaymentIntentResult> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy thông tin đơn hàng');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      return {
        transactionId: `paid_${order.id}`,
        status: PaymentTransactionStatus.COMPLETED,
      };
    }

    const provider = this.paymentFactory.getProvider(order.paymentMethod);
    const transferContent = generateTransferContent(
      order.createdAt,
      order.sequenceNumber,
    );

    const intentResult = await provider.createPaymentIntent(
      order.id,
      Number(order.totalAmount),
      'VND',
      {
        orderSequenceNumber: order.sequenceNumber,
        orderNumber: order.orderNumber,
        transferContent,
        customerEmail: order.user?.email,
        customerName: order.user?.name,
      },
    );

    // Lưu PaymentTransaction vào Database (RULE-INT-002)
    await this.prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        provider: provider.providerType.toUpperCase(),
        providerTxId: intentResult.transactionId,
        amount: order.totalAmount,
        currency: 'VND',
        status: intentResult.status,
        expiresAt: intentResult.expiresAt ? new Date(intentResult.expiresAt) : null,
        metadata: {
          transferContent: intentResult.transferContent,
          qrUrl: intentResult.qrUrl,
          redirectUrl: intentResult.redirectUrl,
        },
      },
    });

    // Nếu là Mock Provider: Giả lập xác nhận thanh toán sau 2 giây (Dev/Test mode)
    if (provider.providerType === 'mock') {
      setTimeout(async () => {
        try {
          await this.confirmPaymentSuccess(
            order.id,
            intentResult.transactionId,
            Number(order.totalAmount),
            'Mock auto-approved payment',
          );
          this.logger.log(`[MOCK] Auto-confirmed payment for order #${order.orderNumber}`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          this.logger.error(`[MOCK] Auto-confirmation failed: ${msg}`);
        }
      }, 2000);
    }

    return intentResult;
  }

  /**
   * Xử lý Webhook từ cổng thanh toán (RULE-INT-002: Signature + Idempotency)
   */
  async handleWebhook(
    providerName: string,
    payload: Record<string, string | number | boolean | object | null>,
    signature?: string,
  ): Promise<{ received: boolean; message: string }> {
    const provider = this.paymentFactory.getProviderByName(providerName);
    if (!provider) {
      throw new BadRequestException(`Cổng thanh toán "${providerName}" không được hỗ trợ`);
    }

    const verification = await provider.verifyWebhook(payload, signature);
    if (!verification.isValid) {
      throw new BadRequestException('Chữ ký webhook hoặc nội dung giao dịch không hợp lệ');
    }

    const txId = verification.transactionId;
    if (txId) {
      const existingTx = await this.prisma.paymentTransaction.findUnique({
        where: { providerTxId: txId },
      });

      if (existingTx && existingTx.status === PaymentTransactionStatus.COMPLETED) {
        return { received: true, message: 'Giao dịch đã được xử lý trước đó (Idempotent)' };
      }
    }

    // 1. Thử match đơn hàng qua nội dung CK (CF DDMMYYYY N)
    let order = null;
    const content = verification.content || '';
    const parsedTransfer = parseTransferContent(content);

    if (parsedTransfer) {
      order = await this.prisma.order.findFirst({
        where: { sequenceNumber: parsedTransfer.sequenceNumber },
      });
    }

    // 2. Fallback: match qua transactionId hoặc orderId trực tiếp trong metadata/content
    if (!order && content) {
      order = await this.prisma.order.findFirst({
        where: {
          OR: [
            { id: content },
            { orderNumber: content },
          ],
        },
      });
    }

    if (!order) {
      this.logger.warn(`Webhook received for unknown order. Content: "${content}"`);
      return { received: true, message: 'Đã nhận webhook nhưng không tìm thấy đơn hàng tương ứng' };
    }

    await this.confirmPaymentSuccess(
      order.id,
      txId || `tx_${Date.now()}`,
      verification.amount || Number(order.totalAmount),
      content,
    );

    return { received: true, message: 'Thanh toán đã được xác nhận thành công' };
  }

  /**
   * Tra cứu trạng thái thanh toán của đơn hàng (cho Frontend Polling)
   */
  async getPaymentStatus(orderId: string): Promise<PaymentStatusResult> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        paymentTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    const latestTx = order.paymentTransactions[0];
    const isPaid = order.paymentStatus === PaymentStatus.PAID;

    // Kiểm tra hết hạn (15 phút) nếu chưa thanh toán và có expiresAt
    if (!isPaid && latestTx?.expiresAt && new Date() > new Date(latestTx.expiresAt)) {
      if (order.status === OrderStatus.PENDING) {
        await this.prisma.$transaction([
          this.prisma.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.CANCELLED },
          }),
          this.prisma.paymentTransaction.update({
            where: { id: latestTx.id },
            data: { status: PaymentTransactionStatus.EXPIRED },
          }),
        ]);
      }
    }

    return {
      orderId: order.id,
      paymentStatus: order.paymentStatus,
      transactionStatus: latestTx?.status || PaymentTransactionStatus.PENDING,
      provider: (latestTx?.provider?.toLowerCase() as PaymentStatusResult['provider']) || 'mock',
      paidAt: isPaid ? order.updatedAt.toISOString() : undefined,
    };
  }

  /**
   * Cập nhật xác nhận thanh toán thành công trong Transaction (Nguyên tử & Chuyển trạng thái)
   */
  private async confirmPaymentSuccess(
    orderId: string,
    providerTxId: string,
    amount: number,
    notes: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (!order) return;

      // Cập nhật PaymentTransaction
      const existingTx = await tx.paymentTransaction.findFirst({
        where: { orderId },
        orderBy: { createdAt: 'desc' },
      });

      if (existingTx) {
        await tx.paymentTransaction.update({
          where: { id: existingTx.id },
          data: {
            status: PaymentTransactionStatus.COMPLETED,
            providerTxId,
            metadata: {
              ...(existingTx.metadata as Record<string, string | number | boolean | null>),
              confirmedAt: new Date().toISOString(),
              notes,
              amount,
            },
          },
        });
      }

      // Cập nhật Order: paymentStatus -> PAID, auto-transition PENDING -> CONFIRMED
      const nextStatus =
        order.status === OrderStatus.PENDING
          ? OrderStatus.CONFIRMED
          : order.status;

      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: nextStatus,
        },
      });
    });
  }
}
