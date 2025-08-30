import React, { useRef } from 'react';
import type { Portfolio } from '../types';
import PublicPortfolioPage from '../pages/PublicPortfolioPage';
import { useTranslation } from '../hooks/useTranslation';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortfolioPreviewModalProps {
  portfolio: Portfolio;
  onClose: () => void;
}

const PortfolioPreviewModal: React.FC<PortfolioPreviewModalProps> = ({ portfolio, onClose }) => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
      {...backdropMotionProps}
    >
      <motion.div 
        className="bg-white dark:bg-slate-900 w-full h-full sm:max-w-5xl sm:h-full sm:max-h-[90vh] rounded-none sm:rounded-2xl shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
        {...modalMotionProps}
      >
        <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-slate-200 text-lg">{t('previewTitle', {title: portfolio.title})}</h3>
            <button 
                onClick={onClose}
                className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                aria-label={t('closePreview')}
            >
                <X size={20} />
            </button>
        </header>
        <div ref={scrollContainerRef} className="flex-grow overflow-y-auto bg-white">
            <PublicPortfolioPage portfolioForPreview={portfolio} scrollContainerRef={scrollContainerRef} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PortfolioPreviewModal;