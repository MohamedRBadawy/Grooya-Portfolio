import React, { useRef, useState, useEffect } from 'react';
import type { PortfolioBlock, Page } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Grip, MoreVertical, FilePenLine, Copy, ArrowRight, Trash2 } from 'lucide-react';

interface BlockListItemProps {
    block: PortfolioBlock;
    onFocus: (id: string) => void;
    onRemove: (id: string) => void;
    onDuplicate: (id: string) => void;
    onMoveBlockToPage: (blockId: string, targetPageId: string) => void;
    pages: Page[];
    activePageId: string;
}

const BlockListItem: React.FC<BlockListItemProps> = ({
    block, onFocus, onRemove, onDuplicate, onMoveBlockToPage, pages, activePageId
}) => {
    // FIX: Add resizeObserverConfig to useSortable to fix dnd-kit error.
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: block.id,
        resizeObserverConfig: {
            disabled: true,
        },
    });
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const otherPages = pages.filter(p => p.id !== activePageId);

    const menuMotionProps: any = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg touch-none flex items-center justify-between"
        >
            <div className="flex items-center">
                <button {...attributes} {...listeners} className="p-4 cursor-grab text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-s-lg">
                    <Grip size={16} />
                </button>
                <span className="font-medium capitalize text-slate-800 dark:text-slate-200">{t(`block.${block.type}`)}</span>
            </div>
            
            <div className="flex items-center gap-1 p-2">
                <button onClick={() => onFocus(block.id)} className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label={`Edit ${block.type} block`}>
                    <FilePenLine size={16} />
                </button>
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(p => !p)} className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="More options">
                        <MoreVertical size={16} />
                    </button>
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                {...menuMotionProps}
                                className="absolute top-full end-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 py-1"
                            >
                                <div className="relative group">
                                    <div className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200">
                                        <span>Move to Page...</span>
                                        <ArrowRight size={14} />
                                    </div>
                                    <div className="absolute top-0 left-full -mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-30 py-1 hidden group-hover:block">
                                        {otherPages.length > 0 ? otherPages.map(page => (
                                            <button key={page.id} onClick={() => { onMoveBlockToPage(block.id, page.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                {page.name}
                                            </button>
                                        )) : <span className="px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400">No other pages</span>}
                                    </div>
                                </div>
                                <button onClick={() => { onDuplicate(block.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                    <Copy size={14} /> {t('duplicate')}
                                </button>
                                <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                                <button onClick={() => { onRemove(block.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                                    <Trash2 size={14} /> {t('delete')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default BlockListItem;