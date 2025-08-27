# Grooya - Monetization, Localization, and Growth Rollout Plan

**Version:** 1.0
**Status:** In Development

## 1. Introduction

This document outlines the strategic roadmap for transitioning the Grooya Portfolio Hub from its current MVP state into a fully commercial product with a multi-tiered subscription model, deep localization for the MENA region, and a phased go-to-market strategy. It also details the core feature sets designed to drive user acquisition, engagement, and retention.

---

## 2. Phase 1: Multi-Tier Subscription Model Implementation

**Goal:** Implement a flexible, multi-tier subscription model with regional pricing (EGP-first, then USD) and clear value propositions for each tier.

### Tier Structure & Rationale:

#### "Pro" Features vs. Metered Actions
- **Decision:** Instead of charging for every design change, we will classify certain high-value Content Blocks (e.g., Testimonials, Services/Pricing) and Design Features (e.g., Custom Palettes, Parallax, Custom CSS) as "Pro."
- **Rationale:** This avoids punishing user creativity and experimentation. It provides a clear, tangible reason to upgrade ("I need this professional feature") rather than creating anxiety over using up an arbitrary limit of adjustments.

#### Global Assets (Projects & Skills) are Unlimited
- **Decision:** The number of projects and skills a user can add to their central library will be unlimited on all plans, including Free.
- **Rationale:** This encourages users to deeply invest their professional data into the platform, making Grooya their central "career OS." We monetize the presentation and optimization of this data, not the data entry itself.

#### Resumes are a Tier Differentiator
- **Decision:** The number of resumes a user can create is a key lever between tiers.
- **Rationale:** This maps directly to user needs. A casual user needs one primary resume (Free), a more active job seeker needs a few tailored versions (Starter), and a power user or freelancer needs unlimited versions for every application (Pro).

#### Hybrid AI Credit System
- **Decision:** AI usage will be managed through a hybrid model. Free users get a one-time trial of each AI text feature. Paid users receive a monthly allotment of credits, separated into Text Credits and Image Credits.
- **Rationale:** This allows every user to experience the "magic" of the AI features, demonstrating their value and creating an incentive to upgrade. Separating credit types reflects their different computational costs.

### Final Consolidated Pricing Model

| Feature | Free Plan | Starter Plan | Pro Plan | Premium Plan |
| :--- | :--- | :--- | :--- | :--- |
| **Portfolios** | 1 | 3 | 10 | Unlimited |
| **Projects** | Unlimited | Unlimited | Unlimited | Unlimited |
| **Skills** | Unlimited | Unlimited | Unlimited | Unlimited |
| **Resumes** | 1 | 3 | Unlimited | Unlimited |
| **AI Text Credits** | 1 free use per feature | 50 / month | 150 / month | 500 / month |
| **AI Image Credits** | — | 10 / month | 30 / month | 100 / month |
| **Customization** | Standard Blocks & Design | Standard Blocks & Design | Pro Blocks & Pro Design | Pro Blocks & Pro Design |
| **Remove Branding** | — | ✅ | ✅ | ✅ |
| **Custom Domain** | — | — | ✅ | ✅ |
| **ATS Optimization** | — | — | ✅ | ✅ |
| **Bilingual Sites** | — | — | — | ✅ |
| **Advanced Analytics** | — | — | — | ✅ |


### Action Plan:

#### Backend Development
-   [ ] **Payment Gateway:** Integrate Stripe for handling international subscriptions (USD).
-   [ ] **Local Payments:** Research and integrate a local Egyptian payment provider (e.g., Fawry) for EGP transactions.
-   [ ] **Database Models:**
    -   [ ] Create `Plan` model to store tier details (name, price_egp, price_usd, features).
    -   [x] **(FE)** Expand `User.subscription` model to track `plan_id`, `status` (active, canceled), `renews_at`, `promo_code_used`.
-   [ ] **Webhooks:** Implement a webhook handler to listen for payment events from gateways (e.g., `payment.success`, `subscription.canceled`).

#### Frontend Development
-   [x] **Data Context:** Refactor `DataContext.tsx` to manage the new, more complex `user.subscription` and `user.entitlements` objects.
-   [x] **Entitlements Logic:** Create a robust service (within DataContext) to check a user's permissions based on their active plan (e.g., `can_remove_branding`, `max_portfolios`).
-   [x] **New Pricing Page:** Build a dynamic pricing page that displays all four tiers, allows for annual/monthly toggling (with discount), and shows the correct currency based on user region.
-   [ ] **Billing Management:** Create a "Billing & Subscription" section in the `ProfilePage` where users can view their current plan, usage, renewal date, and manage their subscription.
-   [ ] **Contextual Upgrade Prompts:** Implement UI modals/banners that appear when a user hits a feature limit (e.g., trying to remove branding on the Free plan).

---

## 3. Phase 2: Early Adopter Program Launch

**Goal:** Drive initial user acquisition and word-of-mouth marketing through a limited-time promotional offer.

### Promo Details:
-   **Code:** `GROOYA-ALPHA`
-   **Offer:** Unlocks **Premium Plan** free for 3 months.
-   **Limit:** First 1,000 users.
-   **Perk:** Permanent "Early Adopter" 🎖️ badge on profile.
-   **Post-Trial:** Auto-downgrade to Free, with an exclusive ~20% discount offer to convert to a paid plan.

### Early Adopter Exclusives:
-   **🎖️ Early Adopter Badge:** Visible on their portfolio link (like “Built on Grooya • Early Adopter”).
-   **🚀 Locked-in Discount for Life:** e.g., “Founding Users always get 20% off.”
-   **🌐 Custom Domain Voucher:** Free for the first year if they upgrade after the promo.
-   **🔗 Referral Rewards:** Invite 3 friends = +1 month of Premium.

### Action Plan:

#### Backend Development
-   [ ] **Promo Code System:**
    -   [ ] Create `PromoCode` model in the database with fields for `code`, `usage_limit`, `times_used`, `trial_duration_days`, `discount_percent`.
    -   [ ] Implement logic in the subscription flow to validate and apply promo codes.
-   [ ] **User Model:** Add `is_early_adopter` boolean flag to the `User` model, set to `true` upon successful promo code redemption.
-   [ ] **Scheduled Tasks:** Create a nightly cron job to check for expired trials and automatically downgrade users' plans.

#### Frontend Development
-   [x] **Promo Code Input:** Add a promo code field to the new pricing page.
-   [x] **UI Badges:** Display the "Early Adopter" 🎖️ badge in the `AuthenticatedLayout` header and on the `ProfilePage` if `user.is_early_adopter` is true.
-   [ ] **Notification System:** Implement UI banners/toasts to notify users before their trial expires.
-   [ ] **Exclusive Offer UI:** Create a special pricing view for early adopters whose trial has ended, displaying the exclusive discount.

---

## 4. Phase 3: Deep Localization & Feature Differentiation

**Goal:** Achieve product-market fit in Egypt and the wider MENA region by offering a truly native experience and career-specific tools.

### Localization Add-ons:
-   **Bilingual Portfolios (Arabic & English):** A huge edge in Gulf & Egypt.
-   **Local Template Norms:** Templates that include common MENA CV features (e.g., photo + personal info).
-   **Local Payment Bundles:** Starter tier purchasable via Fawry, Vodafone Cash, etc.

### Career-Specific Features (Differentiate from LinkedIn/Canva):
-   [x] **AI Resume Tailor:** “Paste a job description → instantly adjust resume to fit ATS.”
-   [x] **AI Content Generation:** Core features for generating text for portfolios, projects, and resumes are implemented.
-   [ ] **ATS Check Tool:** Highlight whether a CV passes common ATS checks.
-   [ ] **Portfolio Health Score:** AI grades the user's profile and suggests improvements.
-   [ ] **Dual Format Output:** One-click generation of an online portfolio + an ATS-safe PDF.

### Action Plan:
-   [ ] **AI Content Generation:** Update prompts in `aiService.ts` to instruct the Gemini API to generate Arabic-first or bilingual content for users who require it (a Premium feature).
-   [ ] **Payment Integration:** Complete the integration of local Egyptian payment methods.
-   [ ] **Bilingual Portfolios (Premium Feature):**
    -   [ ] **Data Structure:** Update the `Portfolio`'s `JSONField` structure to support content in multiple languages (e.g., `headline: { en: 'Hello', ar: 'مرحباً' }`).
    -   [ ] **UI:** Add a language switcher to the *public* portfolio view. Add language toggles within the editor for Premium users.
-   [ ] **ATS-Friendly PDF Generation:** Implement a robust, server-side PDF generation service that correctly handles RTL text and layout for resumes.
-   [ ] **New Templates:** Design and build new portfolio templates that are optimized for RTL layouts.

---

## 5. Phase 4: Engagement, Retention & Growth

**Goal:** Keep users active on the platform even when not job-hunting and execute a phased go-to-market strategy.

### Engagement & Retention Features:
-   **📊 Portfolio Analytics:** See views, countries, referrers (“a recruiter from Dubai viewed your portfolio”).
-   **🔔 Job Application Triggers:** During peak job season, Grooya offers a free Pro trial for 7 days.
-   **📅 Career Journal Mode:** Reminders to add new achievements/projects.
-   **🎯 Goal Tracking:** User sets a career goal, and Grooya provides tailored steps.

### Community & Trust Builders:
-   **Success Stories Feed:** Highlight users who got hired using Grooya.
-   **Grooya Network:** A "talent spotlight" feature for recruiters to browse public portfolios.
-   **Career Center Partnerships:** Give universities “Grooya for Students” packages, with early adopters as ambassadors.

### High-Impact Suggestion:
-   **🚀 “Grooya Proof of Impact”:** Track how many interviews, offers, or client leads came through a user's Grooya portfolio. Demonstrating direct ROI is the ultimate retention tool.

### Go-to-Market Growth Strategy:
#### Stage 1: Egypt Launch (Months 0-3)
-   [ ] **Action:** Finalize EGP pricing and local payment integrations.
-   [ ] **Action:** Launch the "GROOYA-ALPHA" early adopter campaign.
-   [ ] **Action:** Form partnerships with career centers at major Egyptian universities (e.g., AUC, GUC).
-   [ ] **Action:** Engage with local freelancer and developer communities on Facebook and LinkedIn.

#### Stage 2: MENA Expansion (Months 4-9)
-   [ ] **Action:** Finalize USD pricing for the Gulf and wider MENA region.
-   [ ] **Action:** Launch targeted ad campaigns on Wuzzuf, Bayt.com, and LinkedIn.
-   [ ] **Action:** Focus marketing messaging on the **Pro plan** as the ideal tool for freelancers and mid-career professionals.

#### Stage 3: Gulf Premium Push (Months 10+)
-   [ ] **Action:** Launch the **Premium plan** with a strong emphasis on its unique features: bilingual sites and white-labeling.
-   [ ] **Action:** Position the product as an "Executive Personal Branding Platform" in high-income markets (UAE, KSA).
-   [ ] **Action:** Run highly targeted LinkedIn campaigns aimed at senior managers, directors, and C-level executives.