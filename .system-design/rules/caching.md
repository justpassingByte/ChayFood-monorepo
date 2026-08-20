# Quy Tắc Bộ Nhớ Đệm (Caching Rules)

# RULE-CACHE-001: Immediate Cache Invalidation on Data Mutation

## Trigger
Khi lưu đệm (cache) danh sách thực đơn (`/menu`), danh mục món ăn hoặc bảng công thức, và quản trị viên thực hiện cập nhật, xóa hoặc đổi trạng thái khả dụng của món ăn.

## Rule
Bắt buộc xóa hoặc làm mới khóa đệm (Cache Invalidation) tương ứng ngay sau khi thao tác sửa đổi trong cơ sở dữ liệu thành công.

## Why
Nếu không xóa đệm khi cập nhật, khách hàng sẽ tiếp tục nhìn thấy giá cũ, món ăn đã hết hàng hoặc công thức cũ trong suốt thời gian tồn tại của TTL, dẫn đến việc đặt phải món không còn khả dụng.

## Violation signal
Hàm `create`, `update`, `remove` trong `MenuService` chỉ cập nhật DB mà không phát tín hiệu xóa cache.

## Preferred pattern
```typescript
async update(id: string, dto: UpdateMenuItemDto) {
  const updated = await this.prisma.menuItem.update({
    where: { id },
    data: dto,
  });

  // Xóa cache danh sách thực đơn
  await this.cacheManager.del('menu:all');
  await this.cacheManager.del(`menu:item:${id}`);

  return updated;
}
```

---

# RULE-CACHE-002: Zero Authorization & Sensitive PII Caching in Shared Stores

## Trigger
Khi lưu đệm kết quả kiểm tra quyền hạn của người dùng hoặc thông tin hồ sơ khách hàng vào bộ nhớ dùng chung (như Redis).

## Rule
Tuyệt đối không lưu đệm quyền hạn hoặc danh sách đơn hàng cá nhân vào các khóa đệm chung không có tiền tố gắn liền với `userId`. Không lưu đệm quyết định phân quyền nếu không có cơ chế thu hồi tức thì khi quyền của người dùng bị thay đổi.

## Why
Lưu cache không phân lập người dùng sẽ dẫn đến hiện tượng rò rỉ dữ liệu chéo giữa các khách hàng (Data Leakage) hoặc người dùng bị hạ quyền nhưng vẫn giữ quyền quản trị do cache chưa hết hạn.

## Violation signal
Sử dụng khóa cache tĩnh như `cache.get('user:profile')` mà không kèm theo mã định danh duy nhất của người dùng.

## Preferred pattern
```typescript
const cacheKey = `user:${currentUser.id}:profile`;
```
