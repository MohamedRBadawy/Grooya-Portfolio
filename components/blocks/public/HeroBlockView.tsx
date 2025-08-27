

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

    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';

    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const hasFallbackImage = block.imageUrl && block.imageUrl.trim() !== '';

    if (hasBgImage || hasFallbackImage) {
        const bgImage = block.designOverrides?.backgroundImage || block.imageUrl;
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
                            className={`text-4xl md:text-6xl font-heading text-white ${fontWeightHeadingClass} ${letterSpacingClass}`}
                        />
                    </motion.div>
                    <motion.div variants={itemVariant} className="overflow-hidden">
                        <EditableText
                            as="p"
                            value={block.subheadline}
                            onSave={(value) => onUpdateBlock?.(block.id, 'subheadline', value)}
                            isEditable={isEditable}
                            className={`mt-4 text-lg md:text-xl max-w-3xl mx-auto text-slate-200`}
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