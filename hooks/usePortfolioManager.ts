
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM;
import { useHistoryState } from './useHistoryState';
import { useDebouncedCallback } from './useDebouncedCallback';
import { useData } from '../contexts/DataContext';
import type { Portfolio, PortfolioBlock, Page } from '../types';
import { arrayMove } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const usePortfolioManager = (portfolioId?: string) => {
    const navigate = useNavigate();
    const { getPortfolioById, updatePortfolio } = useData();

    const {
        state: portfolio,
        set: setPortfolioHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        setPresentOnly,
        reset: resetPortfolioHistory
    } = useHistoryState<Portfolio | null>(null);
    
    const [activePageId, setActivePageId] = useState<string | null>(null);
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // Load initial portfolio
    useEffect(() => {
        if (portfolioId) {
            const data = getPortfolioById(portfolioId);
            if (data) {
                resetPortfolioHistory(JSON.parse(JSON.stringify(data))); // Deep copy
                if (data.pages.length > 0 && !activePageId) {
                    setActivePageId(data.pages[0].id);
                }
            } else {
                navigate('/');
            }
        }
    }, [portfolioId, getPortfolioById, navigate, resetPortfolioHistory, activePageId]);

    const activePage = useMemo(() => {
        return portfolio?.pages.find(p => p.id === activePageId) || null;
    }, [portfolio, activePageId]);
    
    // --- Auto-saving logic ---
    const debouncedSave = useDebouncedCallback((p: Portfolio) => {
        updatePortfolio(p);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);

    const isFirstRender = React.useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (portfolio) {
            setSaveStatus('saving');
            debouncedSave(portfolio);
        }
    }, [portfolio, debouncedSave]);


    // --- State Update Handlers ---
    const updatePortfolioImmediate = useCallback((updater: (p: Portfolio) => Portfolio) => {
        if (!portfolio) return;
        const newPortfolio = updater(portfolio);
        setPresentOnly(newPortfolio);
        setPortfolioHistory(newPortfolio);
    }, [portfolio, setPresentOnly, setPortfolioHistory]);
    
    const debouncedSetHistory = useDebouncedCallback((p: Portfolio) => {
        setPortfolioHistory(p);
    }, 500);
    
    const updatePortfolioDebounced = useCallback((updater: (p: Portfolio) => Portfolio) => {
        if (!portfolio) return;
        const newPortfolio = updater(portfolio);
        setPresentOnly(newPortfolio);
        debouncedSetHistory(newPortfolio);
    }, [portfolio, setPresentOnly, debouncedSetHistory]);
    
    const savePortfolio = useCallback(() => {
        if (portfolio) {
            setSaveStatus('saving');
            debouncedSave.cancel(); // Cancel any pending auto-save
            updatePortfolio(portfolio);
            setTimeout(() => {
                setSaveStatus('saved');
                toast.success('Portfolio saved!');
                setTimeout(() => setSaveStatus('idle'), 2000);
            }, 500);
        }
    }, [portfolio, updatePortfolio, debouncedSave]);

    const updateField = useCallback(<K extends keyof Portfolio>(field: K, value: Portfolio[K]) => {
        updatePortfolioDebounced(p => ({ ...p, [field]: value }));
    }, [updatePortfolioDebounced]);

    const updateBlock = useCallback((blockId: string, newBlockData: any) => {
        if (!activePageId) return;
        updatePortfolioImmediate(p => ({
            ...p,
            pages: p.pages.map(page => 
                page.id === activePageId
                ? { ...page, blocks: page.blocks.map(b => b.id === blockId ? { ...b, ...newBlockData } : b) }
                : page
            )
        }));
    }, [activePageId, updatePortfolioImmediate]);
    
    const updateBlockField = useCallback((blockId: string, field: string, value: any) => {
        if (!activePageId) return;
        updatePortfolioDebounced(p => ({
            ...p,
            pages: p.pages.map(page => 
                page.id === activePageId
                ? { ...page, blocks: page.blocks.map(b => b.id === blockId ? { ...b, [field]: value } : b) }
                : page
            )
        }));
    }, [activePageId, updatePortfolioDebounced]);
    
    const addBlock = useCallback((type: PortfolioBlock['type'], index: number): PortfolioBlock | null => {
        if (!portfolio || !activePageId) return null;
        let newBlock: PortfolioBlock | null = null;
        const newBlockBase = { id: `block-${Date.now()}` };
        switch (type) {
            case 'hero': 
                newBlock = { ...newBlockBase, type, headline: 'Your Name or Compelling Headline', subheadline: 'Describe your core value proposition in one sentence.', imageUrl: '', ctaText: 'Contact Me', ctaLink: '#cta' }; break;
            case 'about':
                newBlock = { ...newBlockBase, type, title: 'About Me', content: 'Share your professional story, your passion, and what drives you. Highlight key experiences and skills that make you unique.' }; break;
            case 'projects':
                newBlock = { ...newBlockBase, type, title: 'Featured Projects', projectIds: [] }; break;
            case 'skills':
                newBlock = { ...newBlockBase, type, title: 'Core Competencies', skillIds: [] }; break;
            case 'gallery':
                newBlock = { ...newBlockBase, type, title: 'Visual Showcase', images: [{id: `img-${Date.now()}`, url: 'https://picsum.photos/seed/gallery1/800/600', caption: 'A descriptive caption'}], layout: 'grid' }; break;
            case 'testimonials':
                newBlock = { ...newBlockBase, type, title: 'What Others Say', testimonials: [{id: `test-${Date.now()}`, quote: '"Alex is a detail-oriented and talented engineer who consistently delivers high-quality work."', author: 'Jane Smith', authorTitle: 'Project Manager at TechCorp', authorAvatarUrl: 'https://picsum.photos/seed/avatar1/100/100'}] }; break;
            case 'video':
                newBlock = { ...newBlockBase, type, title: 'Project Demo or Introduction', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', caption: 'This video provides a walkthrough of the key features of my latest project.' }; break;
            case 'cta':
                newBlock = { ...newBlockBase, type, title: "Let's Build Something Great Together", subtitle: "Have a project in mind or just want to connect? I'd love to hear from you.", buttonText: 'Send a Message', buttonLink: 'mailto:your-email@example.com' }; break;
            case 'resume':
                    newBlock = { ...newBlockBase, type, title: 'View My Experience', description: 'For a detailed look at my work history, skills, and accomplishments, please download my resume.', fileUrl: '', buttonText: 'Download Resume' }; break;
            case 'links':
                newBlock = { ...newBlockBase, type, title: 'Follow My Work', links: [{id: `link-${Date.now()}`, platform: 'linkedin', url: 'https://linkedin.com/in/your-profile', text: 'LinkedIn'}] }; break;
            case 'experience':
                newBlock = { ...newBlockBase, type, title: 'My Experience', items: [{ id: `exp-${Date.now()}`, title: 'Job Title', company: 'Company Name', dateRange: 'Jan 2022 - Present', description: 'Describe your key responsibilities and accomplishments in this role.' }] }; break;
            case 'contact':
                newBlock = { ...newBlockBase, type, title: 'Contact Me', subtitle: 'I\'d love to hear from you. Fill out the form below.', buttonText: 'Send Message' }; break;
            case 'code':
                newBlock = { ...newBlockBase, type, title: 'Code Example', language: 'javascript', code: `// Your code here\nconsole.log('Hello, World!');` }; break;
            case 'services':
                newBlock = { ...newBlockBase, type, title: 'My Services', tiers: [{ id: `tier-${Date.now()}`, title: 'Basic Plan', price: '$99', frequency: '/mo', description: 'A great starting point for individuals and small teams.', features: ['10 Projects', '5GB Storage', 'Basic Support'], buttonText: 'Choose Plan', isFeatured: false }] }; break;
            case 'blog':
                newBlock = { ...newBlockBase, type, title: 'My Recent Articles', posts: [{ id: `post-${Date.now()}`, title: 'My First Post', excerpt: 'A short summary of what this article is about.', imageUrl: 'https://picsum.photos/seed/new-post/600/400', link: '#' }] }; break;
            default: return null;
        }

        if (newBlock) {
             const finalNewBlock = newBlock;
             updatePortfolioImmediate(p => ({
                ...p,
                pages: p.pages.map(page => {
                    if (page.id === activePageId) {
                        const newBlocks = [...page.blocks];
                        newBlocks.splice(index, 0, finalNewBlock);
                        return { ...page, blocks: newBlocks };
                    }
                    return page;
                })
             }));
        }
        return newBlock;
    }, [portfolio, activePageId, updatePortfolioImmediate]);
    
    const removeBlock = useCallback((blockId: string) => {
        if (!activePageId) return;
        updatePortfolioImmediate(p => ({
            ...p,
            pages: p.pages.map(page => 
                page.id === activePageId
                ? { ...page, blocks: page.blocks.filter(b => b.id !== blockId) }
                : page
            )
        }));
    }, [activePageId, updatePortfolioImmediate]);
    
    const handleDuplicateBlock = useCallback((blockId: string, activeBlockIdSetter: (id: string) => void) => {
        if (!activePage || !activePageId) return;
        updatePortfolioImmediate(p => {
            const pageToUpdate = p.pages.find(pg => pg.id === activePageId);
            if (!pageToUpdate) return p;
            
            const blockToDuplicate = pageToUpdate.blocks.find(b => b.id === blockId);
            if (!blockToDuplicate) return p;

            const newBlock = { ...JSON.parse(JSON.stringify(blockToDuplicate)), id: `block-${Date.now()}` };
            const index = pageToUpdate.blocks.findIndex(b => b.id === blockId);
            
            activeBlockIdSetter(newBlock.id);
            const newBlocks = [...pageToUpdate.blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            
            return {
                ...p,
                pages: p.pages.map(page => page.id === activePageId ? { ...page, blocks: newBlocks } : page)
            }
        });
    }, [activePage, activePageId, updatePortfolioImmediate]);
    
    const handleMoveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
        if (!activePage || !activePageId) return;
        updatePortfolioImmediate(p => {
            const pageToUpdate = p.pages.find(pg => pg.id === activePageId);
            if (!pageToUpdate) return p;
            
            const index = pageToUpdate.blocks.findIndex(b => b.id === blockId);
            if (index === -1) return p;

            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= pageToUpdate.blocks.length) return p;

            const newBlocks = arrayMove(pageToUpdate.blocks, index, newIndex);
            return {
                ...p,
                pages: p.pages.map(page => page.id === activePageId ? { ...page, blocks: newBlocks } : page)
            };
        });
    }, [activePage, activePageId, updatePortfolioImmediate]);
    
    const handleMoveBlockToPage = useCallback((blockId: string, targetPageId: string) => {
        if (!portfolio || !activePageId) return;
        updatePortfolioImmediate(p => {
            const sourcePage = p.pages.find(page => page.id === activePageId);
            const targetPage = p.pages.find(page => page.id === targetPageId);
            const blockToMove = sourcePage?.blocks.find(b => b.id === blockId);

            if (!sourcePage || !targetPage || !blockToMove) return p;

            const newSourceBlocks = sourcePage.blocks.filter(b => b.id !== blockId);
            const newTargetBlocks = [...targetPage.blocks, blockToMove];
            
            return {
                ...p,
                pages: p.pages.map(page => {
                    if (page.id === activePageId) return { ...page, blocks: newSourceBlocks };
                    if (page.id === targetPageId) return { ...page, blocks: newTargetBlocks };
                    return page;
                })
            };
        });
    }, [portfolio, activePageId, updatePortfolioImmediate]);

    const handleDragEnd = useCallback((event: any) => {
        if (!activePage || !activePageId) return;
        const {active, over} = event;
        if (active.id !== over.id) {
            updatePortfolioImmediate(p => {
                const pageToUpdate = p.pages.find(pg => pg.id === activePageId);
                 if (!pageToUpdate) return p;
                
                const oldIndex = pageToUpdate.blocks.findIndex(b => b.id === active.id);
                const newIndex = pageToUpdate.blocks.findIndex(b => b.id === over.id);
                const newBlocks = arrayMove(pageToUpdate.blocks, oldIndex, newIndex);
                return { ...p, pages: p.pages.map(page => page.id === activePageId ? { ...page, blocks: newBlocks } : page) };
            });
        }
    }, [activePage, activePageId, updatePortfolioImmediate]);
    
    // --- Page Management ---
    const addPage = useCallback(() => {
        const newPageName = 'New Page';
        const newPage: Page = {
            id: `page-${Date.now()}`,
            name: newPageName,
            path: `/${slugify(newPageName)}-${Math.random().toString(36).substring(2, 7)}`,
            blocks: [],
        };
        updatePortfolioImmediate(p => ({ ...p, pages: [...p.pages, newPage] }));
        setActivePageId(newPage.id);
        setEditingPageId(newPage.id);
    }, [updatePortfolioImmediate]);

    const removePage = useCallback((pageId: string) => {
        if (!portfolio) return;
        if (portfolio.pages.length <= 1) {
            toast.error("You cannot delete the last page.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this page and all its content?")) {
            updatePortfolioImmediate(p => {
                const newPages = p.pages.filter(page => page.id !== pageId);
                if (!newPages.some(page => page.path === '/')) {
                    newPages[0].path = '/';
                }
                if (activePageId === pageId) {
                    setActivePageId(newPages.find(p => p.path === '/')!.id);
                }
                return { ...p, pages: newPages };
            });
        }
    }, [portfolio, activePageId, updatePortfolioImmediate]);

    const updatePage = useCallback((pageId: string, updates: Partial<Page>) => {
        updatePortfolioImmediate(p => ({ ...p, pages: p.pages.map(page => page.id === pageId ? { ...page, ...updates } : page) }));
    }, [updatePortfolioImmediate]);
    
    const handleRenamePage = useCallback((pageId: string, newName: string) => {
        const page = portfolio?.pages.find(p => p.id === pageId);
        if (!page) return;
        
        const newPath = page.path === '/' ? '/' : `/${slugify(newName)}`;
        
        if (portfolio?.pages.some(p => p.path === newPath && p.id !== pageId)) {
            toast.error(`A page with path "${newPath}" already exists. Please choose a different name.`);
            return;
        }
        
        updatePage(pageId, { name: newName, path: newPath });
        setEditingPageId(null);
    }, [portfolio, updatePage]);

    const setHomePage = useCallback((pageId: string) => {
        if (!portfolio) return;
        const currentHomePage = portfolio.pages.find(p => p.path === '/');
        if (currentHomePage?.id === pageId) return;

        updatePortfolioImmediate(p => ({
            ...p,
            pages: p.pages.map(page => {
                if (page.id === pageId) return { ...page, path: '/' };
                if (page.id === currentHomePage?.id) return { ...page, path: `/${slugify(page.name)}` };
                return page;
            })
        }));
    }, [portfolio, updatePortfolioImmediate]);


    return {
        portfolio, savePortfolio, activePage, activePageId, setActivePageId, editingPageId, setEditingPageId,
        undo, redo, canUndo, canRedo, saveStatus,
        updatePortfolioImmediate, updatePortfolioDebounced, updateField, updateBlock, updateBlockField,
        addBlock, removeBlock, handleDuplicateBlock, handleMoveBlock, handleMoveBlockToPage, handleDragEnd,
        addPage, removePage, handleRenamePage, setHomePage,
    };
}