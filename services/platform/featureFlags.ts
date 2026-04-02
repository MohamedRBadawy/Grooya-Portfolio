import type { FeatureFlags } from '../../types';

/**
 * Central launch feature flags for the frontend.
 *
 * These defaults intentionally hide incomplete production features until the
 * backend controls them through `/api/flags`.
 */
export const defaultFeatureFlags: FeatureFlags = {
  aiEnabled: false,
  aiGuidedBuildEnabled: false,
  aiPortfolioReviewEnabled: false,
  advancedAnalyticsEnabled: false,
  customDomainsEnabled: true,
  billingCheckoutEnabled: false,
  leadCaptureEnabled: false,
};
