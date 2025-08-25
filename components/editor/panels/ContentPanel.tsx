

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Page, Portfolio, Project, Skill, PortfolioBlock } from '../../../types';
import BlockEditor from '../BlockEditor';
import BlockInserter from '../BlockInserter';
import Button from '../../ui/Button';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import BlockListItem from '../BlockListItem';
import { useApp } from '../../../contexts/LocalizationContext';

interface ContentPanelProps {
    activePage: Page;
    pages: Page[];
    focusedBlockId: string | null;
    setFocusedBlockId: (id: string | null) => void;
    handleDragEnd: (event: any) => void;
    setAddingBlockIndex: (index: number) => void;
    setActiveBlockId: (id: string | null) => void;
    updateBlock: (blockId: string, newBlockData: any) => void;
    removeBlock: (blockId: string) => void;
    handleDuplicateBlock: (blockId: string) => void;
    handleMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
    handleMoveBlockToPage: (blockId: string, targetPageId: string) => void;
    projects: Project[];
    skills: Skill[];
    setEditingProject: (project: Project) => void;
    handleSaveNewProject: (projectData: Omit<Project, 'id'>) => void;
    handleSaveNewSkill: (skillData: Omit<Skill, 'id'>) => void;
    creatingInBlockId: string | null;
    creationType: 'project' | 'skill' | null;
    setCreatingInBlockId: (id: string | null) => void;
    setCreationType: (type: 'project' | 'skill' | null) => void;
}

const ContentPanel: React.FC<ContentPanelProps> = ({
    activePage,
    pages,
    focusedBlockId,
    setFocusedBlockId,
    handleDragEnd,
    setAddingBlockIndex,
    setActiveBlockId,
    updateBlock,
    removeBlock,
    handleDuplicateBlock,
    handleMoveBlock,
    handleMoveBlockToPage,
    projects,
    skills,
    setEditingProject,
    handleSaveNewProject,
    handleSaveNewSkill,
    creatingInBlockId,
    creationType,
    setCreatingInBlockId,
    setCreationType
}) => {
    const { t } = useTranslation();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const focusedBlock = activePage.blocks.find(b => b.id === focusedBlockId);
    const BackIcon = ArrowLeft;

    if (focusedBlock) {
        return (
            <div className="p-4 space-y-4">
                 <Button variant="ghost" size="sm" onClick={() => setFocusedBlockId(null)} className="mb-2">
                    <BackIcon size={14} className="me-2"/> Back to all blocks
                </Button>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold capitalize text-slate-800 dark:text-slate-200 mb-4 text-lg">{t(`block.${focusedBlock.type}`)} Editor</h4>
                    <BlockEditor
                        block={focusedBlock}
                        onUpdate={updateBlock}
                        allProjects={projects}
                        allSkills={skills}
                        onEditProject={(project) => setEditingProject(project)}
                        handleSaveNewProject={handleSaveNewProject}
                        handleSaveNewSkill={handleSaveNewSkill}
                        isCreatingProject={creatingInBlockId === focusedBlock.id && creationType === 'project'}
                        onStartCreatingProject={() => { setCreatingInBlockId(focusedBlock.id); setCreationType('project'); }}
                        isCreatingSkill={creatingInBlockId === focusedBlock.id && creationType === 'skill'}
                        onStartCreatingSkill={() => { setCreatingInBlockId(focusedBlock.id); setCreationType('skill'); }}
                        onCancelCreation={() => { setCreatingInBlockId(null); setCreationType(null); }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="p-4">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={activePage.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {activePage.blocks.map((block, index) => (
                            <React.Fragment key={block.id}>
                                <BlockInserter onAdd={() => setAddingBlockIndex(index)} />
                                <BlockListItem
                                    block={block}
                                    onFocus={() => { setFocusedBlockId(block.id); setActiveBlockId(block.id); }}
                                    onRemove={removeBlock}
                                    onDuplicate={handleDuplicateBlock}
                                    onMoveBlockToPage={handleMoveBlockToPage}
                                    pages={pages}
                                    activePageId={activePage.id}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            <BlockInserter onAdd={() => setAddingBlockIndex(activePage.blocks.length)} />
            
            {activePage.blocks.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    <h3 className="text-xl font-medium text-slate-800 dark:text-slate-300">{t('addYourFirstBlock')}</h3>
                    <Button onClick={() => setAddingBlockIndex(0)} variant="primary" className="mt-6">
                        <Plus className="w-5 h-5 me-2" />
                        {t('add')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ContentPanel;
