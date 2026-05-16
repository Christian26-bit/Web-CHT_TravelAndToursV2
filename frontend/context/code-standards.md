# Code Standards

## General Principles

- **Single Responsibility**: Keep components and functions small and focused on a single task.
- **Maintainability**: Write clean, self-documenting code. Use descriptive variable and function names.
- **Root Cause Resolution**: Fix bugs at their source rather than layering workarounds.
- **Modern Standards**: Follow ES6+ practices and React best practices (Hooks, Functional Components).

## React (Vite)

- **Functional Components**: Use functional components with hooks (`useState`, `useEffect`, `useCallback`).
- **Prop Drilling**: Avoid deep prop drilling; use React Context (e.g., `AuthContext`) for global state.
- **Component Lifecycle**: Be mindful of effect dependencies to prevent infinite loops or memory leaks.
- **API Communication**: Use the standardized `api` axios instance for all backend requests to ensure consistent auth headers.

## Node.js / Express

- **MVC Pattern**: Follow the Model-Controller-Route pattern. Controllers should contain the business logic.
- **Sequelize ORM**: Use Sequelize for all database operations. Avoid raw SQL queries unless absolutely necessary for performance.
- **Error Handling**: Use try-catch blocks in controllers and return consistent response shapes (`{ success: true/false, data: ..., error: ... }`).
- **Middleware**: Use middleware for authentication (`verifyToken`) and validation.

## Styling (Tailwind + CSS)

- **Utility First**: Use Tailwind CSS for rapid layout and spacing adjustments.
- **Modular Design**: Prefer the `.cv-` modular classes defined in the global design system for consistent UI elements (buttons, inputs, cards).
- **Aesthetics**: Follow the "Light & Airy" v2.0 design rules—use consistent border radii (`rounded-2xl`) and shadow tokens.

## File Organization

- `frontend/src/pages/` — Top-level view components.
- `frontend/src/components/` — Reusable, atomic UI components.
- `backend/controllers/` — Logic for handling API requests.
- `backend/models/` — Sequelize database models and associations.
- `backend/routes/` — Endpoint definitions grouped by concern (admin, user, auth).

## Data Integrity

- **Migrations**: Always use Sequelize migrations to modify the database schema.
- **Seeders**: Maintain robust seeders to ensure the development environment can be fully populated with demo data.
- **Validation**: Validate incoming request bodies in the backend before processing them.
