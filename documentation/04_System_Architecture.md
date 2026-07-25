# 04. System Architecture

> **Responsibility:** This document defines the engineering foundation, infrastructural architecture, and structural strategies for Tatvam. For coding conventions and rules, refer to [07. Development Rules](./07_Development_Rules.md).

---

## 1. Repository Architecture

**Purpose:** To establish an unbreachable boundary between client and server execution environments.
**Responsibilities:** Complete isolation of frontend and backend environments. Independent build and deployment pipelines.
**Future Expansion:** Migration to an explicit Monorepo orchestrator (e.g., Turborepo) if secondary services are added.

### Rules & Conventions
- 🚫 Frontend and Backend MUST remain completely separated.
- 🚫 Never mix frontend files inside backend.
- 🚫 Never mix backend files inside frontend.

### Directory Tree
```text
Tatvam/
├── documentation/   # The single source of truth
├── frontend/        # Web application (Client & SSR)
├── backend/         # Core API & AI Orchestration
├── README.md        # Project Entry
├── LICENSE          # Legal
└── .gitignore       # Source control exclusions
```

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Treat `frontend` and `backend` as entirely distinct products that merely communicate over HTTP. |
| **Notes** | Shared concepts should be documented, not merged into shared code folders. |

> [!WARNING]
> Do not create a global `shared/` folder at the root.

---

## 2. Frontend Folder Architecture

**Purpose:** To organize the client application using a strictly feature-based module approach.
**Responsibilities:** Managing user interface, local state, and API consumption modularly.
**Future Expansion:** Extracted UI component libraries (NPM packages) for mobile app reuse.

### Rules & Conventions
- Modules within `features/` must be entirely self-contained (UI, state, API hooks).
- `components/` is strictly for domain-agnostic, dumb UI elements (buttons, inputs).

### Directory Tree
```text
frontend/
├── src/
│   ├── app/         # Routing layer
│   ├── features/    # Isolated business domains (StudySpace, Auth)
│   ├── components/  # Global UI elements
│   ├── lib/         # Global utilities
│   └── types/       # Global ambient definitions
```

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | A feature should be easily deletable. Removing `features/StudySpace` should not break `features/Auth`. |
| **Notes** | Keep the `app/` routing layer thin. It should only import from `features/`. |

> [!WARNING]
> Avoid deeply nested folders. Flatten structures within `features/` to a maximum depth of 3.

---

## 3. Backend Folder Architecture

**Purpose:** To build a resilient, API-first server infrastructure that cleanly separates routing, business logic, and data.
**Responsibilities:** Routing HTTP requests, orchestrating AI, executing business logic, and database interactions.
**Future Expansion:** Splitting `core/` into microservices if CPU bottlenecks occur around AI generation.

### Rules & Conventions
- Controllers must never write SQL or direct DB calls. They only call the `core/` layer.
- The `data/` layer is the only place allowed to import database drivers.

### Directory Tree
```text
backend/
├── src/
│   ├── api/         # Routes, Controllers, Middleware
│   ├── core/        # Domain logic, AI orchestration
│   ├── data/        # Repositories, DB Models
│   ├── config/      # Environment variables
│   └── utils/       # Shared server helpers
```

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Dependency injection should be used to pass `data` repositories into `core` services. |
| **Notes** | Maintain strict one-way data flow: `API` ──▶ `Core` ──▶ `Data`. |

> [!WARNING]
> Never leak database models (e.g., ORM objects) up into the API response layer. Always map to standard DTOs.

---

## 4. Folder Responsibility Matrix

**Purpose:** To prevent architectural drift by explicitly defining what goes where.
**Responsibilities:** Maintaining the separation of concerns across the codebase.
**Future Expansion:** Adding an `infra/` layer for Infrastructure as Code (Terraform).

### Rules & Conventions
- Layers may only import from themselves or layers below them.
- Circular dependencies are strictly forbidden and must fail the build.

### Responsibility Chart

| Layer | Responsibility | Allowed to Import |
| :--- | :--- | :--- |
| **API (BE)** | HTTP requests, validation, responses | Core, Config, Utils |
| **Core (BE)** | Business logic, AI orchestration | Data, Utils, Config |
| **Data (BE)** | DB interactions, external APIs | Config, Utils |
| **App (FE)** | Next.js Routing, Page composition | Features, Components, Lib |
| **Features (FE)**| Domain-specific UI and state | Components, Lib |

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Enforce these rules using ESLint dependency boundary plugins. |
| **Notes** | Utils should be pure functions with zero external dependencies. |

> [!WARNING]
> If a developer is confused about where a file goes, the architecture is failing.

---

## 9. Service Layer Design

**Purpose:** To isolate complex business logic away from controllers and UI components.
**Responsibilities:** Executing the core rules of Tatvam (e.g., Socratic chat validation).
**Future Expansion:** Event-driven architecture using message queues.

### Rules & Conventions
- A Service must have a single responsibility.
- Services must be completely stateless.

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Write unit tests exclusively against the Service layer. |
| **Notes** | A service should never return an HTTP status code. It returns data or throws an Error. |

> [!WARNING]
> Do not create "God Services" (e.g., `UserService` that handles auth, profile, and billing). Split them.

---

## 11. Environment Strategy

**Purpose:** To manage configurations securely across environments.

### Environments
- **Development:** Local `.env`. Connects to local Docker Postgres/Redis.
- **Testing:** Ephemeral CI/CD environments. Mocks AI endpoints.
- **Production:** Vercel/AWS environment variables. Strict access control.

### Variable Categories
- **Secrets:** `DATABASE_URL`, `JWT_SECRET`, `SESSION_SECRET`.
- **AI Keys:** `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`.
- **Storage:** `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`.
- **Email:** `RESEND_API_KEY`.
- **Logging:** `DATADOG_API_KEY`.
- **Analytics:** `POSTHOG_CLIENT_KEY`.

---

## 13. Caching Strategy

**Purpose:** To minimize latency and protect AI models from redundant computations.
**Responsibilities:** Storing ephemeral data and rate-limiting payloads.
**Future Expansion:** Edge caching for AI responses based on semantic similarity.

### Rules & Conventions
- **Never cache** private student sessions or Socratic dialogue.
- Heavily cache static subject curriculums and structural metadata.

### Architecture Flow
```text
[ Client ] ──▶ [ Edge Cache ] ──▶ [ Redis Cache ] ──▶ [ DB / AI ]
```

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Always assign a strict TTL (Time To Live) to every cache key. |
| **Notes** | Cache invalidation must be handled by the Core layer, not the API layer. |

> [!WARNING]
> Stale data in education is dangerous. When in doubt, bypass the cache.

---

## 14. Authentication Contracts

**Purpose:** To statelessly and securely verify a student's identity.
**Responsibilities:** Issuing and verifying tokens, managing sessions.

### Lifecycle Contracts
- **Login Lifecycle:** User submits Email/Password ──▶ Backend hashes via Argon2id ──▶ Validates ──▶ Issues HTTP-Only Cookie (Refresh Token) + JSON body (Access Token).
- **Token Lifecycle:** Access Token lives for 15 minutes. Contains `userId`, `role`.
- **Refresh Strategy:** Frontend intercepts 401 Unauthorized ──▶ Calls `/auth/refresh` ──▶ Retries original request.
- **Session Lifecycle:** Managed via Redis mapping `refreshTokenId` ──▶ `userId`. Allows global sign-out.
- **Logout:** Clears client state ──▶ Calls backend to blacklist `refreshTokenId` ──▶ Clears HTTP-Only cookie.
- **Password Recovery:** Magic link emailed (valid for 15 minutes).
- **Future Expansion:** OAuth2 (Google, GitHub) mapping provider emails to existing User IDs.

---

## 15. Authorization Matrix

**Purpose:** To guarantee users can only access their own learning data.
**Responsibilities:** Enforcing permission boundaries on every single request.

### Role-Based Access Control

| Role | Permissions |
| :--- | :--- |
| **Guest** | `READ` Demo Subject. `CREATE` Sandbox Chat (Rate Limited). |
| **Student** | `READ/WRITE` own Profile, own Sessions, own Knowledge Graph. `READ` all Subjects. |
| **Admin** | `READ/WRITE` all Subjects. `READ` aggregated telemetry. `DELETE` abusive accounts. |
| **Future Teacher** | `READ` aggregated cohort metrics. `WRITE` cohort goals. |
| **Future Institution**| `WRITE` Teacher provisioning. `READ` institutional billing. |

---

## 16. AI Communication Architecture

**Purpose:** To orchestrate LLM calls with minimal latency and maximum context.
**Responsibilities:** Managing system prompts, vector retrieval, and token streaming.
**Future Expansion:** Local offline LLM execution for absolute privacy.

### Rules & Conventions
- Streaming is mandatory. The UI must render tokens as they arrive.
- Time-To-First-Token (TTFT) must remain under 500ms.

### Architecture Flow
```text
[ Controller ] ──▶ [ AI Orchestrator ]
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
[ Vector DB (Context) ]      [ Output Guardrails ]
            │                           │
            └─────────────┬─────────────┘
                          ▼
                   [ LLM Provider ]
```

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Isolate LLM provider logic behind an interface so swapping OpenAI for Anthropic takes 5 minutes. |
| **Notes** | Log all latency metrics for AI generations. |

> [!WARNING]
> Never pass raw, unsanitized user input directly into an execution context without guardrails.

---

## 17. API Communication Flow

**Purpose:** To standardize how the Frontend and Backend communicate.
**Responsibilities:** Enforcing strict contracts and predictable responses.
**Future Expansion:** GraphQL or gRPC integration for high-performance mobile clients.

### Rules & Conventions
- All requests must return a standard envelope format.
- HTTP status codes must be used semantically (200, 400, 401, 403, 404, 500).

### Standard Envelope
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { "latency": "42ms" }
}
```

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Generate frontend TypeScript clients automatically from the backend OpenAPI spec. |
| **Notes** | Provide correlation IDs in headers for request tracing. |

> [!WARNING]
> Never return raw backend stack traces in the `error` field to the frontend.

---

## 18. Database Architecture

**Purpose:** To persist student knowledge graphs and session histories durably.
**Responsibilities:** Schema definition, data integrity, and fast querying.
**Future Expansion:** Graph databases (Neo4j) for advanced conceptual mapping.

### Core Domain Entities
- **Learner:** (`id`, `email`, `created_at`). 1:1 with Profile.
- **KnowledgeGraph:** Relational map of `Learner` ──▶ `Concept` ──▶ `MasteryScore`.
- **StudySession:** Bounded context for interactions.
- **Conversation:** The Socratic dialogue records.

### Strategy & Conventions
- **Naming Conventions:** `snake_case` for tables and columns (e.g., `study_sessions`, `mastery_score`).
- **Primary Keys:** UUIDv7 (time-ordered, highly scalable).
- **Foreign Keys:** Strict constraints enabled. Cascading deletes are FORBIDDEN on critical data.
- **Audit Strategy:** Every entity gets `created_at`, `updated_at`. Critical entities get an `audit_log` table.
- **Soft Delete:** `deleted_at TIMESTAMP`. Physical DELETE is prohibited.
- **Indexing Strategy:** B-Tree indexes on all Foreign Keys. Composite indexes on `(learner_id, concept_id)`.
- **Versioning:** Concepts are versioned. If a `Concept` text changes, it creates `v2`, preserving `v1` for historical student logs.

---

## 24. Deployment Strategy

**Purpose:** To ensure highly available, zero-downtime rollouts.
**Responsibilities:** CI/CD orchestration and environment parity.
**Future Expansion:** Multi-region active-active deployments.

### Rules & Conventions
- Main branch is always deployable.
- Database migrations must run and succeed *before* the new application instance boots.

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Use immutable container images. The exact image tested in staging goes to production. |
| **Notes** | Use Vercel for Frontend and scalable container services (AWS ECS/Render) for Backend. |

> [!WARNING]
> Never deploy to production without passing the automated E2E test suite.

---

## 25. Future Scalability Plan

**Purpose:** To anticipate the architectural shifts required to serve 1,000,000 students.
**Responsibilities:** Identifying bottlenecks before they affect users.
**Future Expansion:** Fully decentralized edge AI inference.

### Rules & Conventions
- Architecture must be horizontally scalable by default. Avoid stateful server memory.
- Design database schemas to allow for easy sharding by `student_id`.

### Technical Notes
| Category | Details |
| :--- | :--- |
| **Best Practices** | Implement database Read Replicas early to handle heavy Knowledge Graph queries. |
| **Notes** | Keep the AI orchestrator stateless so it can scale infinitely based on CPU demand. |

> [!WARNING]
> Premature optimization is the root of all evil. Build for the current scale, but design so the next scale is possible.

---

## 🧠 Product Intelligence: Context & Memory Architecture

### 5. AI Context Engine

Before a single token is sent to the LLM, the Context Engine must dynamically assemble the student's reality. An AI request without context is just a search engine.

**Context Assembly Pipeline:**
1. **The Goal:** What is the student trying to achieve right now?
2. **The DNA:** Fetch `Student Learning DNA` (e.g., prefers analogies, easily frustrated).
3. **The State:** Fetch the `Knowledge Model` status for the current concept (e.g., failed assessment twice).
4. **The Session:** Inject the last 10 messages of the current conversational loop.
5. **The Bounds:** Enforce time limits and required output depth.

```text
[ DNA ] + [ Concept Mastery ] + [ Current Session ] ──▶ [ Context Engine ] ──▶ [ Prompt ]
```

### 6. AI Memory Framework

To mimic a long-term human tutor, Tatvam's memory is segmented into strict temporal zones.

| Category | Lifespan | Purpose |
| :--- | :--- | :--- |
| **Permanent Memory** | Infinite | The student's core DNA, mastered concepts, and major learning milestones. |
| **Long-Term Memory** | Semesters | Struggles with specific subjects, recurring grammatical errors, overarching goals. |
| **Session Memory** | Hours | The current study flow, active conversation context, immediate frustrations. |
| **Temporary Memory** | Minutes | Scratchpad calculations, intermediate logic steps generated during a single response. |

> [!WARNING]
> Do not load Permanent Memory into the active LLM context window indiscriminately. Only retrieve via vector similarity related to the current `Session Memory`.

---

## 26. Backend Request Lifecycle

**Purpose:** To map the exact path of data through the server.
**Responsibilities:** Enforcing architectural boundaries.

### The Pipeline
```text
[ Request ] ──▶ (HTTP POST /api/v1/sessions)
      │
      ▼
[ Middleware ] ──▶ (Rate Limiting, Request ID injection, CORS)
      │
      ▼
[ Authentication ] ──▶ (JWT verification, Attach user to request)
      │
      ▼
[ Validation ] ──▶ (Zod Schema strict validation. Fails ──▶ 400)
      │
      ▼
[ Controller ] ──▶ (Extracts typed data, calls Service)
      │
      ▼
[ Authorization ] ──▶ (Service checks if User owns the Session)
      │
      ▼
[ Service ] ──▶ (Executes core business logic)
      │
      ▼
[ Repository ] ──▶ (Generates SQL via ORM)
      │
      ▼
[ Database ] ──▶ (PostgreSQL execution)
      │
      ▼
[ Response ] ──▶ (Maps to standard JSON Envelope, HTTP 200)
```

---

## 27. AI Request Lifecycle

**Purpose:** To map the execution pipeline of the Socratic Mentor.

### The Pipeline
```text
[ Student Input ] ──▶ "I don't understand binary search."
        │
        ▼
[ Context Engine ] ──▶ Fetches Student DNA, Active Concept, Session History.
        │
        ▼
[ Prompt Builder ] ──▶ Injects context into the Master System Prompt.
        │
        ▼
[ Safety Layer ] ──▶ Checks prompt for jailbreaks or PII injection.
        │
        ▼
[ LLM Execution ] ──▶ Streams tokens (Target TTFT < 500ms).
        │
        ▼
[ Post-Processing ] ──▶ KaTeX math formatting, Markdown sanitization.
        │
        ▼
[ Memory Update ] ──▶ Asynchronously writes summary to Vector DB / Postgres.
        │
        ▼
[ Analytics ] ──▶ Logs token usage, latency, and sentiment.
        │
        ▼
[ Frontend ] ──▶ Renders stream to UI.
```

---

## 28. Logging & Monitoring

**Purpose:** Absolute system observability.

### Log Categories
- **Application Logs:** Request/Response tracing, unhandled exceptions.
- **Audit Logs:** Auth events (login, password change, account deletion). Stored permanently.
- **Security Logs:** Failed login spikes, rate limit triggers. Alerts via PagerDuty.
- **AI Logs:** Token count per session, TTFT latency, Hallucination flags.

### Metrics & Tracing
- **Health Checks:** `/api/health` endpoint validates DB and Redis connection states.
- **Performance Metrics:** Apdex score, P99 API latency.
- **Tracing:** W3C Trace Context headers injected into every request to trace frontend clicks directly to backend SQL queries.
