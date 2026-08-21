## 📌 Context & Problem Statement
Implements PostgreSQL Prisma ORM database models, production-grade seed dataset, and establishes **@chayfood/shared-types** as the unified **Single Source of Truth (SSOT)** with End-to-End Zod Schemas.

## 🛠️ Proposed Changes & Architecture
- `packages/shared-types/src/schemas/*`:
  - `order.schema.ts`: `CreateOrderSchema`, `CreateOrderItemSchema`, `DeliveryAddressSchema`, `PaymentMethodSchema`, `OrderStatusSchema` with localized Vietnamese validation messages.
  - `auth.schema.ts`: `LoginSchema`, `RegisterSchema`, `UpdateProfileSchema`, `RoleSchema`.
  - `menu.schema.ts`: `CreateMenuItemSchema`, `UpdateMenuItemSchema`, `NutritionInfoSchema`.
  - **Single Source of Truth (SSOT)**: TypeScript types derived automatically via `z.infer` for zero duplication between Backend and Frontend.
  - **Module Build Pipeline**: Configured `tsc` compilation to `./dist` supporting both CommonJS and Node.js v24 ESM module resolution.
- `packages/db/prisma/schema.prisma`: Strongly typed models for Users, MenuItems, Categories, Inventory, Recipes/BOM, Orders, Subscriptions, Family.
- `packages/db/src/index.ts`: Configured Prisma client with silent query logging in production (`log: ['error', 'warn']`).
- `packages/db/src/seed.ts` & `packages/db/src/seed-data/*`: Modularized seed dataset for accounts, dishes, ingredients, recipes, and meal plans.

## 🛡️ System Design Rules & Invariants Checklist
- [x] **Strict Type Safety (`RULE-CODE-001`)**: Zero `any` / Zero `unknown` guarantee, 100% Zod inferred types
- [x] **Single Source of Truth (`RULE-CODE-002`)**: All DTOs, Enums, and Schemas defined once in `@chayfood/shared-types`
- [x] **Modular Architecture (`RULE-CODE-004`)**: Clean modular schema and seed files under 250 lines
- [x] **Concurrency & Balance Invariants (`RULE-CONC-001`)**: Decimal precision for financial fields
- [x] **Data Redaction & Secret Hygiene (`RULE-SEC-001`)**: Password hash field isolation
- [x] **Vietnamese Natural Copywriting (`RULE-UI-008`)**: Clean Vietnamese validation messages embedded directly in schemas

## 🧪 Verification & Test Results
- [x] Type check passed across all packages (`turbo run type-check`)
- [x] Package build succeeded (`pnpm --filter @chayfood/shared-types build`)
- [x] Database query and seeding verified
