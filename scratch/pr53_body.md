## 📌 Context & Problem Statement
Implements the comprehensive Admin Operations Portal with multi-dimensional order filtering, context-aware state machine transition controls, and robust case-insensitive role-based access control.

## 🛠️ Proposed Changes & Architecture

### 1. Multi-Dimensional Order Management (`apps/web/app/admin/orders/`)
- `apps/web/app/admin/orders/page.tsx`:
  - 6 Dimensional filters: Order Status (`PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `DELIVERING`, `DELIVERED`, `CANCELLED`), Payment Status (`PAID`, `PENDING`, `FAILED`), Payment Method (`BANKING`, `COD`, `CARD`), Date Range (Today / This Week / This Month / All), Search query (Order #, Customer name, Phone, Email), Sort (Newest / Oldest / Amount).
- `apps/web/app/admin/orders/[id]/page.tsx`:
  - Context-aware action buttons adhering to `ORDER_TRANSITIONS` state machine map (e.g. `Xác nhận đơn`, `Chuyển vào bếp`, `Sẵn sàng giao`, `Bắt đầu giao`, `Hoàn tất đơn`).
  - Order details view with item breakdown, recipient address, customer phone, and transaction history.
- `apps/web/app/components/admin/dashboard/OrdersTable.tsx`:
  - Added paymentStatus badge and direct link to `/admin/orders/[id]`.

### 2. Admin Authentication & RBAC Alignment
- `apps/web/app/context/AuthContext.tsx`, `apps/web/middleware.ts`, `apps/web/app/components/MobileNav.tsx`:
  - Fixed case-sensitive role mismatch by standardizing `user?.role?.toUpperCase() === 'ADMIN'`.
  - Seamless redirection into `/admin` dashboard upon admin login.

## 🛡️ System Design Rules & Invariants Checklist
- [x] **State Machine Integrity (`RULE-SM-001`)**: Admin actions strictly follow state transitions defined in `@chayfood/shared-types`.
- [x] **Strict TypeScript Mandate (`RULE-CODE-001`)**: 100% type safety on filters, query parameters, and action handlers.
- [x] **Editorial Ergonomics (`RULE-UI-003`, `RULE-UI-004`)**: Clean admin UI with zero trailing dots on headings and action badges.

## 🧪 Verification & Test Results
- [x] Monorepo Typecheck: `npx turbo run type-check` (5/5 packages PASS)
- [x] Full build test: `pnpm --filter @chayfood/web build` passed cleanly
