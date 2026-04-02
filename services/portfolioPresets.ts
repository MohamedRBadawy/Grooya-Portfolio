import type {
  ContactBlock,
  ExperienceBlock,
  HeroBlock,
  Page,
  Portfolio,
  PortfolioBlock,
  PortfolioTemplate,
  PortfolioTrack,
  ProjectsBlock,
  ResumeBlock,
  ServicesBlock,
  TestimonialsBlock,
} from '../types';

const createHeroBlock = (track: PortfolioTrack): HeroBlock => ({
  id: `block-hero-${Date.now()}`,
  type: 'hero',
  headline: track === 'jobSeeker' ? 'Show the work that gets you hired.' : 'Show the work that wins clients.',
  subheadline:
    track === 'jobSeeker'
      ? 'Build a focused portfolio that highlights your strengths, proof of work, and next role.'
      : 'Build a portfolio that explains your services, showcases outcomes, and converts interest into leads.',
  imageUrl: '',
  ctaText: track === 'jobSeeker' ? 'View My Work' : 'Start a Project',
  ctaLink: '#contact',
});

const createAboutBlock = (): PortfolioBlock => ({
  id: `block-about-${Date.now()}`,
  type: 'about',
  title: 'About',
  content:
    'Use this section to explain who you help, what you are best at, and the kind of work you want to do more of.',
});

const createProjectsBlock = (): ProjectsBlock => ({
  id: `block-projects-${Date.now()}`,
  type: 'projects',
  title: 'Selected Projects',
  projectIds: [],
});

const createExperienceBlock = (): ExperienceBlock => ({
  id: `block-experience-${Date.now()}`,
  type: 'experience',
  title: 'Experience',
  items: [
    {
      id: `exp-${Date.now()}`,
      title: 'Role title',
      company: 'Company name',
      dateRange: 'Jan 2024 - Present',
      description: 'Add the work, scope, and measurable outcomes that best support your next opportunity.',
    },
  ],
});

const createResumeBlock = (): ResumeBlock => ({
  id: `block-resume-${Date.now()}`,
  type: 'resume',
  title: 'Resume',
  description: 'Offer a downloadable resume for recruiters who want a structured summary of your experience.',
  fileUrl: '',
  buttonText: 'Download Resume',
});

const createServicesBlock = (): ServicesBlock => ({
  id: `block-services-${Date.now()}`,
  type: 'services',
  title: 'Services',
  tiers: [
    {
      id: `tier-${Date.now()}`,
      title: 'Service package',
      price: 'Custom quote',
      frequency: 'per project',
      description: 'Explain what you deliver, who it is for, and what outcome the client should expect.',
      features: ['Discovery', 'Delivery plan', 'Implementation', 'Support handoff'],
      buttonText: 'Request a Quote',
      isFeatured: true,
    },
  ],
});

const createTestimonialsBlock = (): TestimonialsBlock => ({
  id: `block-testimonials-${Date.now()}`,
  type: 'testimonials',
  title: 'Testimonials',
  testimonials: [
    {
      id: `testimonial-${Date.now()}`,
      quote: 'Add a short testimonial that speaks to your reliability, communication, and impact.',
      author: 'Client or colleague name',
      authorTitle: 'Role / company',
      authorAvatarUrl: '',
    },
  ],
});

const createContactBlock = (track: PortfolioTrack): ContactBlock => ({
  id: 'contact',
  type: 'contact',
  title: track === 'jobSeeker' ? 'Let’s Talk' : 'Start a Project',
  subtitle:
    track === 'jobSeeker'
      ? 'Invite recruiters and hiring managers to reach out with relevant opportunities.'
      : 'Invite clients to share their goals, timeline, and project scope.',
  buttonText: track === 'jobSeeker' ? 'Send Message' : 'Request a Quote',
});

/**
 * Builds the recommended first page for the chosen user track.
 */
export const buildTrackPages = (track: PortfolioTrack): Page[] => {
  const sharedBlocks: PortfolioBlock[] = [createHeroBlock(track), createAboutBlock(), createProjectsBlock()];

  const blocks =
    track === 'jobSeeker'
      ? [...sharedBlocks, createExperienceBlock(), createResumeBlock(), createContactBlock(track)]
      : [...sharedBlocks, createServicesBlock(), createTestimonialsBlock(), createContactBlock(track)];

  return [
    {
      id: `page-home-${Date.now()}`,
      name: 'Home',
      path: '/',
      blocks,
      showInNavigation: true,
      seoTitle: track === 'jobSeeker' ? 'Portfolio and resume' : 'Portfolio and services',
      seoDescription:
        track === 'jobSeeker'
          ? 'A focused portfolio built to support hiring conversations and recruiter review.'
          : 'A conversion-focused portfolio built to showcase services and generate qualified leads.',
    },
  ];
};

/**
 * Creates a production-shaped portfolio draft from a chosen template and track.
 */
export const createPortfolioDraft = ({
  template,
  title,
  track,
  userId,
  role,
}: {
  template: PortfolioTemplate;
  title: string;
  track: PortfolioTrack;
  userId: string;
  role: string;
}): Omit<Portfolio, 'id' | 'slug' | 'createdAt' | 'updatedAt'> => ({
  title,
  userId,
  design: { ...template.design },
  pages: buildTrackPages(track),
  isPublished: false,
  status: 'draft',
  publishedAt: undefined,
  track,
  role,
  seoTitle: title,
  seoDescription:
    track === 'jobSeeker'
      ? `${role} portfolio focused on outcomes, projects, and recruiter-ready presentation.`
      : `${role} portfolio focused on services, outcomes, and client conversion.`,
  isGuided: false,
  goal: track === 'jobSeeker' ? 'job' : 'freelance',
});
