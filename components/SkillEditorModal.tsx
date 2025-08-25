

import React, { useState, useEffect } from 'react';
import type { Skill } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface SkillEditorModalProps {
  skill: Skill | null;
  onClose: () => void;
  onSave: (skillData: Skill) => void;
}

const skillCategories: Skill['category'][] = ['Language', 'Framework', 'Tool', 'Database', 'Cloud'];

const SkillEditorModal: React.FC<SkillEditorModalProps> = ({ skill, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
      name: '',
      category: 'Tool' as Skill['category'],
  });

  useEffect(() => {
    if (skill) {
        setFormData({
            name: skill.name,
            category: skill.category,
        });
    }
  }, [skill]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (skill && formData.name.trim()) {
          onSave({ ...skill, ...formData });
      }
  };

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
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
        {...modalMotionProps}
      >
        <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-slate-200 text-lg font-sora">
                {t('editSkill')}
            </h3>
            <button 
                onClick={onClose}
                className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={t('close')}
            >
                <X size={20} />
            </button>
        </header>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('skillName')}</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} required autoFocus className="block w-full p-2 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('skillCategory')}</label>
                <select 
                    id="category" 
                    name="category"
                    value={formData.category} 
                    onChange={handleChange}
                    className="block w-full p-2 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500"
                >
                    {skillCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </form>
        <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
            <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
            <Button variant="primary" onClick={handleSubmit} type="submit">
                <Save size={16} className="me-2" />
                {t('saveSkill')}
            </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default SkillEditorModal;
