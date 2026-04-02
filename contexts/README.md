# Contexts

This folder contains application-level state providers.

## Current Responsibilities
- `AuthContext`: login/session state for the frontend shell
- `DataContext`: application data facade for portfolios, resumes, projects, and user state
- `LocalizationContext`: language, direction, and theme state

## Refactor Direction
- Keep contexts focused on orchestration and UI state.
- Move domain rules into named helpers and service modules.
- Gradually replace browser-owned persistence with typed API repositories.
