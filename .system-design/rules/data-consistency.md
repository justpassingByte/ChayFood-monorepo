# Quy Tắc Tính Nhất Quán Dữ Liệu (Data Consistency Rules)

# RULE-DATA-001: Atomic Multi-Write Transactions

## Trigger
Khi một nghiệp vụ cập nhật hoặc tạo mới từ 2 bản ghi trở lên trong cơ sở dữ liệu và các thao tác này bắt buộc phải cùng thành công hoặc cùng thất bại (ví dụ: tạo đơn hàng kèm các mục đơn hàng, trừ kho kèm tạo nhật ký biến động kho).

## Rule
Bao bọc toàn bộ các thao tác ghi dữ liệu liên quan trong một giao dịch cơ sở dữ liệu duy nhất (`this.prisma.$transaction(async (tx) => { ... })`).

## Why
Nếu không có ranh giới giao dịch nguyên tử, lỗi xảy ra ở bước sau (ví dụ: tạo mục đơn hàng thất bại sau khi đã tạo đơn hàng chính) sẽ để lại dữ liệu rác, gây sai lệch trạng thái hệ thống và báo cáo tài chính.

## Violation signal
Nhiều lệnh `prisma.model.create/update/delete` diễn ra tuần tự trong một service method mà không nằm trong khối `$transaction`.

## Preferred pattern
```typescript
return this.prisma.$transaction(async (tx) => {
  const record = await tx.order.create({ data: orderPayload });
  await tx.orderItem.createMany({ data: itemsPayload });
  return record;
});
```

---

# RULE-DATA-002: Zero Network Calls Inside Database Transactions

## Trigger
Khi thực thi một luồng nghiệp vụ chứa cả thao tác cập nhật cơ sở dữ liệu và gọi dịch vụ bên ngoài qua mạng (gọi cổng thanh toán Stripe/VNPAY, gửi email xác nhận, gọi AI engine, gọi webhook).

## Rule
Tuyệt đối không thực hiện bất kỳ lệnh gọi mạng ngoại vi nào bên trong khối giao dịch cơ sở dữ liệu (`$transaction`). Luôn thực hiện gọi mạng trước hoặc sau khi giao dịch cơ sở dữ liệu đã hoàn tất (commit).

## Why
Các cuộc gọi mạng có thể bị nghẽn mạng, timeout kéo dài hàng chục giây. Giữ kết nối cơ sở dữ liệu đang mở trong thời gian này sẽ gây cạn kiệt Connection Pool của PostgreSQL, khóa các dòng dữ liệu liên quan và làm tê liệt hệ thống.

## Violation signal
Tồn tại các lệnh `axios`, `fetch`, `mailService.send`, `stripe.paymentIntents.create` hoặc `aiService.call` nằm bên trong callback của `this.prisma.$transaction`.

## Preferred pattern
```typescript
// Bước 1: Gọi dịch vụ ngoại vi trước hoặc chuẩn bị dữ liệu
const paymentResult = await this.paymentProvider.charge(amount);

// Bước 2: Mở giao dịch cơ sở dữ liệu ngắn gọn và commit ngay lập tức
return this.prisma.$transaction(async (tx) => {
  return tx.order.update({
    where: { id: orderId },
    data: { paymentStatus: PaymentStatus.PAID, transactionId: paymentResult.id },
  });
});
```

---

# RULE-DATA-003: Non-Negative Quantity Constraints & Invariant Validation

## Trigger
Khi thực hiện các thao tác biến động về số lượng tồn kho nguyên liệu, số dư điểm thưởng, giá trị tiền tệ hoặc hạn mức sử dụng khuyến mãi.

## Rule
Luôn áp dụng cơ chế xác thực bất biến ở cả 2 tầng: Tầng ứng dụng (kiểm tra trước khi trừ) và Tầng cơ sở dữ liệu (sử dụng PostgreSQL Check Constraint `CHECK (current_stock >= 0)` hoặc điều kiện `gte` trong câu lệnh `update`).

## Why
Chỉ kiểm tra ở tầng ứng dụng mà không có ràng buộc ở cơ sở dữ liệu sẽ dễ dàng bị vượt qua bởi các truy vấn đồng thời, dẫn đến tồn kho bị số âm (bán khống).

## Violation signal
Cập nhật số lượng mới bằng cách gán trực tiếp giá trị tính toán `Math.max(0, current - qty)` mà không kiểm tra điều kiện tồn kho khả dụng tại thời điểm ghi.

## Preferred pattern
```typescript
const updated = await tx.ingredient.updateMany({
  where: {
    id: ingredientId,
    currentStock: { gte: requiredQuantity },
  },
  data: {
    currentStock: { decrement: requiredQuantity },
  },
});

if (updated.count === 0) {
  throw new BadRequestException(`Không đủ tồn kho khả dụng cho nguyên liệu: ${ingredientId}`);
}
```
