import React from 'react';
import type { Portfolio, PortfolioBlock } from '../../types';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useApp } from '../../contexts/LocalizationContext';

interface FloatingDotsNavProps {
    blocks: PortfolioBlock[];
    design: Portfolio['design'];
    scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

const getBlockTitle = (block: PortfolioBlock): string => {
     if ('title' in block && block.title) {
        return block.title;
    }
    return block.type.charAt(0).toUpperCase() + block.type.slice(1);
};


const FloatingDotsNav: React.FC<FloatingDotsNavProps> = ({ blocks, design, scrollContainerRef }) => {
    const { direction } = useApp();
    const blockIds = React.useMemo(() => blocks.map(b => b.id), [blocks]);
    const activeId = useScrollSpy(blockIds, { rootMargin: '-50% 0px -50% 0px' }, scrollContainerRef);
    
    const positionClass = direction === 'rtl' ? 'left-4' : 'right-4';

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, blockId: string) => {
        e.preventDefault();
        const targetElement = document.getElementById(blockId);
        if (!targetElement) return;

        const container = scrollContainerRef?.current;
        if (container) {
            const containerRect = container.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            const scrollTop = container.scrollTop;
            const top = targetRect.top - containerRect.top + scrollTop;

            container.scrollTo({
                top: top,
                behavior: 'smooth',
            });
        } else {
            // Fallback for when no container is specified (e.g., public page)
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className={`fixed top-1/2 -translate-y-1/2 ${positionClass} z-40`}>
            <ul className="space-y-3">
                {blocks.map(block => (
                    <li key={block.id} className="group relative">
                        <a
                            href={`#${block.id}`}
                            onClick={(e) => handleClick(e, block.id)}
                            className="block w-3 h-3 rounded-full transition-all duration-300"
                            style={{
                                backgroundColor: activeId === block.id ? design.accentColor : 'rgba(100, 116, 139, 0.4)', // slate-500 with alpha
                                transform: activeId === block.id ? 'scale(1.2)' : 'scale(0.8)',
                            }}
                            aria-label={`Scroll to ${getBlockTitle(block)}`}
                        >
                        </a>
                        <div
                           className={`absolute top-1/2 -translate-y-1/2 ${direction === 'rtl' ? 'right-full mr-3' : 'left-full ml-3'} w-max bg-slate-900 text-slate-50 text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}
                        >
                            {getBlockTitle(block)}
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default FloatingDotsNav;