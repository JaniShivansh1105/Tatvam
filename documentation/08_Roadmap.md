# 08. Roadmap

> **Responsibility:** This document explains *WHERE* the project is going. For past releases, see the [CHANGELOG](./CHANGELOG.md).

---

## 📍 Phase 1: The Foundation (Current)

Our goal is to establish an unshakeable base. No code is written until the blueprint is perfect.

- [x] Define product philosophy and principles.
- [x] Establish the documentation architecture.
- [x] Draft System Architecture and UI guidelines.
- [ ] Initialize repository structure and strict linting/formatting rules.

---

## 🏗️ Phase 2: The Core Mentor (Upcoming)

Building the essential intelligence loop.

- [ ] Connect secure authentication layer.
- [ ] Implement the Socratic AI pipeline.
- [ ] Build the minimal Study Sanctuary UI.
- [ ] Establish local state management for offline resilience.

---

## 🚀 Phase 3: The Knowledge Graph

Transitioning from chat to conceptual mapping.

- [ ] Engineer the entity extraction system.
- [ ] Build the visual canvas for the Knowledge Graph.
- [ ] Implement spaced repetition algorithms for review prompts.

---

## 🌟 Phase 4: Expansion

Deepening the educational experience.

- [ ] Voice interaction for conversational learning.
- [ ] Math and Code rendering engines.
- [ ] Export functionality (Notes ──▶ PDF/Markdown).

> [!NOTE]
> Timelines are deliberately omitted. We do not rush quality. A feature ships when it achieves the standard of excellence defined in our philosophy, not an arbitrary calendar date.

---

## 🎯 Version 1 Product Scope (The MVP)

The MVP defines exactly what must be built to prove Tatvam's core hypothesis: *AI can facilitate deep conceptual understanding through Socratic dialogue.*

### 🔴 P0 (Critical - Must Have for Launch)

| Feature | Purpose | User Value | Dependencies |
| :--- | :--- | :--- | :--- |
| **Secure Authentication** | Identity management. | Data privacy and persistence. | Platform Foundation |
| **The Study Sanctuary** | Distraction-free UI. | Reduces cognitive load. | Component Library |
| **Socratic AI Mentor** | Core chat interface. | Guides understanding. | AI Orchestrator |
| **Subject Curriculum** | Static Knowledge Model. | Gives the student a map. | Database Schema |

### 🟡 P1 (Important - Fast Follows)

| Feature | Purpose | User Value | Dependencies |
| :--- | :--- | :--- | :--- |
| **Basic Knowledge Graph** | Tracks mastered concepts. | Visual proof of progress. | Study Sessions |
| **Concept Deconstruction**| Breaks down pasted text. | Simplifies dense material. | Socratic Mentor |
| **Micro-Assessments** | In-chat surgical quizzes. | Validates understanding. | AI Orchestrator |
| **Dark Mode** | Ergonomic UI toggling. | Prevents eye strain. | Design System |

### 🟢 P2 (Optional - Nice to Have in V1)

| Feature | Purpose | User Value | Dependencies |
| :--- | :--- | :--- | :--- |
| **Spaced Repetition** | Algorithmic revision prompts. | Prevents memory decay. | Knowledge Graph |
| **Multilingual UI** | Localized interfaces. | Accessible to wider demographics. | i18n Framework |

### 🚫 Out of Scope for V1

- Voice interaction (Speech-to-Text / Text-to-Speech).
- Teacher/Institution dashboards.
- Collaborative/multiplayer study rooms.
- Gamification elements (leaderboards, streaks).
