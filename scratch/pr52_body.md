## 📌 Context & Problem Statement
Delivers the complete Customer Digital Portal (Account Hub), Clinical Nutrition & Personalization Profile, Rich Order Cards with 1-click Reorder, Redesigned Order Details with Stepper Timeline, and Subscriptions Management.

## 🛠️ Proposed Changes & Architecture

### 1. Backend User Module & Subscriptions (`apps/api/src/user/` & `apps/api/src/subscriptions/`)
- `apps/api/src/user/`:
  - `user.controller.ts` & `user.service.ts`: Endpoints `GET /api/user/profile/full`, `GET /api/user/profile`, `PUT /api/user/profile`, `GET /api/user/addresses`, `POST /api/user/addresses`, `PUT /api/user/preference`, `PUT /api/user/password`.
  - Secure bcrypt password change with current password verification.
- `apps/api/src/subscriptions/`:
  - Added `POST /api/subscriptions/:id/toggle` for customer meal plan pause & resume.

### 2. Unified Customer Account Hub (`apps/web/app/account/`)
- `apps/web/app/account/layout.tsx`:
  - Persistent left Sidebar with active tab indicators and user membership badge ("Thành viên Thân thiết").
  - 5 Navigation routes: Profile, Orders, Subscriptions, Family Nutrition, Security Settings.
- `apps/web/app/account/profile/page.tsx`:
  - Integrated Clinical Health & Personalization survey (Age, Biological Gender, Height, Weight, Activity Level, Goals).
  - Real-time automatic Biomarkers calculation (BMI with WHO Asia category, BMR, TDEE, Target Calories, Target Plant Protein, Macro breakdown).
  - Delivery Address book with default badges and quick-add modal.
  - Dietary restrictions & allergen exclusion filters (No Allium, Peanuts, Gluten...).
- `apps/web/app/account/orders/page.tsx`:
  - Editorial Order Cards with status badges matching Order State Machine.
  - Quick action buttons: "Thanh toán ngay" (direct VietQR link), "Chi tiết & Tiến trình", "Đặt lại đơn này" (1-click Reorder adding items to Cart), "Hủy đơn" (when `PENDING`).
- `apps/web/app/account/subscriptions/page.tsx`:
  - View active/paused meal plans, delivery time windows, and 1-click pause/resume toggle.

### 3. Redesigned Editorial Order Details (`apps/web/app/order/[id]/page.tsx`)
- Breadcrumbs navigation (`Trang chủ` / `Lịch sử đơn hàng` / `#{orderNumber}`).
- Dynamic live status badge with glowing rings.
- Visual Timeline Stepper with step timestamps and culinary icons.
- High-res dish thumbnails, pricing breakdown, and customer support card.

### 4. Subscription Discovery (`apps/web/app/subscriptions/page.tsx`)
- 4 Signature ChayFood meal plans: Weekly Pure Plant, Gym & Fit High-Protein, 30-Day Balance, Family Feast.
- 3-Step interactive wizard with seamless redirect to `/account/subscriptions`.

## 🛡️ System Design Rules & Invariants Checklist
- [x] **Strict TypeScript Mandate (`RULE-CODE-001`)**: 100% typed props and state interfaces.
- [x] **Single Source of Truth (`RULE-CODE-002`)**: Nutrition engine and biomarker calculations shared with `/nutrition-planner`.
- [x] **Editorial Ergonomics (`RULE-UI-003`, `RULE-UI-004`)**: Zero trailing dots on headers, badges, and buttons.
- [x] **Natural Vietnamese Copywriting (`RULE-UI-008`)**: Rich, respectful culinary messaging.

## 🧪 Verification & Test Results
- [x] Monorepo Typecheck: `npx turbo run type-check` (5/5 packages PASS)
- [x] Monorepo Test Suites: 8 suites, 41 tests passed (`npx turbo run test`)
