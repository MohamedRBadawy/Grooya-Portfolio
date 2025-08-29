import React from 'react';
import type { SkillsBlock, Skill } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { MultiItemSelector } from '../../ui/MultiItemSelector';
import { EditorLabel } from '../../ui/editor/EditorControls';
import InlineSkillCreator from '../InlineSkillCreator';
import Button from '../../ui/Button';
import { Plus } from 'lucide-react';

interface SkillsEditorProps {
  block: SkillsBlock;
  onUpdate: (updates: Partial<SkillsBlock>) => void;
  allSkills: Skill[];
  handleSaveNewSkill: (skillData: Omit<Skill, 'id'>) => void;
  isCreatingSkill: boolean;
  onStartCreatingSkill: () => void;
  onCancelCreation: () => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  block,
  onUpdate,
  allSkills,
  handleSaveNewSkill,
  isCreatingSkill,
  onStartCreatingSkill,
  onCancelCreation,
}) => {
  const { t } = useTranslation();

  const handleToggle = (skillId: string) => {
    const currentIds = block.skillIds;
    const newIds = currentIds.includes(skillId)
      ? currentIds.filter(id => id !== skillId)
      : [...currentIds, skillId];
    onUpdate({ skillIds: newIds });
  };

  return (
    <div>
      <EditorLabel>Select Skills</EditorLabel>
      <MultiItemSelector
        items={allSkills}
        selectedIds={block.skillIds}
        onToggle={handleToggle}
        placeholder={t('searchSkills')}
        renderFooter={() => (
          isCreatingSkill ? (
            <InlineSkillCreator onSave={handleSaveNewSkill} onCancel={onCancelCreation} />
          ) : (
            <Button size="sm" variant="secondary" className="w-full" onClick={onStartCreatingSkill}>
              <Plus size={14} className="me-2" />
              {t('createSkill')}
            </Button>
          )
        )}
      />
    </div>
  );
};
