import React from 'react';
import type { ProjectsBlock, Project } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { MultiItemSelector } from '../../ui/MultiItemSelector';
import { EditorLabel } from '../../ui/editor/EditorControls';
import InlineProjectCreator from '../InlineProjectCreator';
import Button from '../../ui/Button';
import { Plus } from 'lucide-react';

interface ProjectsEditorProps {
  block: ProjectsBlock;
  onUpdate: (updates: Partial<ProjectsBlock>) => void;
  allProjects: Project[];
  onEditProject: (project: Project) => void;
  handleSaveNewProject: (projectData: Omit<Project, 'id'>) => void;
  isCreatingProject: boolean;
  onStartCreatingProject: () => void;
  onCancelCreation: () => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({
  block,
  onUpdate,
  allProjects,
  onEditProject,
  handleSaveNewProject,
  isCreatingProject,
  onStartCreatingProject,
  onCancelCreation,
}) => {
  const { t } = useTranslation();

  const handleToggle = (projectId: string) => {
    const currentIds = block.projectIds;
    const newIds = currentIds.includes(projectId)
      ? currentIds.filter(id => id !== projectId)
      : [...currentIds, projectId];
    onUpdate({ projectIds: newIds });
  };

  return (
    <div>
      <EditorLabel>Select Projects</EditorLabel>
      <MultiItemSelector
        items={allProjects.map(p => ({ id: p.id, name: p.title }))}
        selectedIds={block.projectIds}
        onToggle={handleToggle}
        placeholder={t('searchProjects')}
        onEditItem={(id) => {
          const projectToEdit = allProjects.find(p => p.id === id);
          if (projectToEdit) onEditProject(projectToEdit);
        }}
        renderFooter={() => (
          isCreatingProject ? (
            <InlineProjectCreator onSave={handleSaveNewProject} onCancel={onCancelCreation} />
          ) : (
            <Button size="sm" variant="secondary" className="w-full" onClick={onStartCreatingProject}>
              <Plus size={14} className="me-2" />
              {t('createProject')}
            </Button>
          )
        )}
      />
    </div>
  );
};
