import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import type { PortfolioBlock } from '../types';
import { Image, User, LayoutGrid, Sparkles, X, GalleryThumbnails, Quote, Clapperboard, MousePointerClick, FileTextIcon, Link, Briefcase, Mail, Code, DollarSign, PenSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddBlockMenuProps {
  onAddBlock: (type: PortfolioBlock['type']) => void;
  onClose: () => void;
}

const blockTypes: { type: PortfolioBlock['type']; icon: React.ElementType }[] = [
  { type: 'hero', icon: Image },
  { type: 'about', icon: User },
  { type: 'experience', icon: Briefcase },
  { type: 'projects', icon: LayoutGrid },
  { type: 'skills', icon: Sparkles },
  { type: 'code', icon: Code },
  { type: 'gallery', icon: GalleryThumbnails },
  { type: 'testimonials', icon: Quote },
  { type: 'video', icon: Clapperboard },
  { type: 'resume', icon: FileTextIcon },
  { type: 'links', icon: Link },
  { type: 'blog', icon: PenSquare },
  { type: 'services', icon: DollarSign },
  { type: 'cta', icon: MousePointerClick },
  { type: 'contact', icon: Mail },
];

const AddBlockMenu: React.FC<AddBlockMenuProps> = ({ onAddBlock, onClose }) => {
  const { t } = useTranslation();

  const backdropMotionProps: any = {
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
        className="bg-slate-100 dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl relative border border-slate-200 dark:border-slate-700 p-6"
        onClick={e => e.stopPropagation()}
        {...modalMotionProps}
      >
        <button 
            onClick={onClose}
            className="absolute top-4 end-4 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
            aria-label={t('closePreview')}
        >
            <X size={20} />
        </button>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 font-sora mb-6">{t('addNewBlock')}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blockTypes.map(({ type, icon: Icon }) => (
            <button
              key={type}
              onClick={() => onAddBlock(type)}
              className="p-4 bg-white dark:bg-slate-950/50 rounded-lg text-start border border-slate-200 dark:border-slate-800/80 hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-lg group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20">
                    <Icon className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{t(`block.${type}`)}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t(`block.${type}.desc`)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddBlockMenu;