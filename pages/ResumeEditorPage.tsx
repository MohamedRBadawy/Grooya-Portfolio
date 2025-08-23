

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Resume, AITailoringSuggestions } from '../types';
import Button from '../components/ui/Button';
import { ArrowLeft, ArrowRight, Save, Trash2, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/LocalizationContext';
import ResumePreview from '../components/ResumePreview';
import { AnimatePresence } from 'framer-motion';
import AITailorModal from '../components/AITailorModal';
import toast from 'react-hot-toast';

const EditorLabel: React.FC<{ children: React.ReactNode, htmlFor?: string, className?: string }> = ({ children, htmlFor, className }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-cream-600 dark:text-cream-400 mb-1.5 ${className || ''}`}>{children}</label>
);

const EditorInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`block w-full bg-cream-200 dark:bg-cream-800 border-cream-400 dark:border-cream-600 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-cream-800 dark:text-cream-100 transition-colors p-2 ${props.className}`} />
);
const EditorTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`block w-full bg-cream-200 dark:bg-cream-800 border-cream-400 dark:border-cream-600 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-cream-800 dark:text-cream-100 transition-colors p-2 ${props.className}`} />
);

const ResumeEditorPage: React.FC = () => {
    const { resumeId } = useParams<{ resumeId: string }>();
    const navigate = useNavigate();
    const { getResumeById, updateResume, deleteResume } = useData();
    const { t } = useTranslation();
    const { direction } = useApp();

    const [resume, setResume] = useState<Resume | null>(null);
    const [isAITailorModalOpen, setIsAITailorModalOpen] = useState(false);

    useEffect(() => {
        if (resumeId) {
            const data = getResumeById(resumeId);
            if (data) {
                setResume(JSON.parse(JSON.stringify(data))); // Deep copy for editing
            } else {
                navigate('/resumes');
            }
        }
    }, [resumeId, getResumeById, navigate]);

    const handleSave = () => {
        if (resume) {
            updateResume(resume);
            toast.success(t('resumeSaved'));
        }
    };

    const handleDelete = () => {
        if (resume && window.confirm(t('deleteResumeConfirm'))) {
            deleteResume(resume.id);
            navigate('/resumes');
        }
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResume(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleApplySuggestions = (suggestions: AITailoringSuggestions) => {
        setResume(prev => {
            if (!prev) return null;
            
            const existingSkillNames = new Set(prev.skills.map(s => s.name.toLowerCase()));
            
            const newSkillsToAdd = suggestions.suggestedKeywords
                .filter(kw => !existingSkillNames.has(kw.toLowerCase()))
                .map(kw => ({
                    id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    name: kw,
                    category: 'Tool' as const // Default category
                }));

            return { 
                ...prev, 
                summary: suggestions.newSummary,
                skills: [...prev.skills, ...newSkillsToAdd]
            };
        });
        setIsAITailorModalOpen(false);
    };

    if (!resume) {
        return <div className="flex items-center justify-center h-full">Loading editor...</div>;
    }
    
    const BackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;

    return (
        <>
        <div className="flex h-full bg-cream-200 dark:bg-cream-900 text-cream-800 dark:text-cream-200">
            {/* Left Panel: Editor */}
            <aside className="w-[480px] bg-cream-200 dark:bg-cream-900 flex flex-col h-full shadow-2xl border-e border-cream-300 dark:border-cream-800 flex-shrink-0">
                <header className="p-4 border-b border-cream-300 dark:border-cream-800 flex-shrink-0 sticky top-0 bg-cream-200/80 dark:bg-cream-900/80 backdrop-blur-sm z-20">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={() => navigate('/resumes')}>
                           <BackIcon className="w-4 h-4 me-2" /> {t('backToList')}
                        </Button>
                        <div className="flex items-center gap-2">
                           <Button onClick={() => setIsAITailorModalOpen(true)} variant="secondary" size="sm" className="!bg-amber-200/50 dark:!bg-amber-500/10 hover:!bg-amber-200/80 dark:hover:!bg-amber-500/20 !text-amber-700 dark:!text-amber-300">
                               <Sparkles size={14} className="me-2" /> {t('aiTailor')}
                           </Button>
                           <Button onClick={handleDelete} variant="danger" size="sm"><Trash2 className="w-4 h-4" /></Button>
                           <Button onClick={handleSave} variant="primary" size="sm"><Save className="w-4 h-4 me-2" /> {t('save')}</Button>
                        </div>
                    </div>
                    <input 
                        type="text" 
                        name="title"
                        value={resume.title}
                        onChange={handleFieldChange}
                        className="w-full text-2xl font-bold bg-transparent focus:outline-none mt-3 font-sora text-cream-900 dark:text-cream-50"
                        placeholder={t('untitledResume')}
                    />
                </header>
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-cream-800 dark:text-cream-200 border-b border-cream-300 dark:border-cream-700 pb-2">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div><EditorLabel htmlFor="fullName">Full Name</EditorLabel><EditorInput id="fullName" name="fullName" value={resume.fullName} onChange={handleFieldChange} /></div>
                        <div><EditorLabel htmlFor="jobTitle">Job Title</EditorLabel><EditorInput id="jobTitle" name="jobTitle" value={resume.jobTitle} onChange={handleFieldChange} /></div>
                        <div><EditorLabel htmlFor="email">Email</EditorLabel><EditorInput id="email" name="email" type="email" value={resume.email} onChange={handleFieldChange} /></div>
                        <div><EditorLabel htmlFor="phone">Phone</EditorLabel><EditorInput id="phone" name="phone" value={resume.phone || ''} onChange={handleFieldChange} /></div>
                        <div><EditorLabel htmlFor="website">Website</EditorLabel><EditorInput id="website" name="website" type="url" value={resume.website || ''} onChange={handleFieldChange} /></div>
                        <div><EditorLabel htmlFor="linkedin">LinkedIn</EditorLabel><EditorInput id="linkedin" name="linkedin" value={resume.linkedin || ''} onChange={handleFieldChange} /></div>
                    </div>

                    <h3 className="text-lg font-semibold text-cream-800 dark:text-cream-200 border-b border-cream-300 dark:border-cream-700 pb-2 pt-4">Professional Summary</h3>
                    <div>
                        <EditorLabel htmlFor="summary" className="sr-only">Summary</EditorLabel>
                        <EditorTextarea id="summary" name="summary" value={resume.summary} onChange={handleFieldChange} rows={5} />
                    </div>

                    {/* TODO: Add editors for Experience, Education, Skills, Projects */}
                </div>
            </aside>

            {/* Main Content: Preview */}
            <main className="flex-grow h-full bg-cream-300 dark:bg-cream-950 p-8 overflow-y-auto">
                <div className="w-full max-w-[8.5in] mx-auto">
                    <ResumePreview resume={resume} />
                </div>
            </main>
        </div>
        <AnimatePresence>
            {isAITailorModalOpen && (
                <AITailorModal
                    resume={resume}
                    onClose={() => setIsAITailorModalOpen(false)}
                    onApplySuggestions={handleApplySuggestions}
                />
            )}
        </AnimatePresence>
        </>
    );
};

export default ResumeEditorPage;