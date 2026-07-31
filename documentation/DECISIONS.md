# Architecture Decision Records (ADRs)

**Document Purpose:** To log the critical architectural, architectural, and technological decisions made during the development of Tatvam.
**Scope:** Frameworks, Databases, Libraries, and AI Providers.

---

## ADR 001: Selection of Next.js for Frontend

**Context:** The platform requires a highly interactive dashboard with seamless routing and potential SEO requirements for future public landing pages.
**Decision:** We selected Next.js 14 (App Router).
**Consequences:** Provides excellent developer experience and built-in API routes if needed. Forces us to carefully delineate `"use client"` vs Server Components.
**Alternatives Considered:** Vite + React (Lacks built-in routing convention and SSR).

---

## ADR 002: Selection of Express.js for Backend

**Context:** We need a backend capable of handling long-running background tasks (PDF parsing, embeddings) and Server-Sent Events (SSE) for AI streaming.
**Decision:** We selected a decoupled Node.js + Express.js architecture instead of using Next.js API routes.
**Consequences:** Complete architectural separation. Allows the backend to be scaled independently of the frontend and prevents Vercel serverless timeout limits on long vectorization tasks.
**Alternatives Considered:** Next.js API Routes (Serverless timeouts on heavy PDF processing). Python/FastAPI (Excellent for AI, but splits the codebase into two languages, slowing down full-stack velocity).

---

## ADR 003: Selection of PostgreSQL + pgvector

**Context:** The platform requires relational data (Users, Profiles) and highly dimensional vector data (Document Embeddings).
**Decision:** We selected PostgreSQL with the `pgvector` extension.
**Consequences:** Allows us to store vector embeddings in the exact same database as our relational data. We can join vector searches with user isolation easily (`WHERE userId = X`).
**Alternatives Considered:** Pinecone / Milvus (Adds unnecessary network latency and infrastructure complexity for a startup phase).

---

## ADR 004: Selection of Google Gemini as Primary Provider

**Context:** The AI Mentor requires a massive context window to ingest entire textbooks, extreme speed for real-time chat, and strict adherence to JSON schemas.
**Decision:** We selected `gemini-2.5-flash` via the Google AI Studio API.
**Consequences:** Provides a 1M+ token context window and incredibly fast time-to-first-token (TTFT). Requires careful system prompting to prevent hallucination.
**Alternatives Considered:** OpenAI GPT-4o (Higher cost, slower TTFT, smaller context window).

---

## ADR 005: Native Multilingual Generation over i18n Libraries

**Context:** The platform must support multiple languages. Traditional apps use `react-i18next` with massive JSON dictionaries.
**Decision:** We opted for dynamic AI generation + Google Translate DOM injection.
**Consequences:** We do not maintain translation files. The LLM handles conceptual translation natively, and the DOM injector handles UI labels. Drastically reduces maintenance overhead while providing a magical user experience.
**Alternatives Considered:** Standard `react-i18next` (Impossible to maintain for dynamic AI-generated content).

---

## ADR 006: Zustand over Redux

**Context:** The frontend requires complex global state (Authentication, Active Document, AI Chat History).
**Decision:** We selected Zustand.
**Consequences:** Minimal boilerplate, hook-based, and highly performant. Avoids the intense verbosity of Redux ToolKit.
**Alternatives Considered:** Redux (Too much boilerplate). React Context (Causes unnecessary re-renders on highly nested dashboard trees).
