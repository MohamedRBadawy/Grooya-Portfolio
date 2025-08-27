import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, featureName, featureDescription }) => {
  if (!isOpen) return null;

  const backdropMotionProps = {
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
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
        {...modalMotionProps}
      >
        <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-end items-center">
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label="Close">
            <X size={20} />
          </button>
        </header>
        <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4">
                <Sparkles size={32} className="text-white"/>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-2xl font-sora">
                {featureName}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
                {featureDescription}
            </p>
            <Link to="/dashboard/upgrade">
                <Button variant="primary" size="lg" className="w-full mt-8">
                    Upgrade to Pro <ArrowRight size={18} className="ml-2"/>
                </Button>
            </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UpgradeModal;
