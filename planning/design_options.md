# Plan: World-Class Design Customization

**Objective:** To provide users with a comprehensive and intuitive suite of design tools, empowering them to create truly unique and professional portfolios that reflect their personal brand. This plan outlines the features needed to elevate our design capabilities to be competitive with modern website builders.

---

## 1. Global Design System (Site Styles)

These settings control the foundational look and feel of the entire portfolio, ensuring consistency and a cohesive brand identity.

### 🎨 Colors
- [✅] **Primary Palette System:** Allow users to select from pre-designed themes (Light, Dark, Mint, Rose) that control all default colors.
- [✅] **Custom Palette Editor:** An interface for users to create, save, and apply their own color palettes.
    - [✅] Background Color
    - [✅] Text Color (Body)
    - [✅] Heading Color
    - [✅] Subtle Text/Border Color
    - [✅] Card/Container Background
- [✅] **Global Accent Color:** A single color picker that controls the primary color for buttons, links, and highlights.
- [✅] **Global Gradient Controls:** Define a global gradient that can be easily applied to sections.
    - [✅] **UI:** Angle picker for direction, two color stops with opacity controls.

### ✒️ Typography
- [✅] **Font Pairing:** Curated list of professional Google Font pairings for headings and body text.
- [✅] **Font Size Scaling:** Simple controls (Small, Medium, Large) that apply a responsive typographic scale.
- [✅] **Advanced Typography Controls:**
    - [✅] **Font Weight:** Select default font weights for headings and body (e.g., Light, Regular, Bold).
    - [✅] **Line Height:** Adjust the spacing between lines of text for readability.
    - [✅] **Letter Spacing:** Control the spacing between characters, especially for headings.
- [✅] **Link Styling:**
    - [✅] **Default State:** Underline (yes/no).
    - [✅] **Hover State:** Underline on hover (yes/no).

### 📏 Layout & Spacing
- [✅] **Page Width:** Global setting for content width (Standard, Full-Width).
- [✅] **Section Spacing:** Control the default vertical space between content blocks (Compact, Cozy, Spacious).
- [✅] **Grid & Column Gaps:** Set the default spacing between items in a grid (e.g., project cards, gallery images, service tiers).

### UI Elements
- [✅] **Button Styling:** Control `border-radius` (Rounded, Pill, Square).
- [✅] **Advanced Button Theming:**
    - [✅] **Fill Style:** Solid, Outline.
    - [✅] **Hover Effects:** Lift, Scale, None.
- [✅] **Container/Card Styling:**
    - [✅] **Corner Radius:** Control `border-radius` for all cards and containers.
    - [✅] **Shadows:** A selection of shadow styles (Subtle, Medium, Strong) to add depth.
    - [✅] **Border Styling:** Global controls for border width and style (solid, dashed, dotted) on cards.
- [ ] **Form & Input Fields:**
    - [ ] Style options for input fields (used in the Contact block).

---

## 2. Header & Navigation

Provide detailed control over the portfolio's main navigation element.

### 📐 Layout
- [✅] **Navigation Style:** Select from different navigation behaviors (Sticky Header, Minimal Header, Floating Dots, None).
- [✅] **Transparent Header:** Option for the header to be transparent on top of the hero section and gain a background on scroll.
- [✅] **Layout Options:**
    - [✅] Logo Position (Left, Center)
    - [✅] **Navigation Links Alignment:** Left, Center, Right.

### 🎨 Styling
- [✅] **Background Color & Opacity:** Full control over the header's background.
- [✅] **Borders & Shadows:** Add a bottom border or shadow to separate the header from content.
- [✅] **Link Styles:** Customize the color, hover effect, and active state indicator for navigation links.

### 📱 Mobile Menu
- [✅] **Hamburger Icon Style:** Options for the mobile menu icon.
- [✅] **Overlay Style:** Full-screen overlay vs. side-drawer menu.
- [✅] **Animation:** Control how the mobile menu appears (slide-in, fade-in).

---

## 3. Per-Block Overrides (Granular Control)

Allow users to break from the global styles for specific sections to create emphasis or unique layouts.

### 🖼️ Backgrounds
- [✅] **Solid Color:** Override the global background for a single block.
- [✅] **Gradient:** Apply a custom two-color linear gradient.
- [✅] **Image Background:**
    - [✅] Use an image as a block background.
    - [✅] **Overlay Color & Opacity:** Add a color overlay to ensure text readability.
- [ ] **Video Background:** Allow a looping, muted video as a block background.
    - [ ] **Source:** URL to MP4/WebM file.
    - [ ] **Overlay Color & Opacity:** Essential for text readability.

### 📏 Spacing
- [✅] **Custom Padding:** Granular control over the top, bottom, left, and right padding of a block.

### Borders
- [✅] **Border Overrides:** Apply custom borders to a specific block.
    - [✅] **Sides:** Top, Bottom, Left, Right, or All.
    - [✅] **Style:** Color, width, and style (solid, dashed).

### ✨ Effects
- [✅] **Shape Dividers:** Add SVG shape dividers (e.g., waves, slant, curve) to the top or bottom of a block to create visual separation.
- [✅] **Text Color Override:** Explicitly set text color for a block, essential for use with dark backgrounds.

---

## 4. Design Presets & Themes

Streamline the design process with pre-packaged and user-saved themes.

- [✅] **Curated Templates:** Offer full portfolio templates that include content and a complete design system.
- [✅] **Design Presets:**
    - [✅] **Save Preset:** A "Save Current Design" button in the editor that captures all global styles and saves them with a user-provided name.
    - [✅] **Apply Preset:** A visual gallery of saved presets that can be applied with one click.
- [✅] **AI-Powered Suggestions:** Use AI to recommend a full design preset based on the user's profession and portfolio content.

---

## 5. Smart Scroll Behaviors & Effects

Implement dynamic effects that respond to user scrolling, making the portfolio feel more alive and interactive.

- [✅] **Parallax Backgrounds:** Enable block backgrounds to scroll at a different speed than the foreground content, creating a sense of depth.
- [✅] **Sticky Elements:** Allow specific elements within a block to "stick" to the top of the viewport while scrolling past the rest of the block's content.
- [✅] **Enhanced Scroll-Triggered Animations:** In addition to global settings, allow per-block animation triggers.
    - [✅] **Animation Type:** Per-block override for animation style (Fade in, Slide in, Reveal Up, Blur In, etc.).
    - [✅] **Controls:** Delay, duration, and trigger offset (e.g., animate when block is 50% visible).
- [✅] **Scroll Progress Indicator:** Option to display a thin progress bar at the top of the page that fills as the user scrolls down.
- [✅] **Reveal Effects:** Animate content or images to be "revealed" from behind a sliding or fading mask as the user scrolls. (Implemented as new animation styles 'Reveal Up' and 'Blur In').

---

## 6. Accessibility (a11y) Design

Ensuring the portfolio is accessible to everyone is paramount. These features are not optional add-ons but core requirements of the design system.

- [✅] **High Contrast Mode:** A toggle that overrides the current theme with a WCAG AA compliant high-contrast color scheme.
- [ ] **Focus State Visibility:** A global setting to control the appearance of focus rings (e.g., color, thickness, offset) to make keyboard navigation clearer.
- [✅] **Reduced Motion Toggle:** The system will automatically respect the user's `prefers-reduced-motion` OS setting. This control provides a manual override to disable all non-essential animations (parallax, scroll effects).
- [ ] **Readable Font Scaling:** An option to increase the base font size of the entire portfolio by a certain percentage without breaking the layout, improving readability for users with visual impairments.

---

This plan will be implemented progressively, starting with the highest-impact features that offer the most creative freedom. The goal is to build a design system that is both powerful for advanced users and simple for beginners.