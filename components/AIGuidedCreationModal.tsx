
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Sparkles, ArrowRight, Briefcase, Target, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Portfolio } from '../types';
import { portfolioTemplates } from '../services/templates';

interface AIGuidedCreationModalProps {
  onClose: () => void;
  onCreationComplete: (portfolio: Portfolio) => void;
}

type Step = 'goal' | 'role' | 'summary';
type Goal = 'job' | 'freelance' | 'personal';

const AIGuidedCreationModal: React.FC<AIGuidedCreationModalProps> = ({ onClose, onCreationComplete }) => {
  const { t } = useTranslation();
  const { user, createPortfolio } = useData();
  const [step, setStep] = useState<Step>('goal');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [role, setRole] = useState(user?.title || '');

  const handleCreatePortfolio = () => {
    if (!user || !goal) return;
    
    // For now, we start with a blank template and let the mentor panel guide the rest.
    const template = portfolioTemplates.find(t => t.id === 'minimalist-template')!;

    const newPortfolioData: Omit<Portfolio, 'id' | 'slug' | 'createdAt' | 'updatedAt'> = {
        title: `Portfolio for ${role}`,
        userId: user.id,
        design: template.design,
        pages: template.pages,
        isPublished: false,
        isGuided: true, // This is the key to trigger the mentor panel
        goal,
        role,
    };
    const newPortfolio = createPortfolio(newPortfolioData);
    onCreationComplete(newPortfolio);
  };
  
  const GoalOption: React.FC<{ icon: React.ElementType, title: string, description: string, onClick: () => void, isSelected: boolean }> = ({ icon: Icon, title, description, onClick, isSelected }) => (
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

  const stepMotionProps: any = {
    key: step,
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.2 },
  };

  return (
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
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg font-sora flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} />
                Let's Build Your Portfolio
            </h3>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label={t('close')}>
                <X size={20} />
            </button>
        </header>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              {...stepMotionProps}
            >
              {step === 'goal' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">What is the main goal of this portfolio?</h4>
                  <GoalOption icon={Briefcase} title="Get a full-time job" description="Tailor your portfolio to impress recruiters and hiring managers." onClick={() => { setGoal('job'); setStep('role'); }} isSelected={goal === 'job'} />
                  <GoalOption icon={UserCheck} title="Attract freelance clients" description="Showcase your expertise and services to win new projects." onClick={() => { setGoal('freelance'); setStep('role'); }} isSelected={goal === 'freelance'} />
                  <GoalOption icon={Target} title="Showcase personal work" description="A general-purpose portfolio to share your projects and art." onClick={() => { setGoal('personal'); setStep('role'); }} isSelected={goal === 'personal'} />
                </div>
              )}
              {step === 'role' && (
                <div>
                   <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">What is your profession or title?</h4>
                   <input
                        type="text"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        placeholder="e.g., Senior Frontend Developer"
                        className="block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2"
                        autoFocus
                    />
                    <div className="mt-6 flex justify-between items-center">
                        <Button variant="secondary" onClick={() => setStep('goal')}>Back</Button>
                        <Button variant="primary" onClick={handleCreatePortfolio} disabled={!role.trim()}>
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

export default AIGuidedCreationModal;
