
import React from 'react';
import PublicPortfolioPage from '../../pages/PublicPortfolioPage';
import type { Portfolio, Page } from '../../types';

export const PortfolioPreview: React.FC<{ 
    portfolio: Portfolio | null; 
    activePage: Page | null;
    activePageId: string | null;
    onUpdateBlock: (blockId: string, field: string, value: any) => void;
    activeBlockId: string | null;
    setActiveBlockId: (id: string | null) => void;
    onDuplicateBlock: (id: string) => void;
    onMoveBlock: (id: string, direction: 'up' | 'down') => void;
    onDeleteBlock: (id: string) => void;
    onAIAssist: () => void;
    isAIAssistLoading: boolean;
    onTune: (audience: string) => void;
    isTuning: boolean;
    onPageLinkClick: (pageId: string) => void;
    focusedBlockId?: string | null;
    scrollContainerRef: React.RefObject<HTMLDivElement>;
}> = ({ portfolio, activePage, activePageId, onUpdateBlock, activeBlockId, setActiveBlockId, onDuplicateBlock, onMoveBlock, onDeleteBlock, onAIAssist, isAIAssistLoading, onTune, isTuning, onPageLinkClick, focusedBlockId, scrollContainerRef }) => {
    
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

    return (
        <div className="w-full h-full bg-white dark:bg-slate-950 rounded-lg shadow-inner overflow-hidden border border-slate-200 dark:border-slate-800">
            <div ref={scrollContainerRef} className="w-full h-full overflow-y-auto pb-24 md:pb-0">
                <MockPublicPage />
            </div>
        </div>
    );
};

export default PortfolioPreview;
