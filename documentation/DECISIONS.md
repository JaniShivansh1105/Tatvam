# Architecture Decision Records (ADRs)

> **Responsibility:** This document stores Architecture Decision Records (ADRs). It explains *WHY* technical choices were made.

---

## 📝 ADR-001: The Documentation-First Mandate

**Date:** 2026-07-24
**Status:** ✅ Accepted

### Context
Software projects frequently suffer from architectural drift, tech debt, and misaligned team objectives due to a rush to write code before the problem is fully understood.

### Decision
Tatvam adopts a strict "Documentation-First" policy. The `/documentation` folder acts as the sole source of truth. Implementation is strictly forbidden until the specification is fully documented, reviewed, and approved.

### Consequences
- **Positive:** Guarantees architectural integrity. Radically reduces rewrites. Onboarding new engineers is seamless.
- **Negative:** Initial velocity feels slower because code is not being immediately shipped.

---

## 📝 ADR-002: AI as a Socratic Mentor, Not an Oracle

**Date:** 2026-07-24
**Status:** ✅ Accepted

### Context
Large Language Models (LLMs) default to providing comprehensive, direct answers. In an educational context, this bypasses the student's cognitive struggle, actively harming the learning process.

### Decision
We will inject strict system prompts and intermediary reasoning layers that force the LLM to behave via the Socratic method. It must ask questions, guide logic, and refuse direct answers to complex problems.

### Consequences
- **Positive:** Forces genuine student comprehension. Differentiates the product from generic AI wrappers.
- **Negative:** Increases prompt engineering complexity. May frustrate students who are looking for quick, lazy answers.

> [!NOTE]
> To see how this decision impacts the user experience, refer to the flows in [06. User Flows](./06_User_Flows.md).
