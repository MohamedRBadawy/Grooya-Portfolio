

import React, { useState } from 'react';
import type { PortfolioBlock, Gradient, ShapeDivider, Project, Skill } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { Waves } from 'lucide-react';
import Button from '../ui/Button';
import { EditorLabel, EditorInput } from '../ui/editor/EditorControls';
import ImageUploader from '../ui/ImageUploader';

// Import all the new block-specific editor components
import {
    HeroEditor, AboutEditor, ProjectsEditor, SkillsEditor, GalleryEditor,
    TestimonialsEditor, VideoEditor, CtaEditor, ResumeEditor, LinksEditor,
    ExperienceEditor, ContactEditor, CodeEditor, ServicesEditor, BlogEditor
} from './block_editors';

const SECTION_STYLE_PRESETS: Array<{
    id: string;
    label: string;
    overrides: NonNullable<PortfolioBlock['designOverrides']>;
}> = [
    {
        id: 'clean',
        label: 'Clean Canvas',
        overrides: {
            padding: { top: '4rem', bottom: '4rem' },
            animationStyle: 'fadeIn',
        },
    },
    {
        id: 'spotlight',
        label: 'Spotlight',
        overrides: {
            background: { direction: 135, color1: '#0f172a', color2: '#134e4a' },
            textColor: '#f8fafc',
            padding: { top: '5rem', bottom: '5rem' },
            animationStyle: 'revealUp',
        },
    },
    {
        id: 'card',
        label: 'Soft Card',
        overrides: {
            background: '#f8fafc',
            padding: { top: '3rem', bottom: '3rem', left: '2rem', right: '2rem' },
            animationStyle: 'fadeIn',
            border: {
                top: { width: 1, style: 'solid', color: '#e2e8f0' },
                bottom: { width: 1, style: 'solid', color: '#e2e8f0' },
            },
        },
    },
];

interface BlockEditorProps {
    block: PortfolioBlock,
    onUpdate: (blockId: string, newBlockData: any) => void,
    allProjects: Project[],
    allSkills: Skill[],
    onEditProject: (project: Project) => void;
    handleSaveNewProject: (projectData: Omit<Project, 'id'>) => void;
    handleSaveNewSkill: (skillData: Omit<Skill, 'id'>) => void;
    isCreatingProject: boolean;
    onStartCreatingProject: () => void;
    isCreatingSkill: boolean;
    onStartCreatingSkill: () => void;
    onCancelCreation: () => void;
}

const BlockEditor: React.FC<BlockEditorProps> = (props) => {
    const { block, onUpdate, ...rest } = props;
    const { t } = useTranslation();
    const [backgroundType, setBackgroundType] = useState<'solid' | 'gradient'>(
        typeof block.designOverrides?.background === 'object' ? 'gradient' : 'solid'
    );

    const handleUpdate = (updates: Partial<PortfolioBlock>) => {
        onUpdate(block.id, updates);
    };
    
    const handleDesignOverrideChange = (field: keyof NonNullable<PortfolioBlock['designOverrides']>, value: any) => {
        const currentOverrides = block.designOverrides || {};
        let newOverrides;

        if (value === undefined || value === null || value === '') {
            const { [field]: _, ...rest } = currentOverrides;
            newOverrides = rest;
        } else {
            newOverrides = { ...currentOverrides, [field]: value };
        }
        
        if (Object.keys(newOverrides).length === 0) {
            handleUpdate({ designOverrides: undefined });
        } else {
            handleUpdate({ designOverrides: newOverrides });
        }
    };

    const handlePaddingChange = (side: 'top' | 'bottom' | 'left' | 'right', value: string) => {
        const currentOverrides = block.designOverrides || {};
        const currentPadding = currentOverrides.padding || {};
        let newPadding;
        if (value.trim() === '') {
            const { [side]: _, ...rest } = currentPadding;
            newPadding = rest;
        } else {
            newPadding = { ...currentPadding, [side]: value };
        }
        let newOverrides = { ...currentOverrides };
        if (Object.keys(newPadding).length === 0) {
             delete newOverrides.padding;
        } else {
            newOverrides.padding = newPadding;
        }
        if (Object.keys(newOverrides).length === 0) {
            handleUpdate({ designOverrides: undefined });
        } else {
            handleUpdate({ designOverrides: newOverrides });
        }
    };
    
     const handleShapeDividerChange = (
        position: 'top' | 'bottom',
        field: keyof ShapeDivider,
        value: string | number | boolean
    ) => {
        const currentOverrides = block.designOverrides || {};
        const currentDividers = currentOverrides.shapeDividers || {};
        const currentDivider = currentDividers[position] || {
            type: 'wave', color: '#ffffff', flipX: false, height: 100
        };
        const newDivider: ShapeDivider = { ...currentDivider, [field]: value };
        handleDesignOverrideChange('shapeDividers', { ...currentDividers, [position]: newDivider });
    };

    const toggleShapeDivider = (position: 'top' | 'bottom') => {
        const currentOverrides = block.designOverrides || {};
        let currentDividers = currentOverrides.shapeDividers || {};
        const isEnabled = !!currentDividers[position];
        if (isEnabled) {
            const {[position]: _, ...rest} = currentDividers;
            currentDividers = rest;
        } else {
            currentDividers = { ...currentDividers, [position]: { type: 'wave', color: '#ffffff', flipX: false, height: 100 } }
        }
        if (Object.keys(currentDividers).length === 0) {
            handleDesignOverrideChange('shapeDividers', undefined);
        } else {
            handleDesignOverrideChange('shapeDividers', currentDividers);
        }
    };

    const handleBackgroundChange = (value: string | Gradient | undefined) => {
        handleDesignOverrideChange('background', value)
    };

    const applySectionPreset = (presetId: string) => {
        const preset = SECTION_STYLE_PRESETS.find(item => item.id === presetId);
        if (!preset) return;
        handleUpdate({
            designOverrides: {
                ...(block.designOverrides || {}),
                ...preset.overrides,
            },
        });
    };

    const resetStyleOverrides = () => {
        handleUpdate({ designOverrides: undefined });
    };
    
    const renderFields = () => {
        switch (block.type) {
            case 'hero': return <HeroEditor block={block} onUpdate={handleUpdate} />;
            case 'about': return <AboutEditor block={block} onUpdate={handleUpdate} />;
            case 'projects': return <ProjectsEditor block={block} onUpdate={handleUpdate} {...rest} />;
            case 'skills': return <SkillsEditor block={block} onUpdate={handleUpdate} {...rest} />;
            case 'gallery': return <GalleryEditor block={block} onUpdate={handleUpdate} t={t} />;
            case 'testimonials': return <TestimonialsEditor block={block} onUpdate={handleUpdate} t={t} />;
            case 'video': return <VideoEditor block={block} onUpdate={handleUpdate} />;
            case 'cta': return <CtaEditor block={block} onUpdate={handleUpdate} />;
            case 'resume': return <ResumeEditor block={block} onUpdate={handleUpdate} />;
            case 'links': return <LinksEditor block={block} onUpdate={handleUpdate} t={t} />;
            case 'experience': return <ExperienceEditor block={block} onUpdate={handleUpdate} t={t} />;
            case 'contact': return <ContactEditor block={block} onUpdate={handleUpdate} />;
            case 'code': return <CodeEditor block={block} onUpdate={handleUpdate} t={t} />;
            case 'services': return <ServicesEditor block={block} onUpdate={handleUpdate} t={t} />;
            case 'blog': return <BlogEditor block={block} onUpdate={handleUpdate} t={t} />;
            default: return null;
        }
    };
    
    const fields = renderFields();
    const currentBg = block.designOverrides?.background;
    const gradient = typeof currentBg === 'object' ? currentBg : { direction: 90, color1: '#ffffff', color2: '#f0f0f0'};

    return (
        <div className="space-y-4">
            {fields && <div className="space-y-4">{fields}</div>}
             <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <details>
                    <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400 list-none flex items-center justify-between">
                        <div className="flex items-center gap-2"><span>Style Overrides (Advanced)</span></div>
                        <svg className="w-4 h-4 transition-transform transform details-arrow" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </summary>
                    <div className="mt-4 space-y-4">
                        <div className="rounded-xl border border-dashed border-slate-300 p-3 dark:border-slate-700">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Section presets</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Apply a structured style base, then fine-tune the details below.</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={resetStyleOverrides}>
                                    Reset overrides
                                </Button>
                            </div>
                            <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
                                {SECTION_STYLE_PRESETS.map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => applySectionPreset(preset.id)}
                                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left transition-colors hover:border-teal-400 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-teal-500 dark:hover:bg-slate-800"
                                    >
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{preset.label}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <EditorLabel>Padding</EditorLabel>
                             <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                <EditorInput placeholder="Top" value={block.designOverrides?.padding?.top || ''} onChange={e => handlePaddingChange('top', e.target.value)} />
                                <EditorInput placeholder="Bottom" value={block.designOverrides?.padding?.bottom || ''} onChange={e => handlePaddingChange('bottom', e.target.value)} />
                                <EditorInput placeholder="Left" value={block.designOverrides?.padding?.left || ''} onChange={e => handlePaddingChange('left', e.target.value)} />
                                <EditorInput placeholder="Right" value={block.designOverrides?.padding?.right || ''} onChange={e => handlePaddingChange('right', e.target.value)} />
                            </div>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                            <EditorLabel>Background Type</EditorLabel>
                            <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-900 rounded-lg">
                                <button onClick={() => setBackgroundType('solid')} className={`flex-1 text-sm py-1 rounded-md ${backgroundType === 'solid' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>Solid</button>
                                <button onClick={() => setBackgroundType('gradient')} className={`flex-1 text-sm py-1 rounded-md ${backgroundType === 'gradient' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>Gradient</button>
                            </div>
                        </div>
                        {backgroundType === 'solid' ? (
                             <div>
                                <EditorLabel htmlFor={`override-bg-${block.id}`}>Background Color</EditorLabel>
                                 <div className="flex items-center gap-2">
                                    <EditorInput id={`override-bg-${block.id}`} type="text" value={typeof currentBg === 'string' ? currentBg : ''} placeholder="Default (e.g., #020617)" onChange={e => handleBackgroundChange(e.target.value || undefined)} />
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                         <input type="color" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={typeof currentBg === 'string' ? currentBg : '#ffffff'} onChange={e => handleBackgroundChange(e.target.value)} />
                                         <div className="w-full h-full rounded-md border border-slate-300 dark:border-slate-600" style={{backgroundColor: typeof currentBg === 'string' ? currentBg : 'transparent'}}></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <EditorLabel>Direction ({gradient.direction}°)</EditorLabel>
                                    <input type="range" min="0" max="360" value={gradient.direction} onChange={e => handleBackgroundChange({...gradient, direction: parseInt(e.target.value)})} className="w-full" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <EditorLabel>Color 1</EditorLabel>
                                        <input type="color" value={gradient.color1} onChange={e => handleBackgroundChange({...gradient, color1: e.target.value})} className="w-full h-10 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent" />
                                    </div>
                                     <div>
                                        <EditorLabel>Color 2</EditorLabel>
                                        <input type="color" value={gradient.color2} onChange={e => handleBackgroundChange({...gradient, color2: e.target.value})} className="w-full h-10 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                            <ImageUploader 
                                label="Upload Background Image"
                                value={block.designOverrides?.backgroundImage}
                                onChange={(value) => handleDesignOverrideChange('backgroundImage', value)}
                            />
                        </div>
                        {block.designOverrides?.backgroundImage && (
                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                                <div>
                                    <EditorLabel>Background Overlay ({Math.round((block.designOverrides?.backgroundOpacity ?? 0.5) * 100)}%)</EditorLabel>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.05" 
                                        value={block.designOverrides?.backgroundOpacity ?? 0.5} 
                                        onChange={e => handleDesignOverrideChange('backgroundOpacity', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                                    <div>
                                        <EditorLabel>Background Size</EditorLabel>
                                        <select
                                            value={block.designOverrides?.backgroundSize || 'cover'}
                                            onChange={e => handleDesignOverrideChange('backgroundSize', e.target.value)}
                                            className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                        >
                                            <option value="cover">Cover</option>
                                            <option value="contain">Contain</option>
                                            <option value="auto">Auto</option>
                                        </select>
                                    </div>
                                    <div>
                                        <EditorLabel>Background Repeat</EditorLabel>
                                        <select
                                            value={block.designOverrides?.backgroundRepeat || 'no-repeat'}
                                            onChange={e => handleDesignOverrideChange('backgroundRepeat', e.target.value)}
                                            className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                        >
                                            <option value="no-repeat">No repeat</option>
                                            <option value="repeat">Repeat</option>
                                            <option value="repeat-x">Repeat X</option>
                                            <option value="repeat-y">Repeat Y</option>
                                        </select>
                                    </div>
                                    <div>
                                        <EditorLabel>Background Position</EditorLabel>
                                        <EditorInput
                                            placeholder="center"
                                            value={block.designOverrides?.backgroundPosition || ''}
                                            onChange={e => handleDesignOverrideChange('backgroundPosition', e.target.value || undefined)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <EditorLabel>Text Color Override</EditorLabel>
                                    <EditorInput 
                                        type="text" 
                                        placeholder="#FFFFFF" 
                                        value={block.designOverrides?.textColor || ''} 
                                        onChange={e => handleDesignOverrideChange('textColor', e.target.value || undefined)}
                                    />
                                </div>
                            </div>
                        )}
                         <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                            <details className="group">
                                <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400 list-none flex items-center justify-between">
                                    <div className="flex items-center gap-2"><Waves size={16}/><span>Shape Dividers</span></div>
                                    <svg className="w-4 h-4 transition-transform transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </summary>
                                <div className="mt-4 space-y-6">
                                    {['top', 'bottom'].map(pos => {
                                        const position = pos as 'top' | 'bottom';
                                        const divider = block.designOverrides?.shapeDividers?.[position];
                                        const isEnabled = !!divider;
                                        return (
                                            <div key={position}>
                                                <div className="flex items-center justify-between">
                                                    <EditorLabel className="capitalize !mb-0">{position} Divider</EditorLabel>
                                                    <label className="inline-flex relative items-center cursor-pointer">
                                                        <input type="checkbox" checked={isEnabled} onChange={() => toggleShapeDivider(position)} className="sr-only peer"/>
                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
                                                    </label>
                                                </div>
                                                {isEnabled && (
                                                    <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md space-y-3">
                                                        <div>
                                                            <EditorLabel>Shape</EditorLabel>
                                                            <select value={divider.type} onChange={e => handleShapeDividerChange(position, 'type', e.target.value)} className="block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500">
                                                                <option value="wave">Wave</option>
                                                                <option value="slant">Slant</option>
                                                                <option value="curve">Curve</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <EditorLabel>Color</EditorLabel>
                                                            <input type="color" value={divider.color} onChange={e => handleShapeDividerChange(position, 'color', e.target.value)} className="w-full h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent" />
                                                        </div>
                                                        <div>
                                                            <EditorLabel>Height ({divider.height}px)</EditorLabel>
                                                            <input type="range" min="20" max="300" value={divider.height} onChange={e => handleShapeDividerChange(position, 'height', parseInt(e.target.value))} className="w-full" />
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <label className="flex items-center text-sm"><input type="checkbox" checked={divider.flipX} onChange={e => handleShapeDividerChange(position, 'flipX', e.target.checked)} className="h-4 w-4 rounded me-2"/> Flip Horizontally</label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </details>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                            <EditorLabel>Border Preset</EditorLabel>
                            <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
                                {[
                                    { id: 'none', label: 'None' },
                                    { id: 'top', label: 'Top Rule', border: { top: { width: 2, style: 'solid', color: '#cbd5e1' } } },
                                    { id: 'bottom', label: 'Bottom Rule', border: { bottom: { width: 2, style: 'solid', color: '#cbd5e1' } } },
                                    { id: 'frame', label: 'Frame', border: {
                                        top: { width: 1, style: 'solid', color: '#cbd5e1' },
                                        bottom: { width: 1, style: 'solid', color: '#cbd5e1' },
                                        left: { width: 1, style: 'solid', color: '#cbd5e1' },
                                        right: { width: 1, style: 'solid', color: '#cbd5e1' },
                                    } },
                                ].map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => handleDesignOverrideChange('border', preset.id === 'none' ? undefined : preset.border)}
                                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 transition-colors hover:border-teal-400 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-teal-500"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                            <EditorLabel>Animation Style Override</EditorLabel>
                            <select value={block.designOverrides?.animationStyle || ''} onChange={e => handleDesignOverrideChange('animationStyle', e.target.value || undefined)} className="block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500">
                                <option value="">Default (from Design tab)</option>
                                <option value="none">None</option>
                                <option value="fadeIn">Fade In</option>
                                <option value="slideInUp">Slide In Up</option>
                                <option value="scaleIn">Scale In</option>
                                <option value="slideInFromLeft">Slide In From Left</option>
                                <option value="revealUp">Reveal Up</option>
                                <option value="blurIn">Blur In</option>
                            </select>
                        </div>
                        {block.designOverrides?.animationStyle && block.designOverrides.animationStyle !== 'none' && (
                            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                <EditorLabel>Animation Timing</EditorLabel>
                                <div className="grid grid-cols-2 gap-2">
                                    <EditorInput type="number" placeholder="Duration (s)" step="0.1" min="0" value={block.designOverrides.animationDuration ?? ''} onChange={e => handleDesignOverrideChange('animationDuration', e.target.value ? parseFloat(e.target.value) : undefined)} />
                                    <EditorInput type="number" placeholder="Delay (s)" step="0.1" min="0" value={block.designOverrides.animationDelay ?? ''} onChange={e => handleDesignOverrideChange('animationDelay', e.target.value ? parseFloat(e.target.value) : undefined)} />
                                </div>
                            </div>
                        )}
                    </div>
                </details>
             </div>
        </div>
    )
};

export default BlockEditor;
