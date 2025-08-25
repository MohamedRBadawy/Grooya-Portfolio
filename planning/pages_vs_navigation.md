
# Pages Panel vs. Navigation Section: A Technical Explanation

In the Grooya editor, the concepts of "Pages" and "Navigation" are intentionally separated to provide maximum flexibility and control. Understanding their relationship is key to building multi-page portfolios effectively.

---

## 1. The Pages Panel: Defining Structure

The **Pages Panel** is the architectural blueprint of your portfolio. Its sole responsibility is to manage the fundamental pages that make up your site.

### Key Functions:
-   **Creation & Deletion:** This is where you create or remove entire pages (e.g., an "About" page, a "Contact" page).
-   **Naming & URL (Path):** You define the page's name (e.g., "About Me") and its URL path (e.g., `/about`).
-   **Setting the Home Page:** You designate which single page serves as the root of your portfolio (the `/` path).

Think of the Pages Panel as the **sitemap or file manager** for your portfolio. It determines **what pages exist**, but not necessarily how a user gets to them.

  <!-- Fictional image placeholder -->

---

## 2. The Navigation Section: Crafting the User Journey

The **Navigation Section**, located within the Design Panel, controls the main menu that your visitors use to move around the site (typically the header).

### Key Functions:
-   **Link Creation:** Add, remove, and reorder the links that appear in your navigation bar.
-   **Custom Labels:** The text of a navigation link can be different from the page's actual name (e.g., a page named "My Professional Background" can have a link labeled "Experience").
-   **Targeting:** A navigation link "points" to a target. This target can be:
    1.  **A Page:** The most common use case (e.g., a "Contact" link that navigates to the `/contact` page).
    2.  **A Specific Block on a Page:** This allows for creating one-page scrolling sites or linking to specific sections from any page (e.g., a "Projects" link that scrolls down to the Projects block on the Home page).

Think of the Navigation section as the **table of contents or the menu builder**. It determines **how pages are presented** to the user for navigation.

  <!-- Fictional image placeholder -->

---

## The Relationship: Structure vs. Presentation

The relationship between the two panels can be summarized as **Structure vs. Presentation**.

-   **Dependency:** The Navigation section is **dependent** on the Pages Panel. You cannot create a navigation link that points to a page that doesn't exist. You must create the page first in the Pages Panel.

-   **Decoupling for Flexibility:** They are separate for a crucial reason: **You may not want every page to appear in your main navigation.**
    -   **Example 1: Hidden Pages:** You might have a "Thank You" page that users are redirected to after submitting a contact form. This page needs to exist (and is created in the Pages Panel), but you wouldn't add it to your main header navigation.
    -   **Example 2: One-Page Sites:** You might only have one page in your Pages Panel (the Home page). In the Navigation section, you can create multiple links ("About", "Projects", "Contact") that all point to different blocks on that single page, creating a smooth scrolling experience.

### Summary

| Feature            | Pages Panel                                  | Navigation Section (in Design Panel)                  |
| ------------------ | -------------------------------------------- | ----------------------------------------------------- |
| **Purpose**        | Manages the site's structure and URLs        | Manages the user-facing navigation menu (header)      |
| **Core Question**  | **What** pages exist?                        | **How** do users navigate between them?               |
| **Controls**       | Page creation, deletion, renaming, home page | Link creation, reordering, labeling, targeting      |
| **Analogy**        | Sitemap / File Manager                       | Table of Contents / Menu Builder                      |

By keeping these concerns separate, Grooya provides the power to build both simple one-page sites and complex multi-page portfolios with a clear and logical workflow.