# Quy Tắc Bảo Mật & Phòng Chống Lỗ Hổng (Security Rules)

# RULE-SEC-001: Zero Secrets & Credentials in Logs (Data Redaction)

## Trigger
Khi cấu hình Interceptors, Middlewares, Logger trong Backend hoặc HTTP Client phía Frontend.

## Rule
Tuyệt đối loại trừ và ẩn danh (redact/mask) toàn bộ các trường nhạy cảm: `password`, `passwordHash`, `token`, `authorization`, `secret`, `creditCard`, `cvv` trước khi ghi ra console hoặc gửi đến hệ thống lưu log tập trung.

## Why
Ghi log toàn bộ HTTP request payload khiến mật khẩu thô và Bearer Token bị lưu lại trong console trình duyệt hoặc log server, vi phạm các tiêu chuẩn an toàn dữ liệu và dễ dàng bị đánh cắp bởi mã độc hoặc log collector.

## Violation signal
Ghi log trực tiếp dữ liệu thô: `console.log('REQUEST_BODY:', config.data)` hoặc `console.log('Token payload:', payload)` trong interceptor mà không qua hàm làm sạch.

## Preferred pattern
```typescript
const sanitizeLogData = (data: unknown): unknown => {
  if (typeof data !== 'object' || data === null) return data;
  const sanitized = { ...(data as Record<string, unknown>) };
  const sensitiveFields = ['password', 'token', 'authorization', 'secret', 'creditCard', 'cvv'];
  for (const field of sensitiveFields) {
    if (field in sanitized) sanitized[field] = '[REDACTED]';
  }
  return sanitized;
};
```

---

# RULE-SEC-002: Server-Authoritative Computation on Financial Amounts

## Trigger
Khi người dùng tạo giao dịch mới, đặt đơn hàng, đăng ký dịch vụ hoặc thực hiện bất kỳ thao tác thanh toán tài chính nào từ phía máy khách.

## Rule
Tổng giá trị giao dịch (`totalAmount`), các khoản giảm trừ khuyến mãi và phụ phí bắt buộc phải được tính toán hoàn toàn phía máy chủ (Server-Side) dựa trên đơn giá niêm yết có thẩm quyền trong cơ sở dữ liệu. Tuyệt đối không tin tưởng giá trị tổng tiền do máy khách tự tính toán và gửi lên trong payload request.

## Why
Nếu máy chủ tin tưởng giá tiền do client gửi lên trong DTO, kẻ tấn công có thể chỉnh sửa payload request qua HTTP client để mua tài nguyên, sản phẩm có giá trị cao với số tiền 0 đồng hoặc số tiền âm.

## Violation signal
Gán trực tiếp `data: { totalAmount: dto.totalAmount }` lấy từ body request của client mà không qua hàm tính toán lại từ bảng dữ liệu nguồn trên server.

## Preferred pattern
```typescript
// Truy vấn dữ liệu tài nguyên gốc từ DB và tính toán giá trên server
const dbItems = await this.prisma.item.findMany({
  where: { id: { in: itemIds } },
});

const itemMap = new Map(dbItems.map((item) => [item.id, item]));

let calculatedTotal = 0;
const transactionItems = dto.items.map((item) => {
  const dbItem = itemMap.get(item.itemId);
  if (!dbItem) throw new BadRequestException('Tài nguyên không tồn tại');
  const unitPrice = Number(dbItem.price);
  calculatedTotal += unitPrice * item.quantity;
  return { itemId: item.itemId, quantity: item.quantity, price: unitPrice };
});
```

---

# RULE-SEC-003: Defensive Mass Assignment Prevention & DTO Whitelisting

## Trigger
Khi định nghĩa các Controller tiếp nhận payload đầu vào từ client (`@Body() dto: CreateDto`).

## Rule
Toàn bộ DTO phải sử dụng `class-validator` với các decorator kiểu dữ liệu rõ ràng, và cấu hình `ValidationPipe` toàn cục với `whitelist: true, forbidNonWhitelisted: true`. Không truyền trực tiếp đối tượng `dto` không qua kiểm soát vào ORM (`prisma.entity.create({ data: dto })`) mà phải trích xuất tường minh các trường được phép cập nhật.

## Why
Ngăn chặn tấn công Mass Assignment (ví dụ: người dùng gửi kèm `role: "ADMIN"` hoặc `isVerified: true` trong request cập nhật thông tin cá nhân để tự nâng quyền hạn tài khoản).

## Violation signal
Sử dụng `data: dto as any` hoặc không kiểm soát danh sách các trường được phép ghi vào model User/Account.

## Preferred pattern
```typescript
// Chỉ nhận các trường hợp lệ được phép thay đổi theo chính sách nghiệp vụ
await this.prisma.user.update({
  where: { id: userId },
  data: {
    name: dto.name,
    phone: dto.phone,
    address: dto.address,
  },
});
```
