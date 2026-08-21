## 📌 Context & Problem Statement
Delivers the complete customer digital experience with high-performance Zustand cart store, modern Editorial Cart & Checkout pages, glassmorphic Toast notification system, and centralized apiClient request pipeline.

## 🛠️ Proposed Changes & Architecture
- `apps/web/app/store/useCartStore.ts`: Zustand store with persistent storage for items, vouchers, delivery fees, portion options, and live macro calculations.
- `apps/web/app/cart/page.tsx` & `apps/web/app/cart/components/*`:
  - `CartEmptyState.tsx`, `CartFreeshipProgress.tsx`, `CartItemCard.tsx`, `CartMacroOverview.tsx`, `CartOrderSummary.tsx`.
  - Editorial layout with responsive two-column view, free shipping progress bar, and real-time total meal macro breakdown.
- `apps/web/app/checkout/page.tsx` & `apps/web/app/checkout/components/*`:
  - `CheckoutAddressSection.tsx`, `CheckoutPaymentSection.tsx`, `CheckoutDeliveryNotesSection.tsx`, `CheckoutOrderSummary.tsx`.
  - Client-side pre-validation using `CreateOrderSchema.safeParse(...)`.
  - Multi-tiered fallback for dish ID extraction and graceful Vietnamese alerts.
  - Pluggable payment strategies (VietQR Banking, Stripe Card Gateway, Cash on Delivery).
- `apps/web/app/lib/utils/formatError.ts`: Technical validation and HTTP error translator converting NestJS / Zod issues into natural Vietnamese copy.
- `apps/web/app/components/ClientProviders.tsx`: Redesigned `<Toaster />` with glassmorphic styling (`backdrop-blur-md`, rounded-2xl, shadow-xl, emerald success & ruby error).
- `apps/web/app/lib/services/apiClient.ts`: Single SSOT Axios HTTP client handling auth bearer token injection and logging.
- `apps/web/app/services/*`: Refactored `orderService`, `paymentService`, `menuService`, `categoryService`, `analyticsService`, and `reviewService` to use centralized `apiClient`.

## 🛡️ System Design Rules & Invariants Checklist
- [x] **UI & Editorial Ergonomics (`RULE-UI-003`, `RULE-UI-004`)**: Editorial Food Tech aesthetic, zero trailing dots on headings/badges
- [x] **Strict Type Safety (`RULE-CODE-001`)**: 100% typed props and state interfaces
- [x] **Single Source of Truth (`RULE-CODE-002`)**: All API calls routed through `apiClient`
- [x] **Pluggable Payment Providers (`RULE-CODE-007`)**: Strategy pattern for Stripe / VietQR / COD
- [x] **Natural Vietnamese Copywriting (`RULE-UI-008`)**: Clean, polite, culinary-inspired messaging

## 🧪 Verification & Test Results
- [x] Type check passed (`pnpm --filter @chayfood/web type-check`)
- [x] Web build passed (`pnpm --filter @chayfood/web build` - 32/32 routes static & dynamic)
- [x] End-to-End cart and checkout validation verified
