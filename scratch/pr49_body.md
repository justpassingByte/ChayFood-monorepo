## 📌 Context & Problem Statement
Implements the backend checkout order pipeline with server-authoritative pricing, Zod validation pipe, centralized HTTP status logger, and exception formatting.

## 🛠️ Proposed Changes & Architecture
- `apps/api/src/common/pipes/zod-validation.pipe.ts`: Generic `ZodValidationPipe` parsing input DTOs and throwing structured `BadRequestException` with detailed field-level `issues`.
- `apps/api/src/common/filters/http-exception.filter.ts`: Centralized exception filter returning structured JSON (`statusCode`, `error`, `message`, `issues`, `timestamp`, `path`, `method`) and warning logs.
- `apps/api/src/common/logger/http-logger.middleware.ts`: Real-time color-coded HTTP access logger (`[HTTP] METHOD /path STATUS - TIMEms (BYTES) [IP]`).
- `apps/api/src/orders/orders.controller.ts`: Secured with `@UseGuards(JwtAuthGuard)` and `@Body(new ZodValidationPipe(CreateOrderSchema))`.
- `apps/api/src/orders/orders.service.ts`: Server-authoritative price calculation from database `menuItem.price`, order number generator, and relation mapping.
- `apps/api/src/prisma/prisma.service.ts`: Disabled noisy `query` logs unless `DEBUG_PRISMA=true`.

## 🛡️ System Design Rules & Invariants Checklist
- [x] **Zero-Trust Client Computation (`RULE-SEC-002`)**: Client prices ignored, 100% server calculated from DB
- [x] **Strict Type Safety (`RULE-CODE-001`)**: Typed request params and DTOs
- [x] **Resource Ownership & Access Control (`RULE-AUTHZ-001`)**: Orders bound strictly to authenticated user ID
- [x] **Observability & Logging (`RULE-OBS-001`)**: Clean HTTP access log with status codes and latency

## 🧪 Verification & Test Results
- [x] Type check passed (`pnpm --filter @chayfood/api type-check`)
- [x] Production build succeeded (`pnpm --filter @chayfood/api build`)
- [x] End-to-End API test passed (`POST /api/orders` returned 400 with Vietnamese issues for invalid payload, 201 for valid order)
