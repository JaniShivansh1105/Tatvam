# User Flows

**Document Purpose:** To visualize and document the critical user journeys through the Tatvam platform.
**Scope:** Covers Onboarding, Knowledge Ingestion, AI Interaction, and Settings workflows.
**Audience:** Product Managers, UI/UX Designers, QA Engineers.
**Revision Information:** v2.0 - Finalized Enterprise Workflows
**Related Documents:** `05_Feature_Specification.md`

---

## 1. Registration & Onboarding Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DB
    
    User->>Frontend: Fills Registration Form
    Frontend->>API: POST /auth/register { email, password, lang }
    API->>API: Validate schema & Hash password
    API->>DB: Check if email exists
    DB-->>API: Email available
    API->>DB: Create User & Profile
    DB-->>API: Success
    API->>Frontend: Return JWT + User Object
    Frontend->>Frontend: Hydrate Zustand authStore & engineStore
    Frontend->>User: Redirect to /dashboard
```

## 2. Language Selection Flow

```mermaid
sequenceDiagram
    participant User
    participant SettingsPage
    participant API
    participant GoogleTranslateDOM
    
    User->>SettingsPage: Selects "Gujarati" and clicks Save
    SettingsPage->>API: PUT /auth/profile { preferredLanguage: "Gujarati" }
    API-->>SettingsPage: Success
    SettingsPage->>SettingsPage: Update Zustand `engineStore`
    SettingsPage->>GoogleTranslateDOM: Dispatch Event (Update Iframe Cookie)
    GoogleTranslateDOM-->>User: Entire UI repaints in Gujarati instantly (No reload)
```

## 3. Document Upload & Ingestion Flow

```mermaid
sequenceDiagram
    participant User
    participant UploadUI
    participant API
    participant Worker
    participant VectorDB
    
    User->>UploadUI: Drops PDF file
    UploadUI->>API: POST /knowledge/upload (FormData)
    API->>API: Save to /uploads/
    API->>Worker: Trigger Background Extraction Task
    API-->>UploadUI: 202 Accepted (Processing)
    
    Worker->>Worker: Parse PDF to Text
    Worker->>Worker: Semantic Chunking
    Worker->>Worker: Request Embeddings from Model
    Worker->>VectorDB: Upsert Vectors
    Worker->>DB: Update Document Status to "READY"
    
    UploadUI->>API: Polling GET /knowledge/status
    API-->>UploadUI: Status: "READY"
    UploadUI->>User: Redirect to Document Viewer
```

## 4. AI Mentor (Socratic Chat) Flow

```mermaid
sequenceDiagram
    participant User
    participant ChatUI
    participant API
    participant VectorDB
    participant GeminiLLM
    
    User->>ChatUI: Types "Explain this equation"
    ChatUI->>API: GET /ai/chat/stream?query=Explain...
    API->>API: Intercept X-Preferred-Language header
    API->>VectorDB: Semantic Search for relevant chunks
    VectorDB-->>API: Top 3 Semantic Chunks
    API->>API: Construct System Prompt (Rules + Chunks + Language)
    API->>GeminiLLM: Request Stream
    GeminiLLM-->>API: Stream tokens...
    API-->>ChatUI: SSE Stream (data: "Let's...")
    ChatUI-->>User: Renders Markdown incrementally
```

## 5. Resource Generation (Smart Notes) Flow

```mermaid
sequenceDiagram
    participant User
    participant KnowledgeUI
    participant API
    participant GeminiLLM
    
    User->>KnowledgeUI: Clicks "Generate Notes"
    KnowledgeUI->>API: POST /ai/generate
    API->>API: Retrieve Document Context
    API->>GeminiLLM: Request JSON generation using Zod Schema
    GeminiLLM-->>API: Raw JSON Output
    API->>API: Validate JSON against Schema
    API-->>KnowledgeUI: Structured Notes Data
    KnowledgeUI-->>User: Renders Interactive Markdown Notes
```

## 6. Assessment (Quiz) Flow

```mermaid
sequenceDiagram
    participant User
    participant QuizUI
    participant ProgressEngine
    
    User->>QuizUI: Submits Answer
    QuizUI->>QuizUI: Validate against generated correct answer
    alt Answer is Correct
        QuizUI->>User: Show Success + AI Explanation
        QuizUI->>ProgressEngine: Update mastery (+1)
    else Answer is Incorrect
        QuizUI->>User: Show Error + AI Socratic Hint
        QuizUI->>ProgressEngine: Update mastery (-1)
    end
```
