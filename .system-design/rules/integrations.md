# Quy Tắc Tích Hợp Dịch Vụ Bên Ngoài (Integration Rules)

# RULE-INT-001: Pluggable Provider Abstraction via Strategy Pattern

## Trigger
Khi tích hợp các dịch vụ bên thứ ba (Cổng thanh toán: Stripe, VNPay, VietQR; Xác thực: OAuth Google, Facebook; Dịch vụ Email/SMS; Công cụ AI gợi ý dinh dưỡng).

## Rule
Bắt buộc định nghĩa Interface trừu tượng chung (`IPaymentProvider`, `IAuthProvider`, `INutritionEngine`) và sử dụng Factory Pattern / Dependency Injection để nạp implementation cụ thể. Tuyệt đối không hardcode SDK của một bên thứ ba trực tiếp vào UI Component hoặc nghiệp vụ chính.

## Why
Cho phép hệ thống chuyển đổi linh hoạt giữa môi trường phát triển (Mock/Dev) và môi trường thực tế (Production), cũng như dễ dàng thêm cổng thanh toán mới mà không phải sửa đổi mã nguồn xử lý đơn hàng cốt lõi.

## Violation signal
Gọi trực tiếp `stripe.charges.create()` hoặc `vnpay.createPaymentUrl()` nằm rải rác bên trong `OrdersService`.

## Preferred pattern
```typescript
export interface IPaymentProvider {
  createPaymentIntent(orderId: string, amount: number, currency: string): Promise<PaymentIntentResult>;
  verifyWebhook(payload: unknown, signature: string): Promise<WebhookVerificationResult>;
}

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PAYMENT_PROVIDER') private paymentProvider: IPaymentProvider,
  ) {}
}
```

---

# RULE-INT-002: Webhook Signature Verification & Idempotent Processing

## Trigger
Khi tiếp nhận Webhook từ cổng thanh toán (Stripe, VNPay, Momo) hoặc các bên đối tác vận chuyển.

## Rule
1. Luôn xác thực chữ ký số (HMAC / Webhook Signature) của nhà cung cấp trước khi phân tích payload.
2. Kiểm tra tính trùng lặp của Webhook bằng `referenceId` hoặc `transactionId` trước khi chuyển trạng thái đơn hàng. Nếu sự kiện đã được xử lý thành công trước đó, trả về HTTP 200 ngay lập tức mà không thực hiện lại các tác vụ phụ (như trừ kho hoặc cộng điểm).

## Why
Kẻ tấn công có thể giả mạo yêu cầu webhook để đánh dấu đơn hàng thành "Đã thanh toán" mà không trả tiền. Đồng thời các cổng thanh toán thường gửi lại webhook nhiều lần (At-least-once delivery), nếu không chống trùng lặp sẽ gây lặp nghiệp vụ.

## Violation signal
Endpoint tiếp nhận webhook cập nhật trạng thái đơn hàng mà không kiểm tra chữ ký hoặc không ghi nhận nhật ký giao dịch đã xử lý.

## Preferred pattern
```typescript
async handleWebhook(signature: string, payload: Buffer) {
  const event = this.paymentProvider.verifyWebhook(payload, signature);
  if (!event.isValid) {
    throw new BadRequestException('Chữ ký webhook không hợp lệ');
  }

  const existingTx = await this.prisma.paymentTransaction.findUnique({
    where: { providerTxId: event.transactionId },
  });

  if (existingTx && existingTx.status === 'PROCESSED') {
    return { received: true, message: 'Giao dịch đã được xử lý trước đó' };
  }

  // Cập nhật đơn hàng trong giao dịch...
}
```
