import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Resume, AITailoringSuggestions } from '../types';
import { generateResumeTailoringSuggestions, ApiKeyMissingError } from '../services/aiService';
import toast from 'react-hot-toast';
import { useData } from '../contexts/DataContext';
import UpgradeModal from './UpgradeModal';

interface AITailorModalProps {
  resume: Resume;
  onClose: () => void;
  onApplySuggestions: (suggestions: AITailoringSuggestions) => void;
}

const AITailorModal: React.FC<AITailorModalProps> = ({ resume, onClose, onApplySuggestions }) => {
  const { t } = useTranslation();
  const { user, consumeAiFeature, entitlements } = useData();
  const [jobDescription, setJobDescription] = useState('');
  const [suggestions, setSuggestions] = useState<AITailoringSuggestions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;

    if (!entitlements.atsOptimization) {
        setIsUpgradeModalOpen(true);
        return;
    }
    
    if (!consumeAiFeature('resumeTailoring')) {
      return; // The hook handles the toast message
    }

    setIsGenerating(true);
    setSuggestions(null);
    try {
      const result = await generateResumeTailoringSuggestions(resume, jobDescription);
      setSuggestions(result);
    } catch (error) {
        console.error(error);
        if (error instanceof ApiKeyMissingError) {
            toast.error(error.message);
        } else {
            toast.error("Failed to generate suggestions. Please try again.");
        }
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleApply = () => {
      if (suggestions) {
          onApplySuggestions(suggestions);
      }
  }

  const backdropMotionProps: any = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
  };

  const modalMotionProps: any = {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 20, opacity: 0 },
      transition: { type: 'spring', stiffness: 400, damping: 30 },
  };

  return (
    <>
        <motion.div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          {...backdropMotionProps}
        >
          <motion.div
            className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            {...modalMotionProps}
          >
            <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg font-sora flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} />
                {t('aiTailor')}
              </h3>
              <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label={t('close')}>
                <X size={20} />
              </button>
            </header>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {!suggestions && (
                     <div>
                        <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('pasteJobDescription')}</label>
                        <textarea 
                            id="jobDescription"
                            value={jobDescription} 
                            onChange={e => setJobDescription(e.target.value)}
                            placeholder="e.g., Senior Frontend Developer at Tech Corp..."
                            rows={12}
                            className="block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2"
                        />
                    </div>
                )}
               
                {isGenerating && (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <svg className="animate-spin h-8 w-8 text-teal-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="text-slate-700 dark:text-slate-300">{t('generatingSuggestions')}</p>
                    </div>
                )}

                {suggestions && (
                    <div>
                        <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">{t('tailoringSuggestions')}</h4>
                        <div className="space-y-6">
                            <div>
                                <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('rewrittenSummary')}</h5>
                                <p className="p-4 bg-slate-100/60 dark:bg-slate-800/60 rounded-lg text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{suggestions.newSummary}</p>
                            </div>
                             <div>
                                <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('suggestedKeywords')}</h5>
                                 <div className="flex flex-wrap gap-2">
                                    {suggestions.suggestedKeywords.map(keyword => (
                                        <span key={keyword} className="px-3 py-1 text-sm rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('generalFeedback')}</h5>
                                <ul className="space-y-2">
                                    {suggestions.feedbackPoints.map((point, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-teal-500 mt-1 flex-shrink-0"/>
                                            <span className="text-sm text-slate-800 dark:text-slate-300">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
              <Button variant="secondary" onClick={onClose}>{t('close')}</Button>
              {!suggestions ? (
                <Button variant="primary" onClick={handleGenerate} disabled={!jobDescription.trim() || isGenerating}>
                    <Sparkles size={16} className="me-2"/>
                    {t('generateSuggestions')}
                </Button>
              ) : (
                <Button variant="primary" onClick={handleApply}>
                    {t('applySuggestions')}
                </Button>
              )}
            </footer>
          </motion.div>
        </motion.div>
        <AnimatePresence>
            {isUpgradeModalOpen && (
                <UpgradeModal
                    isOpen={isUpgradeModalOpen}
                    onClose={() => setIsUpgradeModalOpen(false)}
                    featureName='AI Resume Tailoring'
                    featureDescription='The ability to get AI-powered suggestions to tailor your resume is a Pro feature.'
                />
            )}
        </AnimatePresence>
    </>
  );
};

export default AITailorModal;
