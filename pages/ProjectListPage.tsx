


import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Project } from '../types';
import { Plus, Search, FilePenLine, Trash2, MoreVertical } from 'lucide-react';
import ProjectEditorModal from '../components/ProjectEditorModal';
// FIX: The type `MotionProps` does not seem to include animation properties in this project's setup, so we remove the explicit type to let TypeScript infer it.
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ProjectCard: React.FC<{ 
    project: Project,
    onEdit: (project: Project) => void,
    onDelete: (projectId: string) => void,
}> = ({ project, onEdit, onDelete }) => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    // FIX: Removed incorrect `MotionProps` type.
    const menuAnimationProps = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
    };

    return (
        <Card className="flex flex-col group">
            <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" loading="lazy" decoding="async" />
            <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 font-sora">{project.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">{project.description}</p>
                 <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map(tech => (
                        <span key={tech} className="px-2 py-0.5 text-xs font-medium rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">{tech}</span>
                    ))}
                    {project.technologies.length > 4 && <span className="text-xs text-slate-500 dark:text-slate-400">+ {project.technologies.length-4} more</span>}
                </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit(project)} className="!px-3">
                    <FilePenLine size={14} className="me-1.5" />
                    {t('edit')}
                </Button>
                <div className="relative" ref={menuRef}>
                    <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-8 h-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                    <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            {...menuAnimationProps}
                            className="absolute bottom-full mb-2 end-0 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20"
                        >
                            <button onClick={() => { onDelete(project.id); setIsMenuOpen(false); }} className="w-full text-start flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                                <Trash2 size={16} /> {t('delete')}
                            </button>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </Card>
    );
};


const ProjectListPage: React.FC = () => {
    const { projects, createProject, updateProject, deleteProject } = useData();
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProject, setEditingProject] = useState<Project | 'new' | null>(null);

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

    const displayedProjects = useMemo(() => {
        return projects.filter(p => 
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a,b) => a.title.localeCompare(b.title));
    }, [projects, searchTerm]);

    const handleDelete = (projectId: string) => {
        toast((toastInstance) => (
            <div className="flex flex-col items-start gap-3">
                <span className="font-medium">{t('deleteProjectConfirm')}</span>
                <div className="flex gap-2 self-stretch">
                    <Button variant="danger" size="sm" className="flex-grow" onClick={() => { deleteProject(projectId); toast.dismiss(toastInstance.id); }}>
                        Confirm
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-grow" onClick={() => toast.dismiss(toastInstance.id)}>
                        Cancel
                    </Button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const handleSaveProject = (projectData: Project | Omit<Project, 'id'>) => {
        if ('id' in projectData) {
            updateProject(projectData);
        } else {
            createProject(projectData);
        }
        setEditingProject(null);
    };

    return (
        <>
            <div className="min-h-screen">
                <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora">{t('myProjects')}</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">{t('manageYourProjects')}</p>
                        </div>
                        <Button onClick={() => setEditingProject('new')} variant="primary">
                           <Plus className="w-5 h-5 me-2" />
                           {t('createProject')}
                        </Button>
                    </div>
                    
                     <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <div className="relative flex-grow">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                            <input 
                                type="text"
                                placeholder={t('searchProjectsPlaceholder')}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm ps-10 pe-4 py-2 sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500"
                            />
                        </div>
                    </div>
                    
                    {displayedProjects.length > 0 ? (
                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          // FIX: Replaced direct animation props with a spread object to bypass type errors.
                          {...{
                            variants: containerVariants,
                            initial: "hidden",
                            animate: "visible",
                          }}
                        >
                            {displayedProjects.map(p => (
                              <motion.div key={p.id} {...{variants: itemVariants}}>
                                <ProjectCard project={p} onEdit={setEditingProject} onDelete={handleDelete} />
                              </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{t('noProjectsYet')}</h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">{t('getStartedProjects')}</p>
                            <Button onClick={() => setEditingProject('new')} variant="primary" className="mt-6">{t('createProject')}</Button>
                        </div>
                    )}

                </main>
            </div>
            <AnimatePresence>
                {editingProject && (
                    <ProjectEditorModal
                        project={editingProject === 'new' ? null : editingProject}
                        onClose={() => setEditingProject(null)}
                        onSave={handleSaveProject}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ProjectListPage;