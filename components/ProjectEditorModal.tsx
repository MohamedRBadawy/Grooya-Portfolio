import React, { useState, useEffect } from 'react';
import type { Project } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateProjectDescription, ApiKeyMissingError } from '../services/aiService';
import AIAssistButton from './ui/AIAssistButton';
import toast from 'react-hot-toast';
import { useData } from '../contexts/DataContext';

interface ProjectEditorModalProps {
  project: Project | null;
  onClose: () => void;
  onSave: (projectData: Project | Omit<Project, 'id'>) => void;
}

const EditorLabel: React.FC<{ children: React.ReactNode, htmlFor?: string }> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-800 dark:text-slate-300 mb-1.5">{children}</label>
);

const EditorInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2 transition ${props.className}`} />
);

const EditorTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2 transition ${props.className}`} />
);


const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({ project, onClose, onSave }) => {
  const { t } = useTranslation();
  const { consumeAiFeature, user } = useData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
      title: '',
      description: '',
      imageUrl: '',
      technologies: '',
      link: ''
  });

  useEffect(() => {
    if (project) {
        setFormData({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            technologies: project.technologies.join(', '),
            link: project.link
        });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const projectData = {
          ...formData,
          technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      };
      
      if (project) {
        onSave({ ...project, ...projectData });
      } else {
        onSave(projectData)
      }
  };
  
  const handleGenerateDescription = async () => {
    if (!formData.title) {
        toast.error("Please enter a project title first.");
        return;
    }
    
    if (!consumeAiFeature('projectDescription')) {
      const message = user?.subscription?.tier === 'pro'
        ? "You've run out of AI text credits for this month."
        : "You've used your one free generation for this feature. Please upgrade to Pro to use it again.";
      toast.error(message);
      return;
    }

    setIsGenerating(true);
    try {
        const description = await generateProjectDescription(formData.title, formData.technologies);
        setFormData(prev => ({ ...prev, description }));
    } catch (error) {
        console.error(error);
        if (error instanceof ApiKeyMissingError) {
            toast.error(error.message);
        } else {
            toast.error("Failed to generate description. Please try again.");
        }
    } finally {
        setIsGenerating(false);
    }
  };

  const isPro = user?.subscription?.tier === 'pro';
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
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
        {...modalMotionProps}
      >
        <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 rounded-t-2xl">
            <h3 className="font-bold text-slate-900 dark:text-slate-200 text-lg font-sora">
                {project ? t('editProject') : t('createProject')}
            </h3>
            <button 
                onClick={onClose}
                className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                aria-label={t('close')}
            >
                <X size={20} />
            </button>
        </header>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
            <div>
                <EditorLabel htmlFor="title">{t('projectTitle')}</EditorLabel>
                <EditorInput id="title" name="title" value={formData.title} onChange={handleChange} required autoFocus />
            </div>
            <div className="relative">
                <div className="flex justify-between items-center">
                    <EditorLabel htmlFor="description">{t('projectDescription')}</EditorLabel>
                     <div className="flex items-center gap-2">
                        {isPro && <span className="text-xs text-slate-500 dark:text-slate-400">{user?.subscription.credits.text} credits left</span>}
                        <AIAssistButton onClick={handleGenerateDescription} isLoading={isGenerating} />
                    </div>
                </div>
                <EditorTextarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
            </div>
            <div>
                <EditorLabel htmlFor="imageUrl">{t('projectImageUrl')}</EditorLabel>
                <EditorInput id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} />
            </div>
            <div>
                <EditorLabel htmlFor="technologies">{t('projectTechnologies')}</EditorLabel>
                <EditorInput id="technologies" name="technologies" value={formData.technologies} onChange={handleChange} placeholder={t('technologiesHint')} />
            </div>
            <div>
                <EditorLabel htmlFor="link">{t('projectLink')}</EditorLabel>
                <EditorInput id="link" name="link" type="url" value={formData.link} onChange={handleChange} />
            </div>
        </form>
        <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl">
            <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
            <Button variant="primary" onClick={handleSubmit} type="submit">
                <Save size={16} className="me-2" />
                {t('saveProject')}
            </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default ProjectEditorModal;