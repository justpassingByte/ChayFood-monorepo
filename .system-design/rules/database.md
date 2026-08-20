# Quy Tắc Thiết Kế Cơ Sở Dữ Liệu (Database Rules)

# RULE-DB-001: Mandatory Indexing on Foreign Keys & High-Frequency Filters

## Trigger
Khi định nghĩa các trường khóa ngoại (Foreign Keys) hoặc các cột thường xuyên được dùng trong mệnh đề `WHERE` và `ORDER BY` trong `schema.prisma` (như `userId`, `menuItemId`, `status`, `createdAt`, `category`).

## Rule
Khai báo chỉ mục tường minh (`@@index([userId, createdAt])`, `@@index([category, isAvailable])`) cho mọi bảng quan hệ trong `schema.prisma`.

## Why
Trong PostgreSQL, việc tạo khóa ngoại (`@relation`) không tự động sinh chỉ mục cho cột khóa ngoại. Khi dữ liệu tăng lên hàng chục ngàn đơn hàng, các truy vấn như `findUserOrders(userId)` sẽ phải quét toàn bộ bảng (Sequential Scan), làm tê liệt cơ sở dữ liệu.

## Violation signal
Bảng `orders`, `order_items`, `stock_transactions`, `subscriptions` chứa các trường `userId`, `orderId`, `ingredientId` mà không có khai báo `@@index`.

## Preferred pattern
```prisma
model Order {
  id        String      @id @default(uuid())
  userId    String
  status    OrderStatus @default(PENDING)
  createdAt DateTime    @default(now())
  
  user      User        @relation(fields: [userId], references: [id], onDelete: Restrict)
  items     OrderItem[]

  @@index([userId, createdAt(sort: Desc)])
  @@index([status])
  @@map("orders")
}
```

---

# RULE-DB-002: Composite Unique Constraints on Junction Entities

## Trigger
Khi thiết kế các bảng quan hệ liên kết n-n (ví dụ: `RecipeItem` liên kết giữa Công thức và Nguyên liệu, hoặc các mục gán thẻ).

## Rule
Bắt buộc định nghĩa ràng buộc duy nhất phức hợp `@@unique([recipeId, ingredientId])` trong `schema.prisma`.

## Why
Ngăn chặn lỗi logic do người dùng hoặc code chèn trùng lặp một nguyên liệu nhiều lần trong cùng một công thức nấu ăn, gây sai lệch nghiêm trọng bảng tính giá vốn BOM (Food Cost).

## Violation signal
Model `RecipeItem` chỉ có `@id` đơn lẻ mà không có ràng buộc chống trùng lặp `@@unique([recipeId, ingredientId])`.

## Preferred pattern
```prisma
model RecipeItem {
  id           String         @id @default(uuid())
  recipeId     String
  ingredientId String
  quantity     Decimal        @db.Decimal(10, 2)
  unit         IngredientUnit @default(GRAM)
  
  recipe       Recipe         @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  ingredient   Ingredient     @relation(fields: [ingredientId], references: [id], onDelete: Restrict)

  @@unique([recipeId, ingredientId])
  @@map("recipe_items")
}
```

---

# RULE-DB-003: Safe Pagination & Unbounded Query Prevention

## Trigger
Khi xây dựng các endpoint danh sách (Menu items, Orders, Stock Transactions, Recipes).

## Rule
Luôn áp dụng giới hạn kích thước phân trang mặc định (`take: limit || 20`) và giới hạn tối đa (`Math.min(limit, 100)`). Tuyệt đối không thực thi các truy vấn `findMany()` không giới hạn số lượng trả về trên các bảng phát sinh theo thời gian.

## Why
Truy vấn không có giới hạn `take` sẽ kéo hàng triệu dòng bản ghi vào RAM của ứng dụng NestJS khi cơ sở dữ liệu lớn, gây tràn bộ nhớ (Out-Of-Memory Crash) và sập hệ thống.

## Violation signal
Gọi `prisma.order.findMany()` hoặc `prisma.stockTransaction.findMany()` mà không có tham số `take`.

## Preferred pattern
```typescript
async findAll(query: { page?: number; limit?: number }) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    this.prisma.order.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    this.prisma.order.count(),
  ]);

  return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}
```
