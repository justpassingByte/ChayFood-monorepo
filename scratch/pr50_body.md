## 📌 Context & Problem Statement
Implements the end-to-end Meal Plan Subscription lifecycle with smart pause/resume control, dynamic delivery scheduling, and intuitive meal plan discovery.

## 🛠️ Proposed Changes & Architecture

### 1. Backend Subscriptions Module (`apps/api/src/subscriptions/`)
- `subscriptions.controller.ts` & `subscriptions.service.ts`:
  - Added `POST /api/subscriptions/:id/toggle` for switching plan status between `ACTIVE` and `PAUSED`.
  - Enforced user authorization ensuring only subscription owners can toggle status.

### 2. Frontend Subscriptions Discovery & Management (`apps/web`)
- `apps/web/app/subscriptions/page.tsx`:
  - 4 Signature ChayFood meal plans (Weekly Pure Plant, Gym & Fit High-Protein, 30-Day Balance, Family Feast).
  - 3-Step interactive schedule selection (frequency, delivery window, dietary notes) with direct routing to customer subscription hub.
- `apps/web/app/account/subscriptions/page.tsx`:
  - Unified meal plan management dashboard with active/paused badges, remaining days counter, and 1-click status toggle.
- `apps/web/app/lib/services/subscriptionService.ts`:
  - Centralized API service connecting discovery and account dashboards to `/plans` and `/subscriptions`.

## 🛡️ System Design Rules & Invariants Checklist
- [x] **Strict TypeScript Mandate (`RULE-CODE-001`)**: 100% typed subscription interfaces.
- [x] **Editorial Ergonomics (`RULE-UI-003`, `RULE-UI-004`)**: Zero trailing dots on plan titles, badges, and CTAs.
- [x] **Natural Vietnamese Copywriting (`RULE-UI-008`)**: Rich culinary descriptions of daily plant-based meal sets.

## 🧪 Verification & Test Results
- [x] Monorepo Typecheck: `npx turbo run type-check` (5/5 packages PASS)
- [x] Full build test: `pnpm --filter @chayfood/web build` passed cleanly
