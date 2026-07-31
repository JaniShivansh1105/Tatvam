# Product Blueprint

**Document Purpose:** To comprehensively outline every module, screen, and feature of the Tatvam platform.
**Scope:** Covers implemented features and planned visionary modules.
**Audience:** Product Managers, UI/UX Designers, and Engineering Leads.
**Revision Information:** v2.0 - Finalized Enterprise Blueprint
**Related Documents:** `05_Feature_Specification.md`, `06_User_Flows.md`

---

## 1. Product Architecture Overview

Tatvam is divided into two primary zones:
1. **The Portal (Auth):** Onboarding, Identity, and Authentication.
2. **The Workspace (Dashboard):** The core adaptive learning environment.

---

## 2. Authentication Module

### Implemented Features
- **Login Screen:** Email/Password based authentication with secure JWT handling.
- **Registration Screen:** Multi-step form capturing Name, Email, Password, and Preferred Language to immediately establish the cognitive baseline.
- **Forgot Password Flow:** OTP-based email verification and secure password reset.
- **Stateless Sessions:** Token persistence via HttpOnly cookies and Zustand state hydration.

### Planned Features (Vision)
- **OAuth Providers:** Google, GitHub, and Microsoft integration.
- **WebAuthn:** Hardware-backed biometric authentication.

---

## 3. Dashboard Module

### Implemented Features
- **Overview Screen:** A high-level hub displaying daily activity rings, recent learning sessions, and quick-resume shortcuts.
- **Sidebar Navigation:** Contextual routing between Knowledge, Practice, Assessments, and Settings.
- **Progress Tracking (Basic):** Tracking the number of sessions and active time.

### Planned Features (Vision)
- **Study Streak Widget:** Gamification through daily learning streaks.
- **Heatmap:** GitHub-style activity heatmaps representing daily study intensity.

---

## 4. Knowledge Engine Module

### Implemented Features
- **Document Upload:** Users can drag-and-drop PDFs to be ingested into the platform.
- **Text Extraction & Chunking:** Background processing that converts PDFs into semantically relevant markdown chunks.
- **Vector Database (PGVector):** High-dimensional storage of document embeddings.
- **Split-Pane Viewer:** A beautifully synced UI allowing users to read the document on the left while interacting with the AI on the right.

### Planned Features (Vision)
- **Multi-modal Upload:** Support for YouTube video links, audio transcripts, and `.docx` files.
- **Folder Organization:** Hierarchical storage for complex syllabi.

---

## 5. AI Mentor Module

### Implemented Features
- **Socratic Chat:** A streaming SSE chat interface directly linked to the user's uploaded document.
- **RAG Integration:** The AI automatically retrieves the most relevant semantic chunks from the document to ground its answers.
- **Multilingual Support:** The AI dynamically speaks in the user's `preferredLanguage` (e.g., Gujarati, Hindi) natively, without relying on post-generation translation libraries.
- **Pedagogical Constraints:** Strict system prompting that forces the AI to refuse direct answers to homework questions, opting for hints and analogies instead.

### Planned Features (Vision)
- **Voice Interactivity:** Real-time WebRTC audio conversations with the AI Mentor.
- **Emotion Detection:** Sentiment analysis on user prompts to detect frustration and adjust tone accordingly.

---

## 6. Resource Generator Module

### Implemented Features
- **Smart Notes:** On-demand generation of structured, markdown-based study notes summarizing specific topics from the document.
- **Flashcards:** Automated generation of Q&A pairs for active recall.
- **JSON Schema Validation:** The AI output is strictly validated against a predefined Zod schema before rendering.

### Planned Features (Vision)
- **Mind Map Generation:** Visual node-based diagrams representing document concepts.
- **Export to Notion/Anki:** One-click exporting of generated resources to external tools.

---

## 7. Assessment Engine Module

### Implemented Features
- **Quiz Generation:** Dynamic creation of multiple-choice questions based on the active document context.
- **Immediate Feedback:** Real-time evaluation of answers with AI-generated explanations for incorrect choices.

### Planned Features (Vision)
- **Free-text Assessments:** Allowing users to type out essay-style answers, which the AI semantically grades against a rubric.

---

## 8. Settings & Profile Module

### Implemented Features
- **User Profile:** Management of display name and email.
- **Language Preferences:** Deep configuration of Preferred Language (AI generation), Native Language, and Secondary Language. Modifying this triggers an immediate application-wide UI refresh via the Google Translate DOM injector.
- **Theme Preferences:** Light and Dark mode toggling.
- **Notification Preferences:** Toggling daily study reminders.

### Planned Features (Vision)
- **Data Export/Deletion:** GDPR-compliant mechanisms for users to wipe their vectors and profile data.

---

## 9. Learning DNA (Visionary Core)

*(This entire module is currently under Planned Vision)*

### The Concept
Learning DNA is a persistent vector representing the user's cognitive profile. It tracks:
- **Pacing Preference:** Does the user need slow, granular explanations, or high-speed conceptual overviews?
- **Visual vs. Textual:** Does the user respond better to analogies or literal definitions?
- **Frustration Threshold:** How many Socratic hints can the user tolerate before needing a direct explanation?

### Implementation Plan
- The AI Orchestrator will read the Learning DNA prior to generating *any* response, adjusting its system prompt dynamically.
- The Progress Engine will continuously mutate the Learning DNA based on assessment scores and chat sentiment.

---

## 10. Progress & Achievements (Visionary Core)

*(This entire module is currently under Planned Vision)*

### The Concept
- **Knowledge Graph:** A visual web of concepts extracted from the user's syllabus. Nodes turn from gray (unseen) to red (struggling) to green (mastered) based on assessment performance.
- **Spaced Repetition System (SRS):** An algorithm (similar to Anki) that schedules flashcard reviews precisely when the user is about to forget the information, interrupting the Ebbinghaus forgetting curve.
