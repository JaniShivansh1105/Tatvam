# Changelog

All notable changes to the Tatvam platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Phase 3: Learning DNA vectors schema definition.
- Phase 3: Knowledge Graph visualization mockups.

---

## [1.0.0] - 2026-07-31
*Initial Enterprise Release - The Maverick Effect AI Challenge Final Build*

### Added
- **Authentication:** JWT-based stateless authentication with Bcrypt hashing and OTP support.
- **Settings:** Configurable themes, notification toggles, and multi-layered language preferences.
- **Multilingual Engine:** Instantaneous, application-wide UI translation and native AI generation via `X-Preferred-Language` interceptors.
- **Knowledge Pipeline:** PDF ingestion, text extraction, semantic chunking, and PostgreSQL `pgvector` embedding storage.
- **AI Orchestrator:** Secure provider management layer, currently utilizing Google Gemini `gemini-2.5-flash`.
- **AI Mentor:** Server-Sent Events (SSE) streaming chat interface with Socratic prompting constraints.
- **Resource Generation:** Automated Zod-validated creation of Smart Notes, Flashcards, and Quizzes from document context.
- **Frontend Architecture:** Next.js 14 App Router, Tailwind CSS, Zustand, and React Query implementation.
- **Documentation:** Complete overhaul of enterprise documentation, including Architectural Decision Records and Mermaid Lifecycle diagrams.

### Fixed
- Fixed an issue where the AI Orchestrator would fall back to English on initial page hydration. Language preference is now strictly pulled from the database Profile on boot.

---

## [0.9.0] - 2026-06-15
*Beta Architecture Finalization*

### Added
- Initial setup of Express backend and Prisma ORM.
- Implementation of the `pdf-parse` text extraction worker.
- Setup of the vector database extension in PostgreSQL.
- Creation of the core UI Design System using Shadcn/Tailwind.
