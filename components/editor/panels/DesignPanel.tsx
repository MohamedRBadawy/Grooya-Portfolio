
import React, { useState } from 'react';
import type { Portfolio, Palette, ColorTheme, FontWeight, LineHeight, LetterSpacing, FontSize, PageWidth, Spacing, CornerRadius, ShadowStyle, ButtonStyle, AnimationStyle, NavigationStyle, DesignPreset, NavLinkItem, Page, BorderStyle } from '../../../types';
import Button from '../../ui/Button';
import { EditorLabel, EditorTextarea, EditorInput } from '../../ui/editor/EditorControls';
import { useTranslation } from '../../../hooks/useTranslation';
import { defaultPalettes } from '../../../services/palettes';
import { Sparkles, Edit, Trash2, Plus, Pipette, ChevronRight, GripVertical, CornerDownRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// A reusable button component for design settings.
const DesignSettingButton: React.FC<{onClick: () => void, isActive: boolean, children: React.ReactNode}> = ({ onClick, isActive, children }) => (
    <button onClick={onClick} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${isActive ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
        {children}
    </button>
);

// A reusable select component for design settings.
const DesignSelect: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }> = ({ label, value, onChange, children }) => (
    <select 
        value={value}
        onChange={onChange}
        className="block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100"
        aria-label={label}
    >
        {children}
    </select>
);

// A reusable collapsible section component.
const DetailsSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => (
    <details className="border-t border-slate-200 dark:border-slate-700" open={defaultOpen}>
        <summary className="py-4 cursor-pointer list-none flex justify-between items-center">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
            <ChevronRight size={16} className="details-arrow text-slate-500" />
        </summary>
        <div className="pb-6 space-y-6">
            {children}
        </div>
    </details>
);

const SortableNavLinkItem: React.FC<{
    item: NavLinkItem,
    pages: Page[],
    onUpdate: (id: string, updates: Partial<NavLinkItem>) => void,
    onRemove: (id: string) => void,
}> = ({ item, pages, onUpdate, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    const targetPage = pages.find(p => p.id === item.targetPageId);
    const isSectionLink = !!item.targetBlockId;

    return (
         <div ref={setNodeRef} style={style} className={`relative touch-none ${isSectionLink ? 'pl-6' : ''}`}>
            {isSectionLink && <CornerDownRight size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />}
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex gap-2">
                 <button {...attributes} {...listeners} className="p-2 cursor-grab text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md self-center">
                    <GripVertical size={16} />
                </button>
                <div className="flex-grow space-y-2">
                    <EditorInput placeholder="Link Label" value={item.label} onChange={e => onUpdate(item.id, { label: e.target.value })}/>
                    <div className="grid grid-cols-2 gap-2">
                        <select 
                            value={item.targetPageId} 
                            onChange={e => onUpdate(item.id, { targetPageId: e.target.value, targetBlockId: undefined })} 
                            className="block w-full text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                            aria-label="Target Page"
                        >
                            {pages.map(page => <option key={page.id} value={page.id}>{page.name}</option>)}
                        </select>
                         <select 
                            value={item.targetBlockId || ''} 
                            onChange={e => onUpdate(item.id, { targetBlockId: e.target.value || undefined })} 
                            className="block w-full text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500" 
                            disabled={!targetPage}
                            aria-label="Target Section"
                         >
                            <option value="">Page Link (No Section)</option>
                            {targetPage?.blocks.map(block => <option key={block.id} value={block.id}>{ (block as any).title || block.type}</option>)}
                        </select>
                    </div>
                </div>
                 <Button variant="ghost" size="sm" className="p-2 h-auto text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 self-center" onClick={() => onRemove(item.id)} aria-label="Remove link"><Trash2 size={16} /></Button>
            </div>
        </div>
    )
}


interface DesignPanelProps {
    portfolio: Portfolio;
    handleAIDesignSuggest: () => void;
    isAIDesignLoading: boolean;
    updatePortfolioImmediate: (updater: (p: Portfolio) => Portfolio) => void;
    updatePortfolioDebounced: (updater: (p: Portfolio) => Portfolio) => void;
    setEditingPalette: (palette: Palette | 'new' | null) => void;
    handleDeletePalette: (paletteId: string) => void;
}

/**
 * A UI panel within the editor sidebar for managing the portfolio's global design settings.
 */
const DesignPanel: React.FC<DesignPanelProps> = ({
    portfolio,
    handleAIDesignSuggest,
    isAIDesignLoading,
    updatePortfolioImmediate,
    updatePortfolioDebounced,
    setEditingPalette,
    handleDeletePalette
}) => {
    const { t } = useTranslation();
    const [isSavingPreset, setIsSavingPreset] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');

    // Define the available options for fonts and colors.
    const headingFonts = ['Sora', 'Poppins', 'Montserrat', 'Playfair Display', 'Lora', 'Raleway', 'EB Garamond'];
    const bodyFonts = ['Inter', 'Lato', 'Open Sans', 'Lora', 'Merriweather', 'Roboto', 'Noto Sans'];
    const accentColorPresets = ['#14b8a6', '#2dd4bf', '#e11d48', '#f59e0b', '#fbbf24', '#d97706'];
    const allPalettes = [...defaultPalettes, ...(portfolio.customPalettes || [])];

    const handleSavePreset = () => {
        if (!newPresetName.trim()) {
            toast.error("Please enter a name for the preset.");
            return;
        }

        const newPreset: DesignPreset = {
            id: `preset-${Date.now()}`,
            name: newPresetName,
            design: { ...portfolio.design } // Copy the current design
        };

        updatePortfolioImmediate(p => ({
            ...p,
            designPresets: [...(p.designPresets || []), newPreset]
        }));

        setNewPresetName('');
        setIsSavingPreset(false);
        toast.success("Design preset saved!");
    };

    const handleApplyPreset = (preset: DesignPreset) => {
        updatePortfolioImmediate(p => ({
            ...p,
            design: { ...preset.design }
        }));
        toast.success(`'${preset.name}' preset applied!`);
    };

    const handleDeletePreset = (presetId: string) => {
        toast((toastInstance) => (
            <div className="flex flex-col items-start gap-3">
                <span className="font-medium">{t('deletePresetConfirm')}</span>
                <div className="flex gap-2 self-stretch">
                    <Button variant="danger" size="sm" className="flex-grow" onClick={() => {
                        updatePortfolioImmediate(p => ({
                            ...p,
                            designPresets: (p.designPresets || []).filter(preset => preset.id !== presetId)
                        }));
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

    // --- Navigation Link Handlers ---
    const navLinks = portfolio.design.customNavigation || [];

    const handleAddNavLink = () => {
        const newLink: NavLinkItem = {
            id: `nav-${Date.now()}`,
            label: 'New Link',
            targetPageId: portfolio.pages[0]?.id,
        };
        updatePortfolioImmediate(p => ({
            ...p,
            design: {
                ...p.design,
                customNavigation: [...(p.design.customNavigation || []), newLink]
            }
        }));
    };

    const handleUpdateNavLink = (id: string, updates: Partial<NavLinkItem>) => {
        updatePortfolioDebounced(p => ({
            ...p,
            design: {
                ...p.design,
                customNavigation: (p.design.customNavigation || []).map(link => link.id === id ? { ...link, ...updates } : link)
            }
        }));
    };

    const handleRemoveNavLink = (id: string) => {
         updatePortfolioImmediate(p => ({
            ...p,
            design: {
                ...p.design,
                customNavigation: (p.design.customNavigation || []).filter(link => link.id !== id)
            }
        }));
    };
    
    const handleDesignChange = (field: keyof Portfolio['design'], value: any) => {
        updatePortfolioDebounced(p => ({ ...p, design: { ...p.design, [field]: value } }));
    };

    const handleImmediateDesignChange = (field: keyof Portfolio['design'], value: any) => {
        updatePortfolioImmediate(p => ({ ...p, design: { ...p.design, [field]: value } }));
    };
    
    const handleHeaderBorderChange = (field: keyof BorderStyle, value: any) => {
        const currentBorder = portfolio.design.headerBorderStyle || { width: 0, style: 'solid', color: '#e2e8f0' };
        const newBorder = { ...currentBorder, [field]: value };
        handleDesignChange('headerBorderStyle', newBorder);
    };

    const sensors = useSensors(useSensor(PointerSensor));
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            updatePortfolioImmediate(p => {
                const oldNav = p.design.customNavigation || [];
                const oldIndex = oldNav.findIndex(item => item.id === active.id);
                const newIndex = oldNav.findIndex(item => item.id === over.id);
                const newNav = arrayMove(oldNav, oldIndex, newIndex);
                return { ...p, design: { ...p.design, customNavigation: newNav }};
            });
        }
    };


    return (
        <div className="p-4 space-y-4">
            {/* AI Design Assistant Section */}
            <div className="p-4 bg-gradient-to-br from-amber-100/30 to-teal-100/30 dark:from-amber-500/10 dark:to-teal-500/10 rounded-lg border border-amber-200 dark:border-amber-700/30">
                <h4 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">AI Design Assistant</h4>
                <p className="text-sm text-slate-800 dark:text-slate-400 mb-3">Let AI suggest a theme, font, and color based on your professional title.</p>
                <Button onClick={handleAIDesignSuggest} variant="secondary" size="sm" className="w-full" disabled={isAIDesignLoading}>
                    {isAIDesignLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-700 dark:text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <Sparkles size={16} className="me-2 text-amber-500 dark:text-amber-400" />
                    )}
                    {isAIDesignLoading ? 'Generating...' : 'Suggest a Design'}
                </Button>
            </div>
            
            <DetailsSection title="Theme & Colors" defaultOpen>
                <div>
                    <EditorLabel>Color Palette</EditorLabel>
                     <div className="grid grid-cols-2 gap-3">
                        {allPalettes.map(palette => {
                            const isSelected = portfolio.design.paletteId === palette.id;
                            return (
                                <div key={palette.id} className="relative group">
                                    <button onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, paletteId: palette.id}}))} className={`w-full p-3 border-2 rounded-lg cursor-pointer transition-colors text-left ${isSelected ? 'border-teal-500' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {[palette.colors.background, palette.colors.cardBackground, palette.colors.heading, portfolio.design.accentColor].map((color, i) => <div key={i} className="w-5 h-5 rounded-full border border-slate-300/50 dark:border-slate-500/50" style={{backgroundColor: color}}></div>)}
                                        </div>
                                        <span className="font-medium text-sm text-slate-800 dark:text-slate-300">{palette.name}</span>
                                    </button>
                                    {!palette.id.startsWith('default-') && (
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="secondary" size="sm" className="w-6 h-6 p-0" onClick={() => setEditingPalette(palette)}><Edit size={12} /></Button>
                                            <Button variant="danger" size="sm" className="w-6 h-6 p-0" onClick={() => handleDeletePalette(palette.id)}><Trash2 size={12} /></Button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <Button variant="secondary" size="sm" className="w-full mt-3" onClick={() => setEditingPalette('new')}>
                        <Plus size={14} className="me-2"/> Create Custom Palette
                    </Button>
                </div>
                 <div>
                   <EditorLabel>{t('accentColor')}</EditorLabel>
                   <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                            <input type="color" value={portfolio.design.accentColor} onChange={(e) => updatePortfolioDebounced(p => ({...p, design: {...p.design, accentColor: e.target.value}}))} className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"/>
                            <div className="w-full h-full rounded-full border-2 border-slate-200 dark:border-slate-700" style={{backgroundColor: portfolio.design.accentColor}}></div>
                            <Pipette size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 pointer-events-none" />
                        </div>
                       <div className="flex flex-wrap gap-2">
                           {accentColorPresets.map(color => (
                              <button key={color} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, accentColor: color}}))} className={`w-8 h-8 rounded-full border-2 ${portfolio.design.accentColor.toLowerCase() === color.toLowerCase() ? 'border-teal-500' : 'border-transparent'}`} style={{backgroundColor: color}}></button>
                           ))}
                       </div>
                   </div>
                </div>
            </DetailsSection>
            
            <DetailsSection title="Navigation">
                <div className="space-y-3">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={navLinks.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            {navLinks.map(item => (
                                <SortableNavLinkItem 
                                    key={item.id}
                                    item={item}
                                    pages={portfolio.pages}
                                    onUpdate={handleUpdateNavLink}
                                    onRemove={handleRemoveNavLink}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
                <Button variant="secondary" size="sm" className="w-full mt-3" onClick={handleAddNavLink}>
                    <Plus size={14} className="me-2"/> Add Navigation Link
                </Button>
            </DetailsSection>

            <DetailsSection title="Header & Navigation Styling">
                <div>
                    <EditorLabel>Background Color</EditorLabel>
                    <EditorInput value={portfolio.design.headerBackgroundColor || ''} onChange={e => handleDesignChange('headerBackgroundColor', e.target.value)} placeholder="e.g., #FFFFFF or rgba(255,255,255,0.5)"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                        <EditorLabel>Link Color</EditorLabel>
                        <input type="color" value={portfolio.design.headerLinkColor || '#334155'} onChange={e => handleDesignChange('headerLinkColor', e.target.value)} className="w-full h-10" />
                    </div>
                     <div>
                        <EditorLabel>Link Hover Color</EditorLabel>
                        <input type="color" value={portfolio.design.headerLinkHoverColor || '#14b8a6'} onChange={e => handleDesignChange('headerLinkHoverColor', e.target.value)} className="w-full h-10" />
                    </div>
                     <div>
                        <EditorLabel>Active Link Color</EditorLabel>
                        <input type="color" value={portfolio.design.headerActiveLinkColor || '#0d9488'} onChange={e => handleDesignChange('headerActiveLinkColor', e.target.value)} className="w-full h-10" />
                    </div>
                </div>
                <div>
                    <EditorLabel>Bottom Border</EditorLabel>
                    <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <input 
                            type="number"
                            min="0"
                            max="10"
                            value={portfolio.design.headerBorderStyle?.width ?? 0}
                            onChange={(e) => handleHeaderBorderChange('width', parseInt(e.target.value) || 0)}
                            className="w-16 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md p-1.5 text-sm"
                        />
                         <select value={portfolio.design.headerBorderStyle?.style || 'solid'} onChange={e => handleHeaderBorderChange('style', e.target.value)} className="flex-grow bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md p-1.5 text-sm">
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                        </select>
                        <input type="color" value={portfolio.design.headerBorderStyle?.color || '#e2e8f0'} onChange={e => handleHeaderBorderChange('color', e.target.value)} className="h-8 rounded-md" />
                    </div>
                </div>
            </DetailsSection>

            <DetailsSection title="Global Background">
                <div>
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Global Gradient</span>
                        <input 
                            type="checkbox" 
                            checked={!!portfolio.design.globalGradient}
                            onChange={e => {
                                const isEnabled = e.target.checked;
                                updatePortfolioImmediate(p => ({
                                    ...p,
                                    design: {
                                        ...p.design,
                                        globalGradient: isEnabled 
                                            ? { direction: 90, color1: '#f0fdfa', color2: '#fefce8' } 
                                            : undefined
                                    }
                                }));
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                    </label>
                    {portfolio.design.globalGradient && (
                        <div className="mt-4 space-y-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <div>
                                <EditorLabel>Direction ({portfolio.design.globalGradient.direction}°)</EditorLabel>
                                <input 
                                    type="range" min="0" max="360" 
                                    value={portfolio.design.globalGradient.direction} 
                                    onChange={e => updatePortfolioDebounced(p => ({ ...p, design: { ...p.design, globalGradient: { ...p.design.globalGradient!, direction: parseInt(e.target.value) }}}))} 
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <EditorLabel>Color 1</EditorLabel>
                                    <input type="color" value={portfolio.design.globalGradient.color1} onChange={e => updatePortfolioDebounced(p => ({ ...p, design: { ...p.design, globalGradient: { ...p.design.globalGradient!, color1: e.target.value }}}))} className="w-full h-10 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent" />
                                </div>
                                <div>
                                    <EditorLabel>Color 2</EditorLabel>
                                    <input type="color" value={portfolio.design.globalGradient.color2} onChange={e => updatePortfolioDebounced(p => ({ ...p, design: { ...p.design, globalGradient: { ...p.design.globalGradient!, color2: e.target.value }}}))} className="w-full h-10 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DetailsSection>
            
            <DetailsSection title={t('designPresets')}>
                <div className="space-y-3">
                    {(portfolio.designPresets || []).map(preset => (
                        <div key={preset.id} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{preset.name}</span>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="secondary" onClick={() => handleApplyPreset(preset)}>{t('applyPreset')}</Button>
                                <Button size="sm" variant="ghost" className="text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 !p-2" onClick={() => handleDeletePreset(preset.id)}>
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {isSavingPreset ? (
                        <div className="p-3 bg-slate-200 dark:bg-slate-700/50 rounded-lg space-y-2">
                            <EditorLabel htmlFor="presetName">{t('presetName')}</EditorLabel>
                            <EditorInput 
                                id="presetName" 
                                value={newPresetName} 
                                onChange={e => setNewPresetName(e.target.value)}
                                placeholder="e.g., Minimal Dark"
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="secondary" onClick={() => { setIsSavingPreset(false); setNewPresetName(''); }}>{t('cancel')}</Button>
                                <Button size="sm" variant="primary" onClick={handleSavePreset}>{t('savePreset')}</Button>
                            </div>
                        </div>
                    ) : (
                        <Button variant="secondary" size="sm" className="w-full" onClick={() => setIsSavingPreset(true)}>
                            <Plus size={14} className="me-2" /> {t('saveCurrentDesign')}
                        </Button>
                    )}
                </div>
            </DetailsSection>
            
            <DetailsSection title="Typography">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <EditorLabel>{t('headingFont')}</EditorLabel>
                        <DesignSelect label="Heading Font" value={portfolio.design.headingFont} onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, headingFont: e.target.value}}))}>
                            {headingFonts.map(font => <option key={font} value={font}>{font}</option>)}
                        </DesignSelect>
                    </div>
                    <div>
                        <EditorLabel>{t('bodyFont')}</EditorLabel>
                        <DesignSelect label="Body Font" value={portfolio.design.bodyFont} onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, bodyFont: e.target.value}}))}>
                            {bodyFonts.map(font => <option key={font} value={font}>{font}</option>)}
                        </DesignSelect>
                    </div>
                    <div>
                        <EditorLabel>Heading Weight</EditorLabel>
                        <DesignSelect label="Heading Font Weight" value={portfolio.design.fontWeightHeading} onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, fontWeightHeading: e.target.value as FontWeight}}))}>
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                        </DesignSelect>
                    </div>
                    <div>
                        <EditorLabel>Body Weight</EditorLabel>
                        <DesignSelect label="Body Font Weight" value={portfolio.design.fontWeightBody} onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, fontWeightBody: e.target.value as FontWeight}}))}>
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                        </DesignSelect>
                    </div>
                    <div className="md:col-span-2">
                        <EditorLabel>{t('fontSize')}</EditorLabel>
                        <div className="flex items-center gap-2">
                            {(['sm', 'md', 'lg'] as FontSize[]).map(size => (
                                <DesignSettingButton key={size} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, fontSize: size}}))} isActive={portfolio.design.fontSize === size}>
                                    {t(`fontSize.${size}`)}
                                </DesignSettingButton>
                            ))}
                       </div>
                    </div>
                     <div>
                        <EditorLabel>Line Height</EditorLabel>
                        <DesignSelect label="Line Height" value={portfolio.design.lineHeight} onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, lineHeight: e.target.value as LineHeight}}))}>
                            <option value="tight">Tight</option>
                            <option value="normal">Normal</option>
                            <option value="relaxed">Relaxed</option>
                        </DesignSelect>
                    </div>
                    <div>
                        <EditorLabel>Heading Spacing</EditorLabel>
                        <DesignSelect label="Letter Spacing" value={portfolio.design.letterSpacing} onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, letterSpacing: e.target.value as LetterSpacing}}))}>
                            <option value="normal">Normal</option>
                            <option value="wide">Wide</option>
                        </DesignSelect>
                    </div>
                </div>
                 <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                    <EditorLabel>Link Style</EditorLabel>
                    <div className="flex items-center gap-2">
                        {(['none', 'underline', 'underlineOnHover'] as const).map(style => (
                            <DesignSettingButton 
                                key={style} 
                                onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, linkStyle: style}}))} 
                                isActive={(portfolio.design.linkStyle || 'underlineOnHover') === style}
                            >
                                <span className="capitalize">{style === 'underlineOnHover' ? 'Underline on Hover' : style}</span>
                            </DesignSettingButton>
                        ))}
                    </div>
                </div>
            </DetailsSection>
            
            <DetailsSection title="Layout & Spacing">
                <div>
                   <EditorLabel>{t('pageWidth')}</EditorLabel>
                   <div className="flex items-center gap-2">
                        {(['standard', 'full'] as PageWidth[]).map(width => (
                            <DesignSettingButton key={width} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, pageWidth: width}}))} isActive={portfolio.design.pageWidth === width}>
                                <span className="capitalize">{t(`pageWidth.${width}`)}</span>
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                <div>
                   <EditorLabel>{t('spacing')}</EditorLabel>
                   <div className="flex items-center gap-2">
                        {(['compact', 'cozy', 'spacious'] as Spacing[]).map(spacing => (
                            <DesignSettingButton key={spacing} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, spacing}}))} isActive={portfolio.design.spacing === spacing}>
                                <span className="capitalize">{spacing}</span>
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                 <div>
                   <EditorLabel>{t('gridGap')}</EditorLabel>
                   <div className="flex items-center gap-2">
                        {(['compact', 'cozy', 'spacious'] as Spacing[]).map(spacing => (
                            <DesignSettingButton key={spacing} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, gridGap: spacing}}))} isActive={(portfolio.design.gridGap || 'cozy') === spacing}>
                                <span className="capitalize">{spacing}</span>
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                 <div>
                   <EditorLabel>{t('cornerRadius')}</EditorLabel>
                   <div className="flex items-center gap-2">
                        {(['none', 'sm', 'md', 'lg'] as CornerRadius[]).map(radius => (
                            <DesignSettingButton key={radius} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, cornerRadius: radius}}))} isActive={portfolio.design.cornerRadius === radius}>
                                <span className="uppercase">{radius}</span>
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                <div>
                   <EditorLabel>Card Shadow</EditorLabel>
                   <div className="flex items-center gap-2">
                        {(['none', 'sm', 'md', 'lg'] as ShadowStyle[]).map(shadow => (
                            <DesignSettingButton key={shadow} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, shadowStyle: shadow}}))} isActive={portfolio.design.shadowStyle === shadow}>
                                <span className="capitalize">{shadow}</span>
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
            </DetailsSection>

            <DetailsSection title="UI Elements">
                <div>
                   <EditorLabel>{t('buttonStyle')}</EditorLabel>
                   <div className="flex items-center gap-2">
                        {(['rounded', 'pill', 'square'] as ButtonStyle[]).map(style => (
                            <DesignSettingButton key={style} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, buttonStyle: style}}))} isActive={portfolio.design.buttonStyle === style}>
                                <span className="capitalize">{t(`buttonStyle.${style}`)}</span>
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                 <div>
                   <EditorLabel>Button Fill Style</EditorLabel>
                   <div className="flex items-center gap-2">
                        {(['solid', 'outline'] as const).map(style => (
                            <DesignSettingButton key={style} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, buttonFillStyle: style}}))} isActive={(portfolio.design.buttonFillStyle || 'solid') === style}>
                                <span className="capitalize">{style}</span>
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                <div>
                   <EditorLabel>Button Hover Effect</EditorLabel>
                   <div className="flex items-center gap-2">
                        {(['none', 'lift', 'scale'] as const).map(effect => (
                            <DesignSettingButton key={effect} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, buttonHoverEffect: effect}}))} isActive={(portfolio.design.buttonHoverEffect || 'none') === effect}>
                                <span className="capitalize">{effect}</span>
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                <div>
                    <EditorLabel>Card Border Style</EditorLabel>
                    <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <input 
                            type="number"
                            min="0"
                            max="10"
                            value={portfolio.design.cardBorderStyle?.width ?? 1}
                            onChange={(e) => updatePortfolioImmediate(p => ({...p, design: {...p.design, cardBorderStyle: {...p.design.cardBorderStyle, width: parseInt(e.target.value) || 0, style: p.design.cardBorderStyle?.style || 'solid' }}}))}
                            className="w-16 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md p-1.5 text-sm"
                        />
                        <div className="flex-grow flex gap-1">
                            {(['solid', 'dashed', 'dotted'] as const).map(style => (
                                <button key={style} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, cardBorderStyle: {...p.design.cardBorderStyle, width: p.design.cardBorderStyle?.width ?? 1, style: style}}}))} className={`flex-1 text-xs py-1.5 rounded-md capitalize ${ (portfolio.design.cardBorderStyle?.style || 'solid') === style ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold' : 'bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-600' }`}>
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </DetailsSection>
            
            <DetailsSection title="Navigation & Effects">
                <div>
                   <EditorLabel>{t('navigationStyle')}</EditorLabel>
                   <div className="flex items-center flex-wrap gap-2">
                        {(['none', 'stickyHeader', 'minimalHeader', 'floatingDots'] as NavigationStyle[]).map(style => (
                            <DesignSettingButton key={style} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, navigationStyle: style}}))} isActive={portfolio.design.navigationStyle === style}>
                                {t(`navigation.${style}`)}
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                 <div>
                   <EditorLabel>Navigation Alignment</EditorLabel>
                   <div className="flex items-center flex-wrap gap-2">
                        {(['left', 'center', 'right'] as const).map(align => (
                            <DesignSettingButton key={align} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, navAlignment: align}}))} isActive={(portfolio.design.navAlignment || 'right') === align}>
                                <span className="capitalize">{align}</span>
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                 <div>
                   <EditorLabel>{t('logoPosition')}</EditorLabel>
                   <div className="flex items-center flex-wrap gap-2">
                        {(['left', 'center'] as const).map(align => (
                            <DesignSettingButton key={align} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, logoPosition: align}}))} isActive={(portfolio.design.logoPosition || 'left') === align}>
                                <span className="capitalize">{t(`position.${align}`)}</span>
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                <div className={`${portfolio.design.navigationStyle === 'none' ? 'opacity-50' : ''}`}>
                    <EditorLabel>Header Options</EditorLabel>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                         <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-slate-700 dark:text-slate-300">Transparent Header</span>
                            <input 
                                type="checkbox" 
                                checked={portfolio.design.transparentHeader || false} 
                                onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, transparentHeader: e.target.checked}}))}
                                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                                disabled={portfolio.design.navigationStyle === 'none'}
                            />
                        </label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Makes the header background transparent when at the top of the page. Only works with Sticky or Minimal navigation.</p>
                    </div>
                </div>
                <div>
                    <EditorLabel>{t('mobileMenuStyle')}</EditorLabel>
                    <div className="flex items-center gap-2">
                        {(['overlay', 'drawer'] as const).map(style => (
                            <DesignSettingButton 
                                key={style} 
                                onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, mobileMenuStyle: style}}))} 
                                isActive={(portfolio.design.mobileMenuStyle || 'overlay') === style}
                            >
                                <span className="capitalize">{t(`style.${style}`)}</span>
                            </DesignSettingButton>
                        ))}
                    </div>
                </div>
                <div>
                    <EditorLabel>{t('mobileMenuAnimation')}</EditorLabel>
                    <div className="flex items-center gap-2">
                        {(['fadeIn', 'slideIn'] as const).map(style => (
                            <DesignSettingButton 
                                key={style} 
                                onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, mobileMenuAnimation: style}}))} 
                                isActive={(portfolio.design.mobileMenuAnimation || 'fadeIn') === style}
                            >
                                {t(style === 'fadeIn' ? 'animation.fadeIn' : 'animation.slideIn')}
                            </DesignSettingButton>
                        ))}
                    </div>
                </div>
                 <div>
                    <EditorLabel>Mobile Menu Icon</EditorLabel>
                    <div className="flex items-center gap-2">
                        {(['bars', 'plus', 'dots'] as const).map(style => (
                            <DesignSettingButton 
                                key={style} 
                                onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, mobileMenuIconStyle: style}}))} 
                                isActive={(portfolio.design.mobileMenuIconStyle || 'bars') === style}
                            >
                                <span className="capitalize">{style}</span>
                            </DesignSettingButton>
                        ))}
                    </div>
                </div>
                <div>
                   <EditorLabel>Scroll Indicator</EditorLabel>
                   <div className="flex items-center flex-wrap gap-2">
                        {(['none', 'progressBar'] as const).map(style => (
                            <DesignSettingButton key={style} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, scrollIndicator: style}}))} isActive={(portfolio.design.scrollIndicator || 'none') === style}>
                                {style === 'none' ? 'None' : 'Progress Bar'}
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                <div>
                   <EditorLabel>{t('animationStyle')}</EditorLabel>
                   <div className="flex items-center flex-wrap gap-2">
                        {(['none', 'fadeIn', 'slideInUp', 'scaleIn', 'slideInFromLeft', 'revealUp', 'blurIn'] as AnimationStyle[]).map(style => (
                            <DesignSettingButton key={style} onClick={() => updatePortfolioImmediate(p => ({...p, design: {...p.design, animationStyle: style}}))} isActive={portfolio.design.animationStyle === style}>
                                {t(`animation.${style}`)}
                            </DesignSettingButton>
                        ))}
                   </div>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <label className="flex items-center justify-between cursor-pointer">
                       <span className="text-sm text-slate-700 dark:text-slate-300">Parallax Backgrounds</span>
                       <input 
                           type="checkbox" 
                           checked={portfolio.design.parallax || false} 
                           onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, parallax: e.target.checked}}))}
                           className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                       />
                   </label>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Applies a depth effect to block background images on scroll.</p>
               </div>
            </DetailsSection>

            <DetailsSection title="Accessibility">
                 <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <label className="flex items-center justify-between cursor-pointer">
                       <span className="text-sm font-medium text-slate-700 dark:text-slate-300">High Contrast Mode</span>
                       <input 
                           type="checkbox" 
                           checked={portfolio.design.highContrastMode || false}
                           onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, highContrastMode: e.target.checked}}))}
                           className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                       />
                   </label>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Overrides colors to a high-contrast theme for better readability. Disables gradients and shadows.</p>
               </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg mt-4">
                    <label className="flex items-center justify-between cursor-pointer">
                       <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Respect Reduced Motion</span>
                       <input 
                           type="checkbox" 
                           checked={portfolio.design.respectReducedMotion !== false} // default to true
                           onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, respectReducedMotion: e.target.checked}}))}
                           className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                       />
                   </label>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Disables animations for users who have requested reduced motion in their OS settings. It's recommended to keep this on.</p>
               </div>
            </DetailsSection>
            
            <DetailsSection title="Advanced">
                <div>
                    <EditorLabel>Custom CSS</EditorLabel>
                     <EditorTextarea 
                        value={portfolio.design.customCss || ''}
                        onChange={e => updatePortfolioImmediate(p => ({...p, design: {...p.design, customCss: e.target.value}}))}
                        rows={8}
                        placeholder="e.g., .my-custom-class { color: red; }"
                        className="font-mono text-xs"
                    />
                </div>
            </DetailsSection>
        </div>
    );
};

export default DesignPanel;
