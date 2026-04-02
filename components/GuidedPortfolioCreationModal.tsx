import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, ArrowRight, Briefcase, UserCheck, LayoutTemplate, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Portfolio, PortfolioTrack } from '../types';
import { portfolioTemplates } from '../services/templates';
import { createPortfolioDraft } from '../services/portfolioPresets';

interface GuidedPortfolioCreationModalProps {
  onClose: () => void;
  onCreationComplete: (portfolio: Portfolio) => void;
}

type GuidedStep = 'track' | 'template' | 'details';

const GuidedPortfolioCreationModal: React.FC<GuidedPortfolioCreationModalProps> = ({ onClose, onCreationComplete }) => {
  const { t } = useTranslation();
  const { user, createPortfolio } = useData();
  const [step, setStep] = useState<GuidedStep>('track');
  const [track, setTrack] = useState<PortfolioTrack | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(portfolioTemplates[0]?.id || '');
  const [role, setRole] = useState(user?.title || '');
  const [portfolioTitle, setPortfolioTitle] = useState(
    user ? `${user.name.split(' ')[0]}'s Portfolio` : 'My Portfolio'
  );

  const handleCreatePortfolio = async () => {
    if (!user || !track) return;

    const template =
      portfolioTemplates.find((portfolioTemplate) => portfolioTemplate.id === selectedTemplateId) ||
      portfolioTemplates[0];

    if (!template) return;

    const newPortfolioData: Omit<Portfolio, 'id' | 'slug' | 'createdAt' | 'updatedAt'> = createPortfolioDraft({
      template,
      title: portfolioTitle.trim() || `${role.trim() || user.title} Portfolio`,
      track,
      userId: user.id,
      role: role.trim() || user.title,
    });

    const newPortfolio = await createPortfolio(newPortfolioData);
    onCreationComplete(newPortfolio);
  };
  
  const TrackOption: React.FC<{ icon: React.ElementType, title: string, description: string, onClick: () => void, isSelected: boolean }> = ({ icon: Icon, title, description, onClick, isSelected }) => (
      <button 
        onClick={onClick}
        className={`p-4 rounded-lg border-2 text-left transition-all w-full flex items-center gap-4 ${isSelected ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'}`}
      >
        <div className={`p-3 rounded-lg flex-shrink-0 ${isSelected ? 'bg-teal-100 dark:bg-teal-900/50' : 'bg-slate-200 dark:bg-slate-800'}`}>
            <Icon size={24} className="text-teal-500"/>
        </div>
        <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </button>
  );

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
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg font-sora flex items-center gap-2">
                <LayoutTemplate className="text-teal-500" size={20} />
                Create Your First Portfolio
            </h3>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label={t('close')}>
                <X size={20} />
            </button>
        </header>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              {step === 'track' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">What are you building this portfolio for?</h4>
                  <TrackOption icon={Briefcase} title="Get hired" description="Show recruiters your best projects, experience, and resume in one focused portfolio." onClick={() => { setTrack('jobSeeker'); setStep('template'); }} isSelected={track === 'jobSeeker'} />
                  <TrackOption icon={UserCheck} title="Get clients" description="Present your services, proof of work, and contact flow in a client-friendly portfolio." onClick={() => { setTrack('freelancer'); setStep('template'); }} isSelected={track === 'freelancer'} />
                </div>
              )}
              {step === 'template' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Choose a starting template</h4>
                  <div className="space-y-3 max-h-72 overflow-y-auto pe-1">
                    {portfolioTemplates.slice(0, 6).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplateId(template.id)}
                        className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
                          selectedTemplateId === template.id
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h5 className="font-semibold text-slate-900 dark:text-slate-100">{t(template.name)}</h5>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t(template.description)}</p>
                          </div>
                          <LayoutTemplate size={18} className="text-teal-500 flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <Button variant="secondary" onClick={() => setStep('track')}>Back</Button>
                    <Button variant="primary" onClick={() => setStep('details')}>
                      Continue <ArrowRight size={16} className="ms-2"/>
                    </Button>
                  </div>
                </div>
              )}
              {step === 'details' && (
                <div className="space-y-4">
                   <div>
                     <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Add your setup details</h4>
                     <p className="text-sm text-slate-600 dark:text-slate-400">We’ll start you with a structure designed for the outcome you chose.</p>
                   </div>
                   <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Portfolio title</label>
                      <div className="relative">
                        <FileText size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={portfolioTitle}
                          onChange={e => setPortfolioTitle(e.target.value)}
                          placeholder="e.g., Ahmed Ali Portfolio"
                          className="block w-full rounded-lg border-slate-300 bg-slate-100 p-2 ps-9 text-slate-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:text-sm"
                        />
                      </div>
                   </div>
                   <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Professional title</label>
                      <input
                        type="text"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        placeholder="e.g., Senior Frontend Developer"
                        className="block w-full rounded-lg border-slate-300 bg-slate-100 p-2 text-slate-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:text-sm"
                        autoFocus
                      />
                   </div>
                    <div className="mt-6 flex justify-between items-center">
                        <Button variant="secondary" onClick={() => setStep('template')}>Back</Button>
                        <Button variant="primary" onClick={handleCreatePortfolio} disabled={!role.trim() || !portfolioTitle.trim()}>
                            Start Building <ArrowRight size={16} className="ms-2"/>
                        </Button>
                    </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-center bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
          <Link to="/dashboard/templates" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:underline">
            {t('chooseTemplateManually')}
          </Link>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default GuidedPortfolioCreationModal;
