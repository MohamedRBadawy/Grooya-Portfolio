

import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { portfolioTemplates } from '../services/templates';
import PublicPortfolioPage from './PublicPortfolioPage';
import type { Portfolio } from '../types';
import { useTranslation } from '../hooks/useTranslation';

const TemplatePreviewPage: React.FC = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const { t } = useTranslation();

    const template = useMemo(() => {
        return portfolioTemplates.find(t => t.id === templateId);
    }, [templateId]);

    const portfolioForPreview: Portfolio | null = useMemo(() => {
        if (!template) return null;
        return {
            id: template.id,
            title: t(template.name), // Use translation for the title
            slug: template.id,
            userId: 'template-user',
            design: template.design,
            pages: template.pages,
            isPublished: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
    }, [template, t]);

    if (!template || !portfolioForPreview) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Template Not Found</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">The template you're looking for doesn't exist.</p>
                <Link to="/" className="mt-6 px-4 py-2 rounded-md font-semibold text-white bg-cyan-500 hover:bg-cyan-600">
                    Back to Home
                </Link>
            </div>
        );
    }

    return <PublicPortfolioPage portfolioForPreview={portfolioForPreview} />;
};

export default TemplatePreviewPage;
