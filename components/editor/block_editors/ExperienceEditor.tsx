import React, { useState } from 'react';
import type { ExperienceBlock, ExperienceItem } from '../../../types';
import { EditorLabel, EditorInput, EditorTextarea } from '../../ui/editor/EditorControls';
import Button from '../../ui/Button';
import { X, Plus } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';
import { enhanceExperienceDescription, ApiKeyMissingError } from '../../../services/aiService';
import toast from 'react-hot-toast';
import AIAssistButton from '../../ui/AIAssistButton';

interface ExperienceEditorProps {
  block: ExperienceBlock;
  onUpdate: (updates: Partial<ExperienceBlock>) => void;
  t: (key: string) => string;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ block, onUpdate, t }) => {
  const { user, consumeAiFeature } = useData();
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const updateItem = (itemId: string, field: keyof Omit<ExperienceItem, 'id'>, value: string) => {
    const newItems = block.items.map(item => item.id === itemId ? { ...item, [field]: value } : item);
    onUpdate({ items: newItems });
  };
  
  const addItem = () => {
    const newItem: ExperienceItem = { id: `exp-${Date.now()}`, title: 'New Role', company: 'New Company', dateRange: 'Date Range', description: 'Your responsibilities here.' };
    onUpdate({ items: [...block.items, newItem] });
  };
  
  const removeItem = (itemId: string) => {
    onUpdate({ items: block.items.filter(item => item.id !== itemId) });
  };
  
  const handleEnhanceDescription = async (item: ExperienceItem) => {
    if (!item.description) {
        toast.error("Please enter a description first.");
        return;
    }
    
    if (!consumeAiFeature('experienceEnhancement')) {
      const tier = user?.subscription?.tier;
      let message = "An error occurred.";
      if (tier === 'free') {
          message = "You've used your one free AI enhancement. Please upgrade to use it again.";
      } else if (tier) {
          message = "You've run out of AI text credits. Please upgrade or purchase more.";
      }
      toast.error(message);
      return;
    }
    
    setEnhancingId(item.id);
    try {
        const enhancedDescription = await enhanceExperienceDescription(item.description);
        updateItem(item.id, 'description', enhancedDescription);
    } catch (error) {
        console.error(error);
        if (error instanceof ApiKeyMissingError) {
            toast.error(error.message);
        } else {
            toast.error("Failed to enhance description. Please try again.");
        }
    } finally {
        setEnhancingId(null);
    }
  };
  
  return (
    <>
      {block.items.length > 0 ? (
        <div className="space-y-3">
          <EditorLabel>Experience Items</EditorLabel>
          {block.items.map(item => (
            <div key={item.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
              <div className="flex justify-end"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeItem(item.id)}><X size={14} /></Button></div>
              <EditorInput placeholder="Job Title" value={item.title} onChange={e => updateItem(item.id, 'title', e.target.value)} />
              <EditorInput placeholder="Company Name" value={item.company} onChange={e => updateItem(item.id, 'company', e.target.value)} />
              <EditorInput placeholder="Date Range (e.g., Jan 2022 - Present)" value={item.dateRange} onChange={e => updateItem(item.id, 'dateRange', e.target.value)} />
              <div>
                <div className="flex justify-between items-center">
                    <EditorLabel>Description</EditorLabel>
                    <AIAssistButton onClick={() => handleEnhanceDescription(item)} isLoading={enhancingId === item.id} />
                </div>
                <EditorTextarea placeholder="Description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} rows={3} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('experience.emptyState')}</p>
        </div>
      )}
      <Button size="sm" variant="secondary" onClick={addItem}><Plus size={14} className="me-2" />{t('addExperienceItem')}</Button>
    </>
  );
};