
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

export const ResumeBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const buttonProps = getButtonProps(design);
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const textColor = hasBgImage ? '#f1f5f9' : theme.text;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 text-center ${design.pageWidth === 'full' ? 'w-full max-w-3xl' : 'container max-w-3xl'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-4 font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                <motion.div variants={itemVariant}><EditableText as="p" multiline value={block.description} onSave={(value) => onUpdateBlock?.(block.id, 'description', value)} isEditable={isEditable} className={`mb-8`} style={{ color: textColor }} /></motion.div>
                <motion.div variants={itemVariant}>
                <EditableText
                    as="a"
                    value={block.buttonText}
                    onSave={(value) => onUpdateBlock?.(block.id, 'buttonText', value)}
                    isEditable={isEditable}
                    href={block.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...buttonProps}
                />
                </motion.div>
            </div>
        </div>
    )
};
