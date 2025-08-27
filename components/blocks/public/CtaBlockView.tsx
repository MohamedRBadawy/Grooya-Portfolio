

import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio } from '../../../types';
import EditableText from '../../ui/EditableText';
import { getButtonProps, cornerRadiusStyles, fontWeightStyles, letterSpacingStyles, hexToRgba } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const CtaBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const buttonProps = getButtonProps(design);
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 text-center ${design.pageWidth === 'full' ? 'w-full' : 'container'} ${cornerRadiusStyles[design.cornerRadius]}`} style={{backgroundColor: hasBgImage ? 'transparent' : hexToRgba(design.accentColor, 0.1)}}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{color: hasBgImage ? '#FFFFFF' : design.accentColor}} /></motion.div>
                <motion.div variants={itemVariant}><EditableText as="p" value={block.subtitle} onSave={(value) => onUpdateBlock?.(block.id, 'subtitle', value)} isEditable={isEditable} className={`mt-2 max-w-2xl mx-auto`} style={{color: hasBgImage ? '#f1f5f9' : hexToRgba(design.accentColor, 0.8)}} /></motion.div>
                <motion.div variants={itemVariant} className="mt-8">
                     <EditableText
                        as="a"
                        value={block.buttonText}
                        onSave={(value) => onUpdateBlock?.(block.id, 'buttonText', value)}
                        isEditable={isEditable}
                        href={block.buttonLink}
                        {...buttonProps}
                    />
                </motion.div>
            </div>
        </div>
    );
}