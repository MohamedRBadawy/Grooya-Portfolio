import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio, BlogPost } from '../../../types';
import EditableText from '../../ui/EditableText';
import { cornerRadiusStyles, fontWeightStyles, letterSpacingStyles, shadowStyles, getCardStyles, getGridGapClass } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const BlogBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const shadowClass = shadowStyles[design.shadowStyle] || 'shadow-md';
    const cardStyles = getCardStyles(design, theme);
    const gridGapClass = getGridGapClass(design.gridGap);
    
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
                <motion.div variants={itemVariant} className={`grid md:grid-cols-2 lg:grid-cols-3 ${gridGapClass}`}>
                    {block.posts.map((post: BlogPost) => (
                        <a 
                            key={post.id} 
                            href={post.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`block group overflow-hidden ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass} transition-all duration-300 hover:-translate-y-1`}
                            style={cardStyles}
                        >
                            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="p-6">
                                <h3 className={`text-xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: theme.heading }}>{post.title}</h3>
                                <p className={`mt-2 text-sm line-clamp-3`} style={{ color: theme.subtle }}>{post.excerpt}</p>
                            </div>
                        </a>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};