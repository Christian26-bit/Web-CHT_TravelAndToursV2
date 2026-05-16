# UI Context (Light & Airy v2.1 - Figma Aligned)

## Vision
The CHT Platform UI/UX is built on the "Light & Airy" design system, officially synchronized with the Figma source. It is a high-fidelity, premium technical workspace that prioritizes visual clarity, depth through layering, and high-trust administrative aesthetics.

## Core Design Tokens (Figma Verified)

### 1. Colors
| Role            | Hex Code           | Tailwind Utility       | Note |
| --------------- | ------------------ | ---------------------- | ---- |
| **Primary Blue**| `#007BFF`           | `bg-[#007BFF]`         | Official CHT Brand Blue |
| Secondary Blue  | `#0059BC`           | `bg-[#0059BC]`         | Hover/Pressed state |
| Base Background | `#F0F1F1`           | `bg-[#F0F1F1]`         | Neutral high-trust base |
| Surface Primary | `#FFFFFF`           | `bg-white`             | For all cards and panels |
| Success         | `#10B981`           | `bg-emerald-500`       | High-trust fulfillment |
| Danger          | `#EF4444`           | `bg-red-500`           | Critical interventions |
| Text Primary    | `#1C1C1E`           | `text-slate-900`       | High-readability black |
| Text Muted      | `#7D7F86`           | `text-slate-500`       | Secondary metadata |

### 2. Typography
- **Primary Font**: **Inter** (Figma Source)
- **Hierarchy**:
  - `Display Titles`: `text-[36px]`, `font-black`, `tracking-tighter`.
  - `Section Titles`: `text-[24px]`, `font-black`, `tracking-tight`.
  - `Metric Numbers`: `text-[32px]`, `font-black`, `tracking-tighter`.
  - `Body Copy`: `text-[14px]`, `font-medium`, `leading-relaxed`.

### 3. Geometry (Figma Specs)
- **Primary Containers**: `rounded-[40px]`.
- **Dashboard Cards**: `rounded-[24px]` or `rounded-[32px]`.
- **Action Buttons**: `rounded-xl` (12px) to `rounded-2xl` (16px).
- **Shadows**: Soft, subtle shadows (e.g., `shadow-xl shadow-slate-200/50`).

## Component Patterns

### Stat Cards (Figma Pattern)
- Title and Metric on the left.
- Icon in a colored circular background on the right.
- Soft shadow and 32px corners.

### Master-Detail Registry
- Vertical navigation on the left (Master).
- Detailed operational timeline or data panel on the right (Detail).
- Timeline uses 16px circular indicators.

### Booking Wizard
- Step indicators: `32px` circles.
- Active: Blue background, white text.
- Future: Gray background, gray text.
- Completed: Blue background, white checkmark.
