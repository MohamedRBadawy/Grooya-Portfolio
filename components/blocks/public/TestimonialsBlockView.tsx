import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio } from '../../../types';
import EditableText from '../../ui/EditableText';
import { cornerRadiusStyles, fontWeightStyles, letterSpacingStyles, shadowStyles, getCardStyles } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const TestimonialsBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const shadowClass = shadowStyles[design.shadowStyle] || 'shadow-md';
    const cardStyles = getCardStyles(design, theme);
    
    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-12 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                <motion.div variants={itemVariant} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {block.testimonials.map((testimonial: any) => (
                        <div key={testimonial.id} className={`p-6 ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass}`} style={cardStyles}>
                            <p className={`italic`} style={{ color: theme.text }}>"{testimonial.quote}"</p>
                            <div className="flex items-center mt-4">
                                {testimonial.authorAvatarUrl && <img src={testimonial.authorAvatarUrl} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4" loading="lazy" decoding="async" />}
                                <div>
                                    <p className={`font-heading ${fontWeightHeadingClass}`} style={{ color: theme.heading }}>{testimonial.author}</p>
                                    <p style={{ color: theme.subtle }}>{testimonial.authorTitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};