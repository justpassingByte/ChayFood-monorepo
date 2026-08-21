## 📌 Context & Problem Statement
Implements the comprehensive User Profile & Account Management backend module, password security with bcrypt, and fixes frontend role-based access control (RBAC) case-sensitivity.

## 🛠️ Proposed Changes & Architecture

### 1. Backend User Module (`apps/api/src/user/`)
- `user.controller.ts` & `user.service.ts`:
  - `GET /api/user/profile/full`: Fetches full user data including delivery address, family members, and preferences.
  - `GET /api/user/profile` & `PUT /api/user/profile`: Profile management (name, phone, avatar).
  - `GET /api/user/addresses` & `POST /api/user/addresses`: Multi-address book management.
  - `PUT /api/user/preference`: Dietary restrictions and macro preferences.
  - `PUT /api/user/password`: Secure password change verifying existing bcrypt hash.
- `user.module.ts`: Registered in `app.module.ts`.
- `user.service.spec.ts`: Unit tests verifying profile retrieval, address management, and password validation.

### 2. Frontend Role-Based Access Control Alignment (`apps/web`)
- `apps/web/app/context/AuthContext.tsx`, `apps/web/middleware.ts`, `apps/web/app/components/MobileNav.tsx`:
  - Normalized role comparison to `user?.role?.toUpperCase() === 'ADMIN'`, preventing case mismatch issues between PostgreSQL `Role.ADMIN` enum and client checks.
  - Streamlined Admin portal redirection and token persistence in Cookies and LocalStorage.

## 🛡️ System Design Rules & Invariants Checklist
- [x] **Strict TypeScript Mandate (`RULE-CODE-001`)**: 100% typed DTOs and return schemas.
- [x] **Single Source of Truth (`RULE-CODE-002`)**: User preferences and profile aligned with `@chayfood/db`.
- [x] **Security & Password Hashing (`RULE-SEC-001`)**: Bcrypt 10 salt rounds with current password verification.

## 🧪 Verification & Test Results
- [x] Monorepo Typecheck: `npx turbo run type-check` (5/5 packages PASS)
- [x] User Service Unit Tests: `PASS src/user/user.service.spec.ts` (37/37 total tests PASS)
