# AI Workflow Rules

## Approach

Build this project incrementally using a **Spec-Driven Workflow**. All development must be guided by the context files in the `frontend/context/` directory. 
- **Architecture.md** defines the system boundaries.
- **UI-Context.md** defines the visual language.
- **Code-Standards.md** defines implementation patterns.
- **Progress-Tracker.md** defines the roadmap.

Always implement against these specs—do not invent behavior or deviate from the established "Light & Airy" design system.

## Scoping Rules

- Work on one module (e.g., "Flight Tracking") at a time.
- Prefer small, verifiable commits over massive refactors.
- Keep frontend and backend changes synchronized but logically separated in implementation steps.

## Verification Workflow

1.  **Backend Implementation**: Create/update models, controllers, and routes.
2.  **Database Migration**: Run `npx sequelize-cli db:migrate` if schema changed.
3.  **Frontend Integration**: Build UI components and connect to API.
4.  **End-to-End Test**: Verify the feature works in the browser before marking as complete.

## Handling Ambiguity

- If a design requirement is missing, refer to existing pages for consistent styling.
- If a database relationship is unclear, check `backend/models/index.js` first.
- If a requirement is missing, add it to `progress-tracker.md` as a "Pending Requirement" before implementing.

## Protected Files

Do not modify the following unless explicitly instructed:
- `backend/config/config.json` (sensitive database credentials).
- `node_modules` or library internals.
- Legacy PHP files (unless deleting them after successful migration).

## Keeping Docs in Sync

Update context files immediately when:
- A new database table is added (`architecture.md`).
- A new global UI component is created (`ui-context.md`).
- A major feature is completed (`progress-tracker.md`).

## Completion Criteria

1. Feature works as intended in the React SPA.
2. Code follows the `.cv-` modular naming convention.
3. Backend returns standard JSON responses.
4. Progress is updated in the tracker.
