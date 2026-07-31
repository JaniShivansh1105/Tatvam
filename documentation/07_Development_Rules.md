# Development Rules

**Document Purpose:** To define the engineering standards, conventions, and architectural rules for contributing to the Tatvam codebase.
**Scope:** TypeScript, Next.js, Express, Validation, Git workflow.
**Audience:** All Software Engineers.
**Revision Information:** v2.0 - Finalized Enterprise Standards

---

## 1. General Philosophy

- **Explicit over Implicit:** Avoid magic. If a function mutates state, its name should reflect that.
- **Type Safety is Mandatory:** `any` is strictly prohibited unless interacting with legacy, un-typed third-party APIs.
- **Fail Fast:** Validate inputs at the outermost edge of the system (API route layers) before hitting business logic.

---

## 2. TypeScript Rules

- **Interfaces over Types:** Use `interface` for object definitions to take advantage of declaration merging, unless a union type is specifically required.
- **Strict Mode:** `tsconfig.json` MUST have `"strict": true`.
- **Enums:** Avoid TypeScript `enum`. Use string literal unions (`type Status = "ACTIVE" | "INACTIVE"`) to prevent runtime bloat and reverse-mapping issues.

---

## 3. Frontend Rules (Next.js & React)

- **Client vs Server Components:** Default to `"use client"` for all interactive dashboard components. Use Server Components exclusively for static landing pages or initial layout shells to minimize client bundle size.
- **State Management:**
  - **Local UI State:** `useState` or `useReducer`.
  - **Global App State:** `Zustand` (e.g., `useAuthStore`).
  - **Server State / API Data:** `React Query` (`@tanstack/react-query`). Never store API responses in Zustand.
- **Styling:** Tailwind CSS exclusively. No external CSS files except `globals.css` for base layer overrides.
- **Imports:** Use absolute path aliases (`@/components/`, `@/lib/`).

---

## 4. Backend Rules (Node.js & Express)

- **Architecture:** Controller -> Service -> Repository (Prisma).
  - **Controllers** handle HTTP requests, headers, and responses.
  - **Services** handle business logic and throw custom error classes.
  - **Prisma** handles database operations.
- **Validation:** All incoming requests MUST be validated by a Zod middleware in the router before reaching the controller.
- **Error Handling:** 
  - Never use `try/catch` inside controllers unless doing highly specific rollback operations. Use `express-async-errors` or a custom async wrapper to forward errors to the global error handler.
  - Custom error classes (`NotFoundError`, `UnauthorizedError`) must be used to dictate HTTP status codes.

---

## 5. AI Engineering Rules

- **Orchestration Layer:** Do not import `gemini` or `openai` directly into content services. All AI requests must go through the `AIService` which utilizes the generic `ProviderManager`.
- **System Prompting:** User input must *never* be placed inside the System Prompt. It must only exist in the `User` message role to prevent prompt injection vulnerabilities.
- **Factual Grounding:** All RAG implementations must include strict instructions: `"If the context does not contain the answer, reply that you do not know. Do not hallucinate."`

---

## 6. Security Rules

- **JWT Handling:** Do not decode JWTs on the client to trust roles. Only the backend validation of the signature is trusted.
- **Tenant Isolation:** Every Prisma query involving user data MUST include `where: { userId: currentUserId }`.
- **Secrets:** No API keys or secrets in the frontend codebase. Everything must be proxied through the Express backend.

---

## 7. Git Workflow & Commit Conventions

We follow the **Conventional Commits** specification.

**Format:**
`<type>(<scope>): <subject>`

**Types:**
- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Changes to the build process or auxiliary tools.

**Example:**
`feat(auth): implement JWT refresh token rotation`

**Workflow:**
1. Branch off `main` -> `feature/your-feature-name`.
2. Commit frequently with atomic changes.
3. Open a Pull Request (PR) against `main`.
4. PR must pass TypeScript build checks and receive 1 approval before merging.
