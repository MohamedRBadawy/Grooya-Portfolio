import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import type { PortfolioBlock } from '../types';
import { Image, User, LayoutGrid, Sparkles, X, GalleryThumbnails, Quote, Clapperboard, MousePointerClick, FileTextIcon, Link, Briefcase, Mail, Code, DollarSign, PenSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import UpgradeModal from './UpgradeModal';

interface AddBlockMenuProps {
  onAddBlock: (type: PortfolioBlock['type']) => void;
  onClose: () => void;
}

const blockTypes: { type: PortfolioBlock['type']; icon: React.ElementType }[] = [
  { type: 'hero', icon: Image },
  { type: 'about', icon: User },
  { type: 'projects', icon: LayoutGrid },
  { type: 'skills', icon: Sparkles },
  { type: 'gallery', icon: GalleryThumbnails },
  { type: 'cta', icon: MousePointerClick },
  { type: 'resume', icon: FileTextIcon },
  { type: 'links', icon: Link },
  { type: 'contact', icon: Mail },
  // Pro Blocks
  { type: 'experience', icon: Briefcase },
  { type: 'testimonials', icon: Quote },
  { type: 'video', icon: Clapperboard },
  { type: 'code', icon: Code },
  { type: 'services', icon: DollarSign },
  { type: 'blog', icon: PenSquare },
];

const PRO_BLOCK_TYPES: PortfolioBlock['type'][] = ['testimonials', 'video', 'experience', 'code', 'services', 'blog'];

const AddBlockMenu: React.FC<AddBlockMenuProps> = ({ onAddBlock, onClose }) => {
  const { t } = useTranslation();
  const { entitlements } = useData();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [featureToUpgrade, setFeatureToUpgrade] = useState({ name: '', description: ''});

  const handleAdd = (type: PortfolioBlock['type']) => {
    const isProBlock = PRO_BLOCK_TYPES.includes(type);
    if (isProBlock && !entitlements.hasProBlocks) {
        setFeatureToUpgrade({
            name: `The "${t(`block.${type}`)}" block`,
            description: `The ability to add advanced blocks like Testimonials, Services, and more is a Pro feature.`
        });
        setIsUpgradeModalOpen(true);
    } else {
        onAddBlock(type);
    }
  };

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
    <>
        <motion.div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          {...backdropMotionProps}
        >
          <motion.div 
            className="bg-slate-100 dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl relative border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
            {...modalMotionProps}
          >
            <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 font-sora">{t('addNewBlock')}</h3>
                <button 
                    onClick={onClose}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                    aria-label={t('closePreview')}
                >
                    <X size={20} />
                </button>
            </header>
            
            <div className="overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {blockTypes.map(({ type, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => handleAdd(type)}
                      className="p-4 bg-white dark:bg-slate-950/50 rounded-lg text-start border border-slate-200 dark:border-slate-800/80 hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-lg group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20">
                            <Icon className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                            {t(`block.${type}`)}
                            {PRO_BLOCK_TYPES.includes(type) && (
                                <span className="ms-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded-md">PRO</span>
                            )}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{t(`block.${type}.desc`)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
            </div>
          </motion.div>
        </motion.div>
        <AnimatePresence>
            {isUpgradeModalOpen && (
                <UpgradeModal
                    isOpen={isUpgradeModalOpen}
                    onClose={() => setIsUpgradeModalOpen(false)}
                    featureName={featureToUpgrade.name}
                    featureDescription={featureToUpgrade.description}
                />
            )}
        </AnimatePresence>
    </>
  );
};

export default AddBlockMenu;