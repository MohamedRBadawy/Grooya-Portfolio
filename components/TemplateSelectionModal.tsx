import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import type { PortfolioTemplate } from '../types';
import { portfolioTemplates } from '../services/templates';
import { useTranslation } from '../hooks/useTranslation';

interface TemplateSelectionModalProps {
  onSelectTemplate: (template: PortfolioTemplate) => void;
  onClose: () => void;
}

const TemplateCard: React.FC<{ template: PortfolioTemplate; onSelect: () => void; }> = ({ template, onSelect }) => {
    const { t } = useTranslation();
    const themeSwatches: Record<string, string[]> = {
        'dark': ['bg-slate-700', 'bg-slate-500'],
        'light': ['bg-slate-400', 'bg-slate-200'],
        'mint': ['bg-teal-300', 'bg-teal-100'],
        'rose': ['bg-rose-300', 'bg-rose-100'],
    };
    const themeName = template.design.paletteId.replace('default-', '');
    const swatches = themeSwatches[themeName] || themeSwatches.light;
    
    return (
        <button 
            onClick={onSelect} 
            className="w-full h-full text-left p-4 border border-slate-300 dark:border-slate-700 rounded-xl hover:border-teal-500 dark:hover:border-teal-400 hover:bg-white dark:hover:bg-slate-800/50 transition-all group flex flex-col"
        >
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-sora">{t(template.name)}</h4>
                <div className="flex -space-x-2 flex-shrink-0">
                    {swatches.map((color, i) => <div key={i} className={`w-5 h-5 rounded-full border-2 border-slate-100 dark:border-slate-900 ${color}`}></div>)}
                     <div className="w-5 h-5 rounded-full border-2 border-slate-100 dark:border-slate-900" style={{backgroundColor: template.design.accentColor}}></div>
                </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex-grow">{t(template.description)}</p>
            <div className="mt-4 text-sm font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {t('selectTemplate')} <ArrowRight size={16} />
            </div>
        </button>
    );
};


const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({ onSelectTemplate, onClose }) => {
    const { t } = useTranslation();
    
    const backdropMotionProps: any = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };

    const modalMotionProps: any = {
      initial: { y: 20, scale: 0.95, opacity: 0 },
      animate: { y: 0, scale: 1, opacity: 1 },
      exit: { y: 20, scale: 0.95, opacity: 0 },
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    };

    return (
        <motion.div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          {...backdropMotionProps}
        >
          <motion.div 
            className="bg-slate-100 dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
            {...modalMotionProps}
          >
            <header className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-2xl font-sora">
                    {t('createNewPortfolio')}
                </h3>
                <button 
                    onClick={onClose}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    aria-label={t('close')}
                >
                    <X size={20} />
                </button>
            </header>
            <div className="p-8">
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl">{t('templateSelectionPrompt')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioTemplates.map(template => (
                        <TemplateCard key={template.id} template={template} onSelect={() => onSelectTemplate(template)} />
                    ))}
                </div>
            </div>
          </motion.div>
        </motion.div>
      );
};

export default TemplateSelectionModal;