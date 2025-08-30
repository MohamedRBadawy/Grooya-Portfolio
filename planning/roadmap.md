# Grooya - Product Roadmap

This document outlines the strategic plan for evolving the Grooya Portfolio Hub from an MVP into a world-class, AI-powered Career Operating System.

## Part 1: Elevating the Design & User Experience (World-Class UI/UX)

Our immediate focus is to refine the user interface and interactions to make the product feel premium, intuitive, and delightful to use.

### ✅ 1. Foundational MVP
- [x] Initial file structure and components.
- [x] Basic portfolio listing, editing, and public view.
- [x] Mock data and localStorage persistence.

### ✅ 2. Overall Aesthetic & Feel
- [x] **Refined Branding:** Establish a stronger "Grooya" visual identity with a sophisticated dark mode default and vibrant gradient accents.
- [x] **Typography Hierarchy:** Define and implement a clear, beautiful typography scale for all text elements (H1, H2, body, etc.).
- [x] **Micro-interactions & Animations:** Integrate a library like Framer Motion to add subtle, delightful animations for page transitions, button clicks, and list loading. (Initial transitions on buttons/cards complete).
- [x] **Consistent Iconography:** Adopt a high-quality, consistent icon set (e.g., Lucide Icons) across the entire application.

### ✅ 3. Portfolio List Page (`PortfolioListPage.tsx`)
- [x] **Visual Portfolio Cards:** Redesign cards to include a small, blurred preview of the portfolio's hero image or a theme color swatch.
- [x] **Consolidated Actions Menu:** Replace separate action buttons with a single "kebab" (three-dot) menu on each card, containing options like `Edit`, `Preview`, `Duplicate`, and `Delete`.
- [x] **Search & Sort:** Implement search functionality to filter portfolios by title and add sorting options (e.g., Last Modified, Date Created).

### ✅ 4. i18n & Mobile-First Foundation
- [x] **Full Mobile Responsiveness:** Ensure the entire application is usable and beautiful on all screen sizes, from mobile phones to desktops.
- [x] **Adaptive Editor Layout:** Redesign the editor to use a toggle-based view on mobile, switching between a full-screen editor and a full-screen preview.
- [x] **Arabic & RTL Support:** Implement full support for the Arabic language, including a right-to-left (RTL) layout.
- [x] **Localization Framework:** Build a scalable system for adding and managing translations.

### ✅ 5. Portfolio Editor Page (`PortfolioEditorPage.tsx`) - The Core Experience
- [x] **Immersive Layout Redesign:** Transition to a layout where the live preview is dominant, with editor controls in a sleek, collapsible sidebar.
- [x] **Visual Block Inserter:** Replace the `<select>` dropdown with a visual `+` button between blocks that opens a menu with icons for each block type.
- [x] **Enhanced "Design" Studio:**
    - [x] Display color themes as visual color palette swatches.
    - [x] Render font pairing options in their actual fonts for a true preview.
    - [x] Add granular controls for `Spacing`, `Corner Radius`, and a custom `Accent Color Picker`.
- [x] **Direct Manipulation & Inline Editing:** Allow users to edit text directly on the live preview instead of in sidebar form fields.
- [x] **Drag-and-Drop Reordering:** Implement a smooth drag-and-drop system (e.g., using `dnd-kit`) to reorder portfolio blocks.


---

## Part 2: A Strategic Plan for the "AI Career Operating System"

This is the long-term vision to make Grooya an indispensable career tool using the power of the Gemini API. The primary focus is strictly on features related to portfolio and resume creation and enhancement.

### ✅ Phase 1: AI-Guided Onboarding & Staged Creation
- [x] **AI Assistant Introduction:** Replace the standard template selection with a goal-oriented AI conversation to understand the user's objectives (e.g., get a job, find freelance work).
- [x] **Staged Building Process:** Introduce a new "AI Assistant" panel in the editor that guides users through a logical sequence of portfolio-building tasks.
- [x] **Contextual Guidance:** The assistant provides tips and suggestions relevant to the user's stated goal at each stage, transforming the "blank canvas problem" into a manageable, step-by-step process.

### ✅ Phase 2: AI-Assisted Content & Design
- [x] **AI Content Co-pilot:** Integrate Gemini into the editor.
    - [x] **Bio & Headline Generation:** Add a "Generate with AI" button in Hero/About blocks to create compelling text from user prompts.
    - [x] **Project Description Writer:** Use AI to generate professional project descriptions in the STAR format from a few key points.
- [x] **AI Design Assistant:**
    - [x] Suggest tailored themes and fonts based on the user's stated profession (e.g., "Software Engineer," "UX Designer").

### ✅ Phase 3: The Resume & Job Hub
- [x] **Intelligent Resume Builder:**
    - [x] Generate tailored resumes from portfolio data using various templates.
    - [x] **AI Tailoring:** Allow users to paste a job description, and have Gemini analyze it to recommend resume optimizations and keyword inclusion.
    - [x] Full-featured editor for all resume sections (Experience, Education, Skills, Projects) with drag-and-drop reordering.
- [ ] **(OUT OF SCOPE)** ~~Job Application Tracker & Analyzer~~
- [ ] **(OUT OF SCOPE)** ~~AI Interview Prep~~

### 🚀 Phase 4: Advanced Professional Features (Pro/Premium)
- [✅] **Implement Pro-Tier Blocks & Design Tools:**
    - [✅] Introduce exclusive content blocks. (Existing advanced blocks like Testimonials, Services, Experience, Code, Blog, and Video are now gated as Pro features).
    - [✅] Gate specific design features (e.g., Custom Palettes, Parallax Backgrounds, Custom CSS) for Pro and Premium users.
- [ ] **Custom Domain Support (Pro) (On Hold):**
    - [ ] Build the UI for users to connect their own domain names.
    - [ ] Implement backend functionality.
- [✅] **Advanced Analytics Dashboard (Premium):**
    - [✅] Develop a dashboard to display portfolio visitor analytics (views, traffic sources, geographic location).
- [ ] **Bilingual Portfolio Support (Premium) (On Hold):**
    - [ ] Architect the data models and UI to support creating and viewing portfolios in multiple languages.

### 🚀 Phase 5: The Complete Career Companion
- [ ] **Proactive Skill Development (On Hold):** Create personalized learning plans based on career goals and analysis of target job descriptions.
- [ ] **Personal Branding Assistant (On Hold):** Repurpose portfolio content into drafts for LinkedIn posts or blog articles.
- [ ] **(OUT OF SCOPE)** ~~Network & Opportunity Finder~~