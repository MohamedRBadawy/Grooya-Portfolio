
import React from 'react';
import PublicPortfolioPage from '../../pages/PublicPortfolioPage';
import type { Portfolio, Page } from '../../types';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

export const PortfolioPreview: React.FC<{ 
    portfolio: Portfolio | null; 
    activePage: Page | null;
    activePageId: string | null;
    previewMode: 'desktop' | 'tablet' | 'mobile';
    setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
    onUpdateBlock: (blockId: string, field: string, value: any) => void;
    activeBlockId: string | null;
    setActiveBlockId: (id: string | null) => void;
    onDuplicateBlock: (id: string) => void;
    onMoveBlock: (id: string, direction: 'up' | 'down') => void;
    onDeleteBlock: (id: string) => void;
    onAIAssist?: () => void;
    isAIAssistLoading?: boolean;
    onTune?: (audience: string) => void;
    isTuning?: boolean;
    onPageLinkClick: (pageId: string) => void;
    focusedBlockId?: string | null;
    scrollContainerRef: React.RefObject<HTMLDivElement>;
}> = ({ portfolio, activePage, activePageId, previewMode, setPreviewMode, onUpdateBlock, activeBlockId, setActiveBlockId, onDuplicateBlock, onMoveBlock, onDeleteBlock, onAIAssist, isAIAssistLoading, onTune, isTuning, onPageLinkClick, focusedBlockId, scrollContainerRef }) => {
    
    if (!portfolio || !activePage) {
        return <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400">Loading Preview...</div>;
    }
    
    const MockPublicPage = () => <PublicPortfolioPage 
        portfolioForPreview={portfolio} 
        activePageForPreview={activePage}
        activePageId={activePageId}
        isEditable={true} 
        onUpdateBlock={onUpdateBlock}
        activeBlockId={activeBlockId}
        setActiveBlockId={setActiveBlockId}
        onDuplicateBlock={onDuplicateBlock}
        onMoveBlock={onMoveBlock}
        onDeleteBlock={onDeleteBlock}
        onAIAssist={onAIAssist}
        isAIAssistLoading={isAIAssistLoading}
        onTune={onTune}
        isTuning={isTuning}
        onPageLinkClick={onPageLinkClick}
        focusedBlockId={focusedBlockId}
        scrollContainerRef={scrollContainerRef}
    />;

    const previewWidths = {
        desktop: 'w-full',
        tablet: 'w-[900px] max-w-full',
        mobile: 'w-[430px] max-w-full',
    } as const;

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Live preview</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Check layout and hierarchy across device sizes before publishing.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                    {[
                        { key: 'desktop', label: 'Desktop', icon: Monitor },
                        { key: 'tablet', label: 'Tablet', icon: Tablet },
                        { key: 'mobile', label: 'Mobile', icon: Smartphone },
                    ].map((option) => {
                        const Icon = option.icon;
                        const active = previewMode === option.key;

                        return (
                            <button
                                key={option.key}
                                onClick={() => setPreviewMode(option.key as 'desktop' | 'tablet' | 'mobile')}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                                    active
                                        ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'
                                }`}
                            >
                                <Icon size={14} />
                                <span className="hidden sm:inline">{option.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="flex flex-1 items-start justify-center overflow-auto bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.08),_transparent_40%)] p-4 md:p-6">
                <div className={`h-full transition-all duration-200 ${previewWidths[previewMode]}`}>
                    <div ref={scrollContainerRef} className="h-full overflow-y-auto rounded-2xl border border-slate-200 bg-white pb-24 shadow-xl dark:border-slate-800 dark:bg-slate-950 md:pb-0">
                        <MockPublicPage />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPreview;
