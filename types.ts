
/**
 * @description يمثل مستخدم التطبيق.
 * @property {string} id - المعرّف الفريد للمستخدم.
 * @property {string} name - الاسم الكامل للمستخدم.
 * @property {string} title - المسمى الوظيفي (مثال: "مهندس واجهات أمامية أول").
 * @property {string} email - البريد الإلكتروني للمستخدم.
 * @property {string} bio - نبذة تعريفية قصيرة عن المستخدم.
 * @property {string} avatarUrl - رابط الصورة الرمزية للمستخدم.
 * @property {'user' | 'admin'} role - دور المستخدم في النظام (مستخدم عادي أو مسؤول).
 * @property {boolean} [isEarlyAdopter] - علامة تشير إلى ما إذا كان المستخدم من المتبنين الأوائل للمنصة.
 * @property {object} subscription - تفاصيل اشتراك المستخدم.
 * @property {'free' | 'starter' | 'pro' | 'premium'} subscription.tier - فئة الاشتراك الحالية.
 * @property {'active' | 'trial' | 'past_due' | 'canceled'} subscription.status - حالة الاشتراك.
 * @property {number} [subscription.renewsAt] - الطابع الزمني لتاريخ تجديد الاشتراك.
 * @property {Partial<Record<AIFeature, boolean>>} subscription.freeFeaturesUsed - يتتبع الميزات المجانية التي استخدمها المستخدم في الخطة المجانية.
 * @property {object} subscription.credits - أرصدة الذكاء الاصطناعي الشهرية للمشتركين.
 * @property {('proLifetime' | 'creditsTextTier1' | 'creditsImageTier1')[]} [oneTimePurchases] - قائمة بعمليات الشراء لمرة واحدة.
 */
export interface User {
  id: string;
  name: string;
  title: string;
  email: string;
  bio: string;
  avatarUrl: string;
  role: 'user' | 'admin';
  isEarlyAdopter?: boolean;
  subscription: {
    tier: 'free' | 'starter' | 'pro' | 'premium';
    status: 'active' | 'trial' | 'past_due' | 'canceled';
    renewsAt?: number; // timestamp
    // Tracks which free features have been used up.
    // A feature key will be present and true if used.
    freeFeaturesUsed: Partial<Record<AIFeature, boolean>>;
    // Monthly credits for Pro users.
    credits: {
        text: number;
        image: number;
    };
  };
  oneTimePurchases?: ('proLifetime' | 'creditsTextTier1' | 'creditsImageTier1')[];
}

/**
 * @description نوع موحد يمثل كل ميزة من ميزات الذكاء الاصطناعي لتتبع الاستهلاك بدقة.
 */
export type AIFeature =
  | 'projectStory'
  | 'heroContent'
  | 'aboutContent'
  | 'designSuggestions'
  | 'resumeFromPortfolio'
  | 'resumeFromJobDescription'
  | 'resumeTailoring'
  | 'portfolioReview'
  | 'imageGeneration'
  | 'experienceEnhancement'
  | 'blockSuggestions'
  | 'paletteGeneration'
  | 'contentTuning';

/**
 * @description يمثل مشروعًا يمكن عرضه في ملف الأعمال.
 * @property {string} id - المعرّف الفريد للمشروع.
 * @property {string} title - عنوان المشروع.
 * @property {string} description - وصف تفصيلي للمشروع.
 * @property {string} imageUrl - رابط صورة المشروع.
 * @property {string[]} technologies - قائمة بالتقنيات المستخدمة في المشروع.
 * @property {string} link - رابط مباشر للمشروع (إن وجد).
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
 * @description يمثل مهارة تقنية.
 * @property {string} id - المعرّف الفريد للمهارة.
 * @property {string} name - اسم المهارة (مثال: "React").
 * @property {'Language' | 'Framework' | 'Tool' | 'Database' | 'Cloud'} category - فئة المهارة.
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
export type NavigationStyle = 'none' | 'stickyHeader' | 'minimalHeader' | 'floatingDots';
export type FontSize = 'sm' | 'md' | 'lg';
export type PageWidth = 'standard' | 'full';
export type ButtonStyle = 'rounded' | 'pill' | 'square';
export type ColorTheme = 'light' | 'dark' | 'mint' | 'rose';
export type ShadowStyle = 'none' | 'sm' | 'md' | 'lg';
export type FontWeight = 'normal' | 'bold';
export type LineHeight = 'tight' | 'normal' | 'relaxed';
export type LetterSpacing = 'normal' | 'wide';

/**
 * @description يمثل تدرجًا لونيًا (gradient) في CSS.
 * @property {number} direction - زاوية التدرج بالدرجات.
 * @property {string} color1 - اللون الأول في التدرج (hex).
 * @property {string} color2 - اللون الثاني في التدرج (hex).
 */
export interface Gradient {
  direction: number; // Angle in degrees
  color1: string;
  color2: string;
}

/**
 * @description يمثل لوحة ألوان مخصصة أنشأها المستخدم.
 * @property {string} id - المعرّف الفريد للوحة الألوان.
 * @property {string} name - اسم لوحة الألوان.
 * @property {object} colors - كائن يحتوي على رموز الألوان المختلفة للموقع.
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
 * @description يمثل رابطًا واحدًا في شريط التنقل.
 * يمكن أن يستهدف الرابط صفحة أو قسمًا معينًا (block).
 * @property {string} id - المعرّف الفريد لعنصر التنقل.
 * @property {string} label - النص الذي يظهر للرابط.
 * @property {string} targetPageId - معرّف الصفحة المستهدفة.
 * @property {string} [targetBlockId] - معرّف القسم المستهدف (اختياري، للتمرير إلى قسم معين).
 */
export interface NavLinkItem {
    id: string;
    label: string;
    targetPageId: string;
    targetBlockId?: string; // Optional: for scrolling to a block
}

/**
 * @description يمثل نمط إطار لجانب واحد.
 * @property {number} width - عرض الإطار بالبكسل.
 * @property {'solid' | 'dashed' | 'dotted'} style - نمط الخط (صلب، متقطع، منقط).
 * @property {string} color - لون الإطار.
 */
export interface BorderStyle {
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
    color: string;
}

/**
 * @description يحدد إعدادات نظام التصميم العام لملف الأعمال.
 * سيتم تخزين هذا الكائن بأكمله في حقل JSON واحد في قاعدة البيانات.
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
  buttonFillStyle?: 'solid' | 'outline';
  buttonHoverEffect?: 'none' | 'lift' | 'scale';
  navAlignment?: 'left' | 'center' | 'right';
  transparentHeader?: boolean;
  scrollIndicator?: 'none' | 'progressBar';
  parallax?: boolean;
  linkStyle?: 'underline' | 'underlineOnHover' | 'none';
  cardBorderStyle?: {
    width: number; // in pixels
    style: 'solid' | 'dashed' | 'dotted';
  };
  gridGap?: Spacing;
  logoPosition?: 'left' | 'center';
  customCss?: string;
  mobileMenuStyle?: 'overlay' | 'drawer';
  mobileMenuAnimation?: 'slideIn' | 'fadeIn';
  mobileMenuIconStyle?: 'bars' | 'plus' | 'dots';
  globalGradient?: Gradient;
  respectReducedMotion?: boolean;
  customNavigation?: NavLinkItem[];
  headerBackgroundColor?: string;
  headerLinkColor?: string;
  headerLinkHoverColor?: string;
  headerActiveLinkColor?: string;
  headerBorderStyle?: BorderStyle;
  highContrastMode?: boolean;
  hideBranding?: boolean;
}

/**
 * @description يمثل إعداد تصميم محفوظ مسبقًا.
 */
export interface DesignPreset {
  id: string;
  name: string;
  design: Design;
}

/**
 * @description يمثل رابطًا لمنصة خارجية.
 */
export interface ExternalLink {
  id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'website' | 'custom';
  url: string;
  text: string;
}

/**
 * @description يمثل فاصل أشكال SVG للفصل بين الأقسام.
 */
export interface ShapeDivider {
    type: 'wave' | 'slant' | 'curve';
    color: string;
    flipX: boolean;
    height: number; // in pixels
}

/**
 * @description الواجهة الأساسية لجميع أقسام محتوى ملف الأعمال.
 */
interface BlockBase {
  id: string;
  type: 'hero' | 'about' | 'projects' | 'skills' | 'gallery' | 'testimonials' | 'cta' | 'resume' | 'links' | 'experience' | 'contact' | 'code' | 'services' | 'blog' | 'video';
  /** 
   * @description تخصيصات نمط لكل قسم على حدة تتجاوز إعدادات التصميم العامة.
   */
  designOverrides?: {
    background?: string | Gradient;
    backgroundImage?: string;
    videoBackground?: string;
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
    animationStyle?: AnimationStyle;
    animationDuration?: number; // in seconds
    animationDelay?: number; // in seconds
    border?: {
        top?: BorderStyle;
        bottom?: BorderStyle;
        left?: BorderStyle;
        right?: BorderStyle;
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
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaPosition?: 'left' | 'right' | 'top' | 'bottom';
  stickyMedia?: boolean;
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
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
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
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
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

/** 
 * @description نوع موحد يمثل أي قسم محتمل من أقسام ملف الأعمال.
 */
export type PortfolioBlock = HeroBlock | AboutBlock | ProjectsBlock | SkillsBlock | GalleryBlock | TestimonialsBlock | CtaBlock | ResumeBlock | LinksBlock | ExperienceBlock | ContactBlock | CodeBlock | ServicesBlock | BlogBlock | VideoBlock;

/**
 * @description يمثل أصلًا (asset) مرتبطًا بملف الأعمال (مثل صورة تم إنشاؤها بواسطة الذكاء الاصطناعي).
 */
export interface PortfolioAsset {
  id: string;
  url: string; // The base64 data URL
  prompt: string;
  createdAt: number;
}

/**
 * @description يمثل صفحة واحدة داخل ملف أعمال متعدد الصفحات.
 */
export interface Page {
  id: string;
  name: string;
  path: string; // e.g., '/', '/about', '/contact'
  blocks: PortfolioBlock[];
}

/**
 * @description هيكل البيانات الرئيسي لملف أعمال المستخدم.
 * سيتم تخزين هذا الكائن بأكمله في قاعدة البيانات.
 * سيتم تخزين مصفوفة `pages` في حقل JSON واحد.
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
  designPresets?: DesignPreset[];
  isGuided?: boolean; // Is the user in the AI-guided creation flow?
  goal?: 'job' | 'freelance' | 'personal';
  role?: string;
}

/**
 * @description يمثل قالبًا محددًا مسبقًا لإنشاء ملف أعمال جديد.
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
 * @description هيكل البيانات الرئيسي لسيرة ذاتية للمستخدم.
 * سيتم تخزين المحتوى (summary, experience, etc.) في حقل JSON واحد.
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
 * @description هيكل الاقتراحات التي يتم إرجاعها بواسطة مُخصص السيرة الذاتية بالذكاء الاصطناعي.
 */
export interface AITailoringSuggestions {
  newSummary: string;
  suggestedKeywords: string[];
  feedbackPoints: string[];
}

/**
 * @description هيكل الملاحظات التي يتم إرجاعها بواسطة مراجع ملف الأعمال بالذكاء الاصطناعي.
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

/**
 * @description Represents a promotional code that can be redeemed by users.
 */
export interface PromoCode {
  id: string;
  code: string; // The string users will enter
  usageLimit: number; // Max number of times this code can be used
  timesUsed: number; // How many times it has been used
  grantsTier: 'starter' | 'pro' | 'premium'; // Which tier it grants
  isEarlyAdopter: boolean; // Does it grant the early adopter badge?
  createdAt: number; // Timestamp
}
