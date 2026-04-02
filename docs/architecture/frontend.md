# Frontend Architecture

## Purpose
The frontend is moving from a browser-owned demo application to a production client that talks to a Django API.

## Current Direction
- Keep React + Vite.
- Keep the editor experience intact while separating domain logic from view components.
- Introduce typed service modules for plans, feature flags, portfolio presets, and API access.

## Target Module Boundaries
- `auth`: login, session state, route protection
- `portfolio-editor`: editor containers, autosave, page/block management
- `portfolio-public`: public rendering, SEO, analytics hooks
- `resumes`: resume creation, editing, exporting
- `billing`: plan catalog, checkout entrypoints, customer portal
- `admin`: feature flags, promo/admin tooling
- `shared-ui`: reusable design-system components

## Readability Rules
- Each feature folder should contain a short `README.md`.
- Hooks, services, and contexts must start with a short responsibility comment.
- Exported functions and types should use JSDoc/TSDoc.
- Inline comments should explain intent or tricky logic, not restate obvious code.
- Avoid anonymous domain logic inside component trees when a named helper would be clearer.
