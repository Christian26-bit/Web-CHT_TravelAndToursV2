# UI Fixes & Known Issues

Reference: [Antigravity UI/UX Skill](https://www.youtube.com/watch?v=9cf2-BoWsDc) | [Shadcn UI](https://ui.shadcn.com/) | [Tweakcn](https://tweakcn.com/community)

## Critical Layout Issues

### 1. Sidebar Content Clipping (ALL PAGES)
- **Status**: ✅ **FIXED**
- **Action**: Updated `Layout.jsx` with guaranteed 280px margin and removed `max-w` constraints from main views.

### 2. Booking Wizard Step Indicator Overflow
- **Status**: ✅ **FIXED**
- **Action**: Redesigned for 7 steps; reduced circle sizes and used brand blue `#007BFF`.

### 3. Booking Summary Panel Overlap
- **Status**: ✅ **FIXED**
- **Action**: Summary width reduced to 300px; switched to responsive grid columns.

## Design System Inconsistencies

### 4. Mixed Color Tokens
- **Status**: ✅ **FIXED**
- **Action**: `index.css` now maps all `.cv-` classes to the official CHT hex palette. Hardcoded Tailwind blues replaced.

### 5. Inconsistent Border Radius
- **Status**: 🔄 **IN PROGRESS**
- **Note**: Standardizing to `rounded-2xl` (16px) for cards.

### 6. Typography Weight Variations
- **Status**: 🔄 **IN PROGRESS**
- **Action**: Standardizing to `font-black` (900) for titles and `font-bold` for section headers. Added `tracking-tight` to all headings for Shadcn-feel.

## Shadcn Design Standards (v2.1)
1. **Borders over Shadows**: Use `border border-slate-200` instead of heavy shadows for cards.
2. **Typography**: Use **Inter** font. Headings must be `tracking-tight` and `font-black`.
3. **Muted Foreground**: Use `text-slate-500` for secondary text and labels.
4. **Button Shape**: Standardize to `rounded-xl` (12px) for a modern, slightly soft edge.
5. **Generous White Space**: Increase padding to `p-8` or `p-10` for main content cards.

## Page-Specific Progress

| Page | Status | Action Taken |
| :--- | :--- | :--- |
| **Sidebar** | ✅ FIXED | Added CHT logo image and brand colors. |
| **Topbar** | ✅ FIXED | Standardized search bar and brand tokens. |
| **Transportation**| ✅ FIXED | Redesigned with metrics, search, and `.cv-table`. |
| **Hotels** | ✅ FIXED | Redesigned with metrics, search, and `.cv-table`. |
| **Clients** | ⏳ NEXT | Need to apply premium metrics and table. |
| **Payments** | ⏳ NEXT | Need to apply premium metrics and table. |
| **Dashboard** | ⏳ NEXT | Need to audit for brand colors and metrics. |
| **Login** | ⏳ NEXT | Need visual audit. |
