import React, { useState, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM;
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Portfolio, PortfolioTemplate } from '../types';
import { defaultPalettes } from '../services/palettes';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import PortfolioPreviewModal from './PortfolioPreviewModal';

const TemplateVisual: React.FC<{ design: PortfolioTemplate['design'] }> = ({ design }) => {
    const palette = defaultPalettes.find(p => p.id === design.paletteId) || defaultPalettes[0];
    return (
        <div className="aspect-[4/3] p-4 flex flex-col gap-2 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300" style={{ backgroundColor: palette.colors.background }}>
            <div className="flex justify-between items-center">
                <div className="w-1/4 h-3 rounded-full" style={{ backgroundColor: palette.colors.heading }}></div>
                <div className="flex gap-1">
                    <div className="w-8 h-3 rounded-full" style={{ backgroundColor: palette.colors.subtle }}></div>
                    <div className="w-8 h-3 rounded-full" style={{ backgroundColor: palette.colors.subtle }}></div>
                </div>
            </div>
            <div className="w-3/4 h-5 rounded" style={{ backgroundColor: design.accentColor }}></div>
            <div className="w-full h-3 rounded-full mt-2" style={{ backgroundColor: palette.colors.text }}></div>
            <div className="w-5/6 h-3 rounded-full" style={{ backgroundColor: palette.colors.text }}></div>
        </div>
    );
};

const TemplateCard: React.FC<{ template: PortfolioTemplate; onSelect: () => void; onPreview: () => void; }> = ({ template, onSelect, onPreview }) => {
    const { t } = useTranslation();
    
    return (
        <div className="h-full rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col">
            <TemplateVisual design={template.design} />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-sora">{t(template.name)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-grow">{t(template.description)}</p>
                <div className="mt-6 flex gap-3">
                    <Button variant="secondary" className="w-full" onClick={onPreview}>{t('preview')}</Button>
                    <Button variant="primary" className="flex-1" onClick={onSelect}>{t('useTemplate')}</Button>
                </div>
            </div>
        </div>
    );
};

const TemplateShowcasePage: React.FC = () => {
    const { t } = useTranslation();
    const { user, templates, createPortfolio } = useData();
    const navigate = useNavigate();
    const [previewingTemplate, setPreviewingTemplate] = useState<PortfolioTemplate | null>(null);

    const handleSelectTemplate = (template: PortfolioTemplate) => {
        if (!user) return;

        const newPortfolioData: Omit<Portfolio, 'id' | 'slug' | 'createdAt' | 'updatedAt'> = {
            title: `My ${t(template.name)}`,
            userId: user.id,
            design: template.design,
            pages: template.pages,
            isPublished: false,
        };
        const newPortfolio = createPortfolio(newPortfolioData);
        toast.success(`Portfolio created from '${t(template.name)}' template!`);
        navigate(`/dashboard/edit/${newPortfolio.id}`);
    };
    
    const handlePreview = (template: PortfolioTemplate) => {
        setPreviewingTemplate(template);
    };

    const portfolioForPreview = useMemo((): Portfolio | null => {
        if (!previewingTemplate) return null;
        return {
            id: previewingTemplate.id,
            title: t(previewingTemplate.name),
            slug: previewingTemplate.id,
            userId: 'template-user',
            design: previewingTemplate.design,
            pages: previewingTemplate.pages,
            isPublished: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
    }, [previewingTemplate, t]);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07 }
      }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const gridMotionProps: any = {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
    };

    return (
        <>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">
                        {t('templates.title')}
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t('templates.subtitle')}
                    </p>
                </div>
                
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    {...gridMotionProps}
                >
                    {templates.map(template => (
                        <motion.div key={template.id} variants={itemVariants}>
                            <TemplateCard 
                                template={template} 
                                onSelect={() => handleSelectTemplate(template)}
                                onPreview={() => handlePreview(template)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </main>
            <AnimatePresence>
                {portfolioForPreview && (
                    <PortfolioPreviewModal 
                        portfolio={portfolioForPreview} 
                        onClose={() => setPreviewingTemplate(null)} 
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default TemplateShowcasePage;
