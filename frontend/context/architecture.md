# Architecture Context

## Stack

| Layer     | Technology                  | Role   |
| --------- | --------------------------- | ------ |
| Framework | Vite + React (JavaScript)   | Frontend SPA Framework |
| Styling   | Vanilla CSS + Tailwind CSS  | Design System & Utility-first styling |
| State     | React Context (Auth)        | Global state management |
| API Client| Axios                       | Communication with Backend |
| Backend   | Node.js + Express           | RESTful API & Server-side logic |
| Database  | MySQL + Sequelize ORM       | Relational data storage & modeling |
| Tooling   | Sequelize CLI               | Database migrations & seeding |

## System Boundaries

- `frontend/src/pages` — High-level page components and layout structures.
- `frontend/src/components` — Reusable UI components (Sidebar, Topbar, Timeline).
- `backend/controllers` — Business logic and data processing for API requests.
- `backend/models` — Sequelize definitions for database tables and associations.
- `backend/migrations` — Historical record of database schema changes.

## Storage Model

- **MySQL Database**: Primary storage for Clients, Bookings, Flights, Journeys, Employees, and Resources.
- **Sequelize ORM**: Handles the abstraction layer, including complex associations (e.g., Booking belongs to Client, hasMany ClientJourneys).

## Auth and Access Model

- **Authentication**: Custom JWT-based authentication. Users sign in via `/api/auth/login`.
- **JWT Middleware**: `verifyToken.js` ensures that only authenticated requests reach the controller logic.
- **Role-Based Access (RBAC)**: 
  - `admin`: Full access to employee management, system settings, and all resources.
  - `user` (Employee): Access to bookings, clients, and trip monitoring for their assigned tasks.
- **Protected Routes**: React Router checks role and authentication status before rendering pages.
