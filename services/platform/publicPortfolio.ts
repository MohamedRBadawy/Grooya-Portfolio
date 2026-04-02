/**
 * Public portfolio helpers for published portfolio fetches and lead capture.
 */

import type { Portfolio, Project, Skill } from '../../types';
import { apiGet, apiPost } from './api';

interface PublicPortfolioResponse {
  id: number | string;
  title: string;
  slug: string;
  track?: Portfolio['track'];
  status?: Portfolio['status'];
  design: Portfolio['design'];
  pages: Portfolio['pages'];
  assets?: Portfolio['assets'];
  seo_title?: string;
  seo_description?: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  project_catalog?: Project[];
  skill_catalog?: Skill[];
}

export interface LeadSubmissionPayload {
  portfolioSlug: string;
  name: string;
  email: string;
  message: string;
  metadata?: Record<string, unknown>;
}

const toTimestamp = (value?: string | null) => (value ? new Date(value).getTime() : undefined);

const getVisitorId = () => {
  if (typeof window === 'undefined') return 'server-render';
  const existing = window.localStorage.getItem('grooya_visitor_id');
  if (existing) return existing;
  const nextValue = `visitor-${Math.random().toString(36).slice(2)}-${Date.now()}`;
  window.localStorage.setItem('grooya_visitor_id', nextValue);
  return nextValue;
};

const mapPublicPortfolio = (record: PublicPortfolioResponse): Portfolio => ({
  id: String(record.id),
  title: record.title,
  slug: record.slug,
  userId: 'public-owner',
  design: record.design,
  pages: record.pages,
  isPublished: record.status === 'published',
  status: record.status || 'draft',
  publishedAt: toTimestamp(record.published_at),
  createdAt: new Date(record.created_at).getTime(),
  updatedAt: new Date(record.updated_at).getTime(),
  assets: record.assets || [],
  track: record.track || 'jobSeeker',
  seoTitle: record.seo_title,
  seoDescription: record.seo_description,
  projectCatalog: record.project_catalog || [],
  skillCatalog: record.skill_catalog || [],
});

export const fetchPublicPortfolioBySlug = async (slug: string): Promise<Portfolio> => {
  const record = await apiGet<PublicPortfolioResponse>(`/public/portfolios/${slug}/`, {
    headers: {
      'X-Grooya-Visitor': getVisitorId(),
    },
  });
  return mapPublicPortfolio(record);
};

export const submitLead = async ({ portfolioSlug, ...rest }: LeadSubmissionPayload) =>
  apiPost('/leads/', {
    portfolio_slug: portfolioSlug,
    ...rest,
  });
