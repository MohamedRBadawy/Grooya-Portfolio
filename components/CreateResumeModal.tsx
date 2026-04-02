import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, FilePlus, FolderKanban } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Resume } from '../types';
import { buildResumeDraftFromPortfolio } from '../services/resumeDrafts';

interface CreateResumeModalProps {
  onClose: () => void;
  onCreated: (resume: Resume) => void;
}

const CreateResumeModal: React.FC<CreateResumeModalProps> = ({ onClose, onCreated }) => {
  const { t } = useTranslation();
  const { user, portfolios, createResume, projects, skills } = useData();
  const [title, setTitle] = useState(t('untitledResume'));
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(portfolios.length > 0 ? portfolios[0].id : null);
  const [mode, setMode] = useState<'scratch' | 'portfolio'>(portfolios.length > 0 ? 'portfolio' : 'scratch');

  const handleCreateFromScratch = async () => {
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
    const newResume = await createResume(newResumeData);
    onCreated(newResume);
  };

  const handleCreateFromPortfolio = async () => {
    if (!user || !selectedPortfolioId) return;
    const portfolio = portfolios.find(p => p.id === selectedPortfolioId);
    if (!portfolio) return;
    const resumeDraft = buildResumeDraftFromPortfolio({ portfolio, user, projects, skills });
    const newResume = await createResume({
      ...resumeDraft,
      title: title.trim() || resumeDraft.title,
    });
    onCreated(newResume);
  };
  
  return (
        <motion.div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
                    <button onClick={() => setMode('portfolio')} className={`p-4 rounded-lg border-2 text-left transition-colors h-full ${mode === 'portfolio' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                        <FolderKanban size={20} className="mb-2 text-teal-500"/>
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Use portfolio content</h4>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Turn your portfolio sections into a clean, editable resume draft.</p>
                    </button>
                    <button onClick={() => setMode('scratch')} className={`p-4 rounded-lg border-2 text-left transition-colors h-full ${mode === 'scratch' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                        <FilePlus size={20} className="mb-2 text-teal-500"/>
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t('createFromScratch')}</h4>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Start with an empty resume and fill in every section manually.</p>
                    </button>
                </div>
                {mode === 'portfolio' && (
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
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          We’ll bring over your summary, experience, selected projects, and skills so you can refine them in the editor.
                        </p>
                    </div>
                )}
            </div>
            <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
                <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
                {mode === 'scratch' && (
                    <Button variant="primary" onClick={handleCreateFromScratch} disabled={!title.trim()}>{t('createAndEdit')}</Button>
                )}
                {mode === 'portfolio' && (
                    <Button variant="primary" onClick={handleCreateFromPortfolio} disabled={!title.trim() || !selectedPortfolioId}>
                        Build from Portfolio
                    </Button>
                )}
            </footer>
          </motion.div>
        </motion.div>
  );
};

export default CreateResumeModal;
