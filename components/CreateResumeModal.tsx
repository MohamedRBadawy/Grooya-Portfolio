import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Sparkles, FilePlus, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Resume, Portfolio } from '../types';
import { generateResumeFromPortfolio, ApiKeyMissingError, generateResumeForJobDescription } from '../services/aiService';
import toast from 'react-hot-toast';
import UpgradeModal from './UpgradeModal';

interface CreateResumeModalProps {
  onClose: () => void;
  onCreated: (resume: Resume) => void;
}

const CreateResumeModal: React.FC<CreateResumeModalProps> = ({ onClose, onCreated }) => {
  const { t } = useTranslation();
  const { user, portfolios, createResume, projects, skills, consumeAiFeature, resumes, entitlements } = useData();
  const [title, setTitle] = useState(t('untitledResume'));
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(portfolios.length > 0 ? portfolios[0].id : null);
  const [mode, setMode] = useState<'scratch' | 'ai-portfolio' | 'ai-job-desc'>('ai-portfolio');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBaseResumeId, setSelectedBaseResumeId] = useState<string | null>(resumes.length > 0 ? resumes[0].id : null);
  const [jobDescription, setJobDescription] = useState('');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

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
    
    if (!consumeAiFeature('resumeFromPortfolio')) {
      const tier = user?.subscription?.tier;
      let message = "An error occurred.";
      if (tier === 'free') {
          message = "You've used your one free resume generation from a portfolio. Please upgrade to use it again.";
      } else if (tier) {
          message = "You've run out of AI text credits for this month. Please upgrade your plan or purchase more credits.";
      }
      toast.error(message);
      return;
    }

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
        if (error instanceof ApiKeyMissingError) {
            toast.error(error.message);
        } else {
            toast.error("Failed to generate resume. Please try again.");
        }
    } finally {
        setIsGenerating(false);
    }
  };

  const handleGenerateForJobDescription = async () => {
    if (!user || !selectedBaseResumeId || !jobDescription.trim()) return;

    if (!entitlements.atsOptimization) {
        setIsUpgradeModalOpen(true);
        return;
    }
    
    const baseResume = resumes.find(r => r.id === selectedBaseResumeId);
    if (!baseResume) {
        toast.error("Base resume not found.");
        return;
    }

    if (!consumeAiFeature('resumeFromJobDescription')) {
      return; // consumeAiFeature already shows a toast
    }

    setIsGenerating(true);
    try {
        const generatedData = await generateResumeForJobDescription(baseResume, jobDescription);
        const newResumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'> = {
            ...generatedData,
            title: title || `Resume for ${baseResume.jobTitle}`,
            userId: user.id,
            template: baseResume.template,
            accentColor: baseResume.accentColor,
        };
        const newResume = createResume(newResumeData);
        onCreated(newResume);
    } catch (error) {
        console.error(error);
        if (error instanceof ApiKeyMissingError) {
            toast.error(error.message);
        } else {
            toast.error("Failed to generate tailored resume. Please try again.");
        }
    } finally {
        setIsGenerating(false);
    }
  };
  
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
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
            {...modalMotionProps}
          >
            <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg font-sora">{t('createNewResume')}</h3>
                <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label={t('close')}>
                    <X size={20} />
                </button>
            </header>
            <div className="p-6 space-y-6">
                <div>
                    <label htmlFor="resumeTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('resumeTitle')}</label>
                    <input id="resumeTitle" value={title} onChange={e => setTitle(e.target.value)} required className="block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button onClick={() => setMode('ai-portfolio')} className={`p-4 rounded-lg border-2 text-left transition-colors h-full ${mode === 'ai-portfolio' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                        <Sparkles size={20} className="mb-2 text-teal-500"/>
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t('generateFromPortfolio')}</h4>
                    </button>
                    <button onClick={() => setMode('ai-job-desc')} className={`p-4 rounded-lg border-2 text-left transition-colors h-full ${mode === 'ai-job-desc' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                        <Briefcase size={20} className="mb-2 text-teal-500"/>
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t('generateFromJobDescription')}</h4>
                    </button>
                    <button onClick={() => setMode('scratch')} className={`p-4 rounded-lg border-2 text-left transition-colors h-full ${mode === 'scratch' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                        <FilePlus size={20} className="mb-2 text-teal-500"/>
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t('createFromScratch')}</h4>
                    </button>
                </div>
                {mode === 'ai-portfolio' && (
                    <div>
                         <label htmlFor="portfolioSelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('selectPortfolio')}</label>
                         <select 
                            id="portfolioSelect"
                            value={selectedPortfolioId || ''}
                            onChange={e => setSelectedPortfolioId(e.target.value)}
                            className="block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2"
                         >
                             {portfolios.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                         </select>
                    </div>
                )}
                 {mode === 'ai-job-desc' && (
                    <div className="space-y-4">
                        {resumes.length > 0 ? (
                        <>
                            <div>
                                <label htmlFor="resumeSelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('selectBaseResume')}</label>
                                <select 
                                    id="resumeSelect"
                                    value={selectedBaseResumeId || ''}
                                    onChange={e => setSelectedBaseResumeId(e.target.value)}
                                    className="block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2"
                                >
                                    {resumes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('pasteJobDescriptionHere')}</label>
                                <textarea 
                                    id="jobDescription"
                                    value={jobDescription}
                                    onChange={e => setJobDescription(e.target.value)}
                                    rows={6}
                                    className="block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2"
                                />
                            </div>
                            <p className="text-xs text-center text-slate-500 dark:text-slate-400 px-4">{t('atsFriendlyNote')}</p>
                        </>
                        ) : (
                            <p className="text-sm text-center text-slate-600 dark:text-slate-400 py-4">{t('noResumesToTailor')}</p>
                        )}
                    </div>
                )}
            </div>
            <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
                <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
                {mode === 'scratch' && (
                    <Button variant="primary" onClick={handleCreateFromScratch} disabled={!title.trim()}>{t('createAndEdit')}</Button>
                )}
                {mode === 'ai-portfolio' && (
                    <Button variant="primary" onClick={handleGenerateFromPortfolio} disabled={!title.trim() || !selectedPortfolioId || isGenerating}>
                        {isGenerating && <svg className="animate-spin -ms-1 me-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {isGenerating ? t('generatingResume') : t('generateAndEdit')}
                    </Button>
                )}
                 {mode === 'ai-job-desc' && (
                    <Button variant="primary" onClick={handleGenerateForJobDescription} disabled={!title.trim() || !selectedBaseResumeId || !jobDescription.trim() || isGenerating || resumes.length === 0}>
                        {isGenerating && <svg className="animate-spin -ms-1 me-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {isGenerating ? t('generatingTailoredResume') : t('tailorAndEdit')}
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
                    featureName='ATS Resume Tailoring'
                    featureDescription='The ability to automatically tailor your resume for a specific job description is a Pro feature.'
                />
            )}
        </AnimatePresence>
    </>
  );
};

export default CreateResumeModal;