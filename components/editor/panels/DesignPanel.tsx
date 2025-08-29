
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
import { AnimatePresence } from 'framer-motion';
import { useData } from '../../../contexts/DataContext';
import UpgradeModal from '../../UpgradeModal';

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
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id, resizeObserverConfig: { disabled: true } });
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
    setAIPaletteModalOpen: (isOpen: boolean) => void;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (e: React.MouseEvent) => void }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between cursor-pointer" onClick={setEnabled}>
        <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
        <div className="relative">
            <div className={`block w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-4' : ''}`}></div>
        </div>
    </div>
);

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
    handleDeletePalette,
    setAIPaletteModalOpen
}) => {
    const { t } = useTranslation();
    const { entitlements } = useData();
    const [isSavingPreset, setIsSavingPreset] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [featureToUpgrade, setFeatureToUpgrade] = useState({ name: '', description: '' });

    // Define the available options for fonts and colors.
    const headingFonts = ['Sora', 'Poppins', 'Montserrat', 'Playfair Display', 'Lora', 'Raleway', 'EB Garamond'];
    const bodyFonts = ['Inter', 'Lato', 'Open Sans', 'Lora', 'Merriweather', 'Roboto', 'Noto Sans'];
    const accentColorPresets = ['#14b8a6', '#2dd4bf', '#e11d48', '#f59e0b', '#fbbf24', '#d97706'];
    const allPalettes = [...defaultPalettes, ...(portfolio.customPalettes || [])];

    const handleProFeatureClick = (
        isEntitled: boolean,
        featureName: string,
        featureDescription: string,
        action: () => void
    ) => {
        if (isEntitled) {
            action();
        } else {
            setFeatureToUpgrade({ name: featureName, description: featureDescription });
            setIsUpgradeModalOpen(true);
        }
    };

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
    
    const handleBrandingToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleProFeatureClick(
            entitlements.canRemoveBranding,
            'Remove Branding',
            'The ability to remove "Made with Grooya" branding from your portfolio is available on all paid plans.',
            () => handleImmediateDesignChange('hideBranding', !(portfolio.design.hideBranding || false))
        );
    };


    return (
        <>
            <div className="p-4 space-y-4">
                {/* AI Design Assistant Section */}
                <div className="p-4 bg-gradient-to-br from-amber-100/30 to-teal-100/30 dark:from-amber-500/10 dark:to-teal-500/10 rounded-lg border border-amber-200 dark:border-amber-700/30 space-y-3">
                    <div>
                        <h4 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">AI Design Assistant</h4>
                        <p className="text-sm text-slate-800 dark:text-slate-400 mb-3">Let AI suggest a theme, font, and color based on your professional title.</p>
                        <Button onClick={handleAIDesignSuggest} variant="secondary" size="sm" className="w-full" disabled={isAIDesignLoading}>
                            {isAIDesignLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-700 dark:text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Sparkles size={14} className="me-2 text-amber-500" />
                            )}
                            Suggest a Design
                        </Button>
                    </div>
                </div>

                {/* Main Design Settings */}
                <div className="space-y-6">
                    <div>
                        <EditorLabel>Color Palette</EditorLabel>
                        <div className="grid grid-cols-2 gap-3">
                            {allPalettes.map(palette => (
                                <button
                                    key={palette.id}
                                    onClick={() => handleImmediateDesignChange('paletteId', palette.id)}
                                    className={`p-3 rounded-lg border-2 ${portfolio.design.paletteId === palette.id ? 'border-teal-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{palette.name}</span>
                                        {palette.id.startsWith('custom-') && (
                                            <div className="flex items-center gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); setEditingPalette(palette); }} className="p-1 rounded text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"><Edit size={12} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeletePalette(palette.id); }} className="p-1 rounded text-rose-500 hover:text-rose-700 dark:hover:text-rose-300"><Trash2 size={12} /></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex mt-2 gap-1 h-4">
                                        <div className="w-1/4 rounded-sm" style={{ backgroundColor: palette.colors.background }}></div>
                                        <div className="w-1/4 rounded-sm" style={{ backgroundColor: palette.colors.text }}></div>
                                        <div className="w-1/4 rounded-sm" style={{ backgroundColor: palette.colors.heading }}></div>
                                        <div className="w-1/4 rounded-sm" style={{ backgroundColor: portfolio.design.accentColor }}></div>
                                    </div>
                                </button>
                            ))}
                        </div>
                         <div className="grid grid-cols-2 gap-3 mt-3">
                            <Button size="sm" variant="secondary" className="w-full" onClick={() => handleProFeatureClick(
                                entitlements.hasProDesignTools,
                                'Custom Color Palettes',
                                'Create and save your own color palettes for full brand control. This is a Pro feature.',
                                () => setEditingPalette('new')
                            )}>
                                <Plus size={14} className="me-2" /> Create New Palette
                            </Button>
                            <Button size="sm" variant="secondary" className="w-full" onClick={() => handleProFeatureClick(
                                entitlements.hasProDesignTools,
                                'AI Palette Generation',
                                'Generate unique color palettes from a text description using AI. This is a Pro feature.',
                                () => setAIPaletteModalOpen(true)
                            )}>
                                <Pipette size={14} className="me-2" /> Generate with AI
                            </Button>
                        </div>
                    </div>

                    <div>
                        <EditorLabel>Accent Color</EditorLabel>
                         <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10 flex-shrink-0">
                                 <input type="color" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={portfolio.design.accentColor} onChange={e => handleDesignChange('accentColor', e.target.value)} />
                                 <div className="w-full h-full rounded-md border border-slate-300 dark:border-slate-600" style={{backgroundColor: portfolio.design.accentColor}}></div>
                            </div>
                            <div className="flex-grow grid grid-cols-6 gap-2">
                                {accentColorPresets.map(color => (
                                    <button key={color} onClick={() => handleImmediateDesignChange('accentColor', color)} className={`w-full h-8 rounded-md ${portfolio.design.accentColor === color ? 'ring-2 ring-offset-2 ring-teal-500 ring-offset-white dark:ring-offset-slate-900' : ''}`} style={{backgroundColor: color}}></button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <DetailsSection title="Typography">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <EditorLabel>{t('headingFont')}</EditorLabel>
                            <DesignSelect label="Heading Font" value={portfolio.design.headingFont} onChange={e => handleDesignChange('headingFont', e.target.value)}>
                                {headingFonts.map(font => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}
                            </DesignSelect>
                        </div>
                        <div>
                            <EditorLabel>{t('bodyFont')}</EditorLabel>
                             <DesignSelect label="Body Font" value={portfolio.design.bodyFont} onChange={e => handleDesignChange('bodyFont', e.target.value)}>
                                {bodyFonts.map(font => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}
                            </DesignSelect>
                        </div>
                    </div>
                    <div>
                        <EditorLabel>{t('fontSize')}</EditorLabel>
                        <div className="flex gap-2">
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('fontSize', 'sm')} isActive={portfolio.design.fontSize === 'sm'}>{t('fontSize.sm')}</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('fontSize', 'md')} isActive={portfolio.design.fontSize === 'md'}>{t('fontSize.md')}</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('fontSize', 'lg')} isActive={portfolio.design.fontSize === 'lg'}>{t('fontSize.lg')}</DesignSettingButton>
                        </div>
                    </div>
                </DetailsSection>

                <DetailsSection title="Layout & Spacing">
                    <div>
                        <EditorLabel>{t('pageWidth')}</EditorLabel>
                        <div className="flex gap-2">
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('pageWidth', 'standard')} isActive={portfolio.design.pageWidth === 'standard'}>{t('pageWidth.standard')}</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('pageWidth', 'full')} isActive={portfolio.design.pageWidth === 'full'}>{t('pageWidth.full')}</DesignSettingButton>
                        </div>
                    </div>
                     <div>
                        <EditorLabel>{t('spacing')}</EditorLabel>
                        <div className="flex gap-2">
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('spacing', 'compact')} isActive={portfolio.design.spacing === 'compact'}>Compact</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('spacing', 'cozy')} isActive={portfolio.design.spacing === 'cozy'}>Cozy</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('spacing', 'spacious')} isActive={portfolio.design.spacing === 'spacious'}>Spacious</DesignSettingButton>
                        </div>
                    </div>
                </DetailsSection>

                <DetailsSection title="UI Elements">
                     <div>
                        <EditorLabel>{t('cornerRadius')}</EditorLabel>
                        <div className="flex gap-2">
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('cornerRadius', 'none')} isActive={portfolio.design.cornerRadius === 'none'}>None</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('cornerRadius', 'sm')} isActive={portfolio.design.cornerRadius === 'sm'}>Small</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('cornerRadius', 'md')} isActive={portfolio.design.cornerRadius === 'md'}>Medium</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('cornerRadius', 'lg')} isActive={portfolio.design.cornerRadius === 'lg'}>Large</DesignSettingButton>
                        </div>
                    </div>
                     <div>
                        <EditorLabel>Shadows</EditorLabel>
                        <div className="flex gap-2">
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('shadowStyle', 'none')} isActive={portfolio.design.shadowStyle === 'none'}>None</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('shadowStyle', 'sm')} isActive={portfolio.design.shadowStyle === 'sm'}>Small</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('shadowStyle', 'md')} isActive={portfolio.design.shadowStyle === 'md'}>Medium</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('shadowStyle', 'lg')} isActive={portfolio.design.shadowStyle === 'lg'}>Large</DesignSettingButton>
                        </div>
                    </div>
                     <div>
                        <EditorLabel>{t('buttonStyle')}</EditorLabel>
                        <div className="flex gap-2">
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('buttonStyle', 'rounded')} isActive={portfolio.design.buttonStyle === 'rounded'}>{t('buttonStyle.rounded')}</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('buttonStyle', 'pill')} isActive={portfolio.design.buttonStyle === 'pill'}>{t('buttonStyle.pill')}</DesignSettingButton>
                            <DesignSettingButton onClick={() => handleImmediateDesignChange('buttonStyle', 'square')} isActive={portfolio.design.buttonStyle === 'square'}>{t('buttonStyle.square')}</DesignSettingButton>
                        </div>
                    </div>
                </DetailsSection>
                
                <DetailsSection title="Effects & Overrides">
                     <ToggleSwitch
                        label="Parallax Backgrounds"
                        enabled={portfolio.design.parallax || false}
                        setEnabled={() => handleProFeatureClick(
                            entitlements.hasProDesignTools,
                            'Parallax Backgrounds',
                            'Create a sense of depth with parallax scrolling effects. This is a Pro feature.',
                            () => handleImmediateDesignChange('parallax', !(portfolio.design.parallax || false))
                        )}
                    />
                    <ToggleSwitch
                        label="Hide 'Made with Grooya' Branding"
                        enabled={portfolio.design.hideBranding || false}
                        setEnabled={handleBrandingToggle}
                    />
                    <div>
                        <EditorLabel>Custom CSS (Pro)</EditorLabel>
                        <div className="relative">
                            <EditorTextarea
                                value={portfolio.design.customCss || ''}
                                onChange={e => handleDesignChange('customCss', e.target.value)}
                                rows={8}
                                className="font-mono text-xs"
                                disabled={!entitlements.hasProDesignTools}
                            />
                            {!entitlements.hasProDesignTools && (
                                <div
                                    onClick={() => handleProFeatureClick(
                                        false, // Always trigger modal if not entitled
                                        'Custom CSS',
                                        'Add your own custom CSS for pixel-perfect control over your design. This is a Pro feature.',
                                        () => {} // No action needed if entitled
                                    )}
                                    className="absolute inset-0 bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                                >
                                    <span className="px-3 py-1 bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-sm font-semibold rounded-full">
                                        Unlock with Pro
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </DetailsSection>
            </div>
            <AnimatePresence>
                {isUpgradeModalOpen && (
                    <UpgradeModal
                        isOpen={isUpgradeModalOpen}
                        onClose={() => setIsUpgradeModalOpen(false)}
                        featureName={featureToUpgrade.name}
                        featureDescription={featureToUpgrade.description}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default DesignPanel;
