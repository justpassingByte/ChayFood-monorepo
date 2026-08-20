# Quy Tắc Thiết Kế API & Hợp Đồng Dữ Liệu (API Design Rules)

# RULE-API-001: Single Source of Truth Types Contract

## Trigger
Khi định nghĩa các interface dữ liệu, DTOs, Enums dùng trong giao tiếp giữa Frontend (`apps/web`) và Backend (`apps/api`).

## Rule
Toàn bộ kiểu dữ liệu dùng chung bắt buộc phải import trực tiếp từ package `@chayfood/shared-types` hoặc `@chayfood/db`. Tuyệt đối không tự viết lại (duplicate) các interface hoặc enum cục bộ trong các file `types.ts` của frontend.

## Why
Việc định nghĩa độc lập nhiều nơi dẫn đến tình trạng không đồng nhất: Frontend gửi `_id` còn Backend yêu cầu `id`, Frontend gửi enum viết thường `'pending'` còn Backend định nghĩa enum viết hoa `'PENDING'`, dẫn đến lỗi logic âm thầm và gián đoạn trải nghiệm người dùng.

## Violation signal
Tồn tại file `apps/web/app/lib/services/types.ts` với các trường `_id: string`, `foodId: string` không khớp với `@chayfood/shared-types`.

## Preferred pattern
```typescript
// Trong Frontend Service / Component:
import {
  MenuItem,
  CreateOrderDto,
  OrderStatus,
  Recipe,
  Ingredient,
} from '@chayfood/shared-types';
```

---

# RULE-API-002: Zero Silent Failures & Fake Simulation

## Trigger
Khi xử lý lỗi mạng, lỗi phản hồi từ API hoặc endpoint chưa được triển khai trong tầng Service của Frontend.

## Rule
Luôn ném lỗi (re-throw error) hoặc trả về thông báo lỗi thực tế để giao diện hiển thị thông báo chính xác cho người dùng. Tuyệt đối không bắt lỗi `catch` rồi tự trả về phản hồi giả định thành công (`simulated success response`).

## Why
Việc giả lập thành công khi API thực tế bị lỗi (ví dụ: hủy đơn hàng trả về `{ status: 'success', message: 'Order cancelled (simulated)' }`) khiến người dùng tưởng đơn hàng đã được hủy, trong khi phía nhà bếp vẫn chế biến và tài khoản của họ vẫn bị trừ tiền.

## Violation signal
Khối `catch (error)` trả về `{ status: 'success', message: 'Order marked as received (simulated)' }`.

## Preferred pattern
```typescript
try {
  const response = await api.patch(`/orders/${id}/cancel`);
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau');
}
```

---

# RULE-API-003: Restful Naming & HTTP Semantic Consistency

## Trigger
Khi định nghĩa các Controller endpoints trong NestJS và gọi hàm từ Axios client trong Next.js.

## Rule
Tuân thủ chuẩn đặt tên RESTful số nhiều: `@Controller('orders')`, `@Controller('recipes')`, `@Controller('inventory')`.
- Tạo mới: `POST /api/orders` (Status 201)
- Lấy danh sách: `GET /api/orders` (Status 200)
- Lấy chi tiết: `GET /api/orders/:id` (Status 200)
- Cập nhật một phần: `PATCH /api/orders/:id` (Status 200)
- Xóa: `DELETE /api/recipes/:id` (Status 200)

## Why
Không đồng nhất giữa số ít (`/order`) và số nhiều (`/orders`), hoặc dùng sai phương thức HTTP (`PUT` thay cho `PATCH`) dẫn đến lỗi 404 Not Found và làm rối loạn tài liệu Swagger.

## Violation signal
Controller khai báo `@Controller('orders')` nhưng Frontend Service gọi `api.get('/order')` hoặc `api.put('/menu/:id')`.

## Preferred pattern
```typescript
// Controller NestJS:
@Controller('orders')
export class OrdersController {
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {}
}

// Client NextJS:
export const orderService = {
  updateStatus: async (id: string, dto: UpdateOrderStatusDto) => {
    const response = await api.patch(`/orders/${id}/status`, dto);
    return response.data;
  },
};
```
