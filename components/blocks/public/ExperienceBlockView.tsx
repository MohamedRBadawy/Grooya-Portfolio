

import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio, ExperienceItem } from '../../../types';
import EditableText from '../../ui/EditableText';
import { fontWeightStyles, letterSpacingStyles, hexToRgba } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const ExperienceBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const textColor = hasBgImage ? '#f1f5f9' : theme.text;
    const subtleColor = hasBgImage ? '#cbd5e1' : theme.subtle;
    const accent = design.accentColor;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    
    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden">
                    <EditableText
                        as="h2"
                        value={block.title}
                        onSave={(value) => onUpdateBlock?.(block.id, 'title', value)}
                        isEditable={isEditable}
                        className={`text-3xl mb-12 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                        style={{ color: headingColor }}
                    />
                </motion.div>
                <motion.div variants={itemVariant} className="relative border-s-2 max-w-3xl mx-auto" style={{ borderColor: hasBgImage ? hexToRgba('#FFFFFF', 0.2) : hexToRgba(design.accentColor, 0.2) }}>
                    {block.items.map((item: ExperienceItem) => (
                        <div key={item.id} className="mb-10 ms-8 relative">
                            <span className="absolute flex items-center justify-center w-4 h-4 rounded-full -start-[9px] border-2" style={{ backgroundColor: hasBgImage ? 'transparent' : theme.background, borderColor: accent }}></span>
                            <h3 className={`text-xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }}>{item.title} at <span style={{ color: accent }}>{item.company}</span></h3>
                            <time className={`block mb-2 text-sm font-normal leading-none`} style={{ color: subtleColor }}>{item.dateRange}</time>
                            <p className={`text-base font-normal`} style={{ color: textColor }}>{item.description}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};