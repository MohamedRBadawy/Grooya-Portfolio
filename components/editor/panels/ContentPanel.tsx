


import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Page, Portfolio, Project, Skill } from '../../../types';
import BlockEditor from '../BlockEditor';
import BlockInserter from '../BlockInserter';
import Button from '../../ui/Button';
import { Plus } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface ContentPanelProps {
    activePage: Page;
    pages: Page[];
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

/**
 * The main panel in the editor for managing the content blocks of the active page.
 * It handles drag-and-drop reordering and renders the editor for each block.
 */
const ContentPanel: React.FC<ContentPanelProps> = ({
    activePage,
    pages,
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
    // Set up sensors for dnd-kit to allow for both pointer (mouse/touch) and keyboard dragging.
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div className="p-4">
            {/* DndContext provides the drag-and-drop context for all its children. */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                {/* SortableContext provides information about the sortable items to dnd-kit. */}
                <SortableContext items={activePage.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {activePage.blocks.map((block, index) => (
                            <React.Fragment key={block.id}>
                                {/* BlockInserter allows adding a new block at this specific index. */}
                                <BlockInserter onAdd={() => setAddingBlockIndex(index)} />
                                {/* When a BlockEditor is focused, it becomes the "active" block. */}
                                <div onFocus={() => setActiveBlockId(block.id)}>
                                    <BlockEditor
                                        block={block}
                                        onUpdate={updateBlock}
                                        onRemove={removeBlock}
                                        onDuplicate={handleDuplicateBlock}
                                        onMoveUp={(id) => handleMoveBlock(id, 'up')}
                                        onMoveDown={(id) => handleMoveBlock(id, 'down')}
                                        onMoveBlockToPage={handleMoveBlockToPage}
                                        pages={pages}
                                        activePageId={activePage.id}
                                        index={index}
                                        totalBlocks={activePage.blocks.length}
                                        allProjects={projects}
                                        allSkills={skills}
                                        onEditProject={(project) => setEditingProject(project)}
                                        handleSaveNewProject={handleSaveNewProject}
                                        handleSaveNewSkill={handleSaveNewSkill}
                                        isCreatingProject={creatingInBlockId === block.id && creationType === 'project'}
                                        onStartCreatingProject={() => { setCreatingInBlockId(block.id); setCreationType('project'); }}
                                        isCreatingSkill={creatingInBlockId === block.id && creationType === 'skill'}
                                        onStartCreatingSkill={() => { setCreatingInBlockId(block.id); setCreationType('skill'); }}
                                        onCancelCreation={() => { setCreatingInBlockId(null); setCreationType(null); }}
                                    />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            {/* BlockInserter at the end to add a block to the bottom of the list. */}
            <BlockInserter onAdd={() => setAddingBlockIndex(activePage.blocks.length)} />
            
            {/* Empty state shown when a page has no blocks. */}
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