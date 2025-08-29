# Grooya - Codebase & UX Enhancements Plan

This document outlines the strategic roadmap for evolving the Grooya Portfolio Hub from its strong MVP foundation into a more scalable, performant, and polished application. It focuses on internal architecture, developer experience, and user-facing quality-of-life improvements.

---

## 1. Component Architecture & State Management

**Goal:** Decouple logic from the monolithic `PortfolioEditorPage` component to improve maintainability, reduce complexity, and make feature development easier.

- [✅] **Refactor `PortfolioEditorPage.tsx`:** Break down the component into smaller, more focused pieces.
- [✅] **Introduce Custom Hooks:** Extract reusable logic into custom hooks to clean up component code.
    - [✅] **`usePortfolioManager`:** Encapsulate `useHistoryState` and all core data mutation functions (`updateBlock`, `addBlock`, `removeBlock`, etc.).
    - [✅] **`useEditorShortcuts`:** Manage all `useKeyPress` logic for undo, redo, and the command palette.
    - [✅] **`useResizableSidebar`:** Contain the state and callback logic for the sidebar resizing feature.
- [ ] **Explore Granular State Management:**
    - [ ] Evaluate a library like **Zustand** to manage global UI state (e.g., active modals, asset library status) to eliminate prop drilling and create a more predictable state flow.

---

## 2. Performance & Build Process

**Goal:** Ensure a blazing-fast, seamless experience for public-facing portfolios and a modern, optimized build process.

- [✅] **Image Optimization Pipeline:**
    - [ ] **Format Conversion & Resizing:** Implement a process (or simulate one in the frontend) to serve images in modern formats like **WebP** and resize them to optimal dimensions for the user's device.
    - [✅] **Lazy Loading:** Implement lazy-loading for all off-screen images in the public portfolio view to drastically reduce initial page load time.
- [ ] **Component Lazy Loading:**
    - [ ] Use `React.lazy` and `Suspense` to code-split and lazy-load individual portfolio block components, so the browser only downloads the code for blocks that are about to enter the viewport.
- [ ] **Integrate Tailwind CSS into Build Process:**
    - [ ] Remove the Tailwind CSS CDN script from `index.html`.
    - [ ] Set up Tailwind CSS within a build tool environment (like Vite). This enables Just-In-Time (JIT) compilation and CSS purging, resulting in significantly smaller and more performant production stylesheets.

---

## 3. User Experience (UX) Refinements

**Goal:** Reduce friction in the editing process and introduce modern workflows that make the application feel more professional and intuitive.

- [✅] **Introduce Toast Notifications:**
    - [✅] Replace all `window.alert()` and `window.confirm()` calls with a non-blocking toast notification system (e.g., `react-hot-toast`) for a more modern and less intrusive user experience.
- [✅] **Improve Editing Flow (Inline Forms):**
    - [✅] Refactor modal-based creation flows (like creating a new Project or Skill) to use an inline form that appears directly within the editor's sidebar. This keeps the user in their primary context and makes the experience feel faster.
- [ ] **Implement Interactive Onboarding Tour:**
    - [ ] Integrate a library like **Shepherd.js** or **Intro.js** to create a guided tour for new users.
    - [ ] The tour should highlight key features of the editor: the sidebar tabs, the block inserter, inline editing, and the "Get AI Review" button.
- [ ] **Add Progressive Web App (PWA) Support:**
    - [ ] Create a `manifest.json` file with app icons and metadata.
    - [ ] Implement a service worker (`service-worker.js`) to cache the application shell and key assets for offline access.
    - [ ] This enables "Add to Home Screen" functionality on mobile devices, making the app feel more native.

---

## 4. Code Quality & Maintainability

**Goal:** Enforce development best practices to ensure the long-term health, stability, and scalability of the codebase.

- [✅] **Enforce Strict TypeScript:**
    - [✅] Eliminate all remaining instances of the `any` type.
    - [✅] Provide explicit types for all event handlers and data structures (e.g., `DragEndEvent` from `dnd-kit`).
