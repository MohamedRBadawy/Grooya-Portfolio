import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio } from '../../../types';
import EditableText from '../../ui/EditableText';
import { cornerRadiusStyles, fontWeightStyles, letterSpacingStyles, getGridGapClass } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const GalleryBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const captionColor = hasBgImage ? '#f1f5f9' : theme.subtle;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const gridGapClass = getGridGapClass(design.gridGap);

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-8 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                <motion.div variants={itemVariant} className={block.layout === 'masonry' ? `columns-1 sm:columns-2 md:columns-3 ${gridGapClass}` : `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridGapClass}`}>
                    {block.images.map((image: any) => (
                        <div key={image.id} className="mb-4 break-inside-avoid">
                            <img src={image.url} alt={image.caption} className={`w-full h-auto object-cover ${cornerRadiusStyles[design.cornerRadius]}`} />
                            {image.caption && <p className={`mt-2 text-sm text-center`} style={{ color: captionColor }}>{image.caption}</p>}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};