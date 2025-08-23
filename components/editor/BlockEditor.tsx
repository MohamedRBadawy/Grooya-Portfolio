import React, { useRef, useState, useEffect } from 'react';
import type { PortfolioBlock, Gradient, HeroBlock, ProjectsBlock, SkillsBlock, Project, Skill, GalleryBlock, GalleryImage, TestimonialsBlock, Testimonial, VideoBlock, CtaBlock, ResumeBlock, LinksBlock, ExternalLink, ExperienceBlock, ExperienceItem, ContactBlock, CodeBlock, ServicesBlock, PricingTier, BlogBlock, BlogPost, Page, ShapeDivider, AboutBlock } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { AnimatePresence } from 'framer-motion';
import { X, Plus, Waves } from 'lucide-react';
import Button from '../ui/Button';
import { MultiItemSelector } from '../ui/MultiItemSelector';
import { EditorLabel, EditorInput, EditorTextarea } from '../ui/editor/EditorControls';
import InlineProjectCreator from './InlineProjectCreator';
import InlineSkillCreator from './InlineSkillCreator';

const BlockEditor: React.FC<{
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
}> = ({ 
    block, onUpdate, allProjects, allSkills, onEditProject, handleSaveNewProject, handleSaveNewSkill,
    isCreatingProject, onStartCreatingProject, isCreatingSkill, onStartCreatingSkill, onCancelCreation
}) => {
    
    const { t } = useTranslation();
    const [backgroundType, setBackgroundType] = React.useState<'solid' | 'gradient'>(
        typeof block.designOverrides?.background === 'object' ? 'gradient' : 'solid'
    );
    
    const handleFieldChange = (field: string, value: any) => {
        onUpdate(block.id, { [field]: value });
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
            handleFieldChange('designOverrides', undefined);
        } else {
            handleFieldChange('designOverrides', newOverrides);
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
            handleFieldChange('designOverrides', undefined);
        } else {
            handleFieldChange('designOverrides', newOverrides);
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

        handleDesignOverrideChange('shapeDividers', {
            ...currentDividers,
            [position]: newDivider
        });
    };

    const toggleShapeDivider = (position: 'top' | 'bottom') => {
        const currentOverrides = block.designOverrides || {};
        let currentDividers = currentOverrides.shapeDividers || {};
        
        const isEnabled = !!currentDividers[position];
        
        if (isEnabled) {
            const {[position]: _, ...rest} = currentDividers;
            currentDividers = rest;
        } else {
            currentDividers = {
                ...currentDividers,
                [position]: { type: 'wave', color: '#ffffff', flipX: false, height: 100 }
            }
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

    const handleMultiSelectChange = (field: 'projectIds' | 'skillIds', itemId: string) => {
        if (field === 'projectIds' && block.type === 'projects') {
            const currentIds = block.projectIds;
            const newIds = currentIds.includes(itemId)
                ? currentIds.filter(id => id !== itemId)
                : [...currentIds, itemId];
            onUpdate(block.id, { projectIds: newIds });
        } else if (field === 'skillIds' && block.type === 'skills') {
            const currentIds = block.skillIds;
            const newIds = currentIds.includes(itemId)
                ? currentIds.filter(id => id !== itemId)
                : [...currentIds, itemId];
            onUpdate(block.id, { skillIds: newIds });
        }
    };

    const renderFields = () => {
        switch (block.type) {
            case 'hero': {
                const b = block as HeroBlock;
                return (
                    <>
                        <div>
                           <div className="flex justify-between items-center mb-1.5">
                                <EditorLabel htmlFor={`h-imageUrl-${b.id}`}>Image URL (for no-background fallback)</EditorLabel>
                            </div>
                            <EditorInput id={`h-imageUrl-${b.id}`} value={b.imageUrl} onChange={e => handleFieldChange('imageUrl', e.target.value)} />
                        </div>
                         <div>
                            <EditorLabel htmlFor={`h-ctaText-${b.id}`}>CTA Button Text</EditorLabel>
                            <EditorInput id={`h-ctaText-${b.id}`} value={b.ctaText} onChange={e => handleFieldChange('ctaText', e.target.value)} />
                        </div>
                        <div><EditorLabel htmlFor={`h-ctaLink-${b.id}`}>CTA Link</EditorLabel><EditorInput id={`h-ctaLink-${b.id}`} value={b.ctaLink} onChange={e => handleFieldChange('ctaLink', e.target.value)} /></div>
                    </>
                )
            }
            case 'about': {
                 const b = block as AboutBlock;
                return (
                    <>
                        <div>
                            <EditorLabel htmlFor={`a-imageUrl-${b.id}`}>Image URL (optional)</EditorLabel>
                            <EditorInput id={`a-imageUrl-${b.id}`} value={b.imageUrl || ''} onChange={e => handleFieldChange('imageUrl', e.target.value)} />
                        </div>
                        {b.imageUrl && (
                            <>
                                <div className="space-y-2">
                                    <EditorLabel>Image Position</EditorLabel>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant={b.imagePosition === 'left' || !b.imagePosition ? 'primary' : 'secondary'} onClick={() => handleFieldChange('imagePosition', 'left')}>Left</Button>
                                        <Button size="sm" variant={b.imagePosition === 'right' ? 'primary' : 'secondary'} onClick={() => handleFieldChange('imagePosition', 'right')}>Right</Button>
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center justify-between cursor-pointer p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                       <span className="text-sm text-slate-700 dark:text-slate-300">Sticky Image on Scroll</span>
                                       <input 
                                           type="checkbox" 
                                           checked={b.stickyImage || false} 
                                           onChange={e => handleFieldChange('stickyImage', e.target.checked)}
                                           className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                       />
                                   </label>
                                </div>
                            </>
                        )}
                    </>
                )
            }
            case 'projects': {
                 const b = block as ProjectsBlock;
                 return (
                    <div>
                        <EditorLabel>Select Projects</EditorLabel>
                        <MultiItemSelector
                            items={allProjects.map(p => ({ id: p.id, name: p.title }))}
                            selectedIds={b.projectIds}
                            onToggle={(id) => handleMultiSelectChange('projectIds', id)}
                            placeholder={t('searchProjects')}
                            onEditItem={(id) => {
                                const projectToEdit = allProjects.find(p => p.id === id);
                                if (projectToEdit) onEditProject(projectToEdit);
                            }}
                            renderFooter={() => (
                                isCreatingProject ? (
                                    <InlineProjectCreator onSave={handleSaveNewProject} onCancel={onCancelCreation} />
                                ) : (
                                    <Button size="sm" variant="secondary" className="w-full" onClick={onStartCreatingProject}>
                                        <Plus size={14} className="me-2" />
                                        {t('createProject')}
                                    </Button>
                                )
                            )}
                        />
                    </div>
                 )
            }
            case 'skills': {
                 const b = block as SkillsBlock;
                 return (
                    <div>
                        <EditorLabel>Select Skills</EditorLabel>
                        <MultiItemSelector
                            items={allSkills}
                            selectedIds={b.skillIds}
                            onToggle={(id) => handleMultiSelectChange('skillIds', id)}
                            placeholder={t('searchSkills')}
                            renderFooter={() => (
                                isCreatingSkill ? (
                                    <InlineSkillCreator onSave={handleSaveNewSkill} onCancel={onCancelCreation} />
                                ) : (
                                    <Button size="sm" variant="secondary" className="w-full" onClick={onStartCreatingSkill}>
                                        <Plus size={14} className="me-2" />
                                        {t('createSkill')}
                                    </Button>
                                )
                            )}
                        />
                    </div>
                 )
            }
            case 'gallery': {
                const b = block as GalleryBlock;
                const updateImage = (imgId: string, field: keyof GalleryImage, value: string) => {
                    const newImages = b.images.map(img => img.id === imgId ? {...img, [field]: value} : img);
                    handleFieldChange('images', newImages);
                }
                const addImage = () => {
                    const newImage = { id: `img-${Date.now()}`, url: 'https://picsum.photos/seed/new-gallery/800/600', caption: 'A new image'};
                    handleFieldChange('images', [...b.images, newImage]);
                }
                const removeImage = (imgId: string) => {
                    handleFieldChange('images', b.images.filter(img => img.id !== imgId));
                }
                return (
                    <>
                        <div>
                            <EditorLabel>Layout</EditorLabel>
                            <div className="flex gap-2">
                                <Button size="sm" variant={b.layout === 'grid' ? 'primary' : 'secondary'} onClick={() => handleFieldChange('layout', 'grid')}>Grid</Button>
                                <Button size="sm" variant={b.layout === 'masonry' ? 'primary' : 'secondary'} onClick={() => handleFieldChange('layout', 'masonry')}>Masonry</Button>
                            </div>
                        </div>
                        {b.images.length > 0 ? (
                             <div className="space-y-3">
                                <EditorLabel>Images</EditorLabel>
                                {b.images.map(img => (
                                    <div key={img.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
                                        <div className="flex justify-end"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeImage(img.id)}><X size={14} /></Button></div>
                                        <EditorInput placeholder="Image URL" value={img.url} onChange={e => updateImage(img.id, 'url', e.target.value)} />
                                        <EditorInput placeholder="Caption (optional)" value={img.caption} onChange={e => updateImage(img.id, 'caption', e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
                                <p className="text-sm text-slate-600 dark:text-slate-400">{t('gallery.emptyState')}</p>
                            </div>
                        )}
                        <Button size="sm" variant="secondary" onClick={addImage}><Plus size={14} className="me-2"/>{t('addImage')}</Button>
                    </>
                )
            }
            case 'testimonials': {
                const b = block as TestimonialsBlock;
                const updateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
                    const newTestimonials = b.testimonials.map(t => t.id === id ? {...t, [field]: value} : t);
                    handleFieldChange('testimonials', newTestimonials);
                }
                const addTestimonial = () => {
                    const newTestimonial = { id: `test-${Date.now()}`, quote: 'A glowing review about my work.', author: 'Satisfied Client', authorTitle: 'CEO, Acme Inc.', authorAvatarUrl: 'https://picsum.photos/seed/new-avatar/100/100'};
                    handleFieldChange('testimonials', [...b.testimonials, newTestimonial]);
                }
                const removeTestimonial = (id: string) => {
                    handleFieldChange('testimonials', b.testimonials.filter(t => t.id !== id));
                }
                 return (
                    <>
                        {b.testimonials.length > 0 ? (
                            <div className="space-y-3">
                                <EditorLabel>Testimonials</EditorLabel>
                                {b.testimonials.map(item => (
                                    <div key={item.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
                                        <div className="flex justify-end"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeTestimonial(item.id)}><X size={14} /></Button></div>
                                        <EditorTextarea placeholder="Quote" value={item.quote} onChange={e => updateTestimonial(item.id, 'quote', e.target.value)} rows={3} />
                                        <EditorInput placeholder="Author Name" value={item.author} onChange={e => updateTestimonial(item.id, 'author', e.target.value)} />
                                        <EditorInput placeholder="Author Title" value={item.authorTitle} onChange={e => updateTestimonial(item.id, 'authorTitle', e.target.value)} />
                                        <EditorInput placeholder="Author Avatar URL" value={item.authorAvatarUrl} onChange={e => updateTestimonial(item.id, 'authorAvatarUrl', e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
                                <p className="text-sm text-slate-600 dark:text-slate-400">{t('testimonials.emptyState')}</p>
                            </div>
                        )}
                        <Button size="sm" variant="secondary" onClick={addTestimonial}><Plus size={14} className="me-2"/>{t('addTestimonial')}</Button>
                    </>
                )
            }
            case 'video': {
                const b = block as VideoBlock;
                return (
                    <>
                        <div><EditorLabel>Video URL (YouTube or Vimeo)</EditorLabel><EditorInput value={b.videoUrl} onChange={e => handleFieldChange('videoUrl', e.target.value)} /></div>
                    </>
                )
            }
             case 'cta': {
                const b = block as CtaBlock;
                return (
                    <>
                        <div>
                            <EditorLabel htmlFor={`cta-buttonText-${b.id}`}>Button Text</EditorLabel>
                            <EditorInput id={`cta-buttonText-${b.id}`} value={b.buttonText} onChange={e => handleFieldChange('buttonText', e.target.value)} />
                        </div>
                        <div>
                            <EditorLabel htmlFor={`cta-buttonLink-${b.id}`}>Button Link</EditorLabel>
                            <EditorInput id={`cta-buttonLink-${b.id}`} value={b.buttonLink} onChange={e => handleFieldChange('buttonLink', e.target.value)} />
                        </div>
                    </>
                )
            }
             case 'resume': {
                const b = block as ResumeBlock;
                return (
                    <>
                        <div>
                            <EditorLabel htmlFor={`resume-buttonText-${b.id}`}>Button Text</EditorLabel>
                            <EditorInput id={`resume-buttonText-${b.id}`} value={b.buttonText} onChange={e => handleFieldChange('buttonText', e.target.value)} />
                        </div>
                        <div>
                            <EditorLabel htmlFor={`resume-fileUrl-${b.id}`}>Resume PDF URL</EditorLabel>
                            <EditorInput id={`resume-fileUrl-${b.id}`} value={b.fileUrl} onChange={e => handleFieldChange('fileUrl', e.target.value)} />
                        </div>
                    </>
                )
            }
            case 'links': {
                const b = block as LinksBlock;
                const updateLink = (linkId: string, field: keyof Omit<ExternalLink, 'id'>, value: string) => {
                    const newLinks = b.links.map(link => link.id === linkId ? {...link, [field]: value} : link);
                    handleFieldChange('links', newLinks);
                }
                const addLink = () => {
                    const newLink: ExternalLink = { id: `link-${Date.now()}`, platform: 'github', url: 'https://github.com/your-username', text: 'GitHub'};
                    handleFieldChange('links', [...b.links, newLink]);
                }
                const removeLink = (linkId: string) => {
                    handleFieldChange('links', b.links.filter(link => link.id !== linkId));
                }
                return (
                    <>
                         {b.links.length > 0 ? (
                            <div className="space-y-3">
                                <EditorLabel>Links</EditorLabel>
                                {b.links.map(link => (
                                    <div key={link.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
                                        <div className="flex justify-end"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeLink(link.id)}><X size={14} /></Button></div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <EditorLabel htmlFor={`link-platform-${link.id}`}>Platform</EditorLabel>
                                                <select 
                                                    id={`link-platform-${link.id}`}
                                                    value={link.platform} 
                                                    onChange={e => updateLink(link.id, 'platform', e.target.value as ExternalLink['platform'])}
                                                    className="block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100"
                                                >
                                                    <option value="github">GitHub</option>
                                                    <option value="linkedin">LinkedIn</option>
                                                    <option value="twitter">Twitter</option>
                                                    <option value="website">Website</option>
                                                    <option value="custom">Custom</option>
                                                </select>
                                            </div>
                                            <div>
                                                <EditorLabel htmlFor={`link-text-${link.id}`}>Display Text</EditorLabel>
                                                <EditorInput id={`link-text-${link.id}`} placeholder="e.g., My GitHub" value={link.text} onChange={e => updateLink(link.id, 'text', e.target.value)} />
                                            </div>
                                        </div>
                                        <div>
                                            <EditorLabel htmlFor={`link-url-${link.id}`}>URL</EditorLabel>
                                            <EditorInput id={`link-url-${link.id}`} placeholder="https://..." value={link.url} onChange={e => updateLink(link.id, 'url', e.target.value)} type="url" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
                                <p className="text-sm text-slate-600 dark:text-slate-400">{t('links.emptyState')}</p>
                            </div>
                        )}
                        <Button size="sm" variant="secondary" onClick={addLink}><Plus size={14} className="me-2"/>{t('addLink')}</Button>
                    </>
                )
            }
            case 'experience': {
                const b = block as ExperienceBlock;
                const updateItem = (itemId: string, field: keyof Omit<ExperienceItem, 'id'>, value: string) => {
                    const newItems = b.items.map(item => item.id === itemId ? {...item, [field]: value} : item);
                    handleFieldChange('items', newItems);
                }
                const addItem = () => {
                    const newItem: ExperienceItem = { id: `exp-${Date.now()}`, title: 'New Role', company: 'New Company', dateRange: 'Date Range', description: 'Your responsibilities here.' };
                    handleFieldChange('items', [...b.items, newItem]);
                }
                const removeItem = (itemId: string) => {
                    handleFieldChange('items', b.items.filter(item => item.id !== itemId));
                }
                return (
                    <>
                        {b.items.length > 0 ? (
                            <div className="space-y-3">
                                <EditorLabel>Experience Items</EditorLabel>
                                {b.items.map(item => (
                                    <div key={item.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
                                        <div className="flex justify-end"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeItem(item.id)}><X size={14} /></Button></div>
                                        <EditorInput placeholder="Job Title" value={item.title} onChange={e => updateItem(item.id, 'title', e.target.value)} />
                                        <EditorInput placeholder="Company Name" value={item.company} onChange={e => updateItem(item.id, 'company', e.target.value)} />
                                        <EditorInput placeholder="Date Range (e.g., Jan 2022 - Present)" value={item.dateRange} onChange={e => updateItem(item.id, 'dateRange', e.target.value)} />
                                        <EditorTextarea placeholder="Description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} rows={3} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
                                <p className="text-sm text-slate-600 dark:text-slate-400">{t('experience.emptyState')}</p>
                            </div>
                        )}
                        <Button size="sm" variant="secondary" onClick={addItem}><Plus size={14} className="me-2"/>{t('addExperienceItem')}</Button>
                    </>
                )
            }
             case 'contact': {
                const b = block as ContactBlock;
                return (
                    <>
                        <div>
                            <EditorLabel htmlFor={`c-buttonText-${b.id}`}>Button Text</EditorLabel>
                            <EditorInput id={`c-buttonText-${b.id}`} value={b.buttonText} onChange={e => handleFieldChange('buttonText', e.target.value)} />
                        </div>
                    </>
                )
            }
            case 'code': {
                const b = block as CodeBlock;
                return (
                    <>
                        <div>
                            <EditorLabel htmlFor={`code-lang-${b.id}`}>{t('code.language')}</EditorLabel>
                            <EditorInput id={`code-lang-${b.id}`} value={b.language} onChange={e => handleFieldChange('language', e.target.value)} placeholder="e.g., JavaScript" />
                        </div>
                        <div>
                            <EditorLabel htmlFor={`code-code-${b.id}`}>{t('code.code')}</EditorLabel>
                            <EditorTextarea id={`code-code-${b.id}`} value={b.code} onChange={e => handleFieldChange('code', e.target.value)} rows={10} className="font-mono text-sm" />
                        </div>
                    </>
                )
            }
            case 'services': {
                const b = block as ServicesBlock;
                const updateTier = (tierId: string, field: keyof Omit<PricingTier, 'id' | 'features' | 'isFeatured'>, value: string) => {
                    const newTiers = b.tiers.map(tier => tier.id === tierId ? {...tier, [field]: value} : tier);
                    handleFieldChange('tiers', newTiers);
                }
                const updateTierFeatures = (tierId: string, value: string) => {
                    const newTiers = b.tiers.map(tier => tier.id === tierId ? {...tier, features: value.split('\n')} : tier);
                    handleFieldChange('tiers', newTiers);
                }
                const toggleFeatured = (tierId: string) => {
                    const currentTier = b.tiers.find(t => t.id === tierId);
                    if (!currentTier) return;
                    const shouldBeFeatured = !currentTier.isFeatured;
                    const newTiers = b.tiers.map(tier => ({
                        ...tier,
                        isFeatured: (tier.id === tierId) ? shouldBeFeatured : false
                    }));
                    handleFieldChange('tiers', newTiers);
                }
                const addTier = () => {
                    const newTier: PricingTier = { id: `tier-${Date.now()}`, title: 'New Plan', price: '$0', frequency: '/mo', description: 'A great starting point for new customers.', features: ['Feature 1', 'Feature 2'], buttonText: 'Sign Up', isFeatured: false };
                    handleFieldChange('tiers', [...b.tiers, newTier]);
                }
                const removeTier = (tierId: string) => {
                    handleFieldChange('tiers', b.tiers.filter(tier => tier.id !== tierId));
                }
                return (
                    <>
                        {b.tiers.length > 0 ? (
                            <div className="space-y-3">
                                <EditorLabel>Pricing Tiers</EditorLabel>
                                {b.tiers.map(tier => (
                                    <div key={tier.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <input type="checkbox" id={`featured-${tier.id}`} checked={tier.isFeatured} onChange={() => toggleFeatured(tier.id)} className="h-4 w-4 text-teal-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 rounded focus:ring-teal-500" />
                                                <label htmlFor={`featured-${tier.id}`} className="ms-2 text-sm text-slate-600 dark:text-slate-400">{t('markAsFeatured')}</label>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeTier(tier.id)}><X size={14} /></Button>
                                        </div>
                                        <EditorInput placeholder={t('tierName')} value={tier.title} onChange={e => updateTier(tier.id, 'title', e.target.value)} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <EditorInput placeholder={t('price')} value={tier.price} onChange={e => updateTier(tier.id, 'price', e.target.value)} />
                                            <EditorInput placeholder={t('frequency')} value={tier.frequency} onChange={e => updateTier(tier.id, 'frequency', e.target.value)} />
                                        </div>
                                        <EditorInput placeholder={t('description')} value={tier.description} onChange={e => updateTier(tier.id, 'description', e.target.value)} />
                                        <EditorTextarea placeholder={t('features')} value={tier.features.join('\n')} onChange={e => updateTierFeatures(tier.id, e.target.value)} rows={3} />
                                        <EditorInput placeholder={t('buttonText')} value={tier.buttonText} onChange={e => updateTier(tier.id, 'buttonText', e.target.value)} />
                                        <EditorInput placeholder={t('buttonLink')} value={tier.link || ''} onChange={e => updateTier(tier.id, 'link', e.target.value)} type="url" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
                                <p className="text-sm text-slate-600 dark:text-slate-400">{t('services.emptyState')}</p>
                            </div>
                        )}
                        <Button size="sm" variant="secondary" onClick={addTier}><Plus size={14} className="me-2"/>{t('addTier')}</Button>
                    </>
                )
            }
            case 'blog': {
                const b = block as BlogBlock;
                const updatePost = (postId: string, field: keyof Omit<BlogPost, 'id'>, value: string) => {
                    const newPosts = b.posts.map(post => post.id === postId ? {...post, [field]: value} : post);
                    handleFieldChange('posts', newPosts);
                }
                const addPost = () => {
                    const newPost: BlogPost = { id: `post-${Date.now()}`, title: 'New Article', excerpt: 'A brief description of the article.', imageUrl: 'https://picsum.photos/seed/new-post-2/600/400', link: '#' };
                    handleFieldChange('posts', [...b.posts, newPost]);
                }
                const removePost = (postId: string) => {
                    handleFieldChange('posts', b.posts.filter(post => post.id !== postId));
                }
                return (
                    <>
                        {b.posts.length > 0 ? (
                            <div className="space-y-3">
                                <EditorLabel>Posts</EditorLabel>
                                {b.posts.map(post => (
                                    <div key={post.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
                                        <div className="flex justify-end"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removePost(post.id)}><X size={14} /></Button></div>
                                        <EditorInput placeholder="Post Title" value={post.title} onChange={e => updatePost(post.id, 'title', e.target.value)} />
                                        <EditorTextarea placeholder="Excerpt" value={post.excerpt} onChange={e => updatePost(post.id, 'excerpt', e.target.value)} rows={2} />
                                        <EditorInput placeholder="Image URL" value={post.imageUrl} onChange={e => updatePost(post.id, 'imageUrl', e.target.value)} />
                                        <EditorInput placeholder="Article Link URL" value={post.link} onChange={e => updatePost(post.id, 'link', e.target.value)} type="url" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
                                <p className="text-sm text-slate-600 dark:text-slate-400">{t('blog.emptyState')}</p>
                            </div>
                        )}
                        <Button size="sm" variant="secondary" onClick={addPost}><Plus size={14} className="me-2"/>{t('addPost')}</Button>
                    </>
                )
            }
        }
    }
    
    const fields = renderFields();
    const currentBg = block.designOverrides?.background;
    const gradient = typeof currentBg === 'object' ? currentBg : { direction: 90, color1: '#ffffff', color2: '#f0f0f0'};

    return (
        <div className="space-y-4">
            {fields && <div className="space-y-4">{fields}</div>}
             <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <details className="">
                    <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400 list-none flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span>Style Overrides (Advanced)</span>
                        </div>
                         <svg className="w-4 h-4 transition-transform transform details-arrow" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </summary>
                    <div className="mt-4 space-y-4">
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
                                    <EditorInput 
                                        id={`override-bg-${block.id}`}
                                        type="text"
                                        value={typeof currentBg === 'string' ? currentBg : ''}
                                        placeholder="Default (e.g., #020617)"
                                        onChange={e => handleBackgroundChange(e.target.value || undefined)}
                                    />
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                         <input
                                            type="color"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            value={typeof currentBg === 'string' ? currentBg : '#ffffff'}
                                            onChange={e => handleBackgroundChange(e.target.value)}
                                        />
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
                            <EditorLabel htmlFor={`override-bgImage-${block.id}`}>Background Image URL</EditorLabel>
                            <div className="flex items-center gap-2">
                                <EditorInput
                                    id={`override-bgImage-${block.id}`}
                                    type="text"
                                    value={block.designOverrides?.backgroundImage || ''}
                                    placeholder="None (or paste URL)"
                                    onChange={e => handleDesignOverrideChange('backgroundImage', e.target.value || undefined)}
                                />
                                {block.designOverrides?.backgroundImage && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50"
                                        onClick={() => {
                                            handleDesignOverrideChange('backgroundImage', undefined);
                                            handleDesignOverrideChange('backgroundOpacity', undefined);
                                            handleDesignOverrideChange('textColor', undefined);
                                        }}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>

                        {block.designOverrides?.backgroundImage && (
                            <>
                                <div>
                                    <EditorLabel>Image Opacity ({block.designOverrides?.backgroundOpacity ?? 1})</EditorLabel>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={block.designOverrides?.backgroundOpacity ?? 1}
                                        onChange={e => handleDesignOverrideChange('backgroundOpacity', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <EditorLabel>Text Color Override</EditorLabel>
                                    <input
                                        type="color"
                                        value={block.designOverrides?.textColor || '#FFFFFF'}
                                        onChange={e => handleDesignOverrideChange('textColor', e.target.value)}
                                        className="w-full h-10 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent"
                                    />
                                </div>
                            </>
                        )}
                         <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                            <details className="group">
                                <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400 list-none flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Waves size={16}/>
                                        <span>Shape Dividers</span>
                                    </div>
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
                            <EditorLabel>Animation Style Override</EditorLabel>
                            <select
                                value={block.designOverrides?.animationStyle || ''}
                                onChange={e => handleDesignOverrideChange('animationStyle', e.target.value || undefined)}
                                className="block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500"
                            >
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
                    </div>
                </details>
             </div>
        </div>
    )
};

export default BlockEditor;