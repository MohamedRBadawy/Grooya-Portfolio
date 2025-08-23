
# Product Requirements Document: Grooya Portfolio Hub

**Author:** World-Class Senior Frontend Engineer
**Status:** In Development
**Version:** 1.0
**Date:** [Current Date]

---

## 1. Introduction & Executive Summary

The Grooya Portfolio Hub is the foundational component of the Grooya AI Career Operating System. It is an intuitive, AI-powered, no-code website builder designed specifically for tech-savvy professionals. Its purpose is to empower users to create beautiful, professional, and highly-customizable online portfolios in minutes, not days. By leveraging generative AI for content, design, and asset creation, we eliminate the friction and "blank canvas" problem associated with traditional portfolio builders, allowing our users to focus on what matters most: showcasing their skills and landing their next opportunity.

## 2. Problem Statement

Modern professionals, especially in the tech industry, need a compelling online presence to attract job offers and freelance clients. However, the current tools are inadequate:
*   **Website Builders (e.g., Webflow, Framer):** Powerful but have a steep learning curve and are overkill for a personal portfolio.
*   **Portfolio Platforms (e.g., Behance):** Often too niche (e.g., design-only) and offer limited customization.
*   **Professional Networks (e.g., LinkedIn):** Too generic and fail to adequately showcase the depth and quality of a user's project work.

There is a clear market need for a tool that is **simple, powerful, highly customizable, and intelligent**. Professionals need a "co-pilot" that not only provides the tools to build but also the guidance to build *effectively*.

## 3. Goals & Objectives

*   **User Goal:** To create and publish a world-class, professional online portfolio with minimal time and effort, resulting in a showcase they are proud to share.
*   **Business Goal (MVP):** Validate the core value proposition of an AI-assisted portfolio and resume building experience. Establish a strong product foundation that can be expanded into the full "Career OS" vision.
*   **Success Metric Goals:**
    *   **Activation:** Achieve a 40% activation rate (defined as a user publishing at least one portfolio) within the first 7 days of signing up.
    *   **Engagement:** See an average of 5+ blocks per portfolio and an average of 3+ AI feature uses per active user.
    *   **Retention:** Achieve a 20% 30-day retention rate for users who have published a portfolio.

## 4. Target Audience

*   **Primary:** Ambitious, tech-savvy professionals (Software Developers, UX/UI Designers, Product Managers, Data Scientists, etc.) looking for new job opportunities or freelance clients.
*   **Secondary:** Students and recent graduates in tech fields who need to build their first professional portfolio.
*   **Geographic Focus:** While global, the product is designed with a "first-principles" approach for the MENA (Middle East & North Africa) region, including native Arabic language and RTL layout support.

## 5. Feature Scope

### 5.1. Completed Features (Current MVP)

**Core Portfolio Functionality:**
*   **Portfolio Management:** Full CRUD (Create, Read, Update, Delete) and Duplicate functionality.
*   **Block-Based Editor:** An intuitive editor where the portfolio is composed of modular content blocks.
*   **Drag-and-Drop Reordering:** Users can easily reorder blocks on a page.
*   **Multi-Page Architecture:** Users can create multiple pages within a portfolio (e.g., Home, About, Contact).
*   **Public Portfolio View:** Published portfolios are accessible via a unique, shareable slug.

**Content Blocks:**
*   A comprehensive library of 15+ block types, including Hero, About, Projects, Skills, Experience, Gallery, Testimonials, Contact Form, Code Snippets, and more.

**Design & Customization:**
*   **Global Design System:** Centralized control over the portfolio's entire look and feel.
*   **Pre-designed Color Palettes:** A selection of themes (Light, Dark, Mint, Rose).
*   **Custom Palette Editor:** Users can create and save their own color schemes.
*   **Typography Controls:** Curated font pairings, font size scaling, weight, line height, and letter spacing.
*   **Layout Controls:** Global settings for page width, section spacing, corner radius, and shadow styles.
*   **Advanced UI Theming:** Granular control over button styles, fill modes, and hover effects.
*   **Per-Block Style Overrides:** Ability to override global design settings for any individual block, including custom backgrounds (solid color, gradient, image), padding, and text color.
*   **Shape Dividers:** Add SVG shape dividers between sections.

**AI-Powered Features (Powered by Gemini API):**
*   **AI-Guided Onboarding:** An "AI Mentor" that guides new users through a step-by-step portfolio creation process based on their stated career goals.
*   **AI Content Generation:** "Generate with AI" buttons for Hero (headline/subheadline) and About sections.
*   **AI Project Descriptions:** Generate professional project descriptions from a title and list of technologies.
*   **AI Design Suggestions:** Generate a complete design theme (colors, fonts) based on the user's professional title.
*   **AI Image Generation:** An integrated tool to generate images from text prompts and add them to an asset library.
*   **AI Portfolio Review:** An "AI Mentor" provides structured, actionable feedback on the portfolio's content and structure.

**Resume Builder Integration:**
*   **Resume Management:** Full CRUD for creating and managing multiple resumes.
*   **AI Resume Generation:** Create a complete, professional resume from the data in a user's portfolio.
*   **AI Resume Tailoring:** Paste a job description to have the AI rewrite and optimize a base resume with relevant keywords and a tailored summary.

**General UX/UI:**
*   **Full Internationalization (i18n):** Native support for English (LTR) and Arabic (RTL).
*   **Full Mobile Responsiveness:** The application, editor, and public portfolios are all optimized for all screen sizes.
*   **Light/Dark Mode:** User-selectable light and dark themes for the application interface.
*   **Command Palette:** `Cmd/Ctrl+K` interface for quick actions within the editor.
*   **Undo/Redo:** Full history state management within the editor.
*   **Auto-Saving & Toast Notifications:** A modern, non-blocking user experience.

### 5.2. Planned Features (Roadmap)

**Advanced Design & Effects:**
*   **User-Saved Design Presets:** Allow users to save their complete design system settings as a reusable preset.
*   **Advanced Backgrounds:** Support for video backgrounds on blocks.
*   **Advanced Scroll Effects:** "Reveal" animations and other scroll-triggered effects.

**Performance & Quality of Life:**
*   **Image Optimization:** Implement lazy-loading and serve images in modern, optimized formats (e.g., WebP).
*   **Component Lazy Loading:** Code-split the application so users only download the code for the blocks they are actively viewing.
*   **Interactive Onboarding Tour:** A guided product tour for new users highlighting key editor features.
*   **PWA Support:** Enable basic offline functionality and "Add to Home Screen" capability.

**Accessibility:**
*   **High Contrast Mode:** A toggle to switch to a WCAG AA compliant color scheme.
*   **Reduced Motion Toggle:** An override to disable all non-essential animations.

### 5.3. Development Prioritization

*   **Phase 1: Core Authenticated Experience (Current Focus):** All development efforts will be focused on building and refining the features available to a logged-in user. This includes the portfolio editor, project management, resume builder, and user settings.
*   **Phase 2: Public-Facing & User Acquisition:** Public marketing pages, such as the main landing page and template previews, are deferred until the core application experience is complete and polished.

## 6. Features Out of Scope (For This Product)

*   **Strict Portfolio/Resume Focus:** The system will **not** include features outside of the core portfolio/resume creation and management loop. This explicitly excludes job application trackers, learning management systems (LMS), client/freelance project management suites, or social networking components, which are reserved for potential future products.

## 7. User Journey / Flow

1.  **Onboarding:** A new user signs up and is immediately greeted by the AI Mentor. They select their primary goal (e.g., "Get a job") and enter their professional title.
2.  **Guided Creation:** The AI Mentor creates a new portfolio and guides the user through adding and filling out the most critical sections first: Hero, About, and Projects. The user can leverage the AI Co-pilot to generate content.
3.  **Customization:** The user customizes the portfolio's look and feel in the Design Studio, either manually or by using an AI-generated suggestion.
4.  **Asset Creation:** The user uploads their own images or uses the AI Image Generator to create unique backgrounds and project visuals.
5.  **Publishing:** The user previews their site on mobile and desktop, then publishes it to a public URL.
6.  **Leveraging:** The user generates a professional resume from their new portfolio data and uses the AI Tailor to optimize it for a specific job application.
