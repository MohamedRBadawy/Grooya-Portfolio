
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import type { PortfolioTemplate } from '../../types';
import Button from '../../components/ui/Button';
import { Save, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const EditorLabel: React.FC<{ children: React.ReactNode, htmlFor?: string }> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{children}</label>
);

const EditorInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`block w-full bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-800 dark:text-slate-100 transition-colors p-2 ${props.className}`} />
);
const EditorTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`block w-full bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-800 dark:text-slate-100 transition-colors p-2 ${props.className}`} />
);


const AdminTemplateEditorPage: React.FC = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const navigate = useNavigate();
    const { getTemplateById, createTemplate, updateTemplate } = useData();
    const isNew = !templateId;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [designJson, setDesignJson] = useState('');
    const [pagesJson, setPagesJson] = useState('');

    useEffect(() => {
        if (!isNew && templateId) {
            const template = getTemplateById(templateId);
            if (template) {
                setName(template.name);
                setDescription(template.description);
                setDesignJson(JSON.stringify(template.design, null, 2));
                setPagesJson(JSON.stringify(template.pages, null, 2));
            } else {
                toast.error('Template not found!');
                navigate('/admin/templates');
            }
        }
    }, [templateId, isNew, getTemplateById, navigate]);

    const handleSave = () => {
        try {
            const design = JSON.parse(designJson);
            const pages = JSON.parse(pagesJson);
            
            const templateData = { name, description, design, pages };
            
            if (isNew) {
                createTemplate(templateData);
                toast.success('Template created successfully!');
            } else {
                updateTemplate({ id: templateId, ...templateData });
                toast.success('Template updated successfully!');
            }
            navigate('/admin/templates');
        } catch (error) {
            console.error(error);
            toast.error('Invalid JSON in Design or Pages structure. Please check and try again.');
        }
    };
    
    return (
        <div>
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/admin/templates')}>
                    <ChevronLeft size={16} className="mr-2"/> Back to Template List
                </Button>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 font-sora mb-6">
                    {isNew ? 'Create New Template' : 'Edit Template'}
                </h1>
                <div className="space-y-6">
                    <div>
                        <EditorLabel htmlFor="name">Template Name (i18n key)</EditorLabel>
                        <EditorInput id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., template.developer.name" />
                    </div>
                     <div>
                        <EditorLabel htmlFor="description">Description (i18n key)</EditorLabel>
                        <EditorTextarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., template.developer.desc" rows={3} />
                    </div>
                    <div>
                        <EditorLabel htmlFor="designJson">Design (JSON)</EditorLabel>
                        <EditorTextarea id="designJson" value={designJson} onChange={e => setDesignJson(e.target.value)} rows={15} className="font-mono text-xs" />
                    </div>
                     <div>
                        <EditorLabel htmlFor="pagesJson">Pages (JSON)</EditorLabel>
                        <EditorTextarea id="pagesJson" value={pagesJson} onChange={e => setPagesJson(e.target.value)} rows={20} className="font-mono text-xs" />
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <Button variant="primary" onClick={handleSave}>
                    <Save size={16} className="mr-2"/>
                    {isNew ? 'Create Template' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
};

export default AdminTemplateEditorPage;
