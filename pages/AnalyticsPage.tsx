import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChartHorizontal, Globe, Mail, Target } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';
import { fetchPortfolioAnalytics, type PortfolioAnalyticsSummary } from '../services/platform/analytics';

const EmptyAnalyticsState: React.FC<{
    title: string;
    description: string;
    ctaHref?: string;
    ctaLabel?: string;
}> = ({ title, description, ctaHref, ctaLabel }) => (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-teal-500">
            <BarChartHorizontal size={30} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold font-sora text-slate-900 dark:text-slate-50">{title}</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">{description}</p>
        {ctaHref && ctaLabel && (
            <Link to={ctaHref} className="mt-8 inline-block">
                <Button variant="primary" size="lg">
                    {ctaLabel}
                    <ArrowRight size={18} className="ml-2" />
                </Button>
            </Link>
        )}
    </div>
);

const MetricCard: React.FC<{
    label: string;
    value: number;
    icon: React.ReactNode;
}> = ({ label, value, icon }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {icon}
            {label}
        </div>
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{value}</div>
    </div>
);

const AnalyticsPage: React.FC = () => {
    const { portfolios, entitlements, featureFlags } = useData();
    const publishedPortfolios = useMemo(
        () => portfolios.filter((portfolio) => portfolio.status === 'published' || portfolio.isPublished),
        [portfolios],
    );
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(publishedPortfolios[0]?.id || null);
    const [analytics, setAnalytics] = useState<PortfolioAnalyticsSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!publishedPortfolios.length) {
            setSelectedPortfolioId(null);
            return;
        }

        if (!selectedPortfolioId || !publishedPortfolios.some((portfolio) => portfolio.id === selectedPortfolioId)) {
            setSelectedPortfolioId(publishedPortfolios[0].id);
        }
    }, [publishedPortfolios, selectedPortfolioId]);

    useEffect(() => {
        if (!selectedPortfolioId || !featureFlags.advancedAnalyticsEnabled || !entitlements.advancedAnalytics) {
            return;
        }

        let ignore = false;
        setIsLoading(true);

        fetchPortfolioAnalytics(selectedPortfolioId)
            .then((response) => {
                if (!ignore) {
                    setAnalytics(response);
                }
            })
            .catch((error) => {
                if (!ignore) {
                    console.error('Failed to load analytics.', error);
                    setAnalytics(null);
                }
            })
            .finally(() => {
                if (!ignore) {
                    setIsLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [selectedPortfolioId, featureFlags.advancedAnalyticsEnabled, entitlements.advancedAnalytics]);

    if (!featureFlags.advancedAnalyticsEnabled) {
        return (
            <div className="h-full">
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <EmptyAnalyticsState
                        title="Analytics are disabled in this environment"
                        description="The backend feature flags currently hide analytics. Enable the server flag when you’re ready to expose real traffic data."
                    />
                </main>
            </div>
        );
    }

    if (!entitlements.advancedAnalytics) {
        return (
            <div className="h-full">
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <EmptyAnalyticsState
                        title="Advanced analytics are available on Pro"
                        description="Upgrade to Pro to unlock real views, visitor counts, referrers, and lead conversion reporting for your published portfolios."
                        ctaHref="/dashboard/upgrade"
                        ctaLabel="View plans"
                    />
                </main>
            </div>
        );
    }

    if (!publishedPortfolios.length) {
        return (
            <div className="h-full">
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <EmptyAnalyticsState
                        title="Publish a portfolio to start collecting data"
                        description="Analytics only populate for published portfolios. Publish one of your drafts and share it to start tracking real visits and leads."
                        ctaHref="/dashboard"
                        ctaLabel="Go to portfolios"
                    />
                </main>
            </div>
        );
    }

    return (
        <div className="h-full">
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-sora text-slate-900 dark:text-slate-50">Portfolio Analytics</h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            Real backend-tracked performance for your published portfolio pages.
                        </p>
                    </div>

                    <div className="w-full max-w-sm">
                        <label htmlFor="portfolioSelect" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Portfolio
                        </label>
                        <select
                            id="portfolioSelect"
                            value={selectedPortfolioId || ''}
                            onChange={(event) => setSelectedPortfolioId(event.target.value)}
                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        >
                            {publishedPortfolios.map((portfolio) => (
                                <option key={portfolio.id} value={portfolio.id}>
                                    {portfolio.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <MetricCard label="Views" value={analytics?.views || 0} icon={<Globe size={18} className="text-teal-500" />} />
                    <MetricCard label="Unique Visitors" value={analytics?.unique_visitors || 0} icon={<Target size={18} className="text-teal-500" />} />
                    <MetricCard label="Leads" value={analytics?.leads || 0} icon={<Mail size={18} className="text-teal-500" />} />
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Top Referrers</h2>
                        {isLoading && <span className="text-sm text-slate-500 dark:text-slate-400">Refreshing...</span>}
                    </div>

                    {analytics?.top_referrers?.length ? (
                        <div className="space-y-3">
                            {analytics.top_referrers.map((referrer) => (
                                <div
                                    key={`${referrer.referrer}-${referrer.count}`}
                                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/50"
                                >
                                    <span className="truncate text-sm text-slate-700 dark:text-slate-300">
                                        {referrer.referrer || 'Direct / unknown'}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{referrer.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            No referrer data has been collected yet. Once visitors arrive from links, search, or social shares, they’ll appear here.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AnalyticsPage;
