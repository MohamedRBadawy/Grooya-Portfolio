



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Resume, AITailoringSuggestions, ExperienceItem, EducationItem, Skill, ResumeProjectItem } from '../types';
import Button from '../components/ui/Button';
import { Save, ChevronLeft, Download, Sparkles, Plus, Trash2, GripVertical, Palette, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import ResumePreview from '../components/ResumePreview';
import AITailorModal from '../components/AITailorModal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable components for editor fields
const EditorLabel: React.FC<{ children: React.ReactNode, htmlFor?: string }> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{children}</label>
);
const EditorInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2 transition ${props.className}`} />
);
const EditorTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2 transition ${props.className}`} />
);
const EditorDetails: React.FC<{title: string, children: React.ReactNode, defaultOpen?: boolean}> = ({title, children, defaultOpen=false}) => (
    <details open={defaultOpen} className="group border-b border-slate-200 dark:border-slate-800 last:border-b-0">
        <summary className="font-semibold cursor-pointer py-3 list-none flex justify-between items-center">
            {title}
            <ChevronLeft className="details-arrow w-4 h-4 transition-transform text-slate-500" />
        </summary>
        <div className="pb-4 space-y-4">
            {children}
        </div>
    </details>
)

// Sortable item wrapper for DnD
const SortableItem: React.FC<{id: string, children: React.ReactNode, onRemove: () => void}> = ({ id, children, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg relative space-y-2">
            <div className="absolute top-2 right-2 flex gap-1">
                 <Button variant="ghost" size="sm" className="p-2 h-auto text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50" onClick={onRemove}><Trash2 size={16} /></Button>
                 <Button variant="ghost" size="sm" className="p-2 h-auto cursor-grab touch-none" {...attributes} {...listeners}><GripVertical size={16} /></Button>
            </div>
            {children}
        </div>
    );
}

const ResumeEditorPage: React.FC = () => {
    const { resumeId } = useParams<{ resumeId: string }>();
    const navigate = useNavigate();
    const { getResumeById, updateResume, skills: masterSkillsList } = useData();
    const { t } = useTranslation();

    const [resume, setResume] = useState<Resume | null>(null);
    const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
    const [skillSearch, setSkillSearch] = useState('');

    useEffect(() => {
        if (resumeId) {
            const data = getResumeById(resumeId);
            if (data) {
                setResume(JSON.parse(JSON.stringify(data)));
            } else {
                navigate('/dashboard/resumes');
            }
        }
    }, [resumeId, getResumeById, navigate]);

    const handleSave = () => {
        if (resume) {
            updateResume(resume);
            toast.success(t('resumeSaved'));
        }
    };
    
    const handleDownload = () => {
        window.print();
    };

    const handleFieldChange = (field: keyof Resume, value: any) => {
        setResume(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleArrayItemChange = (
        arrayName: 'experience' | 'education' | 'projects',
        itemId: string,
        field: string,
        value: any
    ) => {
        setResume(prev => {
            if (!prev) return null;
            const array = prev[arrayName] as (ExperienceItem | EducationItem | ResumeProjectItem)[];
            const newArray = array.map(item =>
                item.id === itemId ? { ...item, [field]: value } : item
            );
            return { ...prev, [arrayName]: newArray };
        });
    };
    
    const handleSkillToggle = (skillId: string) => {
        setResume(prev => {
            if (!prev) return null;
            const isSelected = prev.skills.some(s => s.id === skillId);
            if (isSelected) {
                return { ...prev, skills: prev.skills.filter(s => s.id !== skillId) };
            } else {
                const skillToAdd = masterSkillsList.find(s => s.id === skillId);
                return skillToAdd ? { ...prev, skills: [...prev.skills, skillToAdd] } : prev;
            }
        });
    }

    const handleAddItem = (arrayName: 'experience' | 'education' | 'projects') => {
        setResume(prev => {
            if (!prev) return null;
            const newItem = {
                id: `${arrayName}-${Date.now()}`,
                ...(arrayName === 'experience' ? { title: 'Job Title', company: 'Company', dateRange: 'Jan 2023 - Present', description: '' } : {}),
                ...(arrayName === 'education' ? { institution: 'University', degree: 'Degree', dateRange: '2018 - 2022', description: '' } : {}),
                ...(arrayName === 'projects' ? { title: 'Project Name', description: '', technologies: [] } : {})
            };
            return { ...prev, [arrayName]: [...prev[arrayName] as any, newItem] };
        });
    };
    
     const handleRemoveItem = (arrayName: 'experience' | 'education' | 'projects', itemId: string) => {
        setResume(prev => {
            if (!prev) return null;
            const newArray = (prev[arrayName] as any[]).filter(item => item.id !== itemId);
            return { ...prev, [arrayName]: newArray };
        });
    };

    const handleApplySuggestions = (suggestions: AITailoringSuggestions) => {
        setResume(prev => {
            if (!prev) return null;
            const newSkills = [...prev.skills];
            suggestions.suggestedKeywords.forEach(keyword => {
                const existingMasterSkill = masterSkillsList.find(ms => ms.name.toLowerCase() === keyword.toLowerCase());
                const alreadyOnResume = newSkills.some(s => s.name.toLowerCase() === keyword.toLowerCase());
                if (!alreadyOnResume) {
                     newSkills.push(existingMasterSkill || { id: `skill-${Date.now()}`, name: keyword, category: 'Tool' });
                }
            });
            return { ...prev, summary: suggestions.newSummary, skills: newSkills };
        });
        setIsTailorModalOpen(false);
        toast.success("AI suggestions applied!");
    };
    
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        
        const arrayName = over.data.current?.sortable.containerId as 'experience' | 'education' | 'projects' | 'skills';
        
        setResume(prev => {
            if (!prev) return null;
            const array = prev[arrayName] as any[];
            const oldIndex = array.findIndex(item => item.id === active.id);
            const newIndex = array.findIndex(item => item.id === over.id);
            return { ...prev, [arrayName]: arrayMove(array, oldIndex, newIndex) };
        });
    };

    const filteredSkills = masterSkillsList.filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()));

    if (!resume) {
        return <div className="flex items-center justify-center h-full">Loading editor...</div>;
    }

    return (
        <>
            <div className="h-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
                {/* Sidebar */}
                <aside className="noprint w-full md:w-[450px] lg:w-[500px] h-full flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                    <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/resumes')}><ChevronLeft size={16} className="me-2"/> Back</Button>
                        <EditorInput
                            value={resume.title}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                            className="w-full text-lg font-bold bg-transparent focus:outline-none mt-2 p-0 border-none"
                            placeholder={t('untitledResume')}
                        />
                    </header>
                    <div className="flex-grow overflow-y-auto p-4">
                        <EditorDetails title="Personal Info" defaultOpen>
                             <EditorLabel>Full Name</EditorLabel><EditorInput value={resume.fullName} onChange={e => handleFieldChange('fullName', e.target.value)} />
                             <EditorLabel>Job Title</EditorLabel><EditorInput value={resume.jobTitle} onChange={e => handleFieldChange('jobTitle', e.target.value)} />
                             <EditorLabel>Email</EditorLabel><EditorInput type="email" value={resume.email} onChange={e => handleFieldChange('email', e.target.value)} />
                             <EditorLabel>Phone</EditorLabel><EditorInput type="tel" value={resume.phone || ''} onChange={e => handleFieldChange('phone', e.target.value)} />
                             <EditorLabel>Website</EditorLabel><EditorInput type="url" value={resume.website || ''} onChange={e => handleFieldChange('website', e.target.value)} />
                             <EditorLabel>LinkedIn</EditorLabel><EditorInput value={resume.linkedin || ''} onChange={e => handleFieldChange('linkedin', e.target.value)} />
                             <EditorLabel>GitHub</EditorLabel><EditorInput value={resume.github || ''} onChange={e => handleFieldChange('github', e.target.value)} />
                        </EditorDetails>
                        <EditorDetails title="Summary" defaultOpen>
                             <EditorTextarea rows={5} value={resume.summary} onChange={e => handleFieldChange('summary', e.target.value)} />
                        </EditorDetails>
                        <EditorDetails title="Experience" defaultOpen>
                            <div className="space-y-3">
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={resume.experience.map(e => ({...e, id: e.id}))} strategy={verticalListSortingStrategy}>
                                        {resume.experience.map(exp => <SortableItem key={exp.id} id={exp.id} onRemove={() => handleRemoveItem('experience', exp.id)}>
                                            <EditorLabel>Job Title</EditorLabel><EditorInput value={exp.title} onChange={e => handleArrayItemChange('experience', exp.id, 'title', e.target.value)} />
                                            <EditorLabel>Company</EditorLabel><EditorInput value={exp.company} onChange={e => handleArrayItemChange('experience', exp.id, 'company', e.target.value)} />
                                            <EditorLabel>Date Range</EditorLabel><EditorInput value={exp.dateRange} onChange={e => handleArrayItemChange('experience', exp.id, 'dateRange', e.target.value)} />
                                            <EditorLabel>Description</EditorLabel><EditorTextarea rows={3} value={exp.description} onChange={e => handleArrayItemChange('experience', exp.id, 'description', e.target.value)} />
                                        </SortableItem>)}
                                    </SortableContext>
                                </DndContext>
                                <Button size="sm" variant="secondary" onClick={() => handleAddItem('experience')}><Plus size={14} className="me-2"/> Add Experience</Button>
                            </div>
                        </EditorDetails>
                         <EditorDetails title="Education" defaultOpen>
                            <div className="space-y-3">
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={resume.education.map(e => ({...e, id: e.id}))} strategy={verticalListSortingStrategy}>
                                        {resume.education.map(edu => <SortableItem key={edu.id} id={edu.id} onRemove={() => handleRemoveItem('education', edu.id)}>
                                            <EditorLabel>Institution</EditorLabel><EditorInput value={edu.institution} onChange={e => handleArrayItemChange('education', edu.id, 'institution', e.target.value)} />
                                            <EditorLabel>Degree</EditorLabel><EditorInput value={edu.degree} onChange={e => handleArrayItemChange('education', edu.id, 'degree', e.target.value)} />
                                            <EditorLabel>Date Range</EditorLabel><EditorInput value={edu.dateRange} onChange={e => handleArrayItemChange('education', edu.id, 'dateRange', e.target.value)} />
                                            <EditorLabel>Description</EditorLabel><EditorTextarea rows={2} value={edu.description || ''} onChange={e => handleArrayItemChange('education', edu.id, 'description', e.target.value)} />
                                        </SortableItem>)}
                                    </SortableContext>
                                </DndContext>
                                <Button size="sm" variant="secondary" onClick={() => handleAddItem('education')}><Plus size={14} className="me-2"/> Add Education</Button>
                            </div>
                        </EditorDetails>
                        <EditorDetails title="Skills" defaultOpen>
                            <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm">
                                <div className="p-2 border-b border-slate-300 dark:border-slate-700">
                                    <input type="text" placeholder="Search skills..." value={skillSearch} onChange={e => setSkillSearch(e.target.value)} className="w-full bg-transparent sm:text-sm focus:outline-none" />
                                </div>
                                <div className="max-h-48 overflow-y-auto p-2">
                                    {filteredSkills.map(skill => {
                                        const isSelected = resume.skills.some(s => s.id === skill.id);
                                        return <div key={skill.id} onClick={() => handleSkillToggle(skill.id)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/50">
                                            <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-teal-500 border-teal-500' : 'border-slate-400 dark:border-slate-500'}`}>{isSelected && <Check size={12} className="text-white"/>}</div>
                                            <span className="text-sm">{skill.name}</span>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </EditorDetails>
                         <EditorDetails title="Projects" defaultOpen>
                            <div className="space-y-3">
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={resume.projects.map(p => ({...p, id: p.id}))} strategy={verticalListSortingStrategy}>
                                        {resume.projects.map(proj => <SortableItem key={proj.id} id={proj.id} onRemove={() => handleRemoveItem('projects', proj.id)}>
                                            <EditorLabel>Project Title</EditorLabel><EditorInput value={proj.title} onChange={e => handleArrayItemChange('projects', proj.id, 'title', e.target.value)} />
                                            <EditorLabel>Description</EditorLabel><EditorTextarea rows={2} value={proj.description} onChange={e => handleArrayItemChange('projects', proj.id, 'description', e.target.value)} />
                                            <EditorLabel>Technologies</EditorLabel><EditorInput value={proj.technologies.join(', ')} onChange={e => handleArrayItemChange('projects', proj.id, 'technologies', e.target.value.split(',').map(t=>t.trim()))} />
                                        </SortableItem>)}
                                    </SortableContext>
                                </DndContext>
                                <Button size="sm" variant="secondary" onClick={() => handleAddItem('projects')}><Plus size={14} className="me-2"/> Add Project</Button>
                            </div>
                        </EditorDetails>
                         <EditorDetails title="Design">
                            <div className="space-y-2">
                                <EditorLabel>Accent Color</EditorLabel>
                                <input type="color" value={resume.accentColor} onChange={e => handleFieldChange('accentColor', e.target.value)} className="w-full h-10"/>
                            </div>
                        </EditorDetails>
                    </div>
                </aside>
                {/* Main Content */}
                <main className="flex-grow h-full flex flex-col">
                    <div className="noprint flex-shrink-0 p-2 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex justify-end items-center gap-2">
                        <Button variant="secondary" onClick={() => setIsTailorModalOpen(true)}><Sparkles size={16} className="me-2 text-amber-500"/>{t('aiTailor')}</Button>
                        <Button variant="secondary" onClick={handleDownload}><Download size={16} className="me-2"/> Download</Button>
                        <Button variant="primary" onClick={handleSave}><Save size={16} className="me-2"/>{t('save')}</Button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-slate-200 dark:bg-slate-950">
                        <div id="resume-print-area" className="max-w-4xl mx-auto">
                            <ResumePreview resume={resume} />
                        </div>
                    </div>
                </main>
            </div>
            
            {isTailorModalOpen && <AITailorModal resume={resume} onClose={() => setIsTailorModalOpen(false)} onApplySuggestions={handleApplySuggestions} />}
        </>
    );
};

export default ResumeEditorPage;
