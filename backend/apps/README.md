# Backend Apps

Each Django app in this folder owns one platform domain.

## Apps
- `accounts`
- `portfolios`
- `resumes`
- `leads`
- `billing`
- `analytics`
- `feature_flags`
- `domains`
- `platform_admin`

## Rule
Keep each app responsible for one domain boundary. Shared primitives should live in a common module rather than being duplicated across apps.
