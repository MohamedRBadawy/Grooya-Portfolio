import type { Portfolio } from '../types';

export interface CoachChecklistItem {
  id: string;
  label: string;
  done: boolean;
  severity: 'critical' | 'watch' | 'good';
  detail: string;
}

export interface CoachTask {
  key: string;
  title: string;
  description: string;
  complete: boolean;
  actionText?: string;
  targetBlockType?: string;
}

export interface PortfolioCoachInsights {
  score: number;
  stageLabel: string;
  nextAction?: string;
  checklist: CoachChecklistItem[];
  tasks: CoachTask[];
}

const hasMeaningfulText = (value?: string, minLength = 60) => Boolean(value && value.trim().length >= minLength);

/**
 * Builds deterministic coaching insights so the editor can guide users even
 * when remote AI guidance is unavailable.
 */
export const getPortfolioCoachInsights = (portfolio: Portfolio): PortfolioCoachInsights => {
  const homePage = portfolio.pages[0];
  const blocks = homePage?.blocks || [];
  const hero = blocks.find((block) => block.type === 'hero') as any;
  const about = blocks.find((block) => block.type === 'about') as any;
  const projects = blocks.find((block) => block.type === 'projects') as any;
  const services = blocks.find((block) => block.type === 'services') as any;
  const experience = blocks.find((block) => block.type === 'experience') as any;
  const contact = blocks.find((block) => block.type === 'contact') as any;
  const testimonials = blocks.find((block) => block.type === 'testimonials') as any;
  const resume = blocks.find((block) => block.type === 'resume') as any;
  const isFreelancer = portfolio.track === 'freelancer';

  const checklist: CoachChecklistItem[] = [
    {
      id: 'hero',
      label: 'Clear hero promise',
      done: Boolean(hero?.headline && hero.headline !== 'Your Name or Compelling Headline' && hasMeaningfulText(hero?.subheadline, 20)),
      severity: 'critical',
      detail: 'Visitors should understand your role and value within the first screen.',
    },
    {
      id: 'about',
      label: 'About section with substance',
      done: hasMeaningfulText(about?.content),
      severity: 'watch',
      detail: 'Add a short story about how you work, not just a generic intro.',
    },
    {
      id: 'proof',
      label: isFreelancer ? 'Visible offer and proof of delivery' : 'Visible proof of work',
      done: isFreelancer
        ? Boolean((services?.tiers?.length || 0) > 0 && (projects?.projectIds?.length || 0) > 0)
        : Boolean((projects?.projectIds?.length || 0) > 0 || (experience?.items?.length || 0) > 0),
      severity: 'critical',
      detail: isFreelancer
        ? 'Freelancer portfolios need both services and examples of shipped work.'
        : 'Job-seeker portfolios need projects or experience to back up the positioning.',
    },
    {
      id: 'contact',
      label: 'Clear conversion path',
      done: Boolean(contact || (isFreelancer && services?.tiers?.some((tier: any) => Boolean(tier.link)))),
      severity: 'critical',
      detail: 'Make it obvious how a recruiter or client should contact you next.',
    },
    {
      id: 'seo',
      label: 'Page SEO is filled in',
      done: Boolean(homePage?.seoTitle && homePage?.seoDescription),
      severity: 'watch',
      detail: 'SEO fields improve search snippets and social sharing quality.',
    },
    {
      id: 'navigation',
      label: 'Published pages show up clearly in navigation',
      done: portfolio.pages.filter((page) => page.showInNavigation !== false).length > 0,
      severity: 'good',
      detail: 'Navigation should help visitors scan the portfolio instead of getting lost.',
    },
    {
      id: 'credibility',
      label: isFreelancer ? 'Trust signals are present' : 'Credibility signals are present',
      done: isFreelancer ? Boolean(testimonials || projects?.projectIds?.length > 1) : Boolean(experience || resume || projects?.projectIds?.length > 1),
      severity: 'watch',
      detail: isFreelancer
        ? 'Testimonials, case studies, or multiple projects make the offer feel safer.'
        : 'Experience, resume access, or multiple projects make the portfolio feel more complete.',
    },
  ];

  const tasks: CoachTask[] = [
    {
      key: 'hero',
      title: 'Sharpen the first screen',
      description: 'Clarify what you do and why someone should keep reading.',
      complete: checklist[0].done,
      actionText: hero ? 'Edit hero' : 'Add hero',
      targetBlockType: hero ? 'hero' : 'hero',
    },
    {
      key: 'about',
      title: 'Explain how you work',
      description: 'Add enough context that your strengths feel believable and specific.',
      complete: checklist[1].done,
      actionText: about ? 'Edit about' : 'Add about',
      targetBlockType: about ? 'about' : 'about',
    },
    {
      key: 'proof',
      title: isFreelancer ? 'Show work and services together' : 'Back the story with proof',
      description: isFreelancer
        ? 'Pair your offer with real examples so the page sells capability and trust at the same time.'
        : 'Projects or experience should quickly prove the kind of work you can deliver.',
      complete: checklist[2].done,
      actionText: projects ? 'Add project' : 'Add projects section',
      targetBlockType: projects ? 'projects' : 'projects',
    },
    {
      key: 'conversion',
      title: isFreelancer ? 'Make buying easier' : 'Make contact frictionless',
      description: isFreelancer
        ? 'Add a clear contact path and stronger service CTAs.'
        : 'Recruiters should not have to hunt for a contact method.',
      complete: checklist[3].done,
      actionText: contact ? 'Edit contact' : 'Add contact',
      targetBlockType: contact ? 'contact' : 'contact',
    },
  ];

  const completed = checklist.filter((item) => item.done).length;
  const score = Math.round((completed / checklist.length) * 100);
  const stageLabel = score >= 85 ? 'Ready to publish' : score >= 60 ? 'Solid draft' : score >= 35 ? 'Early structure' : 'Foundation needed';
  const nextAction = tasks.find((task) => !task.complete)?.title;

  return {
    score,
    stageLabel,
    nextAction,
    checklist,
    tasks,
  };
};
