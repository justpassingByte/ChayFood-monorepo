# Quy Tắc Tiêu Chuẩn Mã Nguồn & Kiến Trúc (Code Standards Rules)

# RULE-CODE-001: Strict TypeScript & Zero Any/Unknown Mandate

## Trigger
Khi viết mã TypeScript trong toàn bộ Monorepo (`apps/api`, `apps/web`, `packages/*`).

## Rule
Tuyệt đối KHÔNG sử dụng `any` hoặc `unknown` trong khai báo biến, tham số hàm, giá trị trả về hoặc ép kiểu (`as any`, `as unknown`). Mọi dữ liệu phải có Interface hoặc Type rõ ràng từ `@chayfood/shared-types`, `@chayfood/db` hoặc DTOs chuẩn.
- Trong khối `try...catch`, sử dụng Type Narrowing: `if (error instanceof Error)`.

## Why
Duy trì tính an toàn kiểu dữ liệu, ngăn ngừa triệt để các lỗi runtime tiềm ẩn và đảm bảo tính nhất quán giữa Backend và Frontend.

## Violation signal
`(error: any)`, `user: any`, `(dto as any)`, `items: unknown[]`.

## Preferred pattern
```typescript
try {
  await this.orderService.process(id);
} catch (error) {
  if (error instanceof Error) {
    this.logger.error(error.message);
  }
}
```

---

# RULE-CODE-002: Modular Architecture & File Size Limits

## Trigger
Khi tạo mới hoặc refactor một component, service, controller hoặc custom hook.

## Rule
Khuyến nghị mỗi file không vượt quá **250 - 300 dòng code**. Khi một component hoặc module phình to:
1. Tách nhỏ thành các sub-components trong thư mục con riêng biệt.
2. Tách custom hook xử lý logic / filtering (`useMenuFilters.ts`).
3. Tách hằng số và types ra file riêng.
4. Tuân thủ Single Responsibility Principle (SRP): Mỗi file chỉ đảm nhận một trách nhiệm duy nhất.

## Why
Giúp mã nguồn dễ đọc, dễ bảo trì, dễ viết unit test và hạn chế xung đột khi nhiều lập trình viên cùng làm việc.

## Violation signal
Một file component hoặc service dài từ 400 đến 1000+ dòng code chứa cả giao diện, state, network fetch và modal logic.

## Preferred pattern
Tách trang chính thành các thành phần con: `Page.tsx` -> `<Header />`, `<Filters />`, `<GridList />`, `<DetailModal />`.

---

# RULE-CODE-003: UI vs State Separation & DRY Reusability

## Trigger
Khi xây dựng các thành phần giao diện lặp lại hoặc các khối logic xử lý trạng thái.

## Rule
1. Tách biệt rõ ràng giữa UI Component (Giao diện hiển thị) và Logic / State (Custom Hooks, Services).
2. Mọi khối giao diện lặp lại từ 2 lần trở lên (Card món ăn, Macro Badges, Search Input, Form Controls, Buttons, Dialogs) phải được trừu tượng hóa thành Reusable Component đặt trong `components/ui/` hoặc `components/shared/`.

## Why
Tránh nhân bản mã nguồn (Don't Repeat Yourself), đảm bảo tính đồng bộ giao diện trên toàn hệ thống và sửa lỗi một nơi tác động toàn bộ.

## Violation signal
Viết lại cùng một cấu trúc HTML card món ăn kèm CSS Tailwind ở cả trang Menu, trang Home và trang Subscriptions.

## Preferred pattern
Trích xuất thành `<FoodCard item={dish} onSelect={...} />` dùng chung.
