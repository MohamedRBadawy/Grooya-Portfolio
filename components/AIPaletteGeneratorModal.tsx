
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Sparkles } from 'lucide-react';
import { motion, type MotionProps } from 'framer-motion';
import type { Palette } from '../types';
import { generateColorPalette, ApiKeyMissingError } from '../services/aiService';
import toast from 'react-hot-toast';

interface AIPaletteGeneratorModalProps {
  onClose: () => void;
  onSave: (palette: Palette) => void;
}

const AIPaletteGeneratorModal: React.FC<AIPaletteGeneratorModalProps> = ({ onClose, onSave }) => {
  const { t } = useTranslation();
  const { user, consumeAiFeature } = useData();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
        toast.error("Please describe the palette you want to generate.");
        return;
    }
    
    if (!consumeAiFeature('paletteGeneration')) {
      const tier = user?.subscription?.tier;
      let message = "An error occurred.";
      if (tier === 'free') {
          message = "You've used your one free AI palette generation. Please upgrade to use it again.";
      } else if (tier) {
          message = "You've run out of AI text credits. Please upgrade your plan or purchase more credits.";
      }
      toast.error(message);
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateColorPalette(prompt);
      const newPalette: Palette = {
          id: `custom-${Date.now()}`,
          name: prompt.substring(0, 30) + (prompt.length > 30 ? '...' : ''), // Use prompt as name
          ...result,
      };
      onSave(newPalette);
      onClose();
    } catch (error) {
        console.error(error);
        if (error instanceof ApiKeyMissingError) {
            toast.error(error.message);
        } else {
            toast.error("Failed to generate palette. The AI might be having trouble with the request. Please try a different prompt.");
        }
    } finally {
      setIsGenerating(false);
    }
  };
  
  const backdropMotionProps: MotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalMotionProps: MotionProps = {
    initial: { y: 20, scale: 0.95, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: { y: 20, scale: 0.95, opacity: 0 },
    transition: { type: 'spring', stiffness: 400, damping: 30 },
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
                AI Palette Generator
            </h3>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label={t('close')}>
                <X size={20} />
            </button>
        </header>
        <div className="p-6 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Describe the mood, brand, or style you're aiming for. Be descriptive for the best results!</p>
            <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g., A warm and inviting palette for a coffee shop, with earthy browns and a creamy accent."
                rows={4}
                className="block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2"
            />
        </div>
        <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
            <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
            <Button variant="primary" onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}>
                {isGenerating && <svg className="animate-spin -ms-1 me-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {isGenerating ? 'Generating...' : 'Generate & Apply'}
            </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default AIPaletteGeneratorModal;