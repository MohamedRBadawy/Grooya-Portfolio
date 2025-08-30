# Plan: Evolving from AI Co-pilot to AI Strategist

**Objective:** To deeply integrate more strategic AI features throughout the portfolio-building process, transforming the AI from a reactive "co-pilot" into a proactive "strategist" that guides users toward creating a more effective and impactful portfolio.

---

## 1. Advanced Content Co-pilot: Beyond Generation

**Goal:** Move from simply generating content to refining and contextualizing it, ensuring every word serves a strategic purpose.

-   [ ] **AI Skill Summarizer:** (Deferred) When a user adds a skill (e.g., "React"), the AI will generate a concise, professional sentence describing their proficiency. *Note: Deferred pending a required refactor of the skills management UI from a simple selector to a more detailed editor.*
-   [✅] **Experience Bullet Point Enhancer:** Allow users to select a bullet point in their work experience and have the AI rewrite it using the STAR method (Situation, Task, Action, Result) with strong action verbs.
-   [✅] **Project Story Weaver:** The AI will take a project's title, technologies, and a few bullet points and weave them into a short, compelling narrative (2-3 paragraphs) that describes the challenge, solution, and impact.

---

## 2. The "Smart" Design Studio: Proactive & Personalized Aesthetics

**Goal:** Make the AI an active participant in the design process, offering suggestions based on content, industry, and user intent.

-   [✅] **Contextual Color Palette Generation:** Allow users to describe a theme in words (e.g., "a modern, trustworthy theme for a fintech startup"). The AI will generate a full, custom color palette with hex codes.
-   [ ] **AI-Powered Layout Suggestions:** The AI will analyze the user's goal and current blocks, then suggest an ideal block order with a rationale (e.g., "For freelance clients, we recommend moving 'Testimonials' right after your 'Hero' section to build immediate trust.").
-   [ ] **AI Image Analyzer & Stylist:** Using a multimodal model, the AI will analyze a user's uploaded hero image and suggest a complementary accent color and font pairings that match the image's aesthetic.

---

## 3. Strategic Portfolio Structuring

**Goal:** Help the user think like a recruiter or client by providing strategic advice on the portfolio's structure and content.

-   [✅] **Goal-Oriented Content Recommendations:** Based on the user's stated `goal` and `role`, the AI Mentor Panel will proactively suggest which content blocks are most critical to add (e.g., suggesting a `CodeBlock` for developers or a `GalleryBlock` for designers).
-   [✅] **Target Audience Tuning:** A new AI action will allow users to select any text block (e.g., Hero, About) and "tune" its content for a specific audience (e.g., technical hiring manager vs. non-technical freelance client).

---

## 4. Phased Rollout Plan

This plan will be implemented in three phases to manage development effectively.

### ✅ Phase 1: Quick Wins (Next Sprint)
- [ ] AI Skill Summarizer (Deferred)
- [✅] Experience Bullet Point Enhancer
- [✅] Goal-Oriented Content Recommendations

### ✅ Phase 2: Core Experience (Next Month)
- [✅] Contextual Color Palette Generation
- [✅] Project Story Weaver
- [✅] Target Audience Tuning

### Phase 3: Next-Gen Features (Next Quarter)
- [ ] AI-Powered Layout Suggestions
- [ ] AI Image Analyzer & Stylist
