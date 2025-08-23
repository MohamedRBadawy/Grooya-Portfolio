import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateImage } from '../services/aiService';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';

interface AIImageGenerationModalProps {
  onClose: () => void;
  onImageGenerated: (assetData: { url: string; prompt: string }) => void;
  initialPrompt?: string;
}

const AIImageGenerationModal: React.FC<AIImageGenerationModalProps> = ({ onClose, onImageGenerated, initialPrompt }) => {
  const { t } = useTranslation();
  const { user, consumeAiFeature } = useData();
  const [prompt, setPrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPrompt) {
        setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (user?.subscription?.tier !== 'pro') {
        toast.error("Upgrade to Pro to generate images.");
        return;
    }
    
    if (!consumeAiFeature('imageGeneration')) {
      toast.error("You've run out of AI image credits for this month.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);
    try {
      const imageUrl = await generateImage(prompt);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleUseImage = () => {
      if (generatedImageUrl) {
          onImageGenerated({ url: generatedImageUrl, prompt: prompt });
          onClose();
      }
  }

  const remainingCredits = user?.subscription?.tier === 'pro' ? `(${user.subscription.monthlyCredits.image} credits left)` : '';

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
            {t('aiImageGeneration')}
             {user?.subscription?.tier === 'pro' && <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{remainingCredits}</span>}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label={t('close')}>
            <X size={20} />
          </button>
        </header>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
            <div>
                <label htmlFor="imagePrompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('imagePrompt')}</label>
                <textarea 
                    id="imagePrompt"
                    value={prompt} 
                    onChange={e => setPrompt(e.target.value)}
                    placeholder={t('imagePromptPlaceholder')}
                    rows={3}
                    className="block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2"
                />
            </div>
           
            <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                {isGenerating ? (
                    <div className="text-center p-4">
                        <svg className="animate-spin h-8 w-8 text-teal-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8
 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="text-slate-600 dark:text-slate-400">{t('generating')}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{t('generatingMessage')}</p>
                    </div>
                ) : error ? (
                    <p className="text-rose-500 p-4">{error}</p>
                ) : generatedImageUrl ? (
                    <img src={generatedImageUrl} alt="AI generated image" className="w-full h-full object-cover" />
                ) : (
                    <p className="text-slate-500 dark:text-slate-400">Your generated image will appear here.</p>
                )}
            </div>
        </div>
        
        <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
            <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
            <div className="flex gap-3">
                 <Button variant="secondary" onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}>
                    {t('generate')}
                </Button>
                <Button variant="primary" onClick={handleUseImage} disabled={!generatedImageUrl || isGenerating}>
                    {t('useThisImage')}
                </Button>
            </div>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default AIImageGenerationModal;