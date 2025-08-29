# Grooya - Codebase Refactoring & Architectural Enhancement Plan

**Objective:** To systematically refactor the Grooya codebase to improve maintainability, readability, and scalability. This plan focuses on deconstructing large, monolithic files, refining the application's data flow, and establishing clear standards for code clarity and documentation.

---

## 1. Guiding Principles

Our refactoring efforts will be guided by established software engineering principles to ensure a high-quality, long-lasting architecture:

1.  **Single Responsibility Principle (SRP):** Each component, hook, or file should have one primary responsibility and reason to change.
2.  **Componentization:** Large UI structures should be broken down into smaller, self-contained, and reusable components.
3.  **Hook Abstraction:** Complex or reusable state logic should be extracted from components into custom hooks.
4.  **Don't Repeat Yourself (DRY):** Redundant code should be consolidated into shared helpers, services, or components.
5.  **Code Clarity:** Code should be easy to understand. This is achieved through clear naming, explicit typing, and strategic commenting that explains the *why*, not just the *what*.

---

## ✅ 2. Phase 1: Deconstructing Monolithic Components (The 600+ LoC Rule)

**Goal:** Address the most significant sources of complexity by breaking down files exceeding 600 lines of code into smaller, more focused modules.

### ✅ Target 1: `pages/PortfolioEditorPage.tsx`
*   **Problem:** This is a monolithic component managing all state, UI, and logic for the entire editing experience. It is difficult to debug and extend.
*   **Strategy:** Decompose the page into a lean layout component. Abstract all state management into custom hooks and move UI sections into dedicated, panel-based components.
*   **Action Plan:**
    1.  **✅ Extract Logic into Hooks:**
        *   `✅ hooks/usePortfolioManager.ts`: Encapsulate `useHistoryState` and all core data mutation functions (`updateBlock`, `addBlock`, `removeBlock`, page management, etc.). This will centralize the business logic of the editor.
        *   `✅ hooks/useResizableSidebar.ts`: Isolate the state and event handlers for the sidebar resizing feature.
        *   `✅ hooks/useEditorShortcuts.ts`: Manage all keyboard shortcut logic for undo, redo, and the command palette.
    2.  **✅ Componentize the UI:**
        *   `✅` Create `components/editor/EditorSidebar.tsx` to serve as the main container for all sidebar controls.
        *   `✅` Create a new directory: `components/editor/panels/`.
        *   `✅` Create focused panel components for each tab: `PagesPanel.tsx`, `ContentPanel.tsx`, `DesignPanel.tsx`, and `AssetsPanel.tsx`.
        *   `✅` Move the corresponding JSX and logic from the old editor page into these new panel components.
*   **Result:** `PortfolioEditorPage.tsx` becomes a high-level layout component that assembles the editor from these modular, maintainable pieces.

### ✅ Target 2: `pages/PublicPortfolioPage.tsx`
*   **Problem:** This file contains the rendering logic for every type of portfolio block, making it large and difficult to manage as new block types are added.
*   **Strategy:** Isolate the view logic for each block type into its own dedicated, reusable component.
*   **Action Plan:**
    1.  `✅` Create a new directory: `components/blocks/public/`.
    2.  `✅` For each block type (Hero, About, etc.), create a new component file (e.g., `HeroBlockView.tsx`).
    3.  `✅` Move the rendering logic for that block from `PublicPortfolioPage.tsx` into its new, dedicated file.
    4.  `✅` Refactor the `BlockRenderer` in `PublicPortfolioPage.tsx` to simply import and render these new components.
*   **Result:** `PublicPortfolioPage.tsx` is dramatically simplified, acting as a layout container and data provider. Adding or modifying a block's appearance only requires changes in one small, isolated file.

### ✅ Target 3: `components/editor/BlockEditor.tsx`
*   **Problem:** Similar to the public page, this component uses a large `switch` statement to render the editor form for every block type.
*   **Strategy:** Componentize each block's specific editor form.
*   **Action Plan:**
    1.  `✅` Create a new directory: `components/editor/block_editors/`.
    2.  `✅` For each `case` in the `renderFields` switch statement, create a new component file (e.g., `HeroEditor.tsx`, `ProjectsEditor.tsx`).
    3.  `✅` Move the JSX and logic for that block's form fields into the new component.
    4.  `✅` Refactor `BlockEditor.tsx` to become a simple dispatcher that imports and renders the correct editor component based on the `block.type`.
*   **Result:** `BlockEditor.tsx` becomes a lean component. Adding or modifying the editor for a specific block now only requires changing one small, isolated file.

---

## ✅ 3. Phase 2: Code Clarity & Documentation Initiative

**Goal:** Systematically improve the readability and maintainability of the entire codebase by establishing and enforcing clear documentation standards.

*   **Strategy:** Institute a codebase-wide initiative to add comments and documentation where they provide the most value, making the code self-explanatory wherever possible.
*   **Action Plan:**
    1.  **✅ JSDoc for Hooks and Complex Components:**
        *   `✅` Every custom hook (`usePortfolioManager`, etc.) must have a JSDoc block explaining its purpose, parameters, and return values.
        *   `✅` Every major UI component (`EditorSidebar`, `PortfolioPreview`, etc.) must have a JSDoc block explaining its primary role and props.
    2.  **✅ Inline Comments for Complex Logic:**
        *   `✅` Any non-obvious code, such as complex state transformations, array manipulations, or mathematical calculations (e.g., in `useResizableSidebar`), must be preceded by a brief inline comment explaining the *intent* or *reasoning* behind the code.
    3.  **✅ Strict Typing:**
        *   `✅` Eliminate all remaining instances of the `any` type.
        *   `✅` Provide explicit, descriptive types for all props, state variables, and event handlers (e.g., use `DragEndEvent` from `@dnd-kit/core` instead of `any`). This serves as a form of self-documentation.
    4.  **✅ Centralized Type Definitions:**
        *   `✅` Ensure all shared data structures (e.g., `Portfolio`, `User`, `Project`) are defined only once in `types.ts` and imported wherever needed to maintain a single source of truth.

---

## 4. Future Considerations: Advanced Refactoring

**Goal:** Lay the groundwork for future scalability by addressing potential architectural bottlenecks before they become critical.

*   **Target: `contexts/DataContext.tsx`**
    *   **Potential Problem:** As the application grows, `DataContext` could become a "God Object," managing too many unrelated pieces of state and making it difficult to track data flow.
    *   **Future Strategy:** Decouple data domains by abstracting the logic for each domain (portfolios, projects, user, etc.) into its own custom hook (e.g., `usePortfolios`, `useProjects`). The main `useData` hook would then compose these individual hooks. This maintains a simple provider tree while separating the state management logic.
*   **Target: `services/aiService.ts`**
    *   **Strategy:** Improve structure and error handling.
    *   **Action Plan:**
        *   `✅` Centralize Gemini API client initialization and API key error handling into a single helper function (`getAiClient`).
        *   `✅` Refactor all service functions to use this helper, reducing boilerplate code and creating a single, clear point of failure if the API key is not configured.