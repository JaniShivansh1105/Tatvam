# 05. Feature Specification

> **Responsibility:** This document explains *WHAT* features exist within Tatvam. To see how these features are built, refer to [07. Development Rules](./07_Development_Rules.md).

---

## 📋 Core Feature Matrix

| Feature | Status | Description |
| :--- | :--- | :--- |
| **The Study Sanctuary** | 📝 Planned | A minimal, distraction-free reading and focus environment. |
| **Socratic Mentor Chat** | 📝 Planned | Context-aware AI dialogue that guides rather than answers. |
| **Knowledge Graph** | 🚧 Research | Visual representation of a student's mastered concepts. |
| **Concept Deconstruction** | 📝 Planned | Breaking down complex pasted text into digestible nodes. |

---

## 🔍 Detailed Specifications

### 1. The Socratic Mentor

**Purpose:**
To emulate a world-class, 1-on-1 human tutor.

**Requirements:**
- Must maintain conversational context across study sessions.
- Must refuse to provide direct answers to homework questions.
- Must identify the exact step where a student's logic failed.
- Must support markdown, math formulas (KaTeX/MathJax), and basic code syntax.

### 2. Concept Deconstruction

**Purpose:**
To reduce the cognitive overload of dense academic material.

**Requirements:**
- A student pastes a dense paragraph.
- The system extracts core entities and relationships.
- Generates a simplified, bulleted breakdown or an ASCII relationship tree.
- Allows the student to click on any node to ask the Mentor for clarification.

### 3. The Study Sanctuary (Focus Mode)

**Purpose:**
To protect the student's attention.

**Requirements:**
- A UI toggle that hides all navigation, sidebars, and extraneous data.
- Leaves only the core subject material and the Mentor interface.
- Supports system-level dark mode integration to reduce eye strain.

---

## 🚫 Anti-Features

What we explicitly choose **NOT** to build:

- ❌ **Leaderboards:** Learning is a personal journey, not a competition.
- ❌ **Streaks/Badges:** We do not rely on cheap dopamine manipulation.
- ❌ **Flashcard Generators:** We optimize for deep comprehension, not rote memorization.

> [!NOTE]
> Every feature must pass the "Understanding Filter." If a feature helps a student memorize a fact without understanding the underlying concept, it is rejected.

---

## ⚙️ Product Intelligence: Cognitive Features

### 8. Assessment Intelligence

Tatvam never generates generic, randomized quizzes. Assessment is deeply surgical.

- **Concept Checks:** Micro-questions injected seamlessly into the chat flow to verify a paragraph was understood.
- **Difficulty Progression:** Questions automatically scale based on real-time confidence scores.
- **Validation, Not Judgment:** If a student fails an assessment, the system does not record a "bad grade." It simply flags the Concept as requiring a new explanatory approach.

### 9. Progress Intelligence

Progress is not a percentage bar of "videos watched."

**The Progress Matrix:**
- **Understanding:** Has the student passed conceptual assessments?
- **Retention:** Can the student recall the concept 14 days later?
- **Consistency:** Study cadence and momentum.
- **Application:** Can the student apply the concept to a novel, unseen scenario?

### 10. Revision Intelligence

Revision in Tatvam is driven by algorithmic decay models (Spaced Repetition).

- **When to Revise:** Triggered when the system calculates a concept's `Confidence Decay` has fallen below a 70% threshold.
- **Priority Calculation:** Concepts acting as foundational dependencies for *future* chapters are prioritized for revision over isolated facts.
- **Revision Recommendations:** The Mentor proactively suggests: "Before we tackle Advanced Calculus, we need a 10-minute refresher on Limits, because your retention score there has dropped."

---

## 🔺 The Feature Pyramid

Tatvam's features are organized into logical layers. Lower layers must be absolutely stable before higher layers can function.

```text
       [ AI Mentor ]            (Socratic Chat, Voice, Adaptive Tone)
      ───────────────
   [ Learning Intelligence ]    (Spaced Repetition, Knowledge Graph, DNA)
  ─────────────────────
 [ Core Learning Interface ]    (Study Sanctuary, Concept Deconstruction)
─────────────────────────────
  [ Platform Foundation ]       (Auth, Security, Sync, Multilingual)
```

**Why this structure?**
- **Platform Foundation:** Without secure auth and sync, nothing matters.
- **Core Learning Interface:** The student needs a quiet place to read before the AI can help.
- **Learning Intelligence:** The system must track what the student knows before it can teach them effectively.
- **AI Mentor:** The apex feature. It relies entirely on the intelligence layer to provide non-generic, highly contextual tutoring.

---

## 👥 User Roles (Version 1)

Tatvam V1 is deeply focused on the single-player student experience. However, roles are defined to support future expansion.

| Role | Permissions & Responsibilities |
| :--- | :--- |
| **Student** | Has full CRUD access to their own `Learning DNA`, `Study Sessions`, and `Knowledge Graph`. Cannot view others. |
| **Administrator** | Can manage platform configurations, view anonymized telemetry, and manage the global `Knowledge Model` (Subjects). |
| **Future Teacher** | *(V2)* Can view aggregate `Knowledge Graphs` for a cohort of `Students` and assign `Learning Goals`. |
| **Future Institution**| *(V2)* Can manage `Teachers` and provision enterprise access. |
| **Guest** | Can interact with a limited, rate-capped sandbox version of the `AI Mentor` (No persistent `Learning DNA`). |

---

## 📱 UX Blueprint: Screen Inventory & Responsibilities

This blueprint provides exact specifications for UI/UX designers and frontend engineers prior to visual design.

### 1. Complete Screen Inventory (V1)

| Screen Name | Purpose | Priority |
| :--- | :--- | :--- |
| **Landing Page** | Value proposition and entry point. | P0 |
| **Login / Register** | Authentication boundary. | P0 |
| **Onboarding Wizard** | Captures initial `Learning DNA`. | P0 |
| **Main Dashboard** | Central hub for active subjects and revisions. | P0 |
| **Subject Overview** | Maps the `Knowledge Model` for a specific topic. | P0 |
| **Study Sanctuary** | The core reading and learning interface. | P0 |
| **AI Mentor Chat** | The persistent or full-screen Socratic dialogue. | P0 |
| **Concept Graph** | Visual representation of mastered nodes. | P1 |
| **Assessment View** | surgical micro-quizzes. | P1 |
| **Profile Settings** | Language, theme, and account management. | P1 |
| **Revision Hub** | Queue of decaying concepts. | P2 |
| **Teacher Dashboard**| Aggregate view of student cohorts. | Future |

### 4. Screen Responsibilities

The strict architectural rules for each critical interface.

#### 4.1. Main Dashboard
- **Purpose:** Answer "What should I study right now?"
- **Key Widgets:** `Progress Timeline`, `Revision Card` (if decay detected), `Learning Card` (active subjects).
- **Data Required:** User Profile, Active Study Sessions, Revision Queue.
- **User Actions:** Resume session, start new subject, view progress.
- **Success State:** Displays clear, prioritized learning paths.
- **Empty State:** "You haven't started any subjects yet. Let's pick one."
- **Loading State:** Skeleton loaders matching the `Learning Card` dimensions.
- **Error State:** "Unable to load your dashboard. [Retry Button]"

#### 4.2. Study Sanctuary
- **Purpose:** Deep focus reading and conceptual deconstruction.
- **Key Widgets:** Text Renderer, `Concept Card` popovers, Toggle to open `AI Mentor`.
- **Data Required:** Subject Curriculum, Concept details.
- **User Actions:** Read, highlight text, request AI explanation.
- **Success State:** Distraction-free, centered text with readable line-height.
- **Empty State:** N/A (Cannot enter without selecting a concept).
- **Loading State:** Subtle pulsing logo.
- **Error State:** Offline banner (Allows reading cached content).

#### 4.3. AI Mentor Chat
- **Purpose:** Direct, contextual Socratic dialogue.
- **Key Widgets:** Message stream, `AI Response Block`, Input area.
- **Data Required:** Chat history, current `Study Session` context.
- **User Actions:** Type query, submit, stop generation.
- **Success State:** Fluid token streaming.
- **Empty State:** "I'm your AI Mentor. What concept are we tackling today?"
- **Loading State:** Animated "thinking" dots (rendered locally while TTFT resolves).
- **Error State:** "I lost my train of thought (Network Error). Could you repeat that?"

---

To see how users navigate these features, review the [User Flows](./06_User_Flows.md).
