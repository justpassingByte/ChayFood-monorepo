# 💬 Review Response Protocol & Template

> **Purpose**: Standardized engineering protocol for PR authors (Developers & AI Agents) to address code review comments transparently and constructively.

---

## 🧭 1. Mandatory Response Principles

1. **100% Explicit Response (No Silent Dismissals)**:
   - Every reviewer comment must have an explicit written response before resolving the conversation or requesting re-review.
2. **Concrete Proof & References**:
   - Always reference the commit SHA (`Fixed in commit abc1234`) or provide the specific code diff showing the fix.
3. **Reference Invariants & Rules**:
   - Ground technical discussions in established System Design Rules (`.system-design/rules/`) rather than subjective preferences.

---

## 📋 2. Standardized Response Templates

### Case 1: Accepted and Fixed According to Feedback
```markdown
> **Resolution**: Updated according to your suggestion in commit [`<commit-sha>`](<commit-link>).  
> **Technical Detail**: Applied rule `<RULE-ID>` using atomic operations instead of in-memory calculation.
```

### Case 2: Intentional Architectural Decision (Clarification)
```markdown
> **Clarification**: Thank you for the comment. We kept the current approach to satisfy rule `<RULE-ID>` (e.g. keeping external I/O outside database transactions to prevent connection pool starvation).  
> **Alternative Implemented**: The asynchronous side-effect was extracted outside the transaction via the Outbox pattern in commit [`<commit-sha>`](<commit-link>).
```

### Case 3: Valid Feedback Deferred to Dedicated Task (Tech Debt / Optimization)
```markdown
> **Action Item**: This optimization feedback is valid but falls outside the scope of the current PR.  
> **Tracking**: Created Issue `#<issue-number>` to track and prioritize in the next cycle.
```

### Case 4: Clarification Request on Edge Cases
```markdown
> **Question**: This function currently guards against boundary condition `X`. Could you clarify the specific edge case `Y` you're concerned about so we can add a corresponding unit test?
```
