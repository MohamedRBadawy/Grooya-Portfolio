import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Resume } from '../types';
import { Plus, FilePenLine, Trash2, MoreVertical, Search, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateResumeModal from '../components/CreateResumeModal';

const ResumeCard: React.FC<{
    resume: Resume,
    onDelete: (resumeId: string) => void,
}> = ({ resume, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col">
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-cream-900 dark:text-cream-50 font-sora">{resume.title}</h3>
        <p className="text-sm text-cream-500 dark:text-cream-400 mt-2">{t('updated')}: {new Date(resume.updatedAt).toLocaleDateString()}</p>
      </div>
      <div className="bg-cream-200 dark:bg-cream-800/70 p-4 border-t border-cream-300 dark:border-cream-700/80 flex justify-end items-center gap-2">
         <Button variant="danger" size="sm" onClick={() => onDelete(resume.id)}><Trash2 size={16}/></Button>
         <Link to={`/resumes/edit/${resume.id}`}>
            <Button variant="secondary" size="sm"><FilePenLine size={16} className="me-2"/> {t('edit')}</Button>
         </Link>
      </div>
    </Card>
  );
};

const ResumeListPage: React.FC = () => {
  const { resumes, user, deleteResume } = useData();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
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

  const displayedResumes = useMemo(() => {
    return resumes.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [resumes, searchTerm]);

  const handleDelete = (resumeId: string) => {
      if (window.confirm(t('deleteResumeConfirm'))) {
          deleteResume(resumeId);
      }
  };

  return (
    <>
      <div className="h-full">
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-cream-900 dark:text-cream-50 font-sora">{t('yourResumes')}</h1>
                {user && <p className="text-cream-500 dark:text-cream-400 mt-1">{t('welcomeBack', { name: user.name.split(' ')[0] })}</p>}
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} variant="primary">
               <Plus className="w-5 h-5 me-2" />
              {t('createNewResume')}
            </Button>
          </div>

          <div className="mb-8 p-4 bg-cream-200/60 dark:bg-cream-800/60 border border-cream-300 dark:border-cream-700/80 rounded-xl">
            <div className="relative flex-grow">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-400 dark:text-cream-500 pointer-events-none" />
                <input 
                    type="text"
                    placeholder={t('searchResumesPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-cream-200 dark:bg-cream-900 border border-cream-400 dark:border-cream-600 rounded-lg shadow-sm ps-10 pe-4 py-2 sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-cream-900 dark:text-cream-50 placeholder-cream-400 dark:placeholder-cream-500"
                />
            </div>
          </div>

          {displayedResumes.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedResumes.map(r => (
                <motion.div key={r.id} variants={itemVariants}>
                  <ResumeCard resume={r} onDelete={handleDelete} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-cream-200 dark:bg-cream-800 border-2 border-dashed border-cream-300 dark:border-cream-700 rounded-xl">
               <div className="mx-auto w-12 h-12 flex items-center justify-center bg-cream-300 dark:bg-cream-700 rounded-full text-cream-400 dark:text-cream-500">
                   <FileText size={24} />
               </div>
              <h3 className="mt-4 text-xl font-semibold text-cream-800 dark:text-cream-200">
                {t('noResumesYet')}
              </h3>
              <p className="text-cream-500 dark:text-cream-400 mt-2 max-w-sm mx-auto">
                {t('getStartedResumes')}
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)} variant="primary" className="mt-6">{t('createNewResume')}</Button>
            </div>
          )}
        </main>
      </div>
       <AnimatePresence>
        {isCreateModalOpen && (
            <CreateResumeModal 
                onClose={() => setIsCreateModalOpen(false)}
                onCreated={(newResume) => navigate(`/resumes/edit/${newResume.id}`)}
            />
        )}
      </AnimatePresence>
    </>
  );
};

export default ResumeListPage;