

import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio } from '../../../types';
import EditableText from '../../ui/EditableText';
import { getButtonProps, fontWeightStyles, letterSpacingStyles } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const HeroBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const buttonProps = getButtonProps(design);
    const { textColor: textColorOverride } = block.designOverrides || {};
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const layoutVariant = block.layoutVariant || 'centered';

    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const hasFallbackImage = block.imageUrl && block.imageUrl.trim() !== '';
    const shouldRenderMedia = hasBgImage || hasFallbackImage;

    if (shouldRenderMedia && layoutVariant === 'split') {
        const bgImage = block.designOverrides?.backgroundImage || block.imageUrl;
        const finalTextColor = textColorOverride || (hasBgImage ? '#FFFFFF' : theme.heading);
        const finalSubtleTextColor = textColorOverride || (hasBgImage ? '#f1f5f9' : theme.subtle);

        return (
            <div className="relative" id={block.id}>
                <div className={`mx-auto grid items-center gap-10 px-4 lg:grid-cols-2 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                    <div className="relative z-10">
                        <motion.div variants={itemVariant} className="overflow-hidden">
                            <EditableText
                                as="h1"
                                value={block.headline}
                                onSave={(value) => onUpdateBlock?.(block.id, 'headline', value)}
                                isEditable={isEditable}
                                className={`text-4xl md:text-6xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                                style={{ color: finalTextColor }}
                            />
                        </motion.div>
                        <motion.div variants={itemVariant} className="overflow-hidden">
                            <EditableText
                                as="p"
                                value={block.subheadline}
                                onSave={(value) => onUpdateBlock?.(block.id, 'subheadline', value)}
                                isEditable={isEditable}
                                className="mt-4 max-w-2xl text-lg md:text-xl"
                                style={{ color: finalSubtleTextColor }}
                            />
                        </motion.div>
                        <motion.div variants={itemVariant} className="mt-8">
                            <EditableText
                                as="a"
                                value={block.ctaText}
                                onSave={(value) => onUpdateBlock?.(block.id, 'ctaText', value)}
                                isEditable={isEditable}
                                href={block.ctaLink}
                                {...buttonProps}
                            />
                        </motion.div>
                    </div>
                    <motion.div variants={itemVariant} className="overflow-hidden">
                        <img src={bgImage} alt={block.headline} className="h-[420px] w-full rounded-[2rem] object-cover shadow-2xl" loading="eager" />
                    </motion.div>
                </div>
            </div>
        );
    }

    if (shouldRenderMedia && layoutVariant === 'editorial') {
        const bgImage = block.designOverrides?.backgroundImage || block.imageUrl;
        const finalTextColor = textColorOverride || (hasBgImage ? '#FFFFFF' : theme.heading);
        const finalSubtleTextColor = textColorOverride || (hasBgImage ? '#f1f5f9' : theme.subtle);

        return (
            <div className="relative" id={block.id}>
                <div className={`mx-auto grid gap-10 px-4 lg:grid-cols-[1.3fr_0.7fr] ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                    <div className="relative z-10 max-w-4xl">
                        <motion.p variants={itemVariant} className="mb-4 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: design.accentColor }}>
                            Portfolio Highlight
                        </motion.p>
                        <motion.div variants={itemVariant} className="overflow-hidden">
                            <EditableText
                                as="h1"
                                value={block.headline}
                                onSave={(value) => onUpdateBlock?.(block.id, 'headline', value)}
                                isEditable={isEditable}
                                className={`text-5xl md:text-7xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                                style={{ color: finalTextColor }}
                            />
                        </motion.div>
                        <motion.div variants={itemVariant} className="overflow-hidden">
                            <EditableText
                                as="p"
                                value={block.subheadline}
                                onSave={(value) => onUpdateBlock?.(block.id, 'subheadline', value)}
                                isEditable={isEditable}
                                className="mt-6 max-w-3xl text-lg md:text-2xl"
                                style={{ color: finalSubtleTextColor }}
                            />
                        </motion.div>
                        <motion.div variants={itemVariant} className="mt-8">
                            <EditableText
                                as="a"
                                value={block.ctaText}
                                onSave={(value) => onUpdateBlock?.(block.id, 'ctaText', value)}
                                isEditable={isEditable}
                                href={block.ctaLink}
                                {...buttonProps}
                            />
                        </motion.div>
                    </div>
                    <motion.div variants={itemVariant} className="flex items-end justify-end">
                        <div className="w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
                            <img src={bgImage} alt={block.headline} className="h-[360px] w-full object-cover" loading="eager" />
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (shouldRenderMedia) {
        const bgImage = block.designOverrides?.backgroundImage || block.imageUrl;
        const finalTextColor = textColorOverride || '#FFFFFF';
        const finalSubtleTextColor = textColorOverride || '#f1f5f9';
        
        return (
            <div 
                className={`text-center relative bg-cover bg-center h-full flex flex-col items-center justify-center`} 
                id={block.id}
                style={{ backgroundImage: design.parallax ? 'none' : `url("${bgImage}")` }} // Don't set image here if parallax is on
            >
                {/* Overlay is handled by parent for parallax */}
                {!design.parallax && <div className="absolute inset-0 bg-black/60"></div>}

                <div className={`mx-auto px-4 relative z-10 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                    <motion.div variants={itemVariant} className="overflow-hidden">
                        <EditableText
                            as="h1"
                            value={block.headline}
                            onSave={(value) => onUpdateBlock?.(block.id, 'headline', value)}
                            isEditable={isEditable}
                            className={`text-4xl md:text-6xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                            style={{ color: finalTextColor }}
                        />
                    </motion.div>
                    <motion.div variants={itemVariant} className="overflow-hidden">
                        <EditableText
                            as="p"
                            value={block.subheadline}
                            onSave={(value) => onUpdateBlock?.(block.id, 'subheadline', value)}
                            isEditable={isEditable}
                            className={`mt-4 text-lg md:text-xl max-w-3xl mx-auto`}
                             style={{ color: finalSubtleTextColor }}
                        />
                    </motion.div>
                     <motion.div variants={itemVariant} className="mt-8">
                        <EditableText
                            as="a"
                            value={block.ctaText}
                            onSave={(value) => onUpdateBlock?.(block.id, 'ctaText', value)}
                            isEditable={isEditable}
                            href={block.ctaLink}
                            {...buttonProps}
                        />
                    </motion.div>
                </div>
            </div>
        );
    }
    
    // Fallback for no image
    return (
        <div className="text-center h-full flex flex-col items-center justify-center" id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden">
                    <EditableText
                        as="h1"
                        value={block.headline}
                        onSave={(value) => onUpdateBlock?.(block.id, 'headline', value)}
                        isEditable={isEditable}
                        className={`text-4xl md:text-6xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                        style={{ color: theme.heading }}
                    />
                </motion.div>
                <motion.div variants={itemVariant} className="overflow-hidden">
                    <EditableText
                        as="p"
                        value={block.subheadline}
                        onSave={(value) => onUpdateBlock?.(block.id, 'subheadline', value)}
                        isEditable={isEditable}
                        className={`mt-4 text-lg md:text-xl max-w-3xl mx-auto`}
                        style={{ color: theme.subtle }}
                    />
                </motion.div>
                 <motion.div variants={itemVariant} className="mt-8">
                    <EditableText
                        as="a"
                        value={block.ctaText}
                        onSave={(value) => onUpdateBlock?.(block.id, 'ctaText', value)}
                        isEditable={isEditable}
                        href={block.ctaLink}
                        {...buttonProps}
                    />
                </motion.div>
            </div>
        </div>
    )
};
