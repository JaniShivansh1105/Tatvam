# Tatvam - Architecture & Deployment Documentation

## Architecture Overview
Tatvam is a production-grade Adaptive AI Learning Platform.
- **Frontend:** Next.js 16 (React 19) with Turbopack, TailwindCSS, and Framer Motion.
- **Backend:** Node.js, Express, TypeScript, and Prisma ORM.
- **Database:** PostgreSQL (Neon) with `pgvector` extension for RAG embedding storage.
- **AI Core:** Google Gemini 1.5 Flash for chat, extraction, and semantic embeddings.

## Project Structure
```
/frontend
  /src/app         - Next.js App Router
  /src/components  - React UI Components
  /src/lib         - Frontend utilities (API clients, formatting)
/backend
  /src/api         - Express controllers, middlewares, routes
  /src/application - Domain Use Cases (Business Logic)
  /src/core        - Core engines (RAG, AI, Adaptive Learning, Progress)
  /src/data        - Database Repositories (Prisma)
  /src/domain      - Core interfaces and types
  /prisma          - Schema definitions and migrations
```

## Developer Setup
1. Clone repository.
2. `cd frontend && npm install`
3. `cd backend && npm install`
4. Create `.env` files in both directories.
5. `npx prisma generate` in `/backend`.
6. `npm run dev` in both terminals.

## Deployment Guide
- **Frontend (Vercel):** Connect GitHub repo, set Build Command to `npm run build`, output directory to `.next`. Add API endpoint env variables.
- **Backend (Render/Railway):** Connect GitHub, Build Command `npm install && npx prisma generate && npx tsc`, Start Command `node dist/index.js`.
- **Database (Neon):** Enable `pgvector` extension. Update `DATABASE_URL` in backend.

## AI Pipeline Overview
- **Ingestion:** Upload -> OCR -> Semantic Chunker -> Gemini Embeddings -> pgvector DB.
- **Retrieval:** User Query -> Embed Query -> Similarity Search (Cosine) -> Context Injection.
- **Generation:** AI Context Builder dynamically injects RAG context, Learning DNA, and System Instructions to force structured output.

## Database Schema Summary
- **Identity:** `User`, `Profile`, `Session`.
- **Content:** `Subject`, `Lesson`, `Topic`, `Section`.
- **Knowledge (RAG):** `KnowledgeCollection`, `KnowledgeDocument`, `DocumentChunk`.
- **Adaptive Learning:** `LearningDNA`, `ConceptMastery`, `LearningInteraction`.

## API Overview
- `POST /api/auth/register` - User Signup
- `POST /api/knowledge/upload` - Asynchronous Document Processing
- `POST /api/ai/chat` - RAG-enabled AI Mentor
- `POST /api/ai/generate-artifact` - Dynamic flashcards/notes generation
