
import React, { useState } from 'react';
import type { Skill } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../ui/Button';
import { Save } from 'lucide-react';
import { EditorLabel, EditorInput } from '../ui/editor/EditorControls';

interface InlineSkillCreatorProps {
  onSave: (skillData: Omit<Skill, 'id'>) => void;
  onCancel: () => void;
}

const skillCategories: Skill['category'][] = ['Language', 'Framework', 'Tool', 'Database', 'Cloud'];

const InlineSkillCreator: React.FC<InlineSkillCreatorProps> = ({ onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
      name: '',
      category: 'Tool' as Skill['category'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim()) return;
      onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 space-y-3 bg-slate-200 dark:bg-slate-700/50 rounded-b-md">
      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">Create New Skill</div>
      <div>
        <EditorLabel htmlFor="new-skill-name">{t('skillName')}</EditorLabel>
        <EditorInput id="new-skill-name" name="name" value={formData.name} onChange={handleChange} required autoFocus />
      </div>
      <div>
        <EditorLabel htmlFor="new-skill-category">{t('skillCategory')}</EditorLabel>
        <select 
            id="new-skill-category" 
            name="category"
            value={formData.category} 
            onChange={handleChange}
            className="block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 p-2"
        >
            {skillCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" size="sm" onClick={onCancel} type="button">{t('cancel')}</Button>
        <Button variant="primary" size="sm" type="submit">
            <Save size={14} className="me-1.5" />
            {t('add')}
        </Button>
      </div>
    </form>
  );
};

export default InlineSkillCreator;