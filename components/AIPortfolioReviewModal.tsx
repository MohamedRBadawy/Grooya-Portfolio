import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Sparkles, Lightbulb, Edit3, FolderKanban, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Portfolio, User, AIPortfolioReview } from '../types';
import { generatePortfolioReview } from '../services/aiService';

const FeedbackSection: React.FC<{ title: string, icon: React.ElementType, children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div>
        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Icon size={18} className="text-amber-500"/>
            {title}
        </h4>
        <div className="p-4 bg-slate-100/60 dark:bg-slate-800/60 rounded-lg text-sm text-slate-800 dark:text-slate-200 space-y-3 border border-slate-200 dark:border-slate-700/50">
            {children}
        </div>
    </div>
);

const AIPortfolioReviewModal: React.FC<{ portfolio: Portfolio; user: User; onClose: () => void; }> = ({ portfolio, user, onClose }) => {
  const { t } = useTranslation();
  const [review, setReview] = useState<AIPortfolioReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generatePortfolioReview(portfolio, user);
        setReview(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReview();
  }, [portfolio, user]);
  
  return (
    <motion.div
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg font-sora flex items-center gap-2">
            <Sparkles className="text-amber-500" size={20} />
            {t('aiMentor.title')}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label={t('close')}>
            <X size={20} />
          </button>
        </header>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {isLoading && (
                <div className="flex flex-col items-center justify-center p-16 text-center">
                    <svg className="animate-spin h-8 w-8 text-teal-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{t('aiMentor.generating')}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t('aiMentor.generating.message')}</p>
                </div>
            )}
            {error && <p className="text-rose-500 p-4">{error}</p>}

            {review && (
                <div className="space-y-6">
                    <FeedbackSection title={t('aiMentor.overallImpression')} icon={Lightbulb}>
                        <p>{review.overallImpression}</p>
                    </FeedbackSection>
                    
                    <FeedbackSection title={t('aiMentor.contentSuggestions')} icon={Edit3}>
                        {review.contentSuggestions.map((item, index) => (
                            <div key={index} className={index > 0 ? "pt-3 border-t border-slate-200/80 dark:border-slate-700/80" : ""}>
                                <p className="font-semibold">{item.area}</p>
                                <p className="opacity-90">{item.suggestion}</p>
                            </div>
                        ))}
                    </FeedbackSection>
                    
                     <FeedbackSection title={t('aiMentor.projectShowcase')} icon={FolderKanban}>
                        <p>{review.projectShowcaseFeedback}</p>
                    </FeedbackSection>
                    
                    {review.missingSections.length > 0 && (
                        <FeedbackSection title={t('aiMentor.missingSections')} icon={PlusCircle}>
                           <p>Consider adding the following sections to make your portfolio more comprehensive:</p>
                           <ul className="list-disc pl-5 mt-2 space-y-1">
                               {review.missingSections.map(section => (
                                   <li key={section} className="capitalize">{t(`block.${section}`)}</li>
                               ))}
                           </ul>
                        </FeedbackSection>
                    )}
                </div>
            )}
        </div>
        
        <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
          <Button variant="primary" onClick={onClose}>{t('aiMentor.done')}</Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default AIPortfolioReviewModal;
