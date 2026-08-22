## 📌 Context & Problem Statement
<!-- Concise summary of the problem, background context, user story, or feature goal -->

## 🛠️ Proposed Changes & Architecture
<!-- Summary of technical changes categorized by package, module, or layer -->
- `<package-or-module-1>`: 
- `<package-or-module-2>`: 
- `<package-or-module-3>`: 

## 🛡️ System Design Rules & Invariants Checklist
<!-- Mandatory self-check against Universal System Design Rules before requesting review -->
- [ ] **Strict Type Safety (`RULE-CODE-001`)**: Zero `any`/`unknown`, strict compile-time types, type-narrowed error handling
- [ ] **Resource Ownership & Access Control (`RULE-AUTHZ-001`, `RULE-AUTHZ-002`)**: BOLA/IDOR protection on all ID routes, default-deny on internal/privileged routes
- [ ] **Concurrency & Balance Invariants (`RULE-CONC-001`, `RULE-DATA-001`)**: Atomic balance/inventory deduction (`decrement` / row lock), short-lived transactions, zero network I/O inside DB transactions
- [ ] **Zero-Trust Client Computation (`RULE-SEC-002`)**: Server-authoritative computation for all financial amounts, prices, and critical states
- [ ] **Data Redaction & Secret Hygiene (`RULE-SEC-001`)**: Credentials, tokens, and PII masked before logging
- [ ] **Hermetic Testing & Quality Gate (`RULE-TEST-001`, `RULE-TEST-002`)**: Unit/Spec tests added for domain business engines (<10s runtime)
- [ ] **UI & Editorial Ergonomics (`RULE-UI-003`, `RULE-UI-004`)**: No trailing dots on headings/buttons/badges, neutral and active copywriting

## 🧪 Verification & Test Results
<!-- Confirm local validation commands succeeded with 0 errors -->
- [ ] Type check command passed (0 errors across workspace)
- [ ] Automated test suite passed
- [ ] Production build succeeded

## 📸 Visual Demonstration / Screenshots (If applicable)
<!-- Attach before/after screenshots or short GIF/video demonstrating behavior -->
