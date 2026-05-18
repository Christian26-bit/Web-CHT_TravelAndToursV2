# Project Strategy: Light & Airy Travel (React/Vite)

## 1. Core Configuration Reference

Use these exact configurations for any file initialization or component generation.

### shadcn/ui (`components.json`)

- **Style:** New York
- **Base Color:** Slate
- **JSX/JS:** Enabled (rsc: false, tsx: false)
- **Pathing:** Uses `@/` aliases for components, lib, and hooks.

### tweakcn Theme Tokens (`theme.json`)

- **Vibe:** Light and Airy Travel
- **Radius:** `0.75rem` (Soft, modern rounded corners)
- **Primary Color:** HSL `210 100% 50%` (Vivid Travel Blue)
- **Backgrounds:** Pure white for light mode; Deep Navy-Slate for dark mode.

## 2. Engineering Directives

### A. Component Implementation (The "shadcn" Way)

- **Strict Logic:** Always use shadcn primitives (Button, Card, Input).
- **Modification:** When creating a "Travel Card," do not write custom CSS. Compose it using:
  ```jsx
  import { Card, CardHeader, CardContent } from "@/components/ui/card";
  import { cn } from "@/lib/utils";
  ```
