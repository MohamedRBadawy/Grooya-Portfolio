
import React from 'react';
import type { Page } from '../../../types';
import Button from '../../ui/Button';
import { Plus, Edit, Trash2, Home } from 'lucide-react';

interface PagesPanelProps {
    pages: Page[];
    activePageId: string;
    editingPageId: string | null;
    addPage: () => void;
    setActivePageId: (id: string) => void;
    setEditingPageId: (id: string | null) => void;
    handleRenamePage: (pageId: string, newName: string) => void;
    updatePage: (pageId: string, updates: Partial<Page>) => void;
    setHomePage: (pageId: string) => void;
    removePage: (pageId: string) => void;
}

/**
 * A UI panel within the editor sidebar for managing a portfolio's pages.
 */
const PagesPanel: React.FC<PagesPanelProps> = ({
    pages,
    activePageId,
    editingPageId,
    addPage,
    setActivePageId,
    setEditingPageId,
    handleRenamePage,
    updatePage,
    setHomePage,
    removePage,
}) => {
    return (
        <div className="p-4 space-y-4">
            <Button onClick={addPage} variant="secondary" size="sm" className="w-full">
                <Plus size={14} className="me-2" /> Add New Page
            </Button>
            <div className="space-y-2">
                {pages.map(page => (
                    // This container represents a single page item in the list.
                    <div 
                        key={page.id} 
                        onClick={() => setActivePageId(page.id)} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${activePageId === page.id ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-grow">
                                {/* Conditional rendering: show an input field if the page is being edited. */}
                                {editingPageId === page.id ? (
                                    <input
                                        type="text"
                                        defaultValue={page.name}
                                        onBlur={(e) => handleRenamePage(page.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRenamePage(page.id, e.currentTarget.value);
                                            if (e.key === 'Escape') setEditingPageId(null);
                                        }}
                                        className="w-full bg-white dark:bg-slate-700 text-sm p-1 rounded-md"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{page.name}</p>
                                )}
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{page.path}</p>
                            </div>
                            {/* Action buttons for each page item */}
                            <div className="flex items-center gap-1">
                                <button onClick={(e) => { e.stopPropagation(); setHomePage(page.id); }} title="Set as Home Page" className={`p-2 rounded-full ${page.path === '/' ? 'text-teal-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>
                                    <Home size={16} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setEditingPageId(page.id); }} title="Rename Page" className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <Edit size={16} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); removePage(page.id); }} title="Delete Page" className="p-2 rounded-full text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        {activePageId === page.id && (
                            <div
                                className="mt-3 space-y-3 border-t border-slate-200 pt-3 dark:border-slate-700"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <label className="flex items-center justify-between gap-3 text-sm text-slate-700 dark:text-slate-300">
                                    <span>Show in navigation</span>
                                    <input
                                        type="checkbox"
                                        checked={page.showInNavigation !== false}
                                        onChange={(event) => updatePage(page.id, { showInNavigation: event.target.checked })}
                                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                    />
                                </label>
                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        SEO title
                                    </label>
                                    <input
                                        type="text"
                                        value={page.seoTitle || ''}
                                        onChange={(event) => updatePage(page.id, { seoTitle: event.target.value })}
                                        placeholder={`${page.name} | Grooya`}
                                        className="w-full rounded-md bg-white p-2 text-sm text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        SEO description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={page.seoDescription || ''}
                                        onChange={(event) => updatePage(page.id, { seoDescription: event.target.value })}
                                        placeholder="Summarize what this page is about and what the visitor should expect."
                                        className="w-full rounded-md bg-white p-2 text-sm text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PagesPanel;
