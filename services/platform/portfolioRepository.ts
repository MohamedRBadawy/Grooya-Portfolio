/**
 * Typed portfolio repository that maps the Django payloads into frontend models.
 */

import type { Page, Portfolio, PortfolioAsset } from '../../types';
import { apiDelete, apiGet, apiPost, apiPut } from './api';

interface BackendPortfolioRecord {
  id: number | string;
  title: string;
  slug: string;
  track?: Portfolio['track'];
  status?: Portfolio['status'];
  design: Portfolio['design'];
  pages: Page[];
  assets?: PortfolioAsset[];
  seo_title?: string;
  seo_description?: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface PortfolioWritePayload {
  title: string;
  slug: string;
  track: Portfolio['track'];
  status: Portfolio['status'];
  design: Portfolio['design'];
  pages: Page[];
  assets: PortfolioAsset[];
  seo_title?: string;
  seo_description?: string;
}

const toTimestamp = (value?: string | null) => (value ? new Date(value).getTime() : undefined);

const mapPortfolioRecord = (record: BackendPortfolioRecord): Portfolio => ({
  id: String(record.id),
  title: record.title,
  slug: record.slug,
  userId: 'server-user',
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
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toPortfolioPayload = (portfolio: Portfolio): PortfolioWritePayload => ({
  title: portfolio.title,
  slug: portfolio.slug || `${slugify(portfolio.title)}-${Math.random().toString(36).slice(2, 8)}`,
  track: portfolio.track || 'jobSeeker',
  status: portfolio.status || (portfolio.isPublished ? 'published' : 'draft'),
  design: portfolio.design,
  pages: portfolio.pages,
  assets: portfolio.assets || [],
  seo_title: portfolio.seoTitle,
  seo_description: portfolio.seoDescription,
});

export const listPortfolios = async (): Promise<Portfolio[]> => {
  const records = await apiGet<BackendPortfolioRecord[]>('/portfolios/');
  return records.map(mapPortfolioRecord);
};

export const createPortfolioRecord = async (portfolio: Portfolio): Promise<Portfolio> => {
  const record = await apiPost<BackendPortfolioRecord>('/portfolios/', toPortfolioPayload(portfolio));
  return mapPortfolioRecord(record);
};

export const updatePortfolioRecord = async (portfolio: Portfolio): Promise<Portfolio> => {
  const record = await apiPut<BackendPortfolioRecord>(`/portfolios/${portfolio.id}/`, toPortfolioPayload(portfolio));
  return mapPortfolioRecord(record);
};

export const deletePortfolioRecord = (portfolioId: string) => apiDelete(`/portfolios/${portfolioId}/`);
