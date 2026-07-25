# 07. Development Rules

> **Responsibility:** This document explains *HOW* developers build Tatvam. It outlines our engineering philosophy, coding standards, and codebase strategies. For the structural architecture, see [04. System Architecture](./04_System_Architecture.md).

---

## 5. Naming Conventions

**Purpose:** To ensure the codebase reads like a well-written book.
**Responsibilities:** Standardizing variables, files, and functions across the team.
**Future Expansion:** Automated PR linting to enforce naming rules.

### Rules & Conventions
- **Files/Folders (React):** PascalCase for components (`StudySpace.tsx`), camelCase for hooks (`useMentor.ts`).
- **Files/Folders (Backend):** kebab-case (`knowledge-graph.service.ts`).
- **Variables/Functions:** camelCase. Be excessively descriptive. `studentMasteryLevel` > `sml`.
- **Constants:** UPPER_SNAKE_CASE.
- **Interfaces/Types:** PascalCase. Do not prefix with `I` (use `Student`, not `IStudent`).

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Boolean variables should answer a question (`isMastered`, `hasCompleted`). |
| **Notes** | Naming is the hardest part of software. Take your time. |

> [!WARNING]
> Never use generic names like `data`, `info`, or `handler`. Specify *what* data.

---

## 6. Import Conventions

**Purpose:** To keep file headers clean and avoid circular dependency hell.
**Responsibilities:** Organizing how code is shared.
**Future Expansion:** Strict barrel-file (`index.ts`) auto-generation.

### Rules & Conventions
- Use absolute path aliases (`@/features`, `@/components`).
- 🚫 Never use deep relative paths (`../../../../components/Button`).

### Import Order
1. External libraries (e.g., `react`, `express`)
2. Internal absolute imports (`@/core/...`)
3. Relative imports (`./types`)

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Configure ESLint `simple-import-sort` to automate this entirely. |
| **Notes** | Group types/interfaces at the bottom of the import block. |

> [!WARNING]
> Do not over-use barrel files (`index.ts`). They can severely impact bundle sizes and cause circular loops.

---

## 7. Component Organization

**Purpose:** To ensure UI elements are easily discoverable and highly reusable.
**Responsibilities:** Structuring React components logically.
**Future Expansion:** Migration to a strict Monorepo design system package.

### Rules & Conventions
- Components must be pure functions where possible.
- Separation of UI and Logic: Complex logic goes into a custom hook, not the component body.

### Directory Tree (Component Level)
```text
components/
└── Button/
    ├── Button.tsx
    ├── Button.styles.css
    ├── Button.test.tsx
    └── index.ts
```

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Destructure props in the function signature for immediate readability. |
| **Notes** | Components should have zero knowledge of the backend or database. |

> [!WARNING]
> If a component file exceeds 200 lines, it is doing too much. Break it down.

---

## 8. Feature Organization

**Purpose:** To group code by business domain rather than technical type.
**Responsibilities:** Keeping related code together (Cohesion).
**Future Expansion:** Micro-frontends based on feature boundaries.

### Rules & Conventions
- A feature folder must contain everything it needs to function (except global UI components).

### Directory Tree (Feature Level)
```text
features/SocraticMentor/
├── api/         # API fetch calls
├── components/  # Feature-specific UI
├── hooks/       # Feature-specific logic
├── store/       # Local state management
└── index.ts     # Public API of the feature
```

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Outside of a feature, you may only import from its `index.ts` file. |
| **Notes** | This structure allows teams to work on a feature without touching the rest of the app. |

> [!WARNING]
> Do not cross-import deeply into another feature's internal folders.

---

## 10. Configuration Strategy

**Purpose:** To separate code from configuration data.
**Responsibilities:** Managing magic strings, constants, and feature flags.
**Future Expansion:** Remote configuration fetching (LaunchDarkly).

### Rules & Conventions
- Magic numbers and strings must live in a central `config/` file.
- App-wide constants should be typed literally.

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Use TypeScript `as const` for strict type inference on config objects. |
| **Notes** | Keep configs easily editable for non-technical product managers. |

> [!WARNING]
> Do not mix environment variables (secrets) with application configuration (constants).

---

## 12. Frontend State Architecture

**Purpose:** To prevent state-sync bugs and reduce UI re-renders.
**Responsibilities:** Managing server state vs client state across the application.
**Future Expansion:** Full local-first sync engines (e.g., ElectricSQL).

### Architectural Layers
- **Global State:** Strictly for UI configuration (Theme, Language, Sidebar toggle). Managed by Zustand.
- **Server State:** Handled exclusively by data-fetching libraries (React Query). Caches API responses.
- **Local State:** Component-level ephemeral UI state (Input values, dropdown toggles). Managed by `useState`.

### Synchronization Rules
- **Optimistic Updates:** Immediate UI mutation on mutation trigger, rollback on API failure. Mandatory for Socratic Chat interactions.
- **Invalidation:** Queries must be invalidated hierarchically (e.g., completing an assessment invalidates the `Concept` and the `Progress` queries).
- **Offline Handling:** Core static curriculum is cached locally. Socratic Chat disables input gracefully when `navigator.onLine === false`.
- **Caching:** Stale-Time defaults to 5 minutes for structural data, 0 minutes for session data.

> [!WARNING]
> Do not use Redux. The boilerplate heavily outweighs the benefits for our architecture.

---

## 19. Logging Strategy

**Purpose:** To guarantee total observability of the application in production.
**Responsibilities:** Tracking errors, AI token usage, and user actions securely.
**Future Expansion:** Centralized observability pipelines (Datadog/ELK).

### Rules & Conventions
- 🚫 Never log PII (Personally Identifiable Information).
- Use structured JSON logging in the backend.

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Attach a `requestId` to every log entry to trace a user's flow through the system. |
| **Notes** | Logs should include context: timestamp, severity, and module. |

> [!WARNING]
> Never log passwords, tokens, or raw Socratic dialogue.

---

## 20. Error Contract

**Purpose:** To ensure failures are handled gracefully without inducing panic in the student.
**Responsibilities:** Catching exceptions and mapping them to standard contracts.
**Future Expansion:** Automated AI-driven bug triage.

### Error Categories
- **Operational:** Network timeouts, Rate limits, Invalid Input.
- **Systemic:** Database failure, LLM Provider outage.

### Standard Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You're asking questions a bit too fast. Let's pause and reflect.",
    "developer_message": "Redis rate limit hit on endpoint /api/ai/chat. Max 50 req/min.",
    "retryable": true,
    "retry_after_ms": 15000
  }
}
```

### UX Strategy
- **User-Friendly Messaging:** Never expose technical jargon to the student. Translate "HTTP 429" to "Let's take a quick breath."
- **Retry Strategy:** Automatic exponential backoff for network-level failures. Max 3 retries.

---

## 21. Validation Strategy

**Purpose:** To protect the system from malformed or malicious data.
**Responsibilities:** Validating inputs at the absolute edge of the system.
**Future Expansion:** Deep semantic validation using smaller, local AI models.

### Rules & Conventions
- All incoming HTTP data must be validated against a strict schema (e.g., Zod).
- Validation must happen on the frontend (for UX) AND the backend (for security).

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Share the Zod schemas between frontend and backend to guarantee parity. |
| **Notes** | Validation errors should return a 400 status with an array of specific field errors. |

> [!WARNING]
> Never trust frontend validation for security. It is purely for UX.

---

## 22. Security Strategy

**Purpose:** To ensure Tatvam is an impenetrable, safe environment for students.
**Responsibilities:** Mitigating OWASP Top 10 vulnerabilities.
**Future Expansion:** Annual independent penetration testing.

### Rules & Conventions
- Strict Content Security Policy (CSP).
- Prepared SQL statements (or strictly typed ORMs) to prevent SQL Injection.
- Rate limiting on all API endpoints.

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Sanitize all user-generated content before rendering to prevent XSS. |
| **Notes** | Keep dependencies updated automatically using Dependabot. |

> [!WARNING]
> Security is not a feature; it is the foundation. A single data breach destroys trust forever.

---

## 23. Testing Strategy

**Purpose:** To ensure the student's learning journey is never interrupted by regression bugs.
**Responsibilities:** Automating confidence in the codebase.
**Future Expansion:** Chaos engineering to test resilience.

### Rules & Conventions
- 100% test coverage is a vanity metric. Aim for 80% coverage on *critical business logic*.
- **Unit Tests:** For services and utilities.
- **E2E Tests:** For core user flows (Login, Study Session, AI Query).

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Test behavior, not implementation details. |
| **Notes** | If a bug reaches production, a test must be written to replicate it before it is fixed. |

> [!WARNING]
> Mocking the database is fine for unit tests, but integration tests must run against a real database instance.

---

## 24. API Contract Standards

**Purpose:** To establish a bulletproof contract between Frontend and Backend engineers.
**Responsibilities:** Defining REST conventions.

### Conventions
- **Endpoint Naming:** `kebab-case`, plural nouns (e.g., `/api/v1/study-sessions`).
- **Versioning:** URL path versioning (`/v1/`).
- **HTTP Methods:** GET (Read), POST (Create/Action), PATCH (Partial Update), DELETE (Remove).

### Standard Envelope
**Request Format:** `application/json`.
**Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "pagination": { "page": 1, "limit": 20, "total": 150 },
    "latency": "42ms"
  }
}
```

### Operations
- **Pagination:** Offset-based for UI tables (`?page=1&limit=20`). Cursor-based for chat streams (`?cursor=xyz`).
- **Filtering:** Bracket syntax (`?filter[status]=active`).
- **Sorting:** Comma-separated prefix (`?sort=-created_at,name`).

### Status Codes
- `200 OK`, `201 Created`
- `400 Bad Request` (Validation error)
- `401 Unauthorized` (Invalid token)
- `403 Forbidden` (Wrong user)
- `404 Not Found`
- `429 Too Many Requests`
- `500 Internal Server Error`

### Validation Format
A `400 Bad Request` must return:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid input provided.",
    "fields": [
      { "field": "email", "message": "Must be a valid university email address." }
    ]
  }
}
```
