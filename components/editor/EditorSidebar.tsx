
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Portfolio, Page, Project, Skill, Palette, PortfolioAsset } from '../../types';
import Button from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { ArrowLeft, ArrowRight, Trash2, Palette as PaletteIcon, FileText, X, Eye, Command, Undo2, Redo2, Award, File, MoreVertical, Home, FilePenLine, Save } from 'lucide-react';
import PagesPanel from './panels/PagesPanel';
import ContentPanel from './panels/ContentPanel';
import DesignPanel from './panels/DesignPanel';
import AssetsPanel from './panels/AssetsPanel';
import { Check, ImageIcon } from 'lucide-react';

const SaveButton: React.FC<{ onSave: () => void; status: 'idle' | 'saving' | 'saved' }> = ({ onSave, status }) => {
    const { t } = useTranslation();
    if (status === 'saving') {
        return (
            <Button variant="primary" size="sm" disabled>
                <svg className="animate-spin -ms-1 me-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Saving...
            </Button>
        );
    }
    if (status === 'saved') {
        return (
            <Button variant="primary" size="sm" disabled className="!bg-teal-700 dark:!bg-teal-800">
                <Check size={16} className="me-2" />
                Saved
            </Button>
        );
    }
    return (
        <Button onClick={onSave} variant="primary" size="sm">
            <Save size={14} className="me-2" /> {t('save')}
        </Button>
    );
};


interface EditorSidebarProps {
    portfolio: Portfolio;
    activePage: Page | null;
    updateField: <K extends keyof Portfolio>(field: K, value: Portfolio[K]) => void;
    navigate: ReturnType<typeof useNavigate>;
    direction: 'ltr' | 'rtl';
    canUndo: boolean;
    undo: () => void;
    canRedo: boolean;
    redo: () => void;
    isMac: boolean;
    setIsCommandPaletteOpen: (isOpen: boolean) => void;
    setIsReviewModalOpen: () => void;
    handleDelete: () => void;
    handleSave: () => void;
    setMobileView: (view: 'editor' | 'preview') => void;
    activeTab: 'pages' | 'content' | 'design' | 'assets';
    setActiveTab: (tab: 'pages' | 'content' | 'design' | 'assets') => void;
    saveStatus: 'idle' | 'saving' | 'saved';
    
    // PagesPanel Props
    activePageId: string | null;
    editingPageId: string | null;
    addPage: () => void;
    setActivePageId: (id: string) => void;
    setEditingPageId: (id: string | null) => void;
    handleRenamePage: (pageId: string, newName: string) => void;
    setHomePage: (pageId: string) => void;
    removePage: (pageId: string) => void;

    // ContentPanel Props
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


    // DesignPanel Props
    handleAIDesignSuggest: () => void;
    isAIDesignLoading: boolean;
    updatePortfolioImmediate: (updater: (p: Portfolio) => Portfolio) => void;
    updatePortfolioDebounced: (updater: (p: Portfolio) => Portfolio) => void;
    setEditingPalette: (palette: Palette | 'new' | null) => void;
    handleDeletePalette: (paletteId: string) => void;

    // AssetsPanel Props
    onAddAsset: (assetData: Omit<PortfolioAsset, 'id' | 'createdAt'>) => void;
    setIsGeneratingAsset: (isGenerating: boolean) => void;
    handleDeleteAsset: (assetId: string) => void;
    setRegeneratingPrompt: (prompt: string | null) => void;
    applyingAssetId: string | null;
    setApplyingAssetId: (id: string | null) => void;
    applyMenuRef: React.RefObject<HTMLDivElement>;
    handleApplyAssetToBlock: (asset: PortfolioAsset, blockId: string, action: 'background' | 'mainImage' | 'addToGallery') => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = (props) => {
    const { t } = useTranslation();
    const BackIcon = props.direction === 'rtl' ? ArrowRight : ArrowLeft;

    return (
        <div className="bg-white dark:bg-slate-900 flex flex-col h-full">
            <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 bg-white dark:bg-slate-900 z-20">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => props.navigate('/dashboard')}>
                        <BackIcon className="w-4 h-4 me-2" />
                        <span className="hidden sm:inline">{t('backToList')}</span>
                    </Button>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { if (props.canUndo) props.undo() }} disabled={!props.canUndo}><Undo2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => { if (props.canRedo) props.redo() }} disabled={!props.canRedo}><Redo2 className="w-4 h-4" /></Button>

                        <Button onClick={props.setIsReviewModalOpen} variant="secondary" size="sm" className="!bg-amber-200/50 dark:!bg-amber-500/10 hover:!bg-amber-200/80 dark:hover:!bg-amber-500/20 !text-amber-700 dark:!text-amber-300">
                            <Award size={14} className="me-1.5" />
                            <span className="hidden sm:inline">{t('aiAssistant.getReview')}</span>
                        </Button>
                        <Button onClick={props.handleDelete} variant="danger" size="sm"><Trash2 className="w-4 h-4" /></Button>
                        <SaveButton onSave={props.handleSave} status={props.saveStatus} />
                    </div>
                </div>
                <input
                    type="text"
                    value={props.portfolio.title}
                    onChange={(e) => props.updateField('title', e.target.value)}
                    className="w-full text-2xl font-bold bg-transparent focus:outline-none mt-3 font-sora text-slate-900 dark:text-slate-50"
                    placeholder={t('untitledPortfolio')}
                />
            </header>
            
            <div className="flex-grow overflow-y-auto pb-24 md:pb-0">
                <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                    <nav className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        {['pages', 'content', 'design', 'assets'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => props.setActiveTab(tab as any)}
                                className={`w-1/4 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${props.activeTab === tab
                                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'
                                    }`}
                            >
                                {tab === 'pages' && <File size={16} />}
                                {tab === 'content' && <FileText size={16} />}
                                {tab === 'design' && <PaletteIcon size={16} />}
                                {tab === 'assets' && <ImageIcon size={16} />}
                                <span className="capitalize">{tab}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {props.activeTab === 'pages' && props.activePageId && (
                    <PagesPanel
                        pages={props.portfolio.pages}
                        activePageId={props.activePageId}
                        editingPageId={props.editingPageId}
                        addPage={props.addPage}
                        setActivePageId={props.setActivePageId}
                        setEditingPageId={props.setEditingPageId}
                        handleRenamePage={props.handleRenamePage}
                        setHomePage={props.setHomePage}
                        removePage={props.removePage}
                    />
                )}
                
                {props.activeTab === 'content' && props.activePage && (
                    <ContentPanel
                        activePage={props.activePage}
                        pages={props.portfolio.pages}
                        focusedBlockId={props.focusedBlockId}
                        setFocusedBlockId={props.setFocusedBlockId}
                        handleDragEnd={props.handleDragEnd}
                        setAddingBlockIndex={props.setAddingBlockIndex}
                        setActiveBlockId={props.setActiveBlockId}
                        updateBlock={props.updateBlock}
                        removeBlock={props.removeBlock}
                        handleDuplicateBlock={props.handleDuplicateBlock}
                        handleMoveBlock={props.handleMoveBlock}
                        handleMoveBlockToPage={props.handleMoveBlockToPage}
                        projects={props.projects}
                        skills={props.skills}
                        setEditingProject={props.setEditingProject}
                        handleSaveNewProject={props.handleSaveNewProject}
                        handleSaveNewSkill={props.handleSaveNewSkill}
                        creatingInBlockId={props.creatingInBlockId}
                        creationType={props.creationType}
                        setCreatingInBlockId={props.setCreatingInBlockId}
                        setCreationType={props.setCreationType}
                    />
                )}

                {props.activeTab === 'design' && (
                     <DesignPanel
                        portfolio={props.portfolio}
                        handleAIDesignSuggest={props.handleAIDesignSuggest}
                        isAIDesignLoading={props.isAIDesignLoading}
                        updatePortfolioImmediate={props.updatePortfolioImmediate}
                        updatePortfolioDebounced={props.updatePortfolioDebounced}
                        setEditingPalette={props.setEditingPalette}
                        handleDeletePalette={props.handleDeletePalette}
                    />
                )}

                {props.activeTab === 'assets' && (
                     <AssetsPanel
                        portfolio={props.portfolio}
                        activePage={props.activePage}
                        onAddAsset={props.onAddAsset}
                        setIsGeneratingAsset={props.setIsGeneratingAsset}
                        handleDeleteAsset={props.handleDeleteAsset}
                        setRegeneratingPrompt={props.setRegeneratingPrompt}
                        applyingAssetId={props.applyingAssetId}
                        setApplyingAssetId={props.setApplyingAssetId}
                        applyMenuRef={props.applyMenuRef}
                        handleApplyAssetToBlock={props.handleApplyAssetToBlock}
                    />
                )}
            </div>
        </div>
    );
};

export default EditorSidebar;