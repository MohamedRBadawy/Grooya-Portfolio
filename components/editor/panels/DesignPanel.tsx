

import React from 'react';
import type { Portfolio, Palette, ColorTheme, FontWeight, LineHeight, LetterSpacing, FontSize, PageWidth, Spacing, CornerRadius, ShadowStyle, ButtonStyle, AnimationStyle, NavigationStyle } from '../../../types';
import Button from '../../ui/Button';
import { EditorLabel, EditorTextarea } from '../../ui/editor/EditorControls';
import { useTranslation } from '../../../hooks/useTranslation';
import { defaultPalettes } from '../../../services/palettes';
import { Sparkles, Edit, Trash2, Plus, Pipette, ChevronRight } from 'lucide-react';

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

    // Define the available options for fonts and colors.
    const headingFonts = ['Sora', 'Poppins', 'Montserrat', 'Playfair Display', 'Lora', 'Raleway', 'EB Garamond'];
    const bodyFonts = ['Inter', 'Lato', 'Open Sans', 'Lora', 'Merriweather', 'Roboto', 'Noto Sans'];
    const accentColorPresets = ['#14b8a6', '#2dd4bf', '#e11d48', '#f59e0b', '#fbbf24', '#d97706'];
    const allPalettes = [...defaultPalettes, ...(portfolio.customPalettes || [])];

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
            
            <DetailsSection title="Typography" defaultOpen>
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
            </DetailsSection>
            
            <DetailsSection title="Navigation & Effects">
                <div>
                   <EditorLabel>{t('navigationStyle')}</EditorLabel>
                   <div className="flex items-center flex-wrap gap-2">
                        {(['none', 'stickyHeader', 'minimalHeader'] as NavigationStyle[]).map(style => (
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