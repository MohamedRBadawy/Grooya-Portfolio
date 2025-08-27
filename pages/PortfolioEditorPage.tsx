

import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Portfolio, PortfolioBlock, Project, Skill, Palette, PortfolioAsset, Page, ColorTheme, GalleryImage } from '../types';
import Button from '../components/ui/Button';
import AddBlockMenu from '../components/AddBlockMenu';
import { FilePenLine, Eye } from 'lucide-react';
import { useApp } from '../contexts/LocalizationContext';
import ProjectEditorModal from '../components/ProjectEditorModal';
import { CommandPalette } from '../components/CommandPalette';
import { generateHeroContent, generateAboutContent, generateDesignSuggestions, ApiKeyMissingError } from '../services/aiService';
import PaletteEditorModal from '../components/PaletteEditorModal';
import AIImageGenerationModal from '../components/AIImageGenerationModal';
import AIPortfolioReviewModal from '../components/AIPortfolioReviewModal';
import AIMentorPanel from '../components/AIMentorPanel';
import EditorSidebar from '../components/editor/EditorSidebar';
import PortfolioPreview from '../components/editor/PortfolioPreview';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Import the new hooks
import { useResizableSidebar } from '../hooks/useResizableSidebar';
import { useEditorShortcuts } from '../hooks/useEditorShortcuts';
import { usePortfolioManager } from '../hooks/usePortfolioManager';

const PortfolioEditorPage: React.FC = () => {
    const { portfolioId } = useParams<{ portfolioId: string }>();
    const navigate = useNavigate();
    const { user, projects, skills, createProject, updateProject, deletePortfolio, createSkill, consumeAiFeature } = useData();
    const { t } = useTranslation();
    const { direction } = useApp();

    // --- State Management and Data Logic from Custom Hook ---
    const {
        portfolio, savePortfolio, activePage, activePageId, setActivePageId, editingPageId, setEditingPageId,
        undo, redo, canUndo, canRedo, saveStatus,
        updatePortfolioImmediate, updatePortfolioDebounced, updateField, updateBlock, updateBlockField,
        addBlock, removeBlock, handleDuplicateBlock: originalHandleDuplicate, handleMoveBlock,
        handleMoveBlockToPage, handleDragEnd, addPage, removePage, handleRenamePage, setHomePage
    } = usePortfolioManager(portfolioId);

    // --- UI State ---
    const [activeTab, setActiveTab] = useState<'pages' | 'content' | 'design' | 'assets'>('pages');
    const [addingBlockIndex, setAddingBlockIndex] = useState<number | null>(null);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null); // For inline preview highlight
    const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null); // For focused sidebar editing
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);


    // --- Sidebar Resizing from Custom Hook ---
    const { sidebarWidth, handleMouseDown } = useResizableSidebar();

    // --- Keyboard Shortcuts from Custom Hook ---
    const { isMac } = useEditorShortcuts({ canUndo, undo, canRedo, redo, setIsCommandPaletteOpen });

    // Reset focused block when switching away from the content tab
    useEffect(() => {
        if (activeTab !== 'content') {
            setFocusedBlockId(null);
        }
    }, [activeTab]);

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
    
    // Effect to scroll the preview pane when a block is focused in the sidebar
    useEffect(() => {
        if (focusedBlockId && scrollContainerRef.current) {
            const element = scrollContainerRef.current.querySelector(`#${focusedBlockId}`);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }, [focusedBlockId]);
    
    const handleTabSwitch = (tab: 'pages' | 'content' | 'design' | 'assets') => {
        if (activeTab !== tab) {
            savePortfolio(); // Save changes when switching tabs
            setActiveTab(tab);
        }
    };

    const handleDelete = () => {
        if (!portfolio) return;
        toast((toastInstance) => (
            <div className="flex flex-col items-start gap-3">
                <span className="font-medium">{t('deleteConfirmEditor')}</span>
                <div className="flex gap-2 self-stretch">
                    <Button variant="danger" size="sm" className="flex-grow" onClick={() => {
                        deletePortfolio(portfolio.id);
                        navigate('/dashboard');
                        toast.dismiss(toastInstance.id);
                    }}>
                        Confirm
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-grow" onClick={() => toast.dismiss(toastInstance.id)}>
                        Cancel
                    </Button>
                </div>
            </div>
        ), { duration: 6000 });
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
        if (!block || (block.type !== 'hero' && block.type !== 'about')) return;

        const feature = block.type === 'hero' ? 'heroContent' : 'aboutContent';
        if (!consumeAiFeature(feature)) {
            const message = user?.subscription?.tier === 'pro'
                ? "You've run out of AI text credits for this month."
                : "You've used your one free generation for this feature. Please upgrade to Pro.";
            toast.error(message);
            return;
        }

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
            if (error instanceof ApiKeyMissingError) {
                toast.error(error.message);
            } else {
                toast.error("AI Assist failed. Please check the console for details.");
            }
        } finally {
            setIsAIAssistLoading(false);
        }
    };
    
    const handleAIDesignSuggest = async () => {
        if (!user) return;
        if (!consumeAiFeature('designSuggestions')) {
            const message = user?.subscription?.tier === 'pro'
                ? "You've run out of AI text credits for this month."
                : "You've used your one free design suggestion. Please upgrade to Pro.";
            toast.error(message);
            return;
        }

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
            if (error instanceof ApiKeyMissingError) {
                toast.error(error.message);
            } else {
                toast.error("AI Design Suggestion failed. Please check the console for details.");
            }
        } finally {
            setIsAIDesignLoading(false);
        }
    };

    const handleOpenReviewModal = () => {
        if (consumeAiFeature('portfolioReview')) {
            setIsReviewModalOpen(true);
        } else {
             const message = user?.subscription?.tier === 'pro'
                ? "You've run out of AI text credits for this month."
                : "You've used your one free portfolio review. Please upgrade to Pro.";
            toast.error(message);
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
        toast((toastInstance) => (
            <div className="flex flex-col items-start gap-3">
                <span className="font-medium">Delete this custom palette?</span>
                <div className="flex gap-2 self-stretch">
                    <Button variant="danger" size="sm" className="flex-grow" onClick={() => {
                        updatePortfolioImmediate(p => {
                            const newPalettes = p.customPalettes?.filter(cp => cp.id !== paletteId) || [];
                            const newDesign = p.design.paletteId === paletteId ? { ...p.design, paletteId: 'default-light' } : p.design;
                            return { ...p, customPalettes: newPalettes, design: newDesign };
                        });
                        toast.dismiss(toastInstance.id);
                    }}>
                        Confirm
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-grow" onClick={() => toast.dismiss(toastInstance.id)}>
                        Cancel
                    </Button>
                </div>
            </div>
        ), { duration: 6000 });
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

    const handleAddAsset = (assetData: Omit<PortfolioAsset, 'id' | 'createdAt'>) => {
        const newAsset: PortfolioAsset = {
            id: `asset-${Date.now()}`,
            ...assetData,
            createdAt: Date.now()
        };
        updatePortfolioImmediate(p => ({
            ...p,
            assets: [...(p.assets || []), newAsset]
        }));
    };
    
    const handleDeleteAsset = (assetId: string) => {
        if (!portfolio) return;
        toast((toastInstance) => (
            <div className="flex flex-col items-start gap-3">
                <span className="font-medium">{t('deleteAssetConfirm')}</span>
                <div className="flex gap-2 self-stretch">
                    <Button variant="danger" size="sm" className="flex-grow" onClick={() => {
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
                        toast.dismiss(toastInstance.id);
                    }}>
                        Confirm
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-grow" onClick={() => toast.dismiss(toastInstance.id)}>
                        Cancel
                    </Button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const handleApplyAssetToBlock = (asset: PortfolioAsset, blockId: string, action: 'background' | 'mainImage' | 'addToGallery') => {
        if (!activePageId) return;
        updatePortfolioImmediate(p => ({
            ...p,
            pages: p.pages.map(page => 
                page.id === activePageId
                ? { ...page, blocks: page.blocks.map(b => {
                        if (b.id !== blockId) return b;

                        switch(action) {
                            case 'background':
                                return {
                                    ...b,
                                    designOverrides: { ...(b.designOverrides || {}), backgroundImage: asset.url, backgroundOpacity: 0.5, textColor: '#FFFFFF' }
                                };
                            case 'mainImage':
                                if (b.type === 'hero' || b.type === 'about') {
                                    return { ...b, imageUrl: asset.url };
                                }
                                return b;
                            case 'addToGallery':
                                if (b.type === 'gallery') {
                                    const newImage: GalleryImage = { id: `gal-${Date.now()}`, url: asset.url, caption: asset.prompt };
                                    return { ...b, images: [...b.images, newImage] };
                                }
                                return b;
                            default:
                                return b;
                        }
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
        onSave: savePortfolio,
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
                        setIsReviewModalOpen={handleOpenReviewModal}
                        handleDelete={handleDelete}
                        handleSave={savePortfolio}
                        setMobileView={setMobileView}
                        activeTab={activeTab} setActiveTab={handleTabSwitch}
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
                        focusedBlockId={focusedBlockId}
                        setFocusedBlockId={setFocusedBlockId}
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
                        onAddAsset={handleAddAsset}
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
                        activePageId={activePageId}
                        onUpdateBlock={updateBlockField}
                        activeBlockId={activeBlockId}
                        setActiveBlockId={setActiveBlockId}
                        onDuplicateBlock={handleDuplicateBlock}
                        onMoveBlock={handleMoveBlock}
                        onDeleteBlock={handleRemoveBlock}
                        onAIAssist={handleAIAssist}
                        isAIAssistLoading={isAIAssistLoading}
                        onPageLinkClick={(pageId) => setActivePageId(pageId)}
                        focusedBlockId={activeTab === 'content' ? focusedBlockId : null}
                        scrollContainerRef={scrollContainerRef}
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
                        setIsReviewModalOpen={handleOpenReviewModal}
                        handleDelete={handleDelete}
                        handleSave={savePortfolio}
                        setMobileView={setMobileView}
                        activeTab={activeTab} setActiveTab={handleTabSwitch}
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
                        focusedBlockId={focusedBlockId}
                        setFocusedBlockId={setFocusedBlockId}
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
                        onAddAsset={handleAddAsset}
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
                                activePageId={activePageId}
                                onUpdateBlock={updateBlockField}
                                activeBlockId={activeBlockId}
                                setActiveBlockId={setActiveBlockId}
                                onDuplicateBlock={handleDuplicateBlock}
                                onMoveBlock={handleMoveBlock}
                                onDeleteBlock={handleRemoveBlock}
                                onAIAssist={handleAIAssist}
                                isAIAssistLoading={isAIAssistLoading}
                                onPageLinkClick={(pageId) => setActivePageId(pageId)}
                                focusedBlockId={activeTab === 'content' ? focusedBlockId : null}
                                scrollContainerRef={scrollContainerRef}
                            />
                        </div>
                    </main>
                )}
            </div>
        </div>
        
        {/* New Mobile Toggle Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 p-2">
            <div className="flex items-center justify-center gap-1 p-1 bg-slate-200 dark:bg-slate-800 rounded-full max-w-sm mx-auto">
                <button
                    onClick={() => setMobileView('editor')}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-full relative transition-colors flex items-center justify-center gap-2 ${
                        mobileView === 'editor' ? 'text-slate-900 dark:text-slate-50' : 'text-slate-600 dark:text-slate-400'
                    }`}
                >
                    {mobileView === 'editor' && (
                        <motion.div
                            layoutId="mobile-toggle-highlight"
                            className="absolute inset-0 bg-white dark:bg-slate-700 rounded-full shadow-sm"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2"><FilePenLine size={16}/> Editor</span>
                </button>
                <button
                    onClick={() => setMobileView('preview')}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-full relative transition-colors flex items-center justify-center gap-2 ${
                        mobileView === 'preview' ? 'text-slate-900 dark:text-slate-50' : 'text-slate-600 dark:text-slate-400'
                    }`}
                >
                     {mobileView === 'preview' && (
                        <motion.div
                            layoutId="mobile-toggle-highlight"
                            className="absolute inset-0 bg-white dark:bg-slate-700 rounded-full shadow-sm"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2"><Eye size={16}/> Preview</span>
                </button>
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