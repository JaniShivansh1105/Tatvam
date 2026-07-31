# Brand & Design System

**Document Purpose:** To outline the visual identity, UI components, and design philosophy of the Tatvam platform.
**Scope:** Typography, colors, layouts, accessibility, and component usage.
**Audience:** UI/UX Designers, Frontend Engineers.
**Revision Information:** v2.0 - Finalized Enterprise Design System

---

## 1. Brand Philosophy

Tatvam's design philosophy is rooted in **Focus, Elegance, and Intelligence.**
The platform must feel premium, frictionless, and deeply calming to reduce the cognitive load associated with intense learning.

- **Minimalism over Clutter:** White space is utilized aggressively to isolate educational content.
- **Dynamic Interaction:** Micro-animations provide tactile feedback without distracting the user.
- **Glassmorphism & Depth:** Soft shadows and blurred backdrops are used to create hierarchy without harsh borders.

---

## 2. Color Palette

The color system is designed to be accessible, high-contrast, and modern. We utilize a vibrant primary accent against soft neutrals.

| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| **Primary Accent** | `#6C5CE7` | Primary buttons, active states, AI highlights. |
| **Primary Hover** | `#5A4FCF` | Button hover states, intense interactive elements. |
| **Background (Light)**| `#FAFAFA` | Main application background. |
| **Surface (Light)** | `#FFFFFF` | Cards, modals, sidebars. |
| **Text Primary** | `#1B1D35` | Headings, primary body text. |
| **Text Secondary** | `#4A5568` | Subtitles, labels, metadata. |
| **Success (Green)** | `#38A169` | Passed quizzes, correct answers, positive notifications. |
| **Error (Red)** | `#E53E3E` | Validation errors, failed quizzes, destructive actions. |

---

## 3. Typography

Tatvam uses modern, highly legible sans-serif fonts optimized for dense reading and UI clarity.

- **Primary Font Family:** `Inter`, `system-ui`, `sans-serif`
- **Headings (H1-H3):** Font Weight 700 (Bold) or 800 (Extra Bold) with tight tracking (`-0.02em`).
- **Body Text:** Font Weight 400 (Regular) or 500 (Medium) with relaxed line height (`1.6`) for reading comprehension.

### Scale Table
| Element | Size (px) | Weight | Line Height |
| :--- | :--- | :--- | :--- |
| **H1 (Page Title)** | 28px - 32px | Bold | 1.2 |
| **H2 (Section)** | 20px - 24px | Bold | 1.3 |
| **H3 (Card Title)**| 16px - 18px | SemiBold | 1.4 |
| **Body (Main)** | 15px | Regular | 1.6 |
| **Body (Small)** | 13px | Medium | 1.5 |
| **Micro/Labels** | 11px - 12px | Bold | 1.2 (Uppercase) |

---

## 4. Layout & Grid

- **Max Width:** The dashboard content area is typically constrained to `1200px` to prevent uncomfortable line lengths.
- **Spacing Scale:** We use a 4px baseline grid. Padding and margins strictly adhere to Tailwind's spacing scale (e.g., `p-4` for 16px, `gap-6` for 24px).
- **Responsive Breakpoints:**
  - `sm`: 640px (Mobile Landscape)
  - `md`: 768px (Tablet)
  - `lg`: 1024px (Small Desktop)
  - `xl`: 1280px (Large Desktop)

---

## 5. UI Components

### Buttons
Buttons must have clear hierarchical distinction.
- **Primary:** Solid background (`bg-[#6C5CE7]`), white text, soft shadow, subtle scaling on active state (`active:scale-95`).
- **Secondary:** Transparent background, subtle border (`border-[#E2E8F0]`), text color `#4A5568`, gray hover state (`hover:bg-[#F8F9FF]`).
- **Ghost:** No background, no border, color changes on hover. Used for tertiary actions.

### Inputs & Forms
- **Style:** Light gray background (`bg-[#F8F9FF]`), subtle border (`border-[#E2E8F0]`).
- **Focus State:** White background, solid primary border (`focus:border-[#6C5CE7]`), zero outline ring.
- **Labels:** Small (`13px`), Bold, dark gray (`#4A5568`), with a 8px margin bottom.

### Cards
- **Style:** Pure white surface (`bg-white`), prominent rounded corners (`rounded-2xl` or `rounded-3xl`), and a very subtle border (`border-[#E2E8F0]`).
- **Shadows:** No harsh drop shadows. We rely on the border and negative space for separation.

### Modals & Dialogs
- **Backdrop:** Blurred glassmorphism (`backdrop-blur-sm bg-black/40`).
- **Animation:** Slide up from bottom with a slight fade in (`animate-in fade-in slide-in-from-bottom-4 duration-300`).

---

## 6. Icons

- **Library:** `lucide-react`
- **Weight:** Consistent stroke width of `2px` (or `1.5px` for larger icons).
- **Usage:** Icons are always accompanied by text unless placed inside tightly constrained toolbars (and must include `aria-label` or tooltips if standalone).

---

## 7. Accessibility (A11y)

- **Contrast Ratios:** All text must meet WCAG AA standards (4.5:1 ratio for normal text). `#1B1D35` on `#FFFFFF` significantly exceeds this.
- **Keyboard Navigation:** All interactive elements must be focusable. Focus rings should be visible (handled natively by browser or specifically styled via `focus-visible`).
- **Screen Readers:** Semantic HTML must be used. `button` for actions, `a` for navigation. Aria-labels applied to icon-only buttons.
- **Motion:** Animations are kept subtle (`duration-300`, `duration-500`) to prevent motion sickness.

---

## 8. Dark Mode (Vision)

*(Currently, Tatvam is optimized for Light Mode. Dark Mode is planned.)*
- **Backgrounds:** Deep blue/blacks (`#0F111A`).
- **Surfaces:** Elevated grays (`#1A1D2D`).
- **Accents:** Neon adjustments of the primary purple for higher contrast against dark backgrounds.
