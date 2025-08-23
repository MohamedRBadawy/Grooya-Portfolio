import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Sparkles, FilePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Resume, Portfolio } from '../types';
import { generateResumeFromPortfolio } from '../services/aiService';
import toast from 'react-hot-toast';

interface CreateResumeModalProps {
  onClose: () => void;
  onCreated: (resume: Resume) => void;
}

const CreateResumeModal: React.FC<CreateResumeModalProps> = ({ onClose, onCreated }) => {
  const { t } = useTranslation();
  const { user, portfolios, createResume, projects, skills } = useData();
  const [title, setTitle] = useState(t('untitledResume'));
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(portfolios.length > 0 ? portfolios[0].id : null);
  const [mode, setMode] = useState<'scratch' | 'ai'>('ai');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateFromScratch = () => {
    if (!user) return;
    const newResumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        userId: user.id,
        fullName: user.name,
        jobTitle: user.title,
        email: user.email,
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        template: 'classic',
        accentColor: '#1e8c8c'
    };
    const newResume = createResume(newResumeData);
    onCreated(newResume);
  };

  const handleGenerateFromPortfolio = async () => {
    if (!user || !selectedPortfolioId) return;
    const portfolio = portfolios.find(p => p.id === selectedPortfolioId);
    if (!portfolio) return;

    setIsGenerating(true);
    try {
        const generatedData = await generateResumeFromPortfolio(portfolio, user, projects, skills);
        const newResumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'> = {
            ...generatedData,
            title,
            userId: user.id,
            template: 'classic',
            accentColor: portfolio.design.accentColor || '#1e8c8c'
        };
        const newResume = createResume(newResumeData);
        onCreated(newResume);
    } catch (error) {
        console.error(error);
        toast.error("Failed to generate resume. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-cream-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-cream-200 dark:bg-cream-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col relative border border-cream-300 dark:border-cream-700"
        onClick={e => e.stopPropagation()}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <header className="flex-shrink-0 p-4 border-b border-cream-300 dark:border-cream-700 flex justify-between items-center">
            <h3 className="font-bold text-cream-800 dark:text-cream-200 text-lg font-sora">{t('createNewResume')}</h3>
            <button onClick={onClose} className="p-2 rounded-full text-cream-500 dark:text-cream-400 hover:bg-cream-300 dark:hover:bg-cream-800" aria-label={t('close')}>
                <X size={20} />
            </button>
        </header>
        <div className="p-6 space-y-6">
            <div>
                <label htmlFor="resumeTitle" className="block text-sm font-medium text-cream-700 dark:text-cream-300 mb-1.5">{t('resumeTitle')}</label>
                <input id="resumeTitle" value={title} onChange={e => setTitle(e.target.value)} required className="block w-full bg-cream-300 dark:bg-cream-800 border-cream-400 dark:border-cream-600 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-cream-900 dark:text-cream-100 p-2"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setMode('ai')} className={`p-4 rounded-lg border-2 text-left transition-colors ${mode === 'ai' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'border-cream-300 dark:border-cream-700 hover:border-cream-400 dark:hover:border-cream-600'}`}>
                    <Sparkles size={20} className="mb-2 text-teal-500"/>
                    <h4 className="font-semibold text-cream-800 dark:text-cream-200">{t('generateFromPortfolio')}</h4>
                </button>
                <button onClick={() => setMode('scratch')} className={`p-4 rounded-lg border-2 text-left transition-colors ${mode === 'scratch' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'border-cream-300 dark:border-cream-700 hover:border-cream-400 dark:hover:border-cream-600'}`}>
                    <FilePlus size={20} className="mb-2 text-teal-500"/>
                    <h4 className="font-semibold text-cream-800 dark:text-cream-200">{t('createFromScratch')}</h4>
                </button>
            </div>
            {mode === 'ai' && (
                <div>
                     <label htmlFor="portfolioSelect" className="block text-sm font-medium text-cream-700 dark:text-cream-300 mb-1.5">{t('selectPortfolio')}</label>
                     <select 
                        id="portfolioSelect"
                        value={selectedPortfolioId || ''}
                        onChange={e => setSelectedPortfolioId(e.target.value)}
                        className="block w-full bg-cream-300 dark:bg-cream-800 border-cream-400 dark:border-cream-600 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-cream-900 dark:text-cream-100 p-2"
                     >
                         {portfolios.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                     </select>
                </div>
            )}
        </div>
        <footer className="flex-shrink-0 p-4 border-t border-cream-300 dark:border-cream-700 flex justify-end gap-3 bg-cream-200/50 dark:bg-cream-900/50 rounded-b-lg">
            <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
            {mode === 'scratch' ? (
                <Button variant="primary" onClick={handleCreateFromScratch} disabled={!title.trim()}>{t('createAndEdit')}</Button>
            ) : (
                <Button variant="primary" onClick={handleGenerateFromPortfolio} disabled={!title.trim() || !selectedPortfolioId || isGenerating}>
                    {isGenerating && <svg className="animate-spin -ms-1 me-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {isGenerating ? t('generatingResume') : t('generateAndEdit')}
                </Button>
            )}
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default CreateResumeModal;