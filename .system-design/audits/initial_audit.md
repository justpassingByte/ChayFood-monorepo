# 🔍 ChayFood Architecture & Security Audit Report

## 1. Tổng Quan Kiến Trúc (Architecture Summary)

- **Mô hình**: Monorepo quản lý bởi Turborepo và pnpm workspaces
- **Backend Layer (`apps/api`)**: NestJS 11, TypeScript, `@nestjs/passport`, `@nestjs/jwt`, `class-validator`, `class-transformer`, `@nestjs/swagger`
- **Frontend Layer (`apps/web`)**: Next.js 15 (App Router), React 19, Tailwind CSS, Axios client, React Context (`AuthContext`, `CartContext`, `AnalyticsContext`)
- **Database & ORM**: PostgreSQL 16 (Docker), Prisma ORM (`packages/db/prisma/schema.prisma`)
- **Shared Packages**: `@chayfood/shared-types`, `@chayfood/db`, `@chayfood/tsconfig`
- **Authentication**: JWT Bearer Strategy, mật khẩu băm với `bcryptjs`, lưu trữ client qua `localStorage` và `document.cookie`
- **Tích hợp mở rộng**: Cổng thanh toán, thuật toán gợi ý dinh dưỡng, quản trị kho và công thức chế biến (BOM)

---

## 2. Bảng Xếp Hạng Rủi Ro & Lỗ Hổng Phát Hiện (Risk Matrix)

| ID | Vấn đề phát hiện | Phân loại | Mức độ | Khả năng | Phạm vi ảnh hưởng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AUD-01** | BOLA/IDOR trong truy vấn chi tiết đơn hàng | Authorization | Critical | Cao | Toàn bộ dữ liệu đơn hàng người dùng |
| **AUD-02** | Lộ số liệu tài chính & kho nhạy cảm qua endpoint không có Guard | Authorization & Security | Critical | Cao | Dữ liệu định giá kho, giá vốn, công thức |
| **AUD-03** | Race Condition (Lost Update) khi trừ kho tự động | Concurrency & Consistency | Critical | Cao | Sai lệch tồn kho, bán khống quá tồn |
| **AUD-04** | Rò rỉ mật khẩu và Token qua HTTP Client Console Logger | Security & PII | High | Cao | Thông tin đăng nhập và JWT Token |
| **AUD-05** | Fallback JWT Secret cố định và thiếu cơ chế Refresh / Revoke | Authentication | High | Trung bình | Chiếm quyền điều khiển phiên đăng nhập |
| **AUD-06** | Bất đồng bộ định dạng dữ liệu (SSOT Divergence) giữa 4 tầng | API & Architecture | High | Cao | Lỗi runtime frontend và mất dữ liệu |
| **AUD-07** | Client Fake Success Simulation & Sai lệch đường dẫn API | API Design | High | Cao | Che giấu lỗi hệ thống, thất lạc đơn hàng |
| **AUD-08** | Giả mạo quyền Admin qua Cookie chưa ký số | Authorization | High | Trung bình | Đột nhập trang quản trị |
| **AUD-09** | Thiếu Database Indexes trên Foreign Keys và Composite Queries | Database | Medium | Cao | Giảm hiệu năng truy vấn, Full Table Scan |
| **AUD-10** | Thiếu ràng buộc Unique trên RecipeItem & Check Constraint trên Stock | Data Consistency | Medium | Trung bình | Trùng lặp nguyên liệu, âm số lượng tồn |

---

## 3. Chi Tiết Các Phát Hiện Nghiêm Trọng (Critical & High Findings)

### AUD-01: Broken Object Level Authorization (IDOR/BOLA) trên đơn hàng
- **Vị trí**: [orders.controller.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/api/src/orders/orders.controller.ts#L35-L39)
- **Hiện trạng**: Phương thức `findById(@Param('id') id: string)` chỉ gắn `@UseGuards(JwtAuthGuard)` ở cấp Controller mà không kiểm tra quyền sở hữu (`order.userId === currentUser.id`) hoặc quyền quản trị (`currentUser.role === Role.ADMIN`).
- **Rủi ro**: Người dùng đã đăng nhập có thể xem thông tin đơn hàng, số điện thoại, địa chỉ nhà riêng và lịch sử mua sắm của bất kỳ khách hàng nào khác bằng cách thay đổi ID trên URL.
- **Quy tắc ngăn chặn**: `RULE-AUTHZ-001: Resource Ownership Verification`

### AUD-02: Lộ dữ liệu tài chính, giá vốn kho và công thức qua Public Endpoints
- **Vị trí**: [inventory.controller.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/api/src/inventory/inventory.controller.ts#L13-L35) và [recipes.controller.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/api/src/recipes/recipes.controller.ts#L13-L29)
- **Hiện trạng**: Các endpoint `GET /inventory`, `GET /inventory/stats`, `GET /inventory/transactions`, `GET /recipes`, `GET /recipes/:id` hoàn toàn không có `JwtAuthGuard` hay `RolesGuard`.
- **Rủi ro**: Bất kỳ người dùng chưa đăng nhập nào cũng có thể trích xuất toàn bộ dữ liệu định giá kho hàng, danh tính nhà cung cấp, nhật ký nhập xuất kho của nhân viên và tỷ lệ lợi nhuận gộp / Food Cost của từng món ăn.
- **Quy tắc ngăn chặn**: `RULE-AUTHZ-002: Default-Deny Sensitive Endpoints`

### AUD-03: Race Condition (Lost Update) khi trừ kho nguyên liệu tự động
- **Vị trí**: [orders.service.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/api/src/orders/orders.service.ts#L116-L160) và [inventory.service.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/api/src/inventory/inventory.service.ts#L191-L256)
- **Hiện trạng**: Quá trình trừ kho thực hiện theo mẫu Read-Modify-Write (`tx.recipe.findUnique` / `tx.ingredient.findUnique` lấy `currentStock`, tính `newStock = prevStock - required`, sau đó gọi `tx.ingredient.update({ data: { currentStock: newStock } })`). Ở mức cô lập mặc định `Read Committed` của PostgreSQL, Prisma không thực hiện khóa dòng (`SELECT ... FOR UPDATE`).
- **Rủi ro**: Khi nhiều đơn hàng được xác nhận đồng thời, các giao dịch đọc cùng giá trị tồn kho cũ và ghi đè kết quả của nhau, dẫn đến sai lệch dữ liệu tồn kho thực tế và nguy cơ âm kho.
- **Quy tắc ngăn chặn**: `RULE-CONC-001: Atomic Inventory Deduction` và `RULE-CONC-002: Read-Modify-Write Protection`

### AUD-04: Rò rỉ mật khẩu và Bearer Token qua Console Logger
- **Vị trí**: [apiClient.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/web/app/lib/services/apiClient.ts#L15-L22)
- **Hiện trạng**: Request interceptor của Axios ghi log toàn bộ `config.data` và `config.headers` ra console trình duyệt.
- **Rủi ro**: Mật khẩu dạng rõ khi gọi `/auth/login`, `/auth/register` cùng JWT Bearer Tokens bị phơi bày trên DevTools trình duyệt, dễ bị trích xuất bởi các tiện ích mở rộng (browser extensions) độc hại hoặc tấn công XSS.
- **Quy tắc ngăn chặn**: `RULE-SEC-001: Zero Secrets & Credentials in Logs`

### AUD-05: Fallback JWT Secret cố định & Thiếu cơ chế vô hiệu hóa phiên (Revocation)
- **Vị trí**: [auth.service.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/api/src/auth/auth.service.ts#L89), [auth.controller.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/api/src/auth/auth.controller.ts#L53), [jwt.strategy.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/api/src/auth/jwt.strategy.ts#L24)
- **Hiện trạng**: Chuỗi secret tĩnh `'super_secret_chayfood_jwt_token_2026'` được hardcode làm giá trị fallback. Token có hạn 7 ngày nhưng không có cơ chế Refresh Token Rotation, Blacklist hoặc Token Version để thu hồi khi đổi mật khẩu / hạ quyền tài khoản.
- **Quy tắc ngăn chặn**: `RULE-AUTH-001: Mandatory Secrets Isolation` và `RULE-AUTH-002: Token Lifecycle & Invalidation`

### AUD-06: Bất đồng bộ định dạng dữ liệu (SSOT Divergence)
- **Vị trí**: Sự không nhất quán giữa `@chayfood/shared-types`, `schema.prisma`, NestJS DTOs và `apps/web/app/lib/services/types.ts`.
- **Hiện trạng**: Tồn tại nhiều tàn dư MongoDB (`_id`, `foodId`, enum viết thường `'pending'`) xung đột với schema PostgreSQL (`id: uuid`, `menuItemId`, enum viết hoa `PENDING`).
- **Quy tắc ngăn chặn**: `RULE-API-001: Single Source of Truth Types Contract`

### AUD-07: Fake Success Simulation & Sai lệch đường dẫn API
- **Vị trí**: [orderService.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/web/app/lib/services/orderService.ts#L76-L81)
- **Hiện trạng**: Khi gọi API thất bại hoặc endpoint không tồn tại (như `/order/${id}/cancel`), frontend bắt lỗi và trả về dữ liệu giả lập thành công `{ status: 'success', message: 'Order cancelled (simulated)' }`.
- **Rủi ro**: Người dùng tưởng rằng đơn hàng đã được hủy thành công nhưng phía nhà bếp vẫn chế biến và giao hàng, gây thất thoát chi phí.
- **Quy tắc ngăn chặn**: `RULE-API-002: No Silent Failure or Fake Simulation`

### AUD-08: Giả mạo quyền Admin qua Cookie chưa ký số
- **Vị trí**: [middleware.ts](file:///c:/Users/MSI/Desktop/chayfood/apps/web/middleware.ts#L17-L25)
- **Hiện trạng**: Middleware kiểm tra `currentUser` cookie dạng plain text JSON mà không xác thực chữ ký số JWT. Đồng thời middleware chỉ cấu hình matcher cho đường dẫn gốc `/`, bỏ lọt toàn bộ prefix `/admin/*`.
- **Quy tắc ngăn chặn**: `RULE-AUTHZ-003: Server-Side Cryptographic Guarding`

---

## 4. Tóm Tắt Khuyến Nghị Ưu Tiên Cao Nhất

1. **Khắc phục BOLA/IDOR và bổ sung Auth Guards**: Bảo vệ toàn bộ endpoint nhạy cảm của Inventory, Recipe và Order.
2. **Khóa nguyên tử kho hàng**: Chuyển đổi cập nhật kho sang toán tử `decrement` có kiểm tra điều kiện hoặc raw SQL lock `SELECT ... FOR UPDATE`.
3. **Loại bỏ Logging dữ liệu nhạy cảm**: Làm sạch interceptor trong `apiClient.ts`, loại trừ payload chứa password và header Authorization.
4. **Chuẩn hóa SSOT Types**: Đồng bộ tuyệt đối giữa `schema.prisma` -> `@chayfood/shared-types` -> Frontend Services, xóa bỏ các định nghĩa type trùng lặp.
5. **Củng cố JWT Authentication**: Đưa JWT Secret vào biến môi trường bắt buộc, triển khai cơ chế kiểm soát token hợp lệ theo trạng thái cơ sở dữ liệu.
