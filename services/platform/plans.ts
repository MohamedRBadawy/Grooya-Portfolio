import type { PlanDefinition, PlanTier } from '../../types';

export const launchPlans: Record<PlanTier, PlanDefinition> = {
  free: {
    tier: 'free',
    title: 'Free',
    monthlyPriceEgp: 0,
    annualPriceEgp: 0,
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    features: [
      '1 portfolio',
      '1 resume',
      'Grooya subdomain',
      'Grooya branding',
      'Standard templates and blocks',
      'Public publishing',
      'Contact form',
    ],
  },
  starter: {
    tier: 'starter',
    title: 'Starter',
    monthlyPriceEgp: 199,
    annualPriceEgp: 1990,
    monthlyPriceUsd: 5,
    annualPriceUsd: 50,
    features: [
      '3 portfolios',
      '3 resumes',
      'Remove Grooya branding',
      'Full core templates',
      'Lead inbox',
      'Basic analytics',
    ],
  },
  pro: {
    tier: 'pro',
    title: 'Pro',
    monthlyPriceEgp: 449,
    annualPriceEgp: 4490,
    monthlyPriceUsd: 12,
    annualPriceUsd: 120,
    features: [
      '10 portfolios',
      'Unlimited resumes',
      'Custom domain',
      'Advanced design controls',
      'SEO controls',
      'Advanced analytics',
      'Priority support',
    ],
  },
  premium: {
    tier: 'premium',
    title: 'Premium',
    monthlyPriceEgp: 0,
    annualPriceEgp: 0,
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    features: [],
  },
};

export const paidLaunchPlanOrder: PlanTier[] = ['free', 'starter', 'pro'];
