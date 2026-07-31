# Feature Specification

**Document Purpose:** Extremely detailed breakdown of every single feature within the Tatvam platform.
**Scope:** Covers Purpose, Business Rules, Dependencies, and Implementation Status for all major and minor modules.
**Audience:** Product Managers, QA Engineers, and Full-Stack Developers.
**Revision Information:** v2.0 - Finalized Enterprise Specification
**Related Documents:** `02_Product_Blueprint.md`, `06_User_Flows.md`

---

## 1. Authentication & Onboarding

### 1.1 User Registration
- **Purpose:** Allow new users to create an account and establish a baseline profile.
- **Description:** A multi-step form capturing core identity and language preferences.
- **Business Rules:** 
  - Email must be unique and valid.
  - Password must be at least 8 characters.
  - `preferredLanguage` must be captured and written directly to the `Profile` table.
- **Dependencies:** Backend `/auth/register` API, Prisma `User` and `Profile` models.
- **Implementation Status:** Implemented.

### 1.2 User Login
- **Purpose:** Securely authenticate existing users.
- **Description:** Form accepting email and password, returning JWT tokens.
- **Business Rules:**
  - Failed logins return a generic "Invalid credentials" error to prevent email enumeration.
  - Issues 15-minute access token and 7-day refresh token.
- **Implementation Status:** Implemented.

### 1.3 Forgot Password (OTP)
- **Purpose:** Recover lost accounts.
- **Description:** Sends a 5-digit OTP to the user's email, which must be verified before allowing a password reset.
- **Business Rules:**
  - OTP expires in 2 minutes.
  - Max 5 failed verification attempts before the OTP is invalidated.
- **Implementation Status:** Backend implemented, Frontend UI pending integration.

---

## 2. Dashboard

### 2.1 Overview Panel
- **Purpose:** Provide a snapshot of user activity.
- **Description:** Renders circular progress rings and top-level statistics.
- **Business Rules:** Metrics are derived from the `Progress` and `Session` database tables.
- **Implementation Status:** UI Implemented (Mock data).

---

## 3. Knowledge Engine (Core)

### 3.1 Document Upload
- **Purpose:** Ingest external educational material.
- **Description:** Drag-and-drop interface accepting PDF files.
- **Business Rules:**
  - File must be `< 50MB`.
  - Allowed types: `application/pdf`.
- **Implementation Status:** Implemented.

### 3.2 Document Viewer
- **Purpose:** Allow users to read ingested documents natively.
- **Description:** Uses `react-pdf` to render the document in a resizable split-pane.
- **Business Rules:** Must synchronize with the AI Mentor pane.
- **Dependencies:** `pdfjs-dist` worker.
- **Implementation Status:** Implemented.

---

## 4. AI Orchestration

### 4.1 AI Mentor Chat
- **Purpose:** Interactive Socratic tutoring.
- **Description:** A persistent chat window alongside the document viewer. Streams AI responses.
- **Inputs:** User query, Document vector context, User Preferred Language.
- **Outputs:** Server-Sent Events (SSE) markdown stream.
- **Business Rules:**
  - Must not provide direct answers to explicit questions.
  - Must respond exclusively in the user's preferred language.
- **Implementation Status:** Implemented.

### 4.2 Smart Notes Generation
- **Purpose:** Automated summarization.
- **Description:** User selects a topic; the system searches the vector database and generates structured markdown notes.
- **Business Rules:** Output must strictly adhere to the Zod JSON schema for `SmartNotes`.
- **Implementation Status:** Implemented.

### 4.3 Flashcard Generation
- **Purpose:** Active recall preparation.
- **Description:** Automatically generates Q&A pairs based on document semantics.
- **Implementation Status:** Implemented.

### 4.4 Dynamic Quizzes
- **Purpose:** Formal mastery assessment.
- **Description:** Generates 4-option multiple-choice questions. Evaluates user selection and provides immediate AI-generated reasoning.
- **Implementation Status:** Implemented.

---

## 5. Settings & Profile

### 5.1 Profile Management
- **Purpose:** Manage identity.
- **Description:** Read-only display of Name and Email (editable only via support for security).
- **Implementation Status:** Implemented.

### 5.2 Language Preferences
- **Purpose:** Localize the entire application experience.
- **Description:** Dropdowns for Preferred Language (AI Explanations), Native Language, and Secondary Language.
- **Business Rules:**
  - Clicking "Save Preferences" immediately mutates the backend `Profile` table.
  - Updates Zustand `engineStore`.
  - Triggers Google Translate DOM injection for instant UI translation.
- **Implementation Status:** Implemented.

### 5.3 Theme & Notifications
- **Purpose:** Aesthetic and engagement configuration.
- **Description:** Toggles for Light/Dark mode and Daily Reminders.
- **Implementation Status:** UI Implemented, backend persistence implemented.

---

## 6. Visionary Features (Planned)

### 6.1 Learning DNA
- **Description:** Vector representation of user cognitive traits (pacing, visual preference). Continuously updated by the Analytics engine.

### 6.2 Knowledge Graph
- **Description:** D3.js or React Flow visualization of the user's mastered semantic concepts, linked by relationship vectors.

### 6.3 Spaced Repetition System (SRS)
- **Description:** Background CRON jobs evaluating flashcard mastery timestamps and calculating optimal review dates based on the Ebbinghaus algorithm.
