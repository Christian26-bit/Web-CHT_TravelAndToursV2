# CHT Travel & Tours - 10x UI/UX Design System Specification

## Overview
This document serves as the foundational Spec-Driven Development context for the CHT Travel & Tours web application. It is heavily inspired by the "10x Designer Skill" and "AntiGravity Insane Websites" workflows, meaning all frontend implementations **must prioritize premium, high-fidelity visual excellence**. 

The goal is to move beyond functional Minimum Viable Products (MVPs) and deliver a state-of-the-art interface that will WOW users at first glance.

## 1. Core Philosophy
* **Aesthetics First:** Design must feel expensive, modern, and trustworthy.
* **Dynamic & Alive:** Interfaces should respond to user input with subtle micro-animations and smooth transitions.
* **Clutter-Free:** Utilize whitespace effectively. Content should breathe.
* **Component Reusability:** Build isolated, reusable components (via Shadcn, standard Tailwind, or modular CSS) that strictly adhere to these design tokens.

## 2. Design Tokens & Aesthetics

### Typography
* **Primary Fonts:** Use modern, highly legible sans-serif fonts (e.g., `Inter`, `Outfit`, or `Plus Jakarta Sans`).
* **Hierarchy:** 
  * Large, bold, and expressive headers (H1/H2).
  * Highly readable, softer-colored body text (e.g., Slate-500 or Gray-600 in Tailwind terms).
* **Styling:** Avoid default browser fonts at all costs.

### Color Palette
* **Primary/Accent Colors:** Avoid harsh, generic colors (no raw `#FF0000` or `#0000FF`). Use curated, harmonious palettes (e.g., Indigo-600, Rose-500).
* **Gradients:** Use soft, subtle gradients for backgrounds, hero sections, or primary buttons to add depth.
* **Dark Mode / Light Mode:** Sleek dark mode implementations are highly encouraged, using deep backgrounds (e.g., `#0f172a`) rather than pure black `#000000`.

## 3. UI Component Specifications

### Cards & Containers
* **Shadows:** Use large, soft, diffuse shadows (e.g., `box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08)`) instead of harsh, tight shadows.
* **Borders:** Thin, subtle borders (1px solid rgba(255,255,255,0.1) in dark mode, or very light gray in light mode).
* **Border Radius:** Generous rounded corners (e.g., `12px` to `24px` depending on the element size).
* **Glassmorphism:** Where applicable (like sticky navbars, modal backdrops, or floating cards), use backdrop-blur (`backdrop-filter: blur(12px)`) with semi-transparent background colors.

### Buttons & Inputs
* **Buttons:** Fully rounded or softly rounded. Must include hover states (slight scale up, shadow increase, or brightness change) and active states (scale down).
* **Inputs:** Generous padding, soft borders that highlight on focus with a clean ring effect.

## 4. Animation & Interactivity
* **Micro-interactions:** Buttons, links, and cards should have a transition duration of `200ms` to `300ms` with an `ease-in-out` timing function.
* **Page Loads:** Content should fade in or slide up softly when entering the viewport (avoid jarring, instant pop-ins).
* **Feedback:** Form submissions, validations, and loading states must have clear, beautiful visual indicators (spinners, skeletons, toast notifications).

## 5. Development Constraints
* **Adherence:** All new frontend PRs or feature generations must be cross-checked against this document.
* **Placeholders:** Never use generic placeholders. Use generated images, proper dummy data, and real-looking icons (e.g., Lucide Icons) during development.
* **Framework:** Standardized on the existing React stack, ensuring Tailwind / custom CSS strictly follows these design tokens.
