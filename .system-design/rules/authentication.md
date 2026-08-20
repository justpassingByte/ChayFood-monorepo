# Quy Tắc Xác Thực Danh Tính (Authentication Rules)

# RULE-AUTH-001: Mandatory Secrets & Environment Isolation

## Trigger
Khi cấu hình, ký hoặc giải mã mã xác thực JWT, khóa API bí mật hoặc bất kỳ thông tin nhạy cảm nào trong ứng dụng NestJS và Next.js.

## Rule
Tuyệt đối không sử dụng chuỗi bí mật tĩnh (hardcoded string) làm giá trị mặc định hoặc fallback trong mã nguồn. Nếu biến môi trường `JWT_SECRET` không được định cấu hình, ứng dụng phải từ chối khởi động (fail-fast).

## Why
Chuỗi bí mật hardcode trong mã nguồn sẽ bị lưu vào lịch sử Git, cho phép kẻ tấn công giả mạo chữ ký JWT và tự tạo token với quyền quản trị viên tối cao.

## Violation signal
Sử dụng toán tử fallback: `secret: process.env.JWT_SECRET || 'super_secret_chayfood_jwt_token_2026'`.

## Preferred pattern
```typescript
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('FATAL: JWT_SECRET biến môi trường chưa được thiết lập');
}
```

---

# RULE-AUTH-002: Token Invalidation & Database State Synchronization

## Trigger
Khi tài khoản người dùng đổi mật khẩu, bị khóa/vô hiệu hóa tài khoản, thay đổi quyền hạn (Role: USER -> ADMIN hoặc ngược lại), hoặc người dùng yêu cầu Đăng xuất.

## Rule
Không chỉ dựa vào tính hợp lệ về mặt mã hóa của JWT tĩnh. Tầng Strategy xác thực (`JwtStrategy.validate`) phải kiểm tra trạng thái thực tế của người dùng từ cơ sở dữ liệu hoặc kiểm tra phiên bản token (`tokenVersion` / `passwordChangedAt`).

## Why
Nếu chỉ kiểm tra chữ ký JWT, một token có hạn 7 ngày vẫn tiếp tục có hiệu lực ngay cả sau khi tài khoản đã bị khóa, bị thu hồi quyền hoặc kẻ xấu đánh cắp token trước khi chủ tài khoản đổi mật khẩu.

## Violation signal
Chỉ kiểm tra thời hạn hết hạn `exp` của JWT mà không đối chiếu với trạng thái tài khoản đang hoạt động (`isActive`) trong cơ sở dữ liệu.

## Preferred pattern
```typescript
async validate(payload: { sub: string; email: string; tokenVersion?: number }) {
  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true, updatedAt: true },
  });

  if (!user) {
    throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc người dùng không tồn tại');
  }

  return user;
}
```

---

# RULE-AUTH-003: Safe Cookie Attributes for Web Authentication

## Trigger
Khi lưu trữ mã xác thực hoặc thông tin phiên đăng nhập vào Cookie trình duyệt từ Client hoặc Server Components.

## Rule
Luôn cấu hình đầy đủ các cờ bảo mật cho Cookie: `HttpOnly` (đối với token truy cập phía server), `Secure` (trong môi trường Production), `SameSite=Lax` hoặc `Strict`, và đường dẫn `path=/`. Không lưu trữ mật khẩu hoặc dữ liệu nhạy cảm trong Cookie chưa mã hóa.

## Why
Cookie không có `HttpOnly` có thể bị đánh cắp thông qua các lỗ hổng XSS; thiếu `SameSite` khiến ứng dụng có nguy cơ bị tấn công CSRF.

## Violation signal
Thiết lập cookie thủ công qua `document.cookie` mà không có các cờ bảo vệ hoặc lưu thông tin phân quyền dạng plain text cho client tự quyết định.

## Preferred pattern
```typescript
// Trong API Response / Server Action:
response.cookies.set('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 ngày
});
```
