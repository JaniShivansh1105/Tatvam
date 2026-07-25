# 03. Brand & Design System

> **Responsibility:** This document explains *HOW* Tatvam looks. To understand the underlying technical infrastructure, refer to [04. System Architecture](./04_System_Architecture.md).

---

## 🎨 Core Aesthetics

Tatvam's visual language is defined by **Calmness**, **Clarity**, and **Focus**. 
The UI must never compete with the learning material for the student's attention.

> [!IMPORTANT]
> A student using Tatvam should feel their heart rate drop. The design must actively lower anxiety.

---

## 🔤 Typography

Typography is the absolute core of our interface. Because reading is fundamental to studying, the text must be flawless.

| Hierarchy | Font Family | Weight | Purpose |
| :--- | :--- | :--- | :--- |
| **Display** | `Inter` | SemiBold | Major section headers. |
| **Body** | `Inter` | Regular | Long-form reading materials and chat. |
| **Monospace** | `JetBrains Mono` | Regular | Code snippets and technical definitions. |

---

## 🖌️ Color Palette

We reject high-dopamine, vibrant color schemes. We embrace muted, natural tones.

```text
 ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
 │ Primary       │ │ Secondary     │ │ Surface       │
 │ #0A0A0A       │ │ Ink Black     │ │ #FAFAFA       │
 │               │ │               │ │ Paper White   │
 └───────────────┘ └───────────────┘ └───────────────┘
```
*(Note: Colors refined for elegance. Secondary adjusted.)*

- **Accents:** Used *exclusively* to indicate semantic meaning (e.g., green for mastery, soft amber for active focus).
- **Backgrounds:** We prefer off-whites over harsh stark white to reduce eye strain during long study sessions.

---

## 📐 Spatial System (The 8pt Grid)

Whitespace is not empty space; it is the breathing room a student needs to process complex information.

- **Micro (4px, 8px):** Component internals (button padding).
- **Macro (16px, 24px):** Component grouping (lists, form fields).
- **Layout (48px, 64px, 128px):** Major sections and reading widths.

> [!TIP]
> The line length (measure) for body text should never exceed 65-75 characters to ensure maximum reading comprehension.

---

## 🎭 Animation & Motion

- **Fade & Slide:** Transitions should be subtle and smooth (e.g., `200ms ease-out`).
- **No Bouncing:** Avoid spring animations that feel overly playful or distracting.
- **Meaningful:** Motion should only occur to explain a state change (e.g., a concept successfully moving into the knowledge graph).

---

## ♿ Accessibility First

Beautiful design is worthless if it excludes learners.

- **Contrast:** All text must strictly adhere to WCAG 2.1 AA contrast ratios (4.5:1).
- **Focus States:** Keyboard navigation must have highly visible, beautiful focus rings.
- **Screen Readers:** Semantic HTML structure is non-negotiable. 

---

## 🗣️ Product Intelligence: Voice & Tone

### 11. The Mentor Personality

The AI Mentor is the voice of Tatvam. It must feel profoundly human, deeply empathetic, and highly competent.

**It must NOT sound:** Like ChatGPT (robotic, overly eager, utilizing generic filler words like "Certainly!").
**It must NOT sound:** Like a strict, condescending professor.

| Attribute | Implementation Standard |
| :--- | :--- |
| **Tone** | Calm, assuring, patient, and intellectually rigorous. |
| **Teaching Style** | Socratic. It asks guiding questions rather than delivering monologues. |
| **Handling Mistakes** | Normalizes failure. "That's a very common trap. Let's look at why that assumption breaks down here." |
| **Giving Hints** | Progressive disclosure. It gives the smallest possible hint required to unblock the student. |
| **Handling Uncertainty** | Absolute transparency. "I'm not completely certain about the syntax for that specific edge case. Let's verify it." |

> [!NOTE]
> The UI design (colors, spacing) provides the *physical* calmness; the Mentor Personality provides the *emotional* calmness.

---

## 🧩 UX Blueprint: Components & Behavior

This section defines the structural and interactive blueprints that UI designers will use to construct the application.

### 6. Component Inventory (Conceptual)

These are the reusable product building blocks. They define *what* exists before we define exactly how it looks in code.

| Component | Purpose | Key Elements |
| :--- | :--- | :--- |
| **Learning Card** | Displays a subject or module overview. | Title, Progress Bar, Next Action button. |
| **Concept Card** | Explains a single, atomic micro-concept. | Title, Short Description, "Explain" button. |
| **Mastery Ring** | Visual indicator of understanding. | Circular progress (0-100%), color-coded (Red ──▶ Green). |
| **Progress Timeline** | Shows historical learning momentum. | Vertical/Horizontal axis, Data points, Milestones. |
| **AI Response Block** | Renders the Mentor's Socratic output. | Markdown renderer, Code block, KaTeX renderer. |
| **Quiz Card** | Renders a surgical micro-assessment. | Question text, Interactive inputs, Submit button. |
| **Revision Card** | Prompts the user to revisit a decaying concept. | Warning icon, Concept Name, "Revise Now" CTA. |
| **Achievement Card** | Subtle acknowledgement of a milestone. | Minimal icon, text. No flashy animations. |
| **Notification Banner** | System alerts (e.g., offline mode). | Severity color (amber/grey), succinct text. |
| **Search Module** | Global entry point for queries. | Text input, fuzzy search results dropdown. |
| **Language Selector** | Instantly switches the UI and AI locale. | Flag/Locale abbreviation, Dropdown list. |

### 7. Responsive Strategy

Tatvam is a fluid application. Learning happens on a phone on a bus, and on a desktop in a library.

| Device | Behavior Strategy |
| :--- | :--- |
| **Mobile (Portrait)** | Single-column. Navigation moves to a bottom tab bar. AI chat takes full screen when active. Touch targets minimum 44x44px. |
| **Tablet** | Two-column layout. Split view (e.g., Content on left, AI Mentor on right). Sidebar navigation collapsible. |
| **Desktop** | Three-column maximum (Navigation ──▶ Content ──▶ Persistent AI Panel). Maximum reading width clamped to 75ch. |

### 8. Accessibility (A11y) Blueprint

Accessibility is not an afterthought; it is a foundational pillar.

- **Keyboard Navigation:** Every interactive element must be reachable via `Tab`. The `Enter` and `Space` keys must trigger primary actions.
- **Screen Reader Support:** All non-decorative elements require `aria-label` or `aria-describedby`. The AI Mentor chat stream must utilize `aria-live="polite"` to announce new incoming messages without interrupting the user.
- **Color Contrast:** Strict WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).
- **Touch Targets:** Minimum 44x44 CSS pixels.
- **Focus States:** High-contrast, highly visible focus rings (e.g., 2px solid blue offset) are mandatory. Default browser outlines are insufficient.
- **Multilingual Accessibility:** RTL (Right-to-Left) layout support is structurally mandated for future languages (e.g., Arabic, Hebrew).

---

For the actual features rendered by this design system, see the [Feature Specification](./05_Feature_Specification.md).
