# Backend Architecture

## Purpose
The backend will replace the current localStorage-backed data model with a server-owned platform API.

## Stack
- Django
- Django REST Framework
- PostgreSQL
- Celery and Redis for background jobs later

## Domain Apps
- `accounts`
- `portfolios`
- `resumes`
- `leads`
- `billing`
- `analytics`
- `feature_flags`
- `domains`
- `platform_admin`

## API Shape
- `/api/auth/*`
- `/api/portfolios/*`
- `/api/public/portfolios/:slug`
- `/api/resumes/*`
- `/api/leads/*`
- `/api/billing/*`
- `/api/analytics/*`
- `/api/domains/*`
- `/api/flags`
- `/api/admin/*`

## Operating Principles
- Roles, subscriptions, and entitlements are always server-owned.
- Public rendering should work by slug or custom hostname.
- Billing, lead capture, and analytics must never depend on browser-only state.
