
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Portfolio } from '../types';
import { Plus, Eye, FilePenLine, Trash2, MoreVertical, ExternalLink, Search, Copy, FolderKanban } from 'lucide-react';
import PortfolioPreviewModal from './PortfolioPreviewModal';
import { useApp } from '../contexts/LocalizationContext';
import { motion, AnimatePresence } from 'framer-motion';
import AIGuidedCreationModal from '../components/AIGuidedCreationModal';

const PortfolioCard: React.FC<{
    portfolio: Portfolio,
    onPreview: (portfolio: Portfolio) => void,
    onDelete: (portfolioId: string) => void,
    onDuplicate: (portfolioId: string) => void,
}> = ({ portfolio, onPreview, onDelete, onDuplicate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { direction } = useApp();
  
  const statusColor = portfolio.isPublished ? '#14b8a6' : '#f59e0b'; // teal-500 and amber-500
  const totalBlocks = useMemo(() => portfolio.pages.reduce((sum, page) => sum + page.blocks.length, 0), [portfolio.pages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Card 
        className="flex flex-col cursor-pointer"
        onClick={() => onPreview(portfolio)}
    >
      <div className="h-2 w-full rounded-t-xl" style={{ backgroundColor: statusColor }}></div>
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 font-sora">{portfolio.title}</h3>
             <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                portfolio.isPublished 
                ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300' 
                : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
            }`}>
                {portfolio.isPublished ? t('published') : t('draft')}
            </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 truncate">/{portfolio.slug}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">{t('blocksCount', { count: totalBlocks })}</p>
      </div>
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
         <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('updated')}: {new Date(portfolio.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
         </p>
         <div className="flex items-center gap-2">
            <Link to={`/edit/${portfolio.id}`} onClick={e => e.stopPropagation()}>
                <Button variant="secondary" size="sm" className="!px-3">
                    <FilePenLine size={14} className="me-1.5" />
                    {t('edit')}
                </Button>
            </Link>
            <div className="relative" ref={menuRef} onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-8 h-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                </Button>
                <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute bottom-full mb-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 ${direction === 'rtl' ? 'start-0' : 'end-0'}`}
                    >
                        <Link to={`/portfolio/${portfolio.slug}`} target="_blank" rel="noopener noreferrer" className="w-full text-start flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <ExternalLink size={16} /> {t('viewPublic')}
                        </Link>
                        <button onClick={() => { onDuplicate(portfolio.id); setIsMenuOpen(false); }} className="w-full text-start flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Copy size={16} /> {t('duplicate')}
                        </button>
                        <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                        <button onClick={() => { onDelete(portfolio.id); setIsMenuOpen(false); }} className="w-full text-start flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                            <Trash2 size={16} /> {t('delete')}
                        </button>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
         </div>
      </div>
    </Card>
  );
};

const PortfolioListPage: React.FC = () => {
  const { portfolios, user, deletePortfolio, duplicatePortfolio } = useData();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [previewingPortfolio, setPreviewingPortfolio] = useState<Portfolio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'title'>('updatedAt');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07 }
      }
  };

  const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
  };

  const displayedPortfolios = useMemo(() => {
    let filtered = portfolios.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        }
        return b[sortBy] - a[sortBy];
    });

    return filtered;
  }, [portfolios, searchTerm, sortBy]);

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreationComplete = (newPortfolio: Portfolio) => {
    setIsCreateModalOpen(false);
    navigate(`/edit/${newPortfolio.id}`);
  };

  const handlePreview = (portfolio: Portfolio) => {
    setPreviewingPortfolio(portfolio);
  };
  
  const handleClosePreview = () => {
    setPreviewingPortfolio(null);
  };

  const handleDelete = (portfolioId: string) => {
      if (window.confirm(t('deleteConfirm'))) {
          deletePortfolio(portfolioId);
      }
  };
  
  const handleDuplicate = (portfolioId: string) => {
      duplicatePortfolio(portfolioId);
  }

  return (
    <>
      <div className="h-full">
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora">{t('yourPortfolios')}</h1>
                {user && <p className="text-slate-600 dark:text-slate-400 mt-1">{t('welcomeBack', { name: user.name.split(' ')[0] })}</p>}
            </div>
            <Button onClick={handleCreateNew} variant="primary">
               <Plus className="w-5 h-5 me-2" />
              {t('createNew')}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="relative flex-grow">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <input 
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm ps-10 pe-4 py-2 sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500"
                />
            </div>
            <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm px-4 py-2 sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-50"
            >
                <option value="updatedAt">{t('sortBy')}: {t('lastModified')}</option>
                <option value="createdAt">{t('sortBy')}: {t('dateCreated')}</option>
                <option value="title">{t('sortBy')}: {t('titleAZ')}</option>
            </select>
          </div>

          {displayedPortfolios.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedPortfolios.map(p => (
                <motion.div key={p.id} variants={itemVariants}>
                  <PortfolioCard portfolio={p} onPreview={handlePreview} onDelete={handleDelete} onDuplicate={handleDuplicate} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
               <div className="mx-auto w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                   <FolderKanban size={24} />
               </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
                {searchTerm ? t('noSearchResults') : t('noPortfoliosYet')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                {searchTerm ? t('tryDifferentSearch') : t('getStarted')}
              </p>
              {!searchTerm && <Button onClick={handleCreateNew} variant="primary" className="mt-6">{t('createNew')}</Button>}
            </div>
          )}
        </main>
      </div>
      <AnimatePresence>
        {isCreateModalOpen && (
            <AIGuidedCreationModal 
                onClose={() => setIsCreateModalOpen(false)}
                onCreationComplete={handleCreationComplete}
            />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {previewingPortfolio && <PortfolioPreviewModal portfolio={previewingPortfolio} onClose={handleClosePreview} />}
      </AnimatePresence>
    </>
  );
};

export default PortfolioListPage;