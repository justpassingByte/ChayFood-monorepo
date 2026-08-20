# Quy Tắc Phân Quyền & Kiểm Soát Truy Cập (Authorization Rules)

# RULE-AUTHZ-001: Resource Ownership Verification (BOLA/IDOR Prevention)

## Trigger
Khi xử lý các yêu cầu truy vấn hoặc thao tác trên một tài nguyên cụ thể thông qua định danh ID từ phía máy khách (ví dụ: `GET /resources/:id`, `PATCH /profiles/:id`, `DELETE /items/:id`).

## Rule
Bắt buộc kiểm tra quyền sở hữu của Principal (người dùng/tenant hiện tại) đối với tài nguyên trước khi trả về dữ liệu hoặc thực hiện sửa đổi: Tài nguyên đó phải thuộc quyền sở hữu của chính Principal (`resource.userId === currentUser.id`) HOẶC Principal phải có vai trò đặc quyền (`currentUser.role === Role.ADMIN`).

## Why
Nếu chỉ kiểm tra xem người dùng đã đăng nhập hay chưa mà không đối chiếu quyền sở hữu (Broken Object Level Authorization - BOLA / IDOR - OWASP API Security Top 1), bất kỳ người dùng nào cũng có thể truy cập trái phép, đọc trộm hoặc sửa đổi dữ liệu riêng tư của người dùng khác bằng cách duyệt/dò ID.

## Violation signal
Hàm Service/Controller truy vấn trực tiếp bằng `where: { id }` và trả kết quả cho người dùng mà không so khớp trường `userId` / `tenantId` với danh tính lấy từ Token xác thực.

## Preferred pattern
```typescript
async findById(resourceId: string, currentUser: { id: string; role: Role }) {
  const resource = await this.prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new NotFoundException('Không tìm thấy tài nguyên');
  }

  if (resource.userId !== currentUser.id && currentUser.role !== Role.ADMIN) {
    throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
  }

  return resource;
}
```

---

# RULE-AUTHZ-002: Principle of Least Privilege & Default-Deny on Privileged Endpoints

## Trigger
Khi định nghĩa các Controller hoặc Routes xử lý dữ liệu quản trị nội bộ: Báo cáo tài chính, Bảng giá vốn, Định mức cấu thành, Tồn kho tài nguyên, Lịch sử kiểm kê, Cấu hình hệ thống, và Danh mục đối tác.

## Rule
Áp dụng nguyên tắc Mặc định từ chối (Default-Deny). Mọi endpoint liên quan đến dữ liệu nội bộ và quản trị đặc quyền bắt buộc phải được bảo vệ bởi bộ đôi Guards: `@UseGuards(JwtAuthGuard, RolesGuard)` và `@Roles(Role.ADMIN)`.

## Why
Bỏ quên Guard trên các route đọc (`GET`) khiến bí mật kinh doanh, cấu trúc chi phí và dữ liệu nhạy cảm nội bộ bị lộ ra ngoài internet cho bất kỳ người dùng ẩn danh nào.

## Violation signal
Phương thức `GET` trong các Controller xử lý dữ liệu nội bộ hoặc quản trị không được khai báo Guards xác thực và phân quyền.

## Preferred pattern
```typescript
@ApiTags('AdminManagement')
@Controller('admin/resources')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminResourceController {
  @Get('metrics')
  getSystemMetrics() {
    return this.service.getSystemMetrics();
  }
}
```

---

# RULE-AUTHZ-003: Server-Side Cryptographic Guarding (Zero-Trust Client State)

## Trigger
Khi kiểm tra quyền truy cập vào các tuyến đường đặc quyền (`/admin/*`) trong Middleware hoặc Server Components.

## Rule
Tuyệt đối không tin tưởng các trường dữ liệu phân quyền lưu trữ dạng Plain Text trên Cookie hoặc LocalStorage do client gửi lên. Mọi quyết định điều hướng và phân quyền phải dựa trên việc giải mã và xác thực chữ ký mật mã của JWT Token hoặc kiểm tra trạng thái từ Backend Service.

## Why
Người dùng bình thường có thể tự chỉnh sửa giá trị Cookie dạng text thuần (ví dụ `currentUser={"role":"admin"}`) trên trình duyệt để đánh lừa middleware phân quyền thô sơ, gây rủi ro lộ giao diện quản trị và chức năng nội bộ.

## Violation signal
Đọc `JSON.parse(request.cookies.get('currentUser'))` trong middleware để quyết định cho phép truy cập khu vực quản trị viên.

## Preferred pattern
```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Xác thực chữ ký token hoặc chuyển tiếp request để backend xác thực
  }
  
  return NextResponse.next();
}
```
