

# Grooya - Full Application Structure & Roadmap

This document outlines the complete architectural plan for the Grooya AI Career Operating System, detailing every page, component, and feature. It serves as a master checklist to track development progress.

## ✅ Phase 1: Core MVP & Editor Experience (Completed)

This phase established the foundational elements of the application, focusing on the core user journey of creating, editing, and managing a single portfolio.

-   **[x] Public & Authentication Pages**
    -   `[x]` **Public Portfolio Page:** Dynamically renders a user's portfolio based on a slug.
    -   `[x]` **Simulated Authentication:** A simplified auth flow that always treats the user as logged in, removing the need for actual login/signup pages in the MVP.
-   **[x] Core Application Pages**
    -   `[x]` **Dashboard / Portfolio List Page:** Lists all user portfolios with primary actions.
    -   `[x]` **Portfolio Editor Page:** The central workspace with a live preview and sidebar controls.
    -   `[x]` **Project Management Page:** A global library for managing projects.
    -   `[x]` **Resume Builder (List & full-featured Editor for all sections):** Dedicated pages for creating and editing resumes.
-   **[x] Settings & Account Pages**
    -   `[x]` **User Profile Page:** Form to update user details.
    -   `[x]` **Upgrade / Billing Page:** A page to display subscription tiers and simulate upgrades.
-   **[x] Supporting Features & UI Components**
    -   `[x]` **Command Palette:** `Cmd/Ctrl+K` for quick actions.
    -   `[x]` **Undo/Redo Functionality:** Client-side history in the editor.
    -   `[x]` **Theme & Language Switchers:** Controls for light/dark mode and en/ar languages.

## Phase 2: Public Presence & User Acquisition (On Hold)

This phase focuses on building the public-facing "storefront" of the application to attract new users and showcase the product's capabilities. **Development on this phase is currently paused to focus on the core authenticated user experience.**

-   **[ ] Public & Authentication Pages**
    -   `[ ]` **Landing Page:** The main marketing page.
        -   `[ ]` Hero section with a clear value proposition and CTA.
        -   `[ ]` Features section detailing what Grooya offers.
        -   `[ ]` Template showcase section with links to previews.
        -   `[ ]` Pricing tier comparison table.
        -   `[ ]` FAQ section.
        -   `[ ]` Footer with legal links.
    -   `[ ]` **Authentication Pages (Real Implementation):**
        -   `[ ]` Sign Up Page with social login options (Google/GitHub).
        -   `[ ]` Login Page.
        -   `[ ]` Forgot/Reset Password flow.
    -   `[ ]` **Public "Template Preview" Page:** A route (`/templates/:templateId`) to display a live, non-editable preview of an official template.
    -   `[ ]` **Terms of Service & Privacy Policy Pages:** Static legal pages.
    -   `[ ]` **Custom 404 "Not Found" Page:** A user-friendly error page.

## Phase 3: Enhancing the Core Product Loop

This phase improves the user experience within the authenticated application, making it more powerful and intuitive.

-   **[ ] Core Application Pages**
    -   `[ ]` **Asset Library Page/Modal:** A central place to view and manage all user images.
        -   `[ ]` Grid view of all uploaded and AI-generated assets.
        -   `[ ]` Ability to upload new images.
        -   `[ ]` Ability to delete unused assets.
-   **[ ] Supporting Features & UI Components**
    -   `[ ]` **Onboarding Tour:** A guided, step-by-step tutorial for new users in the editor (e.g., using a library like Shepherd.js).
    -   `[ ]` **PWA (Progressive Web App) Support:**
        -   `[ ]` Create a `manifest.json` file.
        -   `[ ]` Implement a service worker for basic offline caching of the editor shell and assets.

## ✅ Phase 4: Administration & Platform Management (Completed)

This phase involves building the necessary tools for administrators to manage the platform, users, and content. This would typically require a full backend, but we will simulate the UI for these features.

-   **[x] Admin Dashboard Pages (Authenticated Admin Role)**
    -   `[x]` **Admin Dashboard Overview:**
        -   `[x]` UI for displaying key metrics (Total Users, Signups, etc.).
        -   `[x]` UI for charts and recent activity.
    -   `[x]` **User Management Page:**
        -   `[x]` UI for a searchable, filterable table of users.
        -   `[x]` UI for admin actions (view details, manage subscription, suspend).
    -   `[x]` **User Detail Page:**
        -   `[x]` UI to display a single user's full profile, subscription, usage, and portfolios.
    -   `[x]` **Portfolio Management Page:**
        -   `[x]` UI for a searchable table of all portfolios.
        -   `[x]` UI for admin actions (view, unpublish, feature as template).
    -   `[x]` **Template Management Page:**
        -   `[x]` An interface to create and manage the official templates.
    -   `[ ]` **Platform Settings Page:**
        -   `[ ]` UI for managing subscription plan details.
        -   `[ ]` UI for a feature flag system.
        -   `[ ]` UI for creating global announcement banners.
