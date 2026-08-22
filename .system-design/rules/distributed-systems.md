# Quy Tắc Hệ Thống Phân Tán & Tác Vụ Bất Đồng Bộ (Distributed Systems Rules)

# RULE-DIST-001: Transactional Outbox for Side-Effects & Event Publishing

## Trigger
Khi một thay đổi trong cơ sở dữ liệu (như Đơn hàng được tạo thành công) cần kích hoạt một tác vụ bất đồng bộ (gửi thông báo, gửi email hóa đơn, đồng bộ qua hệ thống ERP bếp).

## Rule
Không phát sự kiện trực tiếp ra hàng đợi bên ngoài (Message Queue / Event Bus) trước khi giao dịch DB hoàn tất. Sử dụng mẫu thiết kế Transactional Outbox: ghi nhận sự kiện vào bảng `OutboxEvent` cùng nằm trong giao dịch của nghiệp vụ chính.

## Why
Nếu ứng dụng gặp sự cố hoặc sập nguồn ngay sau khi commit DB nhưng trước khi gửi message ra ngoài, sự kiện sẽ bị biến mất vĩnh viễn (Lost Event) và khách hàng không bao giờ nhận được thông báo xác nhận.

## Violation signal
Gửi thông điệp qua hàng đợi hoặc gửi email trực tiếp bên trong logic xử lý đơn hàng mà không có bảng lưu trữ outbox dự phòng.

## Preferred pattern
```typescript
return this.prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData });
  await tx.outboxEvent.create({
    data: {
      eventType: 'ORDER_CREATED',
      payload: { orderId: order.id, totalAmount: order.totalAmount },
      status: 'PENDING',
    },
  });
  return order;
});
```

---

# RULE-DIST-002: Idempotent Asynchronous Consumers

## Trigger
Khi viết các Worker hoặc Handler xử lý thông điệp từ hàng đợi hoặc cron job xử lý định kỳ (ví dụ: gia hạn gói ăn, cập nhật trạng thái kho).

## Rule
Mọi consumer phải được thiết kế có tính lũy thừa (Idempotent): Xử lý cùng một thông điệp nhiều lần vẫn mang lại cùng một kết quả trạng thái duy nhất, không tạo ra tác dụng phụ lặp lại.

## Why
Các hệ thống hàng đợi đều tuân theo chuẩn At-Least-Once Delivery. Khi mạng bị trễ hoặc worker gặp lỗi tạm thời trong lúc gửi ACK, thông điệp sẽ được gửi lại cho worker khác.

## Violation signal
Worker trừ tiền hoặc trừ kho trực tiếp mà không kiểm tra xem mã `eventId` / `jobId` đã được xử lý trước đó hay chưa.

## Preferred pattern
```typescript
async handleOrderNotificationJob(job: Job<{ orderId: string }>) {
  const isProcessed = await this.redis.set(`job:processed:${job.id}`, '1', 'EX', 86400, 'NX');
  if (!isProcessed) {
    return; // Đã xử lý trước đó, bỏ qua an toàn
  }
  await this.sendNotification(job.data.orderId);
}
```
