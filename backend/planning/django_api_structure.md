
# Grooya Backend Requirements - Django API

This document outlines the architectural plan for the Grooya backend, built with Django and Django REST Framework (DRF). The core philosophy is to **minimize complexity** by leveraging Django's built-in features while providing a powerful and scalable API to support a world-class user experience.

---

## 1. Core Simplification Strategy: JSONField

To avoid creating a complex web of dozens of database models for each portfolio block (`HeroBlock`, `AboutBlock`, etc.) and every design property, we will embrace Django's `JSONField`.

-   **Portfolio Structure:** The entire `pages` array, including all `blocks` within it, will be stored in a single `JSONField` on the `Portfolio` model.
-   **Design System:** The entire `design` object will be stored in another `JSONField`.

### Why this is simpler and better:
-   **Drastic Model Reduction:** We go from 20+ potential models to just a handful of core ones.
-   **Flexibility:** The frontend can evolve the block structure and add new block types without requiring any backend database migrations.
-   **Performance:** Fetching a portfolio is a single database read, not a series of complex joins.
-   **Frontend/Backend Parity:** The data structure in the database directly mirrors the TypeScript types on the frontend, making serialization and deserialization trivial.

---

## 2. Django Model Definitions

We will define a small number of core models.

-   **`User` (extends `django.contrib.auth.models.AbstractUser`)**
    -   We'll use Django's built-in User model and extend it.
    -   `title`: `CharField` (e.g., "Senior Frontend Engineer")
    -   `bio`: `TextField`
    -   `avatar_url`: `URLField`
    -   `subscription_tier`: `CharField` (choices: 'free', 'pro')
    -   `ai_text_credits`: `IntegerField`
    -   `ai_image_credits`: `IntegerField`

-   **`Portfolio`**
    -   `user`: `ForeignKey` to `User` (owner)
    -   `title`: `CharField`
    -   `slug`: `SlugField` (unique)
    -   `design`: `JSONField` (stores the entire design object)
    -   `pages`: `JSONField` (stores the entire array of pages and their blocks)
    -   `is_published`: `BooleanField`
    -   `is_guided`: `BooleanField` (for AI mentor tracking)
    -   `goal`: `CharField` (choices: 'job', 'freelance', 'personal')
    -   `role`: `CharField`
    -   `created_at`, `updated_at`: `DateTimeField` (auto-managed)

-   **`Project`**
    -   `user`: `ForeignKey` to `User` (owner)
    -   `title`: `CharField`
    -   `description`: `TextField`
    -   `image_url`: `URLField`
    -   `technologies`: `JSONField` (stores an array of strings)
    -   `link`: `URLField`

-   **`Skill`**
    -   `user`: `ForeignKey` to `User` (owner)
    -   `name`: `CharField`
    -   `category`: `CharField` (choices: 'Language', 'Framework', 'Tool', etc.)

-   **`Resume`**
    -   `user`: `ForeignKey` to `User` (owner)
    -   `title`: `CharField`
    -   `content`: `JSONField` (stores all resume sections like summary, experience, etc.)
    -   `created_at`, `updated_at`: `DateTimeField` (auto-managed)

-   **`PortfolioAsset`**
    -   `user`: `ForeignKey` to `User` (owner)
    -   `file`: `ImageField` (handles the actual image file upload)
    -   `prompt`: `TextField` (for AI-generated images)
    -   `created_at`: `DateTimeField` (auto-managed)

---

## 3. API Endpoint Structure (Django REST Framework)

We will use DRF's `ModelViewSet` to automatically generate most CRUD (Create, Read, Update, Delete) endpoints.

-   **Authentication (`/api/auth/`)**
    -   Use JWT (JSON Web Tokens) for modern, stateless authentication.
    -   `/api/auth/register/`: Create a new user.
    -   `/api/auth/login/`: Obtain a JWT access/refresh token.
    -   `/api/auth/user/`: Get the current logged-in user's data.

-   **Portfolios (`/api/portfolios/`)**
    -   `GET /`: List all portfolios for the authenticated user.
    -   `POST /`: Create a new portfolio.
    -   `GET /<id>/`: Retrieve a specific portfolio.
    -   `PUT/PATCH /<id>/`: Update a portfolio.
    -   `DELETE /<id>/`: Delete a portfolio.
    -   **Public View:** `GET /api/public/portfolios/<slug>/` - A separate, **unauthenticated** endpoint to fetch the data for a published portfolio.

-   **Projects (`/api/projects/`)**
    -   Full CRUD endpoints for the user's project library.

-   **Skills (`/api/skills/`)**
    -   Full CRUD endpoints for the user's skills.

-   **Resumes (`/api/resumes/`)**
    -   Full CRUD endpoints for the user's resumes.

-   **Assets (`/api/assets/`)**
    -   `GET /`: List all of the user's image assets.
    -   `POST /`: Upload a new image asset.
    -   `DELETE /<id>/`: Delete an asset.

-   **AI Services (`/api/ai/`)**
    -   **This is a critical UX and security improvement.** The frontend will no longer call the Gemini API directly. It will call our backend, which then securely calls the Gemini API with a hidden key.
    -   `POST /api/ai/generate-text/`: A generic endpoint for all text-based AI generation (hero content, project descriptions, resume tailoring). The request body will specify the `task` and its `payload`.
    -   `POST /api/ai/generate-image/`: An endpoint that takes a prompt, calls the image generation model, and handles storing the resulting image (e.g., to S3) and creating a `PortfolioAsset` record.

---

## 4. Key Implementation Details

-   **Authentication:** Use `dj-rest-auth` and `djangorestframework-simplejwt` for a quick and secure JWT setup.
-   **Permissions:** Create a custom DRF `IsOwner` permission class to ensure users can only access and modify their own data. The public portfolio endpoint will use the `AllowAny` permission.
-   **Image/Asset Storage (UX Enhancement):** Instead of storing images on the server's filesystem, we will use a cloud storage solution like AWS S3 or Cloudinary, managed via the `django-storages` library. This is far more scalable and performant (enabling CDN delivery).
-   **Django Admin (Huge Simplification):** By simply registering our models with the Django Admin, we get a complete, secure "Admin Dashboard" for free. This entirely covers the "Phase 4: Administration & Platform Management" section of the frontend plan with almost no extra work. Admins can manage users, view all portfolios, unpublish content, etc., directly from this interface.
