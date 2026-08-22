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
   * 🌟 Tạo Payment Intent (Pluggable Provider Architecture & VietQR Standard):
   * 1. Định tuyến Provider động qua Factory Pattern dựa trên `order.paymentMethod`.
   * 2. Sinh mã nội dung chuyển khoản chuẩn hóa `CF <DDMMYYYY> <SEQ>` (dễ nhận diện trên sao kê ngân hàng).
   * 3. Lưu bản ghi kiểm toán `PaymentTransaction` trạng thái PENDING.
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
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
          this.logger.error(`[MOCK] Auto-confirmation failed: ${msg}`);
        }
      }, 2000);
    }

    return intentResult;
  }


  /**
   * 🛡️ Xử lý Webhook từ cổng thanh toán (RULE-INT-002: Signature Verification & Idempotency Defense):
   * 1. Xác thực tính toàn vẹn chữ ký HMAC / Secret Token của Webhook.
   * 2. Idempotency Check: Tra cứu `providerTxId` để chặn xử lý trùng lặp khi webhook gửi lại nhiều lần (At-least-once delivery).
   * 3. Phân tích nội dung chuyển khoản để khớp nối đơn hàng theo `sequenceNumber`.
   * 4. Bọc cập nhật trạng thái `PAID` và chuyển đơn `PENDING -> CONFIRMED` trong 1 giao dịch ACID duy nhất.
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

    // 🛡️ Underpayment Defense: Chặn thanh toán thiếu tiền gian lận
    const receivedAmount = Number(verification.amount || 0);
    const requiredAmount = Number(order.totalAmount);
    if (receivedAmount < requiredAmount) {
      this.logger.warn(
        `Underpayment detected for order #${order.orderNumber}: expected ${requiredAmount}, got ${receivedAmount}`,
      );
      return { received: true, message: 'Số tiền thanh toán không đủ so với giá trị đơn hàng' };
    }

    await this.confirmPaymentSuccess(
      order.id,
      txId || `tx_${Date.now()}`,
      receivedAmount,
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
   * 🛡️ Cập nhật xác nhận thanh toán thành công trong Transaction:
   * - Áp dụng Consistent Lock Ordering: Luôn cập nhật bảng Order trước, sau đó mới cập nhật PaymentTransaction để chống Deadlock.
   * - Phục hồi đơn hàng (Revive) nếu tiền về sau khi đã bị hết hạn/hủy tạm thời.
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

      // 1. 🛡️ Cập nhật bảng Order trước (Consistent Lock Ordering Invariant chống Deadlock)
      const nextStatus =
        order.status === OrderStatus.PENDING || order.status === OrderStatus.CANCELLED
          ? OrderStatus.CONFIRMED
          : order.status;

      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: nextStatus,
        },
      });

      // 2. Cập nhật bảng PaymentTransaction sau
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
    });
  }


}
