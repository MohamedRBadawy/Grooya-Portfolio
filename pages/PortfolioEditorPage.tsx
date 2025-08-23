


import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Portfolio, PortfolioBlock, Project, Skill, Palette, PortfolioAsset, Page, ColorTheme } from '../types';
import Button from '../components/ui/Button';
import AddBlockMenu from '../components/AddBlockMenu';
import { FilePenLine } from 'lucide-react';
import { useApp } from '../contexts/LocalizationContext';
import ProjectEditorModal from '../components/ProjectEditorModal';
import { CommandPalette } from '../components/CommandPalette';
import { generateHeroContent, generateAboutContent, generateDesignSuggestions } from '../services/aiService';
import PaletteEditorModal from '../components/PaletteEditorModal';
import AIImageGenerationModal from '../components/AIImageGenerationModal';
import AIPortfolioReviewModal from '../components/AIPortfolioReviewModal';
import AIMentorPanel from '../components/AIMentorPanel';
import EditorSidebar from '../components/editor/EditorSidebar';
import PortfolioPreview from '../components/editor/PortfolioPreview';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Import the new hooks
import { useResizableSidebar } from '../hooks/useResizableSidebar';
import { useEditorShortcuts } from '../hooks/useEditorShortcuts';
import { usePortfolioManager } from '../hooks/usePortfolioManager';

const PortfolioEditorPage: React.FC = () => {
    const { portfolioId } = useParams<{ portfolioId: string }>();
    const navigate = useNavigate();
    const { user, projects, skills, createProject, updateProject, deletePortfolio, createSkill } = useData();
    const { t } = useTranslation();
    const { direction } = useApp();

    // --- State Management and Data Logic from Custom Hook ---
    const {
        portfolio, saveStatus, activePage, activePageId, setActivePageId, editingPageId, setEditingPageId,
        undo, redo, canUndo, canRedo,
        updatePortfolioImmediate, updatePortfolioDebounced, updateField, updateBlock, updateBlockField,
        addBlock, removeBlock, handleDuplicateBlock: originalHandleDuplicate, handleMoveBlock,
        handleMoveBlockToPage, handleDragEnd, addPage, removePage, handleRenamePage, setHomePage
    } = usePortfolioManager(portfolioId);

    // --- UI State ---
    const [activeTab, setActiveTab] = useState<'pages' | 'content' | 'design' | 'assets'>('pages');
    const [addingBlockIndex, setAddingBlockIndex] = useState<number | null>(null);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isAIAssistLoading, setIsAIAssistLoading] = useState(false);
    const [isAIDesignLoading, setIsAIDesignLoading] = useState(false);
    const [editingPalette, setEditingPalette] = useState<Palette | 'new' | null>(null);
    const [isGeneratingAsset, setIsGeneratingAsset] = useState<boolean>(false);
    const [applyingAssetId, setApplyingAssetId] = useState<string | null>(null);
    const [regeneratingPrompt, setRegeneratingPrompt] = useState<string | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
    
    // State for triggering inline creation forms
    const [creatingInBlockId, setCreatingInBlockId] = useState<string | null>(null);
    const [creationType, setCreationType] = useState<'project' | 'skill' | null>(null);
    
    const applyMenuRef = useRef<HTMLDivElement>(null);

    // --- Sidebar Resizing from Custom Hook ---
    const { sidebarWidth, handleMouseDown } = useResizableSidebar();

    // --- Keyboard Shortcuts from Custom Hook ---
    const { isMac } = useEditorShortcuts({ canUndo, undo, canRedo, redo, setIsCommandPaletteOpen });

    // Click outside handler for the apply asset menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (applyMenuRef.current && !applyMenuRef.current.contains(event.target as Node)) {
                setApplyingAssetId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSave = () => {
        if (portfolio) {
            updatePortfolioDebounced(p => p); // Trigger a save
            toast.success('Portfolio saved!');
        }
    };
    
    const handleDelete = () => {
        if (portfolio && window.confirm(t('deleteConfirmEditor'))) {
            deletePortfolio(portfolio.id);
            navigate('/');
        }
    }
    
    // Wrapper to inject setActiveBlockId
    const handleDuplicateBlock = (blockId: string) => {
        originalHandleDuplicate(blockId, setActiveBlockId);
    };

    const handleAddBlock = (type: PortfolioBlock['type'], index: number) => {
        const newBlock = addBlock(type, index);
        if (newBlock) {
            setActiveBlockId(newBlock.id);
        }
        setAddingBlockIndex(null);
    }
    
    const handleRemoveBlock = (blockId: string) => {
        if (activeBlockId === blockId) {
            setActiveBlockId(null);
        }
        removeBlock(blockId);
    }
    
    // --- Project & Skill Management ---
    const handleSaveProject = (projectData: Project) => {
        updateProject(projectData);
        setEditingProject(null);
    };

    const handleSaveNewProject = (projectData: Omit<Project, 'id'>) => {
        const savedProject = createProject(projectData);
        // Automatically add the new project to the currently active projects block
        if (creatingInBlockId) {
            updatePortfolioImmediate(p => {
                const pageWithBlock = p.pages.find(pg => pg.blocks.some(b => b.id === creatingInBlockId));
                if (!pageWithBlock) return p;

                return {
                    ...p,
                    pages: p.pages.map(page => 
                        page.id === pageWithBlock.id 
                        ? { ...page, blocks: page.blocks.map(b => b.id === creatingInBlockId ? { ...b, projectIds: [...(b as any).projectIds, savedProject.id] } : b) }
                        : page
                    )
                }
            });
        }
        setCreatingInBlockId(null);
        setCreationType(null);
    };
    
    const handleSaveNewSkill = (skillData: Omit<Skill, 'id'>) => {
        const savedSkill = createSkill(skillData);
        if (creatingInBlockId) {
             updatePortfolioImmediate(p => {
                const pageWithBlock = p.pages.find(pg => pg.blocks.some(b => b.id === creatingInBlockId));
                if (!pageWithBlock) return p;
                
                return {
                    ...p,
                    pages: p.pages.map(page => 
                        page.id === pageWithBlock.id 
                        ? { ...page, blocks: page.blocks.map(b => b.id === creatingInBlockId ? { ...b, skillIds: [...(b as any).skillIds, savedSkill.id] } : b) }
                        : page
                    )
                }
            });
        }
        setCreatingInBlockId(null);
        setCreationType(null);
    };

    const handleTriggerProjectCreation = () => {
        if (!portfolio) return;
        const projectsBlock = portfolio.pages.flatMap(p => p.blocks).find(b => b.type === 'projects');
        if (projectsBlock) {
            const pageOfBlock = portfolio.pages.find(p => p.blocks.some(b => b.id === projectsBlock.id));
            if (pageOfBlock) {
                setActivePageId(pageOfBlock.id);
                setActiveTab('content');
                setCreatingInBlockId(projectsBlock.id);
                setCreationType('project');
            }
        } else {
            toast.error("Please add a 'Projects' block to your portfolio first.");
        }
    };


    // --- AI Features ---
    const handleAIAssist = async () => {
        if (!portfolio || !activeBlockId || !user || !activePageId) return;

        const block = activePage?.blocks.find(b => b.id === activeBlockId);
        if (!block) return;

        setIsAIAssistLoading(true);
        try {
            if (block.type === 'hero') {
                const { headline, subheadline } = await generateHeroContent(user.name, user.title);
                updateBlock(block.id, { headline, subheadline });
            } else if (block.type === 'about') {
                const content = await generateAboutContent(user.name, user.title, (block as any).content);
                updateBlock(block.id, { content });
            }
        } catch (error) {
            console.error("AI Assist failed:", error);
            toast.error("AI Assist failed. Please check the console for details.");
        } finally {
            setIsAIAssistLoading(false);
        }
    };
    
    const handleAIDesignSuggest = async () => {
        if (!user) return;
        setIsAIDesignLoading(true);
        try {
            const suggestions = await generateDesignSuggestions(user.title);
            updatePortfolioImmediate(p => ({
                ...p,
                design: {
                    ...p.design,
                    ...suggestions,
                    paletteId: `default-${suggestions.theme}`
                }
            }));
        } catch (error) {
            console.error("AI Design Suggestion failed:", error);
            toast.error("AI Design Suggestion failed. Please check the console for details.");
        } finally {
            setIsAIDesignLoading(false);
        }
    };

    // --- Palette & Asset Management ---
    const handleSavePalette = (palette: Palette) => {
        updatePortfolioImmediate(p => {
            const existing = p.customPalettes?.find(cp => cp.id === palette.id);
            if (existing) {
                return { ...p, customPalettes: p.customPalettes?.map(cp => cp.id === palette.id ? palette : cp) };
            } else {
                return { ...p, customPalettes: [...(p.customPalettes || []), palette] };
            }
        });
        setEditingPalette(null);
    };

    const handleDeletePalette = (paletteId: string) => {
        if (!window.confirm("Are you sure you want to delete this custom palette?")) return;
        updatePortfolioImmediate(p => {
            const newPalettes = p.customPalettes?.filter(cp => cp.id !== paletteId) || [];
            const newDesign = p.design.paletteId === paletteId ? { ...p.design, paletteId: 'default-light' } : p.design;
            return { ...p, customPalettes: newPalettes, design: newDesign };
        });
    };
    
    const handleImageGenerated = (assetData: { url: string; prompt: string }) => {
        const newAsset: PortfolioAsset = {
            id: `asset-${Date.now()}`,
            url: assetData.url,
            prompt: assetData.prompt,
            createdAt: Date.now()
        };
        updatePortfolioImmediate(p => ({
            ...p,
            assets: [...(p.assets || []), newAsset]
        }));
    };
    
    const handleDeleteAsset = (assetId: string) => {
        if (!portfolio || !window.confirm(t('deleteAssetConfirm'))) return;
        
        const assetToDelete = portfolio.assets?.find(a => a.id === assetId);
        if (!assetToDelete) return;

        updatePortfolioImmediate(p => {
            const newAssets = p.assets?.filter(a => a.id !== assetId) || [];
            const newPages = p.pages.map(page => ({
                ...page,
                blocks: page.blocks.map(b => {
                    if (b.designOverrides?.backgroundImage === assetToDelete.url) {
                        const { backgroundImage, backgroundOpacity, textColor, ...restOverrides } = b.designOverrides;
                        if (Object.keys(restOverrides).length === 0) {
                            const { designOverrides, ...restBlock } = b;
                            return restBlock as PortfolioBlock;
                        }
                        return { ...b, designOverrides: restOverrides };
                    }
                    return b;
                })
            }));
            return { ...p, assets: newAssets, pages: newPages };
        });
    };

    const handleApplyAssetToBlock = (asset: PortfolioAsset, blockId: string) => {
        if (!activePageId) return;
        updatePortfolioImmediate(p => ({
            ...p,
            pages: p.pages.map(page => 
                page.id === activePageId
                ? { ...page, blocks: page.blocks.map(b => {
                        if (b.id === blockId) {
                            return {
                                ...b,
                                designOverrides: { ...(b.designOverrides || {}), backgroundImage: asset.url, backgroundOpacity: 0.5, textColor: '#FFFFFF' }
                            };
                        }
                        return b;
                    })}
                : page
            )
        }));
        setApplyingAssetId(null);
    };

    if (!portfolio || !activePage || !activePageId) {
        return <div className="flex items-center justify-center h-full">Loading editor...</div>;
    }
        
    const commandPaletteActions = {
        onSwitchTab: setActiveTab,
        onSave: handleSave,
        onDelete: handleDelete,
        onAddBlock: (type: PortfolioBlock['type']) => handleAddBlock(type, activePage.blocks.length),
        onSetTheme: (theme: ColorTheme) => updatePortfolioImmediate(p => ({ ...p, design: { ...p.design, paletteId: `default-${theme}` } })),
    };

    return (
        <>
        <div className="h-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
             {/* Desktop Layout */}
            <div className="hidden md:flex h-full">
                {portfolio.isGuided && <AIMentorPanel 
                    portfolio={portfolio} 
                    onUpdate={updatePortfolioImmediate}
                    setActiveBlockId={setActiveBlockId}
                    addBlock={(type, index) => addBlock(type, index)}
                    onTriggerProjectCreation={handleTriggerProjectCreation}
                />}
                <aside 
                    style={{ width: `${sidebarWidth}px` }}
                    className="flex flex-col h-full shadow-2xl border-e border-slate-200 dark:border-slate-800 flex-shrink-0"
                >
                   <EditorSidebar
                        portfolio={portfolio}
                        activePage={activePage}
                        updateField={updateField}
                        navigate={navigate}
                        direction={direction}
                        canUndo={canUndo} undo={undo}
                        canRedo={canRedo} redo={redo}
                        isMac={isMac}
                        setIsCommandPaletteOpen={setIsCommandPaletteOpen}
                        setIsReviewModalOpen={setIsReviewModalOpen}
                        handleDelete={handleDelete}
                        handleSave={handleSave}
                        setMobileView={setMobileView}
                        activeTab={activeTab} setActiveTab={setActiveTab}
                        saveStatus={saveStatus}
                        
                        // PagesPanel Props
                        activePageId={activePageId}
                        editingPageId={editingPageId}
                        addPage={addPage}
                        setActivePageId={setActivePageId}
                        setEditingPageId={setEditingPageId}
                        handleRenamePage={handleRenamePage}
                        setHomePage={setHomePage}
                        removePage={removePage}

                        // ContentPanel Props
                        handleDragEnd={handleDragEnd}
                        setAddingBlockIndex={setAddingBlockIndex}
                        setActiveBlockId={setActiveBlockId}
                        updateBlock={updateBlock}
                        removeBlock={handleRemoveBlock}
                        handleDuplicateBlock={handleDuplicateBlock}
                        handleMoveBlock={handleMoveBlock}
                        handleMoveBlockToPage={handleMoveBlockToPage}
                        projects={projects}
                        skills={skills}
                        setEditingProject={setEditingProject}
                        handleSaveNewProject={handleSaveNewProject}
                        handleSaveNewSkill={handleSaveNewSkill}
                        creatingInBlockId={creatingInBlockId}
                        creationType={creationType}
                        setCreatingInBlockId={setCreatingInBlockId}
                        setCreationType={setCreationType}
                   
                        // DesignPanel Props
                        handleAIDesignSuggest={handleAIDesignSuggest}
                        isAIDesignLoading={isAIDesignLoading}
                        updatePortfolioImmediate={updatePortfolioImmediate}
                        updatePortfolioDebounced={updatePortfolioDebounced}
                        setEditingPalette={setEditingPalette}
                        handleDeletePalette={handleDeletePalette}

                        // AssetsPanel Props
                        setIsGeneratingAsset={setIsGeneratingAsset}
                        handleDeleteAsset={handleDeleteAsset}
                        setRegeneratingPrompt={setRegeneratingPrompt}
                        applyingAssetId={applyingAssetId}
                        setApplyingAssetId={setApplyingAssetId}
                        applyMenuRef={applyMenuRef}
                        handleApplyAssetToBlock={handleApplyAssetToBlock}
                   />
                </aside>
                <div
                    onMouseDown={handleMouseDown}
                    className="w-1.5 flex-shrink-0 cursor-col-resize bg-slate-200 dark:bg-slate-800 hover:bg-teal-500 active:bg-teal-600 transition-colors duration-200"
                    aria-label="Resize editor panel"
                    role="separator"
                />
                <main className="flex-grow h-full bg-slate-200 dark:bg-slate-950 p-8">
                    <PortfolioPreview 
                        portfolio={portfolio} 
                        activePage={activePage}
                        onUpdateBlock={updateBlockField}
                        activeBlockId={activeBlockId}
                        setActiveBlockId={setActiveBlockId}
                        onDuplicateBlock={handleDuplicateBlock}
                        onMoveBlock={handleMoveBlock}
                        onDeleteBlock={handleRemoveBlock}
                        onAIAssist={handleAIAssist}
                        isAIAssistLoading={isAIAssistLoading}
                        onPageLinkClick={(pageId) => setActivePageId(pageId)}
                    />
                </main>
            </div>
            {/* Mobile Layout */}
             <div className="md:hidden h-full">
                {mobileView === 'editor' ? (
                     <EditorSidebar
                        portfolio={portfolio}
                        activePage={activePage}
                        updateField={updateField}
                        navigate={navigate}
                        direction={direction}
                        canUndo={canUndo} undo={undo}
                        canRedo={canRedo} redo={redo}
                        isMac={isMac}
                        setIsCommandPaletteOpen={setIsCommandPaletteOpen}
                        setIsReviewModalOpen={setIsReviewModalOpen}
                        handleDelete={handleDelete}
                        handleSave={handleSave}
                        setMobileView={setMobileView}
                        activeTab={activeTab} setActiveTab={setActiveTab}
                        saveStatus={saveStatus}
                        
                        // PagesPanel Props
                        activePageId={activePageId}
                        editingPageId={editingPageId}
                        addPage={addPage}
                        setActivePageId={setActivePageId}
                        setEditingPageId={setEditingPageId}
                        handleRenamePage={handleRenamePage}
                        setHomePage={setHomePage}
                        removePage={removePage}

                        // ContentPanel Props
                        handleDragEnd={handleDragEnd}
                        setAddingBlockIndex={setAddingBlockIndex}
                        setActiveBlockId={setActiveBlockId}
                        updateBlock={updateBlock}
                        removeBlock={handleRemoveBlock}
                        handleDuplicateBlock={handleDuplicateBlock}
                        handleMoveBlock={handleMoveBlock}
                        handleMoveBlockToPage={handleMoveBlockToPage}
                        projects={projects}
                        skills={skills}
                        setEditingProject={setEditingProject}
                        handleSaveNewProject={handleSaveNewProject}
                        handleSaveNewSkill={handleSaveNewSkill}
                        creatingInBlockId={creatingInBlockId}
                        creationType={creationType}
                        setCreatingInBlockId={setCreatingInBlockId}
                        setCreationType={setCreationType}
                   
                        // DesignPanel Props
                        handleAIDesignSuggest={handleAIDesignSuggest}
                        isAIDesignLoading={isAIDesignLoading}
                        updatePortfolioImmediate={updatePortfolioImmediate}
                        updatePortfolioDebounced={updatePortfolioDebounced}
                        setEditingPalette={setEditingPalette}
                        handleDeletePalette={handleDeletePalette}

                        // AssetsPanel Props
                        setIsGeneratingAsset={setIsGeneratingAsset}
                        handleDeleteAsset={handleDeleteAsset}
                        setRegeneratingPrompt={setRegeneratingPrompt}
                        applyingAssetId={applyingAssetId}
                        setApplyingAssetId={setApplyingAssetId}
                        applyMenuRef={applyMenuRef}
                        handleApplyAssetToBlock={handleApplyAssetToBlock}
                   />
                ) : (
                    <main className="h-full relative">
                        <div className="h-full bg-slate-200 dark:bg-slate-950 p-2 sm:p-4">
                             <PortfolioPreview 
                                portfolio={portfolio} 
                                activePage={activePage}
                                onUpdateBlock={updateBlockField}
                                activeBlockId={activeBlockId}
                                setActiveBlockId={setActiveBlockId}
                                onDuplicateBlock={handleDuplicateBlock}
                                onMoveBlock={handleMoveBlock}
                                onDeleteBlock={handleRemoveBlock}
                                onAIAssist={handleAIAssist}
                                isAIAssistLoading={isAIAssistLoading}
                                onPageLinkClick={(pageId) => setActivePageId(pageId)}
                            />
                        </div>
                        <Button 
                            onClick={() => setMobileView('editor')} 
                            variant="primary" 
                            className="fixed bottom-4 end-4 z-50 !rounded-full !p-3 shadow-lg"
                        >
                            <FilePenLine size={20} className="me-1"/> Edit
                        </Button>
                    </main>
                )}
            </div>
        </div>
        <AnimatePresence>
            {addingBlockIndex !== null && (
                <AddBlockMenu 
                    onAddBlock={(type) => handleAddBlock(type, addingBlockIndex)}
                    onClose={() => setAddingBlockIndex(null)}
                />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {editingProject && (
                <ProjectEditorModal
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                    onSave={handleSaveProject}
                />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {editingPalette && (
                <PaletteEditorModal
                    palette={editingPalette === 'new' ? null : editingPalette}
                    onClose={() => setEditingPalette(null)}
                    onSave={handleSavePalette}
                />
            )}
        </AnimatePresence>
         <AnimatePresence>
            {isGeneratingAsset && (
                <AIImageGenerationModal
                    onClose={() => {
                        setIsGeneratingAsset(false);
                        setRegeneratingPrompt(null);
                    }}
                    onImageGenerated={handleImageGenerated}
                    initialPrompt={regeneratingPrompt || undefined}
                />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {isReviewModalOpen && user && (
                <AIPortfolioReviewModal
                    portfolio={portfolio}
                    user={user}
                    onClose={() => setIsReviewModalOpen(false)}
                />
            )}
        </AnimatePresence>
        <CommandPalette
            isOpen={isCommandPaletteOpen}
            setIsOpen={setIsCommandPaletteOpen}
            actions={commandPaletteActions}
        />
        </>
    );
};

export default PortfolioEditorPage;