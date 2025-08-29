
import React, { useState } from 'react';
import type { Project } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../ui/Button';
import { Save } from 'lucide-react';
import { generateProjectStory, ApiKeyMissingError } from '../../services/aiService';
import AIAssistButton from '../ui/AIAssistButton';
import toast from 'react-hot-toast';
import { EditorLabel, EditorInput, EditorTextarea } from '../ui/editor/EditorControls';
import { useData } from '../../contexts/DataContext';

interface InlineProjectCreatorProps {
  onSave: (projectData: Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

const InlineProjectCreator: React.FC<InlineProjectCreatorProps> = ({ onSave, onCancel }) => {
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
      onSave(projectData);
  };
  
  const handleGenerateDescription = async () => {
    if (!formData.title) {
        toast.error("Please enter a project title first.");
        return;
    }

    if (!consumeAiFeature('projectStory')) {
      const tier = user?.subscription?.tier;
      let message = "An error occurred.";
      if (tier === 'free') {
          message = "You've used your one free project story generation. Please upgrade to use it again.";
      } else if (tier) {
          message = "You've run out of AI text credits for this month. Please upgrade your plan or purchase more credits.";
      }
      toast.error(message);
      return;
    }

    setIsGenerating(true);
    try {
        const description = await generateProjectStory(formData.title, formData.technologies, formData.description);
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

  return (
    <form onSubmit={handleSubmit} className="p-2 space-y-3 bg-slate-200 dark:bg-slate-700/50 rounded-b-md">
      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">Create New Project</div>
      <div>
        <EditorLabel htmlFor="new-proj-title">{t('projectTitle')}</EditorLabel>
        <EditorInput id="new-proj-title" name="title" value={formData.title} onChange={handleChange} required autoFocus />
      </div>
      <div className="relative">
        <div className="flex justify-between items-center">
            <EditorLabel htmlFor="new-proj-description">{t('projectDescription')}</EditorLabel>
            <AIAssistButton onClick={handleGenerateDescription} isLoading={isGenerating} />
        </div>
        <EditorTextarea id="new-proj-description" name="description" value={formData.description} onChange={handleChange} rows={3} required />
      </div>
      <div>
        <EditorLabel htmlFor="new-proj-technologies">{t('projectTechnologies')}</EditorLabel>
        <EditorInput id="new-proj-technologies" name="technologies" value={formData.technologies} onChange={handleChange} placeholder={t('technologiesHint')} />
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

export default InlineProjectCreator;
