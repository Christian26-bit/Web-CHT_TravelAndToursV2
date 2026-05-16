# CHT Travel & Tours - AI Assistant Guide

## Context Files (Read in order)

1. `context/project-overview.md` — product definition & goals
2. `context/architecture.md` — system structure & boundaries
3. `context/ui-context.md` — design system & components
4. `context/code-standards.md` — implementation rules
5. `context/ai-workflow-rules.md` — development workflow
6. `context/progress-tracker.md` — current state & roadmap
7. `context/ui-fixes.md` — known UI bugs & design debt

## Context Continuity (Multi-Model Support)

This project uses **Spec-Driven Development (SDD)**. If you are a new model (Claude, Gemini, etc.) joining this session:
- **READ ALL** files in the `context/` folder before making changes.
- **NEVER** invent behavior; follow the specs in `ui-context.md` and `code-standards.md`.
- **UPDATE** `progress-tracker.md` after your task is complete to maintain history for the next model.


## Quick Commands

- **Backend Dev**: `cd backend && npm run dev`
- **Frontend Dev**: `cd frontend && npm run dev`
- **Migration**: `npx sequelize-cli db:migrate`
- **Seeding**: `npx sequelize-cli db:seed:all`
- **Rollback**: `npx sequelize-cli db:migrate:undo`

## Invariants
- Use `.cv-` class prefix for all modular UI elements.
- Always return JSON with `{ success: boolean, data?: any, error?: string }`.
- Maintain the "Light & Airy" v2.0 premium aesthetic using CHT hex palette (`#007BFF`, `#F0F1F1`, etc.).
- Check `ui-fixes.md` before building new UI to avoid repeating known issues.
- Update `progress-tracker.md` after every feature implementation.
