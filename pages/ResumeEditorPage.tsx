
import React, { useState, useEffect, useCallback } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, useNavigate } = ReactRouterDOM;
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Resume, AITailoringSuggestions, ExperienceItem, EducationItem, ResumeProjectItem, Skill } from '../types';
import Button from '../components/ui/Button';
import { ArrowLeft, ArrowRight, Save, Trash2, Sparkles, GripVertical, Edit, PlusCircle } from 'lucide-react';
import { useApp } from '../contexts/LocalizationContext';
import ResumePreview from '../components/ResumePreview';
import { AnimatePresence, motion } from 'framer-motion';
import AITailorModal from '../components/AITailorModal';
import toast from 'react-hot-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MultiItemSelector } from '../components/ui/MultiItemSelector';


const EditorLabel: React.FC<{ children: React.ReactNode, htmlFor?: string, className?: string }> = ({ children, htmlFor, className }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5 ${className || ''}`}>{children}</label>
);

const EditorInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 transition-colors p-2 ${props.className}`} />
);
const EditorTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 transition-colors p-2 ${props.className}`} />
);

// Generic Sortable Item Wrapper
const SortableItem = ({ id, onEdit, onDelete, children }: { id: string, onEdit: () => void, onDelete: () => void, children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2">
            <button {...attributes} {...listeners} className="p-2 cursor-grab text-slate-500 touch-none"><GripVertical size={16} /></button>
            <div className="flex-grow">{children}</div>
            <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="p-2 h-auto" onClick={onEdit}><Edit size={14} /></Button>
                <Button variant="ghost" size="sm" className="p-2 h-auto text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50" onClick={onDelete}><Trash2 size={14} /></Button>
            </div>
        </div>
    );
};

// Section-specific form components
const ExperienceForm: React.FC<{ item: ExperienceItem, onSave: (item: ExperienceItem) => void, onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);
    return (
        <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-2">
            <EditorInput placeholder="Job Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} autoFocus/>
            <EditorInput placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
            <EditorInput placeholder="Date Range (e.g., Jan 2022 - Present)" value={formData.dateRange} onChange={e => setFormData({...formData, dateRange: e.target.value})} />
            <EditorTextarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
            <div className="flex justify-end gap-2"><Button size="sm" variant="secondary" onClick={onCancel}>Cancel</Button><Button size="sm" onClick={() => onSave(formData)}>Save</Button></div>
        </div>
    );
};
const EducationForm: React.FC<{ item: EducationItem, onSave: (item: EducationItem) => void, onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);
    return (
        <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-2">
            <EditorInput placeholder="Institution" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} autoFocus/>
            <EditorInput placeholder="Degree" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} />
            <EditorInput placeholder="Date Range (e.g., 2018 - 2022)" value={formData.dateRange} onChange={e => setFormData({...formData, dateRange: e.target.value})} />
            <EditorTextarea placeholder="Description (optional)" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} />
            <div className="flex justify-end gap-2"><Button size="sm" variant="secondary" onClick={onCancel}>Cancel</Button><Button size="sm" onClick={() => onSave(formData)}>Save</Button></div>
        </div>
    );
};
const ProjectForm: React.FC<{ item: ResumeProjectItem, onSave: (item: ResumeProjectItem) => void, onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);
    return (
        <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-2">
            <EditorInput placeholder="Project Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} autoFocus/>
            <EditorTextarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} />
            <EditorInput placeholder="Technologies (comma-separated)" value={formData.technologies.join(', ')} onChange={e => setFormData({...formData, technologies: e.target.value.split(',').map(t => t.trim())})} />
            <div className="flex justify-end gap-2"><Button size="sm" variant="secondary" onClick={onCancel}>Cancel</Button><Button size="sm" onClick={() => onSave(formData)}>Save</Button></div>
        </div>
    );
};


const ResumeEditorPage: React.FC = () => {
    const { resumeId } = useParams<{ resumeId: string }>();
    const navigate = useNavigate();
    const { getResumeById, updateResume, deleteResume, skills: masterSkillsList, projects: masterProjectsList } = useData();
    const { t } = useTranslation();
    const { direction } = useApp();

    const [resume, setResume] = useState<Resume | null>(null);
    const [isAITailorModalOpen, setIsAITailorModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{ section: 'experience' | 'education' | 'projects', id: string } | null>(null);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    useEffect(() => {
        if (resumeId) {
            const data = getResumeById(resumeId);
            if (data) setResume(JSON.parse(JSON.stringify(data)));
            else navigate('/dashboard/resumes');
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
            navigate('/dashboard/resumes');
        }
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResume(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSectionChange = <T extends ExperienceItem | EducationItem | ResumeProjectItem>(section: 'experience' | 'education' | 'projects', items: T[]) => {
        setResume(prev => prev ? { ...prev, [section]: items } : null);
    };

    const handleAddItem = (section: 'experience' | 'education' | 'projects') => {
        const newItemId = `item-${Date.now()}`;
        if (section === 'experience') {
            const newItem: ExperienceItem = { id: newItemId, title: '', company: '', dateRange: '', description: '' };
            handleSectionChange(section, [...(resume?.experience || []), newItem]);
        } else if (section === 'education') {
            const newItem: EducationItem = { id: newItemId, institution: '', degree: '', dateRange: '', description: '' };
            handleSectionChange(section, [...(resume?.education || []), newItem]);
        } else if (section === 'projects') {
            const newItem: ResumeProjectItem = { id: newItemId, title: '', description: '', technologies: [] };
            handleSectionChange(section, [...(resume?.projects || []), newItem]);
        }
        setEditingItem({ section, id: newItemId });
    };

    const handleSaveItem = (section: 'experience' | 'education' | 'projects', item: ExperienceItem | EducationItem | ResumeProjectItem) => {
        if (section === 'experience') {
            handleSectionChange(section, (resume?.experience || []).map((i) => (i.id === item.id ? (item as ExperienceItem) : i)));
        } else if (section === 'education') {
            handleSectionChange(section, (resume?.education || []).map((i) => (i.id === item.id ? (item as EducationItem) : i)));
        } else if (section === 'projects') {
            handleSectionChange(section, (resume?.projects || []).map((i) => (i.id === item.id ? (item as ResumeProjectItem) : i)));
        }
        setEditingItem(null);
    };

    const handleDeleteItem = (section: 'experience' | 'education' | 'projects', itemId: string) => {
        if (section === 'experience') {
            handleSectionChange(section, (resume?.experience || []).filter((i) => i.id !== itemId));
        } else if (section === 'education') {
            handleSectionChange(section, (resume?.education || []).filter((i) => i.id !== itemId));
        } else if (section === 'projects') {
            handleSectionChange(section, (resume?.projects || []).filter((i) => i.id !== itemId));
        }
    };

    const handleDragEndForSection = (section: 'experience' | 'education' | 'projects') => (event: DragEndEvent) => {
        const { active, over } = event;
    
        if (over && active.id !== over.id) {
            setResume(prev => {
                if (!prev) return null;

                if (section === 'experience') {
                    const items = prev.experience;
                    const oldIndex = items.findIndex((item) => item.id === active.id);
                    const newIndex = items.findIndex((item) => item.id === over.id);
                    if (oldIndex > -1 && newIndex > -1) {
                        return { ...prev, experience: arrayMove(items, oldIndex, newIndex) };
                    }
                } else if (section === 'education') {
                    const items = prev.education;
                    const oldIndex = items.findIndex((item) => item.id === active.id);
                    const newIndex = items.findIndex((item) => item.id === over.id);
                    if (oldIndex > -1 && newIndex > -1) {
                        return { ...prev, education: arrayMove(items, oldIndex, newIndex) };
                    }
                } else if (section === 'projects') {
                    const items = prev.projects;
                    const oldIndex = items.findIndex((item) => item.id === active.id);
                    const newIndex = items.findIndex((item) => item.id === over.id);
                    if (oldIndex > -1 && newIndex > -1) {
                        return { ...prev, projects: arrayMove(items, oldIndex, newIndex) };
                    }
                }
                
                return prev;
            });
        }
    };

    const handleApplySuggestions = (suggestions: AITailoringSuggestions) => {
        setResume(prev => {
            if (!prev) return null;
            const existingSkillNames = new Set(prev.skills.map(s => s.name.toLowerCase()));
            const newSkillsToAdd = suggestions.suggestedKeywords
                .filter(kw => !existingSkillNames.has(kw.toLowerCase()))
                .map(kw => masterSkillsList.find(s => s.name.toLowerCase() === kw.toLowerCase()) || { id: `skill-${Date.now()}-${kw}`, name: kw, category: 'Tool' as const });

            return { ...prev, summary: suggestions.newSummary, skills: [...prev.skills, ...newSkillsToAdd] };
        });
        setIsAITailorModalOpen(false);
    };

    if (!resume) return <div className="flex items-center justify-center h-full">Loading editor...</div>;
    
    const BackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;

    const renderSection = (sectionName: 'experience' | 'education' | 'projects', title: string) => {
        const items = resume[sectionName];
        const ItemFormComponent = sectionName === 'experience' ? ExperienceForm : sectionName === 'education' ? EducationForm : ProjectForm;

        return (
            <details open className="pt-4">
                <summary className="text-lg font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">{title}</summary>
                <div className="pt-4 space-y-2">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndForSection(sectionName)}>
                        <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                            {items.map((item: any) => (
                                editingItem?.section === sectionName && editingItem?.id === item.id 
                                ? <ItemFormComponent key={item.id} item={item} onSave={(updatedItem) => handleSaveItem(sectionName, updatedItem)} onCancel={() => setEditingItem(null)} />
                                : <SortableItem key={item.id} id={item.id} onEdit={() => setEditingItem({section: sectionName, id: item.id})} onDelete={() => handleDeleteItem(sectionName, item.id)}>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{item.title || item.institution}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.company || item.degree}</p>
                                    </div>
                                  </SortableItem>
                            ))}
                        </SortableContext>
                    </DndContext>
                    <Button variant="secondary" size="sm" className="w-full" onClick={() => handleAddItem(sectionName)}><PlusCircle size={14} className="me-2"/> Add {title}</Button>
                </div>
            </details>
        )
    }

    return (
        <>
        <div className="flex h-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <aside className="w-full md:w-[480px] bg-slate-50 dark:bg-slate-900 flex flex-col h-full shadow-2xl border-e border-slate-200 dark:border-slate-800 flex-shrink-0">
                <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-20">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={() => navigate('/dashboard/resumes')}>
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
                    <input type="text" name="title" value={resume.title} onChange={handleFieldChange} className="w-full text-2xl font-bold bg-transparent focus:outline-none mt-3 font-sora text-slate-900 dark:text-slate-50" placeholder={t('untitledResume')} />
                </header>
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <details open><summary className="text-lg font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">Contact Information</summary>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div><EditorLabel htmlFor="fullName">Full Name</EditorLabel><EditorInput id="fullName" name="fullName" value={resume.fullName} onChange={handleFieldChange} /></div>
                            <div><EditorLabel htmlFor="jobTitle">Job Title</EditorLabel><EditorInput id="jobTitle" name="jobTitle" value={resume.jobTitle} onChange={handleFieldChange} /></div>
                            <div><EditorLabel htmlFor="email">Email</EditorLabel><EditorInput id="email" name="email" type="email" value={resume.email} onChange={handleFieldChange} /></div>
                            <div><EditorLabel htmlFor="phone">Phone</EditorLabel><EditorInput id="phone" name="phone" value={resume.phone || ''} onChange={handleFieldChange} /></div>
                            <div><EditorLabel htmlFor="website">Website</EditorLabel><EditorInput id="website" name="website" type="url" value={resume.website || ''} onChange={handleFieldChange} /></div>
                            <div><EditorLabel htmlFor="linkedin">LinkedIn</EditorLabel><EditorInput id="linkedin" name="linkedin" value={resume.linkedin || ''} onChange={handleFieldChange} /></div>
                        </div>
                    </details>
                    <details open><summary className="text-lg font-semibold text-slate-800 dark:text-slate-200 cursor-pointer pt-4">Professional Summary</summary>
                        <div className="pt-4"><EditorLabel htmlFor="summary" className="sr-only">Summary</EditorLabel><EditorTextarea id="summary" name="summary" value={resume.summary} onChange={handleFieldChange} rows={5} /></div>
                    </details>
                    
                    {renderSection('experience', 'Experience')}
                    {renderSection('education', 'Education')}

                    <details open className="pt-4">
                        <summary className="text-lg font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">Skills</summary>
                        <div className="pt-4">
                            <MultiItemSelector
                                items={masterSkillsList}
                                selectedIds={resume.skills.map(s => s.id)}
                                onToggle={(id) => {
                                    const newSkills = resume.skills.some(s => s.id === id) 
                                        ? resume.skills.filter(s => s.id !== id)
                                        : [...resume.skills, masterSkillsList.find(s => s.id === id)!];
                                    setResume(prev => prev ? {...prev, skills: newSkills} : null)
                                }}
                                placeholder="Search skills..."
                            />
                        </div>
                    </details>

                    {renderSection('projects', 'Projects')}
                </div>
            </aside>
            <main className="flex-grow h-full bg-slate-200 dark:bg-slate-950 p-8 overflow-y-auto hidden md:block">
                <div className="w-full max-w-[8.5in] mx-auto"><ResumePreview resume={resume} /></div>
            </main>
        </div>
        <AnimatePresence>
            {isAITailorModalOpen && (<AITailorModal resume={resume} onClose={() => setIsAITailorModalOpen(false)} onApplySuggestions={handleApplySuggestions} />)}
        </AnimatePresence>
        </>
    );
};

export default ResumeEditorPage;