# 06. User Flows

> **Responsibility:** This document explains *HOW* users interact with Tatvam. It maps the student's journey.

---

## 🧭 The Core Study Journey

The most critical flow in Tatvam is the transition from confusion to clarity.

```text
[ Start Study Session ]
          │
          ▼
[ Select Subject / Upload Material ]
          │
          ▼
[ Enter Study Sanctuary (Focus Mode) ]
          │
          ▼
[ Encounter Difficult Concept ]
          │
          ▼
[ Highlight Text ──▶ Click "Explain like I'm 15" ]
          │
          ▼
[ AI Mentor Opens Contextual Dialogue ]
          │
          ▼
[ Student & Mentor engage in Socratic Q&A ]
          │
          ▼
[ Student confirms Understanding ]
          │
          ▼
[ Concept marked as "Mastered" in Knowledge Graph ]
```

---

## 🚪 Onboarding Journey

We must build trust immediately. The onboarding should feel like sitting down in a quiet, organized library.

```text
[ Welcome Screen (Minimal Typography) ]
          │
          ▼
[ "What are you currently trying to understand?" ]
          │
          ▼
[ User inputs a topic (e.g., 'Quantum Physics', 'Calculus') ]
          │
          ▼
[ System generates an initial Concept Map ]
          │
          ▼
[ Guided tour of the AI Mentor interface ]
          │
          ▼
[ Seamless transition into first study session ]
```

---

## 🚦 Edge Cases & Error Handling

Even beautiful software encounters errors. Our error states must be as calm as our success states.

| Scenario | UX Handling |
| :--- | :--- |
| **AI Rate Limit Hit** | Calm message: "Take a deep breath. Let's pause for a moment to process what we've learned." |
| **Network Disconnect** | Non-intrusive banner. Local state is preserved automatically. |
| **Hallucination Detected** | Mentor self-corrects or prompts the user: "Let's verify this fact together." |

> [!TIP]
> Never use jarring red error text for system failures. Use subtle amber or grayscale notices. The student's anxiety should not be triggered by our infrastructure.

---

## 🌊 Product Intelligence: The Learner Lifecycle

### 4. The Complete Learning Journey

The macro-lifecycle of a student moving through a subject in Tatvam.

1. **Discover:** Mapping the unknown. Identifying what needs to be learned.
2. **Learn:** Initial exposure to the concepts via the AI Mentor.
3. **Understand:** The "Aha!" moment achieved through Socratic dialogue.
4. **Practice:** Low-stakes application of the concept.
5. **Apply:** High-stakes integration of the concept into complex scenarios.
6. **Reflect:** The student and Mentor reviewing what was learned.
7. **Revise:** Algorithmic spaced-repetition to prevent memory decay.
8. **Master:** The concept is permanently embedded in the Knowledge Graph.

### 7. The Study Session Lifecycle

The micro-lifecycle of a single sitting (e.g., 45 minutes).

```text
[ 1. Goal Setting ]      "What are we achieving today?"
        │
        ▼
[ 2. Learn / Viz ]       Mental model construction
        │
        ▼
[ 3. Challenge ]         Mentor issues a surgical assessment
        │
        ▼
[ 4. Reflection ]        "How difficult did that feel?"
        │
        ▼
[ 5. Session Summary ]   Updating the Knowledge Graph
```

> [!IMPORTANT]
> A study session must ALWAYS end with a Summary and an update to the Knowledge Graph. The student must feel a tangible sense of progression before closing the app.

---

## 🧭 UX Blueprint: Information Architecture & Journeys

This section defines how a user physically moves through the application.

### 2. Information Architecture (Hierarchy)

```text
[ App Root ]
 ├── (Unauthenticated)
 │    ├── Landing Page
 │    └── Login / Register
 │
 └── (Authenticated)
      ├── Onboarding (First login only)
      │
      ├── Dashboard (Home)
      │    ├── Revision Hub
      │    └── Concept Graph
      │
      ├── Subject Overview (e.g., Biology)
      │    ├── Module (e.g., Cell Structure)
      │    │    └── Study Sanctuary (Focus Mode)
      │    │         └── AI Mentor Panel (Persistent Overlay)
      │    │
      │    └── Assessment View
      │
      └── Profile & Settings
           ├── Language Preferences
           └── Account Details
```

### 3. Navigation System

Tatvam relies on a flat, highly predictable navigation structure.

- **Primary Navigation:** A persistent left sidebar (Desktop/Tablet) or bottom tab bar (Mobile). Contains: Dashboard, Graph, Revision, Profile.
- **Secondary Navigation:** Contextual breadcrumbs at the top of the screen (e.g., `Dashboard / Biology / Cell Structure`).
- **Persistent AI Access:** A floating action button (FAB) or a collapsible right-side panel. The AI Mentor is *never* more than one click away.
- **Global Search:** Accessible via `Cmd/Ctrl + K` from anywhere. Quickly jumps to Concepts or past conversations.
- **Back Navigation:** Strictly hierarchical. "Back" always takes the user exactly one level up the Information Architecture tree.

### 5. Detailed User Journeys

The precise step-by-step UX flows for core actions.

#### Flow: First-Time Onboarding
1. User successfully registers via Auth provider.
2. System detects `is_first_login == true`.
3. Screen 1: "Welcome. Let's calibrate your learning style."
4. User selects primary language via `Language Selector`.
5. User selects current academic goal (e.g., High School, University, Curiosity).
6. Screen 2: Quick tour of the `Study Sanctuary` and `AI Mentor`.
7. User lands on `Dashboard` with a customized first step.

#### Flow: Returning Learner
1. User logs in.
2. System checks `Revision Queue`.
3. If critical decay exists ──▶ Dashboard highlights a `Revision Card` ("Your memory of 'Binary Trees' is fading").
4. Else ──▶ Dashboard highlights the last active `Learning Card`.
5. User clicks and resumes exactly where they left off.

#### Flow: Asking AI a Question
1. User is inside the `Study Sanctuary`.
2. User highlights a confusing paragraph.
3. User clicks the contextual "Explain this" tooltip.
4. `AI Mentor Panel` slides in from the right.
5. System automatically injects the highlighted text as context.
6. AI streams a Socratic response ("What part of this specifically confuses you?").

#### Flow: Starting a Study Session
1. User selects a `Concept` from the `Subject Overview`.
2. User clicks "Begin Focus Session".
3. UI transitions into full screen. All primary navigation hides.
4. Timer (optional) begins tracking the bounded session.

#### Flow: Completing a Session
1. User clicks "End Session".
2. System triggers a `Micro-Assessment` to verify understanding.
3. User completes the assessment.
4. System updates the `Knowledge Graph`.
5. System presents the `Achievement Card` and returns user to `Dashboard`.

#### Flow: Taking an Assessment
1. Mentor determines an assessment is needed based on the conversation.
2. Mentor injects a `Quiz Card` directly into the chat stream.
3. User selects/types an answer.
4. Mentor instantly validates, providing conceptual correction if wrong, or praise if right.

#### Flow: Reviewing Mistakes
1. User fails a `Micro-Assessment`.
2. AI Mentor does NOT display a red "FAIL" banner.
3. AI Mentor outputs: "Not quite. Look at step 2 again. What happens if X is negative?"
4. User attempts again in a safe, non-judgmental loop.

#### Flow: Revising Concepts
1. User clicks "Revise Now" from the `Dashboard`.
2. System pulls the most degraded `Concept` from the `Revision Plan`.
3. System drops the user into a specific `Study Session` focused strictly on recall and application.

#### Flow: Updating Profile / Language
1. User navigates to `Profile & Settings`.
2. User selects a new language from the dropdown.
3. System performs an optimistic UI update, immediately refreshing labels via the `i18n Framework`.
4. Subsequent AI requests automatically append the new language context.

---

For the architectural decisions powering these flows, see [DECISIONS.md](./DECISIONS.md).
