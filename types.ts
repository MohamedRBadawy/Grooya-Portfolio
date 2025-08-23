
/**
 * Represents a user of the application.
 */
export interface User {
  id: string;
  name: string;
  title: string;
  email: string;
  bio: string;
  avatarUrl: string;
}

/**
 * Represents a project that can be showcased in a portfolio.
 */
export interface Project {
  id:string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  link: string;
}

/**
 * Represents a technical skill.
 */
export interface Skill {
  id:string;
  name: string;
  category: 'Language' | 'Framework' | 'Tool' | 'Database' | 'Cloud';
}

// Design System Types
export type FontPairing = 'sans' | 'serif' | 'mixed';
export type Spacing = 'compact' | 'cozy' | 'spacious';
export type CornerRadius = 'none' | 'sm' | 'md' | 'lg';
export type AnimationStyle = 'none' | 'fadeIn' | 'slideInUp' | 'scaleIn' | 'slideInFromLeft' | 'revealUp' | 'blurIn';
export type NavigationStyle = 'none' | 'stickyHeader' | 'minimalHeader';
export type FontSize = 'sm' | 'md' | 'lg';
export type PageWidth = 'standard' | 'full';
export type ButtonStyle = 'rounded' | 'pill' | 'square';
export type ColorTheme = 'light' | 'dark' | 'mint' | 'rose';
export type ShadowStyle = 'none' | 'sm' | 'md' | 'lg';
export type FontWeight = 'normal' | 'bold';
export type LineHeight = 'tight' | 'normal' | 'relaxed';
export type LetterSpacing = 'normal' | 'wide';

/**
 * Represents a CSS gradient.
 */
export interface Gradient {
  direction: number; // Angle in degrees
  color1: string;
  color2: string;
}

/**
 * Represents a custom color palette created by the user.
 */
export interface Palette {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    heading: string;
    subtle: string;
    cardBackground: string;
    cardBorder: string;
    inputBackground: string;
    inputBorder: string;
    inputText: string;
    inputPlaceholder: string;
  }
}

/**
 * Defines the global design system settings for a portfolio.
 */
export interface Design {
  paletteId: string;
  headingFont: string;
  bodyFont: string;
  fontSize: FontSize;
  fontWeightHeading: FontWeight;
  fontWeightBody: FontWeight;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  shadowStyle: ShadowStyle;
  pageWidth: PageWidth;
  buttonStyle: ButtonStyle;
  accentColor: string;
  spacing: Spacing;
  cornerRadius: CornerRadius;
  animationStyle: AnimationStyle;
  navigationStyle: NavigationStyle;
  transparentHeader?: boolean;
  scrollIndicator?: 'none' | 'progressBar';
  parallax?: boolean;
  customCss?: string;
}

/**
 * Represents a link to an external platform.
 */
export interface ExternalLink {
  id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'website' | 'custom';
  url: string;
  text: string;
}

/**
 * Represents an SVG shape divider for separating blocks.
 */
export interface ShapeDivider {
    type: 'wave' | 'slant' | 'curve';
    color: string;
    flipX: boolean;
    height: number; // in pixels
}

/**
 * The base interface for all portfolio content blocks.
 */
interface BlockBase {
  id: string;
  type: 'hero' | 'about' | 'projects' | 'skills' | 'gallery' | 'testimonials' | 'video' | 'cta' | 'resume' | 'links' | 'experience' | 'contact' | 'code' | 'services' | 'blog';
  /** Per-block style overrides that deviate from the global Design settings. */
  designOverrides?: {
    background?: string | Gradient;
    backgroundImage?: string;
    backgroundOpacity?: number;
    textColor?: string;
    padding?: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    }
    shapeDividers?: {
        top?: ShapeDivider;
        bottom?: ShapeDivider;
    }
  }
}

export interface HeroBlock extends BlockBase {
  type: 'hero';
  headline: string;
  subheadline: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export interface AboutBlock extends BlockBase {
  type: 'about';
  title: string;
  content: string; // Can contain HTML
  imageUrl?: string;
  imagePosition?: 'left' | 'right';
  stickyImage?: boolean;
}

export interface ProjectsBlock extends BlockBase {
  type: 'projects';
  title: string;
  projectIds: string[]; // References Project.id
}

export interface SkillsBlock extends BlockBase {
  type: 'skills';
  title: string;
  skillIds: string[]; // References Skill.id
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface GalleryBlock extends BlockBase {
  type: 'gallery';
  title: string;
  images: GalleryImage[];
  layout: 'grid' | 'masonry';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  authorTitle: string;
  authorAvatarUrl: string;
}

export interface TestimonialsBlock extends BlockBase {
  type: 'testimonials';
  title: string;
  testimonials: Testimonial[];
}

export interface VideoBlock extends BlockBase {
  type: 'video';
  title: string;
  videoUrl: string;
  caption: string;
}

export interface CtaBlock extends BlockBase {
  type: 'cta';
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface ResumeBlock extends BlockBase {
  type: 'resume';
  title: string;
  description: string;
  fileUrl: string;
  buttonText: string;
}

export interface LinksBlock extends BlockBase {
  type: 'links';
  title: string;
  links: ExternalLink[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  dateRange: string;
  description: string;
}

export interface ExperienceBlock extends BlockBase {
  type: 'experience';
  title: string;
  items: ExperienceItem[];
}

export interface ContactBlock extends BlockBase {
  type: 'contact';
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface CodeBlock extends BlockBase {
  type: 'code';
  title: string;
  language: string;
  code: string;
}

export interface PricingTier {
  id: string;
  title: string;
  price: string;
  frequency: string;
  description: string;
  features: string[];
  buttonText: string;
  isFeatured: boolean;
  link?: string;
}

export interface ServicesBlock extends BlockBase {
  type: 'services';
  title: string;
  tiers: PricingTier[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  link: string;
}

export interface BlogBlock extends BlockBase {
  type: 'blog';
  title: string;
  posts: BlogPost[];
}

/** A union type representing any possible portfolio block. */
export type PortfolioBlock = HeroBlock | AboutBlock | ProjectsBlock | SkillsBlock | GalleryBlock | TestimonialsBlock | VideoBlock | CtaBlock | ResumeBlock | LinksBlock | ExperienceBlock | ContactBlock | CodeBlock | ServicesBlock | BlogBlock;

/**
 * Represents an asset (e.g., an AI-generated image) associated with a portfolio.
 */
export interface PortfolioAsset {
  id: string;
  url: string; // The base64 data URL
  prompt: string;
  createdAt: number;
}

/**
 * Represents a single page within a multi-page portfolio.
 */
export interface Page {
  id: string;
  name: string;
  path: string; // e.g., '/', '/about', '/contact'
  blocks: PortfolioBlock[];
}

/**
 * The main data structure for a user's portfolio.
 */
export interface Portfolio {
  id:string;
  title: string;
  slug: string;
  userId: string;
  design: Design;
  pages: Page[];
  isPublished: boolean;
  createdAt: number;
  updatedAt: number;
  customPalettes?: Palette[];
  assets?: PortfolioAsset[];
  isGuided?: boolean; // Is the user in the AI-guided creation flow?
  goal?: 'job' | 'freelance' | 'personal';
  role?: string;
}

/**
 * Represents a pre-defined template for creating a new portfolio.
 */
export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  design: Design;
  pages: Page[];
}

// Resume Feature Types
export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  dateRange: string;
  description?: string;
}

export interface ResumeProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

/**
 * The main data structure for a user's resume.
 */
export interface Resume {
  id: string;
  title: string;
  userId: string;
  createdAt: number;
  updatedAt: number;

  // Personal Info
  fullName: string;
  jobTitle: string;
  email: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  
  // Content
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: Skill[];
  projects: ResumeProjectItem[];

  // Design
  template: 'classic' | 'modern' | 'creative';
  accentColor: string;
}

/**
 * The structure of suggestions returned by the AI resume tailor.
 */
export interface AITailoringSuggestions {
  newSummary: string;
  suggestedKeywords: string[];
  feedbackPoints: string[];
}

/**
 * The structure of feedback returned by the AI portfolio reviewer.
 */
export interface AIPortfolioReview {
    overallImpression: string;
    contentSuggestions: {
        area: 'Hero' | 'About' | 'Projects' | string;
        suggestion: string;
    }[];
    projectShowcaseFeedback: string;
    missingSections: PortfolioBlock['type'][];
}