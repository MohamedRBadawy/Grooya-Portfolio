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

const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1].split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
    }
    return null; // Not a supported video URL
};

const MediaComponent: React.FC<{ block: any, design: Portfolio['design'] }> = ({ block, design }) => {
    const mediaType = block.mediaType || 'image'; // Default to image if not specified
    
    if (mediaType === 'video') {
        const embedUrl = getVideoEmbedUrl(block.mediaUrl);
        if (embedUrl) {
            return (
                <div className={`aspect-video w-full overflow-hidden ${cornerRadiusStyles[design.cornerRadius]}`}>
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={block.title || 'Embedded video'}
                    ></iframe>
                </div>
            );
        }
    }

    // Fallback to image if it's an image type or an unsupported video URL
    return <img src={block.mediaUrl} alt={block.title} className={`w-full h-auto object-cover ${cornerRadiusStyles[design.cornerRadius]}`} loading="lazy" decoding="async" />;
};


export const AboutBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const textColor = hasBgImage ? '#f1f5f9' : theme.text;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';

    const textContent = (
        <div className="w-full">
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
    );

    if (!block.mediaUrl) {
        return (
            <div id={block.id}>
                <div className={`mx-auto px-4 text-center ${design.pageWidth === 'full' ? 'w-full' : 'container max-w-3xl'}`}>
                    {textContent}
                </div>
            </div>
        );
    }
    
    const position = block.mediaPosition || 'left';
    const isVertical = position === 'top' || position === 'bottom';
    const isHorizontal = position === 'left' || position === 'right';

    const mediaContainerClasses = isHorizontal ? `w-full md:w-5/12 lg:w-4/12` : `w-full`;
    const stickyMediaClasses = block.stickyMedia && isHorizontal ? `md:sticky md:top-24` : '';
    const layoutClasses = isVertical ? 'flex-col' : 'flex-col md:flex-row';
    
    const mediaElement = (
        <motion.div variants={itemVariant} className={mediaContainerClasses}>
            <div className={stickyMediaClasses}>
                <MediaComponent block={block} design={design} />
            </div>
        </motion.div>
    );

    const textElement = (
         <motion.div variants={itemVariant} className={isHorizontal ? 'w-full md:w-7/12 lg:w-8/12' : 'w-full'}>
            {textContent}
        </motion.div>
    );
    
    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 flex ${layoutClasses} gap-8 md:gap-12 items-start ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                {position === 'top' && <>{mediaElement}{textElement}</>}
                {position === 'bottom' && <>{textElement}{mediaElement}</>}
                {position === 'left' && <>{mediaElement}{textElement}</>}
                {position === 'right' && <>{textElement}{mediaElement}</>}
            </div>
        </div>
    );
};