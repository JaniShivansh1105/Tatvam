# 02. Product Blueprint

> **Responsibility:** This document explains *WHAT* Tatvam is. To understand the visual design, refer to [03. Brand & Design System](./03_Brand_Design_System.md).

---

## 🧩 The Core Concept

Tatvam is an **AI-First Learning Companion**. It is a unified space where a student can deconstruct complex subjects, interact with a personalized mentor, and build a lasting knowledge foundation.

### What Tatvam Is NOT
- ❌ A traditional Learning Management System (LMS).
- ❌ A wrapper around ChatGPT.
- ❌ A generic note-taking application.
- ❌ A school administration portal.

### What Tatvam IS
- ✅ An infinitely patient AI Mentor.
- ✅ A calm, distraction-free study environment.
- ✅ A conceptual map of a student's understanding.

---

## 🏛️ Foundational Pillars

### 1. The Study Sanctuary
The primary interface where learning happens. It is minimal, completely devoid of gamified clutter, and focused entirely on the subject matter.

### 2. The Socratic Mentor
An intelligence layer that analyzes what the student knows and challenges their assumptions. It never hands out direct answers to complex problems.

### 3. The Knowledge Graph
A visual representation of everything the student has mastered, highlighting gaps in understanding and forming connections between disparate subjects.

---

## 📊 Product Matrix

| Capability | Purpose | Value to Student |
| :--- | :--- | :--- |
| **Contextual Chat** | Socratic dialogue | Deepens understanding through guided inquiry. |
| **Concept Parsing** | Breaking down texts | Simplifies overwhelming study materials. |
| **Mastery Tracking** | Visualizing growth | Replaces grades with a sense of genuine progress. |
| **Focus Mode** | Minimizing UI | Reduces cognitive load and anxiety. |

---

## 🧭 The Learning Loop

The fundamental experience of using Tatvam follows a strict, repeatable loop:

```text
  [1] Encounter Concept
        │
        ▼
  [2] Express Confusion ──(AI Identifies Gap)──┐
        │                                      │
        ▼                                      │
  [3] Socratic Dialogue ◀──────────────────────┘
        │
        ▼
  [4] "Aha!" Moment
        │
        ▼
  [5] Solidify in Knowledge Graph
```

> [!NOTE]
> Every feature we build must serve this exact loop. If a proposed feature distracts from this journey, it must be discarded.

---

## 🧬 Product Intelligence: The DNA & Structure

### 2. Student Learning DNA

Tatvam maintains a deeply personalized, constantly evolving profile of how a student learns best. This DNA informs every AI interaction.

| Attribute Category | Tracked Elements |
| :--- | :--- |
| **Cognitive Profile** | Learning speed, Preferred explanation style (Visual vs Analogy), Confidence baseline |
| **Academic Context** | Current level, Active semester, Goal (e.g., "Pass Finals" vs "Deep Curiosity") |
| **Knowledge State** | Weak concepts, Strong concepts, Historical assessment performance |
| **Behavioral Habits** | Revision consistency, Preferred study duration, Time-of-day effectiveness |
| **Linguistic Profile** | Preferred communication tone, Primary language, Terminology familiarity |

### 3. Knowledge Model Hierarchy

All knowledge in Tatvam is structured deterministically.

```text
[ Subject ]          e.g., Computer Science
    │
    ▼
[ Module ]           e.g., Data Structures
    │
    ▼
[ Chapter ]          e.g., Trees
    │
    ▼
[ Topic ]            e.g., Binary Search Trees
    │
    ▼
[ Concept ]          e.g., Node Insertion
    │
    ▼
[ Micro Concept ]    e.g., Balancing logic
    │
    ▼
[ Mastery Status ]   (Unseen -> Learning -> Practicing -> Mastered)
```
- **Responsibility:** Higher levels organize curriculum; lower levels (Concepts) are the atomic units of AI instruction and assessment.

### 12. Multilingual Learning Framework

Tatvam provides **native-quality educational communication**, not mechanical translation. The goal is that a student in Gujarat feels the system was built natively in Gujarati.

- **Native Construction:** The AI must generate responses using natural sentence structures appropriate to the cultural and linguistic context, not translated English idioms.
- **Mixed-Language (Code-Switching):** The AI intelligently mixes languages when necessary (e.g., explaining a complex algorithm in Hindi, but retaining strict English keywords for `public static void main`).
- **Precision Terminology:** Mathematical notation and scientific vocabulary are maintained accurately across linguistic boundaries.
- **Fallback Strategy:** If a deep technical concept lacks a robust localized translation, the AI defaults to the global standard (English) for the term, while surrounding the explanation in the native language.

---

## 🏗️ The Domain Model

The Domain Model defines the conceptual entities within Tatvam and how they relate. This is the abstract reality of the product, independent of database tables or implementation details.

### Core Entities

| Entity | Purpose & Responsibilities | Relationships |
| :--- | :--- | :--- |
| **Learner** | The human using the system. Owns the learning journey and all associated data. | Has exactly one `Profile`, `Language Profile`, and `Learning DNA`. |
| **Learning DNA** | Tracks cognitive preferences, learning speed, and historical behavior. | Belongs to `Learner`. Drives `AI Memory`. |
| **Subject ──▶ Concept** | The `Knowledge Model Hierarchy`. Defines the academic curriculum deterministically. | Independent of `Learner`, but mapped against them via `Knowledge Graph`. |
| **Study Session** | A bounded period of learning (e.g., 45 mins). Tracks focus, goals, and outcomes. | Contains multiple `Conversations` and `Assessments`. |
| **Conversation** | The Socratic dialogue between the Learner and the AI Mentor. | Belongs to `Study Session`. Associated with a specific `Concept`. |
| **Assessment** | A surgical concept-check generated by the Mentor to verify understanding. | Contains `Questions` and `Answers`. Updates `Progress`. |
| **Knowledge Graph** | The dynamic map of what a `Learner` knows, tied to the `Knowledge Model`. | Updated by `Study Session` completions. Drives `Revision Plan`. |
| **Revision Plan** | The algorithmic spaced-repetition queue for a Learner. | Consumes data from `Knowledge Graph` and `Learning DNA`. |
| **AI Memory** | The contextual boundary for the LLM (Permanent, Long-Term, Session, Temp). | Feeds into the `Conversation` context. |

> [!NOTE]
> All entities are strictly owned by the Learner (except the global `Subject` curriculum). The Learner lifecycle dictates the lifecycle of their associated graph.

---

## ⚡ Product Capabilities (Platform Foundations)

Platform capabilities differ from User Features. Capabilities are the omnipresent foundations that enable features to exist effectively.

| Capability | Application Across Platform |
| :--- | :--- |
| **Multilingual Learning** | Every text node and AI response must natively support localized language switching. |
| **Security & Privacy** | AES-256 encryption at rest. Zero-retention AI processing policies. |
| **Accessibility** | ARIA-compliant UI, high-contrast theming, and keyboard-first navigation. |
| **Dark Mode** | First-class citizen to reduce cognitive fatigue and eye strain during late study sessions. |
| **Synchronization** | Offline-first data capture with optimistic UI updates syncing transparently to the cloud. |
| **Scalability** | Stateless edge-caching for curriculum; isolated compute for LLM context generation. |
| **Voice Readiness** | UI layers designed to eventually accept audio input/output without restructuring. |

---

For technical implementation details, refer to the [System Architecture](./04_System_Architecture.md).
