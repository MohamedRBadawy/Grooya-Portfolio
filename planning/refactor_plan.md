
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

### 2. `components/editor/BlockEditor.tsx`

*   **Problem:** Similar to the public page, this file contains a massive `switch` statement to render the editor fields for every block type, making it brittle and hard to manage.
*   **Strategy:** Componentization of block-specific editor forms.
*   **Action Plan:**
    1.  Create a new directory: `components/editor/block_editors/`.
    2.  For each `case` in the `renderFields` switch statement, create a new component file (e.g., `components/editor/block_editors/HeroEditor.tsx`, `ProjectsEditor.tsx`, etc.).
    3.  Move the JSX and logic for that block's form fields into the new component.
    4.  Refactor `BlockEditor.tsx` to act as a dispatcher, importing and rendering the correct editor component based on the `block.type`.
*   **Result:** `BlockEditor.tsx` becomes a lean component, and adding or modifying the editor for a specific block type only requires changing one small, isolated file.

### 3. `pages/PortfolioEditorPage.tsx`

*   **Problem:** While already improved with custom hooks, this component still manages a lot of UI-specific state and renders multiple panels (Pages, Content, Design, Assets) within its `EditorSidebar`.
*   **Strategy:** Extract the sidebar's internal panels into their own components.
*   **Action Plan:**
    1.  Create a new directory: `components/editor/panels/`.
    2.  Create new components: `PagesPanel.tsx`, `ContentPanel.tsx`, `DesignPanel.tsx`, and `AssetsPanel.tsx`.
    3.  Move the JSX and logic for each tab from `EditorSidebar.tsx` into the corresponding new panel component.
    4.  Update `EditorSidebar.tsx` to simply render the correct panel based on the `activeTab` state, passing down the necessary props.
*   **Result:** The main `EditorSidebar` component becomes much cleaner, responsible only for the overall layout and tab switching, while the complexity of each panel is isolated.

### 4. `services/aiService.ts`

*   **Problem:** There is repeated boilerplate code in every function for getting the `GoogleGenAI` client and handling the `ApiKeyMissingError`.
*   **Strategy:** Abstract the client initialization and error handling into a centralized helper.
*   **Action Plan:**
    1.  Create a single helper function, `getAiClient()`, at the top of the file that checks for `process.env.API_KEY` and throws `ApiKeyMissingError` if it's missing.
    2.  Refactor every exported function (`generateImage`, `generateProjectDescription`, etc.) to call `getAiClient()` at the beginning of its `try` block.
    3.  Ensure all `catch` blocks re-throw the `ApiKeyMissingError` so it can be handled appropriately in the UI.
*   **Result:** Reduced code duplication and a single, clear point of failure if the API key is not configured.
