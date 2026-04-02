/**
 * Analytics endpoints for published portfolio performance.
 */

import { apiGet } from './api';

export interface PortfolioAnalyticsSummary {
  portfolio_id: number | string;
  views: number;
  unique_visitors: number;
  leads: number;
  top_referrers: Array<{
    referrer: string;
    count: number;
  }>;
}

export const fetchPortfolioAnalytics = (portfolioId: string) =>
  apiGet<PortfolioAnalyticsSummary>(`/analytics/portfolio/${portfolioId}/`);
