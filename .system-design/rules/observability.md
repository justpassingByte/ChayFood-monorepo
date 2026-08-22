# Quy Tắc Giám Sát & Ghi Nhật Ký (Observability Rules)

# RULE-OBS-001: Structured Logging & Request Correlation ID

## Trigger
Khi ghi log các sự kiện hệ thống, lỗi runtime hoặc truy vấn quan trọng trong NestJS và Next.js.

## Rule
Sử dụng định dạng JSON có cấu trúc (Structured JSON Logging) kèm mã định danh yêu cầu duy nhất (`x-request-id` / `correlationId`) xuyên suốt từ Frontend -> Backend -> Database -> External Services.

## Why
Nếu chỉ in log dạng văn bản thuần không có mã định danh luồng, khi hệ thống có hàng ngàn yêu cầu diễn ra đồng thời, việc truy vết nguyên nhân gây lỗi của một đơn hàng cụ thể sẽ trở nên bất khả thi.

## Violation signal
Sử dụng các lệnh `console.log("Error occurred")` không có cấu trúc, không có stack trace chuẩn và không có `requestId`.

## Preferred pattern
```typescript
this.logger.error({
  message: 'Xử lý đơn hàng thất bại do lỗi cổng thanh toán',
  requestId: req.headers['x-request-id'],
  orderId,
  userId,
  errorCode: error.code,
});
```

---

# RULE-OBS-002: Audit Logging on Privileged & Financial Mutations

## Trigger
Khi thực hiện các thao tác quản trị đặc quyền: Kiểm kê điều chỉnh kho (`ADJUSTMENT`), Xuất hủy kho (`EXPORT_WASTE`), Thay đổi công thức định lượng (BOM), Cập nhật thủ công trạng thái thanh toán.

## Rule
Ghi nhận đầy đủ bản ghi kiểm toán (Audit Trail) bao gồm: Định danh người thực hiện (`performedBy` / `adminId`), Thời điểm (`timestamp`), Giá trị trước khi sửa (`previousState`), Giá trị sau khi sửa (`newState`), và Lý do điều chỉnh (`notes`).

## Why
Giúp chủ nhà hàng và ban quản lý có thể đối chiếu, chống gian lận nội bộ và truy cứu trách nhiệm khi có sai lệch nguyên vật liệu hoặc thất thoát tài chính.

## Violation signal
Thao tác cập nhật kho trực tiếp bằng `update` mà không tạo bản ghi tương ứng trong bảng `StockTransaction`.

## Preferred pattern
```typescript
await tx.stockTransaction.create({
  data: {
    ingredientId,
    type: StockTransactionType.ADJUSTMENT,
    quantity: diffQuantity,
    previousStock: oldStock,
    newStock: verifiedStock,
    notes: `Kiểm kê định kỳ cuối ca: ${reason}`,
    performedBy: adminUser.email,
  },
});
```

---

# RULE-OBS-003: Type-Narrowed Error Handling

## Trigger
Khi viết các khối `try...catch` xử lý lỗi trong toàn bộ codebase.

## Rule
Tuyệt đối tuân thủ Project Rule 1: Không sử dụng `catch (error: any)`. Luôn áp dụng Type Narrowing `if (error instanceof Error)` hoặc kiểm tra `axios.isAxiosError(error)`.

## Why
Đảm bảo an toàn kiểu dữ liệu TypeScript, tránh lỗi runtime `TypeError: Cannot read properties of undefined` khi truy cập `error.message`.

## Violation signal
`catch (error: any) { console.log(error.message); }`

## Preferred pattern
```typescript
try {
  await this.paymentProvider.charge(amount);
} catch (error) {
  if (error instanceof Error) {
    this.logger.error(`Thanh toán thất bại: ${error.message}`, error.stack);
  }
  throw new InternalServerErrorException('Giao dịch thanh toán không thành công');
}
```
