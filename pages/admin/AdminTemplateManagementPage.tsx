
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from '../../hooks/useTranslation';
import type { PortfolioTemplate } from '../../types';
import { Eye, FilePenLine, Trash2, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

const TemplateCard: React.FC<{
    template: PortfolioTemplate,
    onDelete: (templateId: string) => void,
}> = ({ template, onDelete }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 font-sora">{t(template.name)}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">{t(template.description)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end items-center gap-2">
                <Link to={`/templates/${template.id}`} target="_blank">
                    <Button variant="ghost" size="sm" className="!p-2"><Eye size={16}/></Button>
                </Link>
                <Link to={`/admin/templates/edit/${template.id}`}>
                    <Button variant="ghost" size="sm" className="!p-2"><FilePenLine size={16}/></Button>
                </Link>
                <Button variant="ghost" size="sm" className="!p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50" onClick={() => onDelete(template.id)}>
                    <Trash2 size={16}/>
                </Button>
            </div>
        </div>
    );
};

const AdminTemplateManagementPage: React.FC = () => {
    const { templates, deleteTemplate } = useData();
    const navigate = useNavigate();

    const handleDelete = (templateId: string) => {
        if (window.confirm('Are you sure you want to delete this template? This cannot be undone.')) {
            deleteTemplate(templateId);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora">Template Management</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Create, edit, and manage portfolio templates.</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/admin/templates/new')}>
                    <Plus size={16} className="mr-2" /> Create New Template
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(template => (
                    <TemplateCard key={template.id} template={template} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    );
};

export default AdminTemplateManagementPage;
