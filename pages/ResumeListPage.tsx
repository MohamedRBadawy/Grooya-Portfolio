

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Resume } from '../types';
import { Plus, FilePenLine, Trash2, Search, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateResumeModal from '../components/CreateResumeModal';
import toast from 'react-hot-toast';
import UpgradeModal from '../components/UpgradeModal';

const ResumeCard: React.FC<{
    resume: Resume,
    onDelete: (resumeId: string) => void,
}> = ({ resume, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col">
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 font-sora">{resume.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('updated')}: {new Date(resume.updatedAt).toLocaleDateString()}</p>
      </div>
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end items-center gap-2">
         <Button variant="danger" size="sm" onClick={() => onDelete(resume.id)}><Trash2 size={16}/></Button>
         <Link to={`/dashboard/resumes/edit/${resume.id}`}>
            <Button variant="secondary" size="sm"><FilePenLine size={16} className="me-2"/> {t('edit')}</Button>
         </Link>
      </div>
    </Card>
  );
};

const ResumeListPage: React.FC = () => {
  const { resumes, user, deleteResume, entitlements } = useData();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const canCreate = resumes.length < entitlements.maxResumes;
  const tierName = user?.subscription.tier || 'free';
  
  const handleCreateNew = () => {
    if (canCreate) {
        setIsCreateModalOpen(true);
    } else {
        setIsUpgradeModalOpen(true);
    }
  };

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

  const displayedResumes = useMemo(() => {
    return resumes.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [resumes, searchTerm]);

  const handleDelete = (resumeId: string) => {
    toast((toastInstance) => (
        <div className="flex flex-col items-start gap-3">
            <span className="font-medium">{t('deleteResumeConfirm')}</span>
            <div className="flex gap-2 self-stretch">
                <Button variant="danger" size="sm" className="flex-grow" onClick={() => { deleteResume(resumeId); toast.dismiss(toastInstance.id); }}>
                    Confirm
                </Button>
                <Button variant="secondary" size="sm" className="flex-grow" onClick={() => toast.dismiss(toastInstance.id)}>
                    Cancel
                </Button>
            </div>
        </div>
    ), { duration: 6000 });
  };

  const gridMotionProps: any = {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
  };
  
  const bannerMotionProps = {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="h-full">
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora">{t('yourResumes')}</h1>
                {user && <p className="text-slate-500 dark:text-slate-400 mt-1">{t('welcomeBack', { name: user.name.split(' ')[0] })}</p>}
            </div>
            <Button onClick={handleCreateNew} variant="primary">
               <Plus className="w-5 h-5 me-2" />
              {t('createNewResume')}
            </Button>
          </div>

           {!canCreate && (
             <motion.div 
                {...bannerMotionProps}
                className="p-4 mb-8 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-center"
             >
                <p className="text-amber-800 dark:text-amber-200 text-sm">You've reached your resume limit ({entitlements.maxResumes}) for the <span className="capitalize font-semibold">{tierName}</span> plan. <Link to="/dashboard/upgrade" className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100">Upgrade your plan</Link> to create more.</p>
            </motion.div>
          )}

          <div className="mb-8 p-4 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="relative flex-grow">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input 
                    type="text"
                    placeholder={t('searchResumesPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm ps-10 pe-4 py-2 sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500"
                />
            </div>
          </div>

          {displayedResumes.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              {...gridMotionProps}
            >
              {displayedResumes.map(r => (
                <motion.div key={r.id} variants={itemVariants}>
                  <ResumeCard resume={r} onDelete={handleDelete} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
               <div className="mx-auto w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
                   <FileText size={24} />
               </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
                {t('noResumesYet')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                {t('getStartedResumes')}
              </p>
              <Button onClick={handleCreateNew} variant="primary" className="mt-6">{t('createNewResume')}</Button>
            </div>
          )}
        </main>
      </div>
       <AnimatePresence>
        {isCreateModalOpen && (
            <CreateResumeModal 
                onClose={() => setIsCreateModalOpen(false)}
                onCreated={(newResume) => navigate(`/dashboard/resumes/edit/${newResume.id}`)}
            />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isUpgradeModalOpen && (
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                featureName="Create More Resumes"
                featureDescription={`You have reached the maximum of ${entitlements.maxResumes} resumes for the ${tierName} plan. Upgrade to a higher tier to create unlimited resumes.`}
            />
        )}
        </AnimatePresence>
    </>
  );
};

export default ResumeListPage;