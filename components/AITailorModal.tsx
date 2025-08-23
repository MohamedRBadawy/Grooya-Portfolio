

import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Resume, AITailoringSuggestions } from '../types';
import { generateResumeTailoringSuggestions } from '../services/aiService';
import toast from 'react-hot-toast';

interface AITailorModalProps {
  resume: Resume;
  onClose: () => void;
  onApplySuggestions: (suggestions: AITailoringSuggestions) => void;
}

const AITailorModal: React.FC<AITailorModalProps> = ({ resume, onClose, onApplySuggestions }) => {
  const { t } = useTranslation();
  const [jobDescription, setJobDescription] = useState('');
  const [suggestions, setSuggestions] = useState<AITailoringSuggestions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    setIsGenerating(true);
    setSuggestions(null);
    try {
      const result = await generateResumeTailoringSuggestions(resume, jobDescription);
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate suggestions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleApply = () => {
      if (suggestions) {
          onApplySuggestions(suggestions);
      }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-cream-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-cream-200 dark:bg-cream-900 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col relative border border-cream-300 dark:border-cream-700 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <header className="flex-shrink-0 p-4 border-b border-cream-300 dark:border-cream-700 flex justify-between items-center">
          <h3 className="font-bold text-cream-800 dark:text-cream-200 text-lg font-sora flex items-center gap-2">
            <Sparkles className="text-amber-500" size={20} />
            {t('aiTailor')}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full text-cream-500 dark:text-cream-400 hover:bg-cream-300 dark:hover:bg-cream-800" aria-label={t('close')}>
            <X size={20} />
          </button>
        </header>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {!suggestions && (
                 <div>
                    <label htmlFor="jobDescription" className="block text-sm font-medium text-cream-700 dark:text-cream-300 mb-1.5">{t('pasteJobDescription')}</label>
                    <textarea 
                        id="jobDescription"
                        value={jobDescription} 
                        onChange={e => setJobDescription(e.target.value)}
                        placeholder="e.g., Senior Frontend Developer at Tech Corp..."
                        rows={12}
                        className="block w-full bg-cream-300 dark:bg-cream-800 border-cream-400 dark:border-cream-600 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-cream-900 dark:text-cream-100 p-2"
                    />
                </div>
            )}
           
            {isGenerating && (
                <div className="flex flex-col items-center justify-center p-16 text-center">
                    <svg className="animate-spin h-8 w-8 text-teal-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-cream-700 dark:text-cream-300">{t('generatingSuggestions')}</p>
                </div>
            )}

            {suggestions && (
                <div>
                    <h4 className="text-xl font-semibold text-cream-800 dark:text-cream-200 mb-4">{t('tailoringSuggestions')}</h4>
                    <div className="space-y-6">
                        <div>
                            <h5 className="font-semibold text-cream-700 dark:text-cream-300 mb-2">{t('rewrittenSummary')}</h5>
                            <p className="p-4 bg-cream-300/60 dark:bg-cream-800/60 rounded-lg text-sm text-cream-800 dark:text-cream-200 whitespace-pre-wrap">{suggestions.newSummary}</p>
                        </div>
                         <div>
                            <h5 className="font-semibold text-cream-700 dark:text-cream-300 mb-2">{t('suggestedKeywords')}</h5>
                             <div className="flex flex-wrap gap-2">
                                {suggestions.suggestedKeywords.map(keyword => (
                                    <span key={keyword} className="px-3 py-1 text-sm rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">{keyword}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h5 className="font-semibold text-cream-700 dark:text-cream-300 mb-2">{t('generalFeedback')}</h5>
                            <ul className="space-y-2">
                                {suggestions.feedbackPoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-teal-500 mt-1 flex-shrink-0"/>
                                        <span className="text-sm text-cream-800 dark:text-cream-300">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        <footer className="flex-shrink-0 p-4 border-t border-cream-300 dark:border-cream-700 flex justify-end gap-3 bg-cream-200/50 dark:bg-cream-900/50 rounded-b-lg">
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
  );
};

export default AITailorModal;