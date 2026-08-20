# 🏛️ System Design & Project Rules Dispatcher

## Mandate for All AI Coding Agents:
Before designing, implementing, or modifying any code in this repository, you **MUST** consult:
1. **[SYSTEM_DESIGN.md](file:///c:/Users/MSI/Desktop/chayfood/SYSTEM_DESIGN.md)** - Master System Design Trigger Matrix & Rules Directory
2. **[AGENTS.md](file:///c:/Users/MSI/Desktop/chayfood/AGENTS.md)** - Core project coding guidelines & architectural invariants
3. **[initial_audit.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/audits/initial_audit.md)** - Comprehensive security & architecture audit findings

---

## 🧭 Quick Context Trigger Matrix:

| Implementation Context | Required Rule Files | Key Invariants |
| :--- | :--- | :--- |
| **UI, Styling & Layout** | [.system-design/rules/ui-and-design.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/ui-and-design.md) | Editorial aesthetics, Design tokens, No trailing dots in headings/buttons, Zero "mọi" & Zero "100%", Compact subpage headers (`py-5` to `py-7`) |
| **TypeScript & Architecture** | [.system-design/rules/code-standards.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/code-standards.md) | Strict TypeScript (Zero `any`/`unknown`), Modular files (<= 250-300 lines), DRY UI/State separation |
| **Data Writes & Transactions** | [.system-design/rules/data-consistency.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/data-consistency.md) | Atomic multi-write in `$transaction`, Zero network calls inside DB transactions, Non-negative balance check |
| **Balances & Concurrency** | [.system-design/rules/concurrency.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/concurrency.md) | Atomic `decrement` for resource deduction, Idempotent state transitions, In-flight double-submission protection |
| **Authentication & Sessions** | [.system-design/rules/authentication.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/authentication.md) | Mandatory secrets isolation (No hardcoded fallback), Token DB synchronization, Secure cookie attributes |
| **Authorization & Permissions**| [.system-design/rules/authorization.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/authorization.md) | Resource ownership verification on `:id` (BOLA/IDOR prevention), Default-deny admin guards on sensitive endpoints |
| **Security & Validation** | [.system-design/rules/security.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/security.md) | Zero passwords/tokens in logs, Server-authoritative financial calculation, DTO whitelisting |
| **Database & Schema** | [.system-design/rules/database.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/database.md) | Mandatory foreign key indexes, Unique constraints on junction tables, Safe pagination limits |
| **APIs & Data Contracts** | [.system-design/rules/api.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/api.md) | Single Source of Truth via `@chayfood/shared-types`, Zero fake success simulation, RESTful plural naming |
| **Integrations & Providers** | [.system-design/rules/integrations.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/integrations.md) | Pluggable Strategy & Factory pattern (`IPaymentProvider`, `IAuthProvider`, `INutritionEngine`), Webhook signature verification |
| **Caching & Invalidation** | [.system-design/rules/caching.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/caching.md) | Immediate cache invalidation on data mutation, Zero authorization caching in shared stores |
| **Async Jobs & Events** | [.system-design/rules/distributed-systems.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/distributed-systems.md) | Transactional Outbox pattern, Idempotent consumers with deduplication keys |
| **Domain Logic Testing** | [.system-design/rules/testing-and-cicd.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/testing-and-cicd.md) | Hermetic fast unit testing (<10s), Boundary value test coverage on calculation engines, Seed/Schema verification |
| **CI/CD Quality Gate** | [.system-design/rules/testing-and-cicd.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/testing-and-cicd.md) | 4-Stage Enterprise Pipeline (TypeCheck -> Tests -> DB Seed -> Build), Zero-tolerance failing PR policy |
| **Git, PR & Code Review** | [.system-design/rules/git-and-code-review.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/git-and-code-review.md) | Conventional branch naming (`feat/`, `fix/`), Atomic commits, PR Template checklist, Transparent review response |
| **Logging & Telemetry** | [.system-design/rules/observability.md](file:///c:/Users/MSI/Desktop/chayfood/.system-design/rules/observability.md) | Structured JSON logging with Request ID, Audit trail on privileged mutations, Type-narrowed error handling |

---

## ⚡ Mandatory Agent Execution Flow:
1. **Identify Context**: Match the user request against the Trigger Matrix above.
2. **Read Specific Rule File**: Open the corresponding `.system-design/rules/<rule-name>.md` before writing code.
3. **Apply Invariants**: Ensure all strict mandates (anti-any, no trailing dots, atomic stock, BOLA checks) are satisfied.
4. **Verify**: Run `pnpm type-check` to validate compile-time correctness.
