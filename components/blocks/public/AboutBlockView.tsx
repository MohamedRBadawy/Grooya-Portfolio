
import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio } from '../../../types';
import EditableText from '../../ui/EditableText';
import { cornerRadiusStyles, fontWeightStyles, letterSpacingStyles } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const AboutBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const textColor = hasBgImage ? '#f1f5f9' : theme.text;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';

    if (!block.imageUrl) {
        return (
            <div id={block.id}>
                <div className={`mx-auto px-4 text-center ${design.pageWidth === 'full' ? 'w-full' : 'container max-w-3xl'}`}>
                    <motion.div variants={itemVariant} className="overflow-hidden">
                        <EditableText
                            as="h2"
                            value={block.title}
                            onSave={(value) => onUpdateBlock?.(block.id, 'title', value)}
                            isEditable={isEditable}
                            className={`text-3xl mb-4 font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                            style={{ color: headingColor }}
                        />
                     </motion.div>
                     <motion.div variants={itemVariant}>
                         <EditableText
                            as="div"
                            multiline
                            value={block.content}
                            onSave={(value) => onUpdateBlock?.(block.id, 'content', value)}
                            isEditable={isEditable}
                            style={{ color: textColor }}
                        />
                     </motion.div>
                </div>
            </div>
        );
    }
    
    // Two-column layout with sticky image
    const imageContainerClasses = `w-full md:w-5/12 lg:w-4/12`;
    const stickyImageClasses = block.stickyImage ? `md:sticky md:top-24` : '';
    const textContainerClasses = 'w-full md:w-7/12 lg:w-8/12';
    const flexOrderClass = block.imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row';

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 flex flex-col ${flexOrderClass} gap-8 md:gap-12 items-start ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className={imageContainerClasses}>
                    <div className={stickyImageClasses}>
                        <img src={block.imageUrl} alt={block.title} className={`w-full h-auto object-cover ${cornerRadiusStyles[design.cornerRadius]}`} />
                    </div>
                </motion.div>
                <motion.div variants={itemVariant} className={textContainerClasses}>
                    <EditableText
                        as="h2"
                        value={block.title}
                        onSave={(value) => onUpdateBlock?.(block.id, 'title', value)}
                        isEditable={isEditable}
                        className={`text-3xl mb-4 font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                        style={{ color: headingColor }}
                    />
                    <EditableText
                        as="div"
                        multiline
                        value={block.content}
                        onSave={(value) => onUpdateBlock?.(block.id, 'content', value)}
                        isEditable={isEditable}
                        style={{ color: textColor }}
                    />
                </motion.div>
            </div>
        </div>
    );
};
