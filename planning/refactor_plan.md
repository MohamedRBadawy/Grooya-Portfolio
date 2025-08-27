# Refactoring Plan: Codebase Simplification & LoC Reduction

**Objective:** To systematically refactor the largest and most complex files in the Grooya codebase. The primary goal is to reduce the lines of code (LoC) in each target file by breaking them down into smaller, more focused, and reusable components and hooks.

**Expected Outcomes:**
*   **Improved Maintainability:** Smaller files are easier to understand, debug, and modify.
*   **Enhanced Reusability:** Logic and UI will be extracted into components that can be reused elsewhere.
*   **Better Developer Experience:** Navigating the codebase will be faster and more intuitive.
*   **Increased Scalability:** A modular architecture makes it easier to add new features without increasing the complexity of existing files.

---

## Guiding Principles

1.  **Single Responsibility Principle (SRP):** Each component or file should have one primary reason to exist.
2.  **Componentization:** Break down large JSX structures into smaller, self-contained components.
3.  **Hook Abstraction:** Extract complex or reusable state logic into custom hooks.
4.  **Don't Repeat Yourself (DRY):** Consolidate redundant code, especially in services and data layers.

---

## Refactoring Targets & Strategies

### ✅ 1. `pages/PublicPortfolioPage.tsx` (Completed)

*   **Problem:** This file was extremely large (over 1000 lines) because it contained the rendering logic for every single type of portfolio block.
*   **Strategy:** Componentization. Each block's view logic has been extracted into its own component.
*   **Action Plan:**
    1.  ✅ Create a new directory: `components/blocks/public/`.
    2.  ✅ For each `...BlockView` component, create a new file (e.g., `components/blocks/public/HeroBlockView.tsx`).
    3.  ✅ Move the corresponding component code from `PublicPortfolioPage.tsx` into its new file.
    4.  ✅ Update the `BlockRenderer` component in `PublicPortfolioPage.tsx` to import and render these new, individual components.
*   **Result:** `PublicPortfolioPage.tsx` is now dramatically smaller, acting primarily as a layout container and data provider for the individual block components.

### ✅ 2. `pages/PortfolioEditorPage.tsx` & `EditorSidebar` (Completed)

*   **Problem:** The editor page was a monolithic component managing all state, UI, and logic for the entire editing experience, making it difficult to maintain and extend.
*   **Strategy:** Abstract logic into custom hooks and componentize the UI into a main `EditorSidebar` with distinct panels for each tab.
*   **Action Plan:**
    1.  ✅ Create custom hooks (`usePortfolioManager`, `useResizableSidebar`, `useEditorShortcuts`) to encapsulate complex state and event logic.
    2.  ✅ Create a new `EditorSidebar` component to manage the sidebar's structure.
    3.  ✅ Create a new directory: `components/editor/panels/`.
    4.  ✅ Create new components: `PagesPanel.tsx`, `ContentPanel.tsx`, `DesignPanel.tsx`, and `AssetsPanel.tsx`.
    5.  ✅ Move the JSX and logic for each tab from the old editor page into the corresponding new panel component.
    6.  ✅ Refactor `PortfolioEditorPage.tsx` to be a high-level layout component that uses the new hooks and renders the `EditorSidebar` and `PortfolioPreview`.
*   **Result:** The editor's architecture is now modular and follows the Single Responsibility Principle. State logic is cleanly separated, and UI components are small and focused, making future feature development significantly easier.

### 3. `components/editor/BlockEditor.tsx`

*   **Problem:** Similar to the public page, this file contains a large `switch` statement to render the editor fields for every block type, making it brittle and hard to manage.
*   **Strategy:** Componentization of block-specific editor forms.
*   **Action Plan:**
    1.  Create a new directory: `components/editor/block_editors/`.
    2.  For each `case` in the `renderFields` switch statement, create a new component file (e.g., `components/editor/block_editors/HeroEditor.tsx`, `ProjectsEditor.tsx`, etc.).
    3.  Move the JSX and logic for that block's form fields into the new component.
    4.  Refactor `BlockEditor.tsx` to act as a dispatcher, importing and rendering the correct editor component based on the `block.type`.
*   **Result:** `BlockEditor.tsx` becomes a lean component, and adding or modifying the editor for a specific block type only requires changing one small, isolated file.

### ✅ 4. `services/aiService.ts` (Completed)

*   **Problem:** There was repeated boilerplate code in every function for getting the `GoogleGenAI` client and handling the `ApiKeyMissingError`.
*   **Strategy:** Abstract the client initialization and error handling into a centralized helper.
*   **Action Plan:**
    1.  ✅ Create a single helper function, `getAiClient()`, at the top of the file that checks for `process.env.API_KEY` and throws `ApiKeyMissingError` if it's missing.
    2.  ✅ Refactor every exported function (`generateImage`, `generateProjectDescription`, etc.) to call `getAiClient()` at the beginning of its `try` block.
    3.  ✅ Ensure all `catch` blocks re-throw the `ApiKeyMissingError` so it can be handled appropriately in the UI.
*   **Result:** Reduced code duplication and a single, clear point of failure if the API key is not configured.