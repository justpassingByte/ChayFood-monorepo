## 📌 Context & Problem Statement
Implements the robust, production-grade Payment Provider Architecture (Strategy & Factory Patterns), VietQR integration, and Order Lifecycle State Machine with atomic BOM inventory deduction and anti-duplicate webhook processing.

## 🛠️ Proposed Changes & Architecture

### 1. Database & SSOT (`packages/db` & `packages/shared-types`)
- `packages/db/prisma/schema.prisma`:
  - Added `sequenceNumber Int @default(autoincrement())` to `Order` for compact bank transfer reference codes.
  - Added `model PaymentTransaction` and `enum PaymentTransactionStatus` (`PENDING`, `PAID`, `EXPIRED`, `FAILED`).
- `packages/shared-types/src/payment.ts`:
  - Defined SSOT types: `PaymentIntentResult`, `WebhookVerificationResult`, `PaymentStatusResult`.
  - Utility functions: `generateTransferContent(seq, date)` (e.g. `CF 21082026 5`) and `parseTransferContent(content)`.
- `packages/shared-types/src/order-state-machine.ts`:
  - Strict transition map: `PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY` ➔ `DELIVERING` ➔ `DELIVERED`.
  - State machine helpers: `isValidTransition()`, `getNextStatuses()`, `ORDER_STATUS_LABELS`, `TRANSITION_ACTION_LABELS`.

### 2. Backend Payment Strategy & Factory (`apps/api/src/payment/`)
- `interfaces/payment-provider.interface.ts`: Generic `IPaymentProvider` contract.
- `providers/sepay.provider.ts`: Vietnamese VietQR banking adapter with signature verification.
- `providers/mock.provider.ts`: Instant/delayed auto-approval mock provider for local development.
- `providers/stripe.provider.ts` & `providers/cod.provider.ts`: Card & Cash on Delivery providers.
- `payment.factory.ts`: Dynamic strategy routing based on `paymentMethod` and `BANKING_PROVIDER` env.
- `payment.service.ts`: Atomic DB transaction handling, idempotency check on transaction IDs, and auto-transition to `CONFIRMED`.
- `payment.controller.ts`: Endpoints `POST /api/payment/create-intent/:orderId`, `GET /api/payment/status/:orderId`, `POST /api/payment/webhook/:provider`.

### 3. Orders Service State Machine (`apps/api/src/orders/`)
- `orders.service.ts`:
  - Enforced `isValidTransition(current, next)`.
  - Atomic BOM inventory deduction (`InventoryService.deductStockForOrder`) when order transitions to `PREPARING`.
  - Customer cancellation (`PATCH /orders/:id/cancel` - only when `PENDING`).
  - Customer receipt confirmation (`PATCH /orders/:id/received` - only when `DELIVERING`).

### 4. Frontend Payment Layer (`apps/web`)
- `apps/web/app/lib/vietqr.ts`: Direct VietQR image URL generation helper.
- `apps/web/app/checkout/payment/[orderId]/`: Dedicated payment page with 15-minute countdown, 3-second auto-polling, and 1-click copy STK & amount.
- `apps/web/app/services/paymentService.ts` & `orderService.ts`: Connected to unified payment APIs.

## 🛡️ System Design Rules & Invariants Checklist
- [x] **Strict TypeScript Mandate (`RULE-CODE-001`)**: 100% typed, 0 `any`/`unknown`.
- [x] **Single Source of Truth (`RULE-CODE-002`)**: State transitions and transfer format centralized in `@chayfood/shared-types`.
- [x] **Pluggable Payment Strategy (`RULE-CODE-007`)**: Clean Strategy & Factory patterns.
- [x] **Anti-duplicate Webhook Processing (`RULE-INT-002`)**: Webhook transactions deduplicated via unique idempotency checks.
- [x] **Atomic Inventory Deduction (`RULE-ACID-001`)**: BOM stock deducted inside Prisma transaction.

## 🧪 Verification & Test Results
- [x] Full Monorepo Typecheck: `npx turbo run type-check` (5/5 packages PASS)
- [x] Backend Unit Tests: 8 passed suites, 37 passed tests (`npm test` in `apps/api`)
