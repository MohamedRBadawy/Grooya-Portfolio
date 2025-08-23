
import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio } from '../../../types';
import EditableText from '../../ui/EditableText';
import { cornerRadiusStyles, fontWeightStyles, letterSpacingStyles, shadowStyles } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const VideoBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const getVideoEmbedUrl = (url: string) => {
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
        return null;
    };
    const embedUrl = getVideoEmbedUrl(block.videoUrl);
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const captionColor = hasBgImage ? '#f1f5f9' : theme.subtle;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const shadowClass = shadowStyles[design.shadowStyle] || 'shadow-md';

    return (
         <div id={block.id}>
            <div className={`mx-auto px-4 text-center ${design.pageWidth === 'full' ? 'w-full max-w-4xl' : 'container max-w-4xl'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-8 font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                <motion.div variants={itemVariant}>
                {embedUrl ? (
                    <div className={`aspect-video border ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass} overflow-hidden`} style={{ borderColor: theme.cardBorder }}>
                        <iframe
                            src={embedUrl}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Embedded video"
                        ></iframe>
                    </div>
                ) : (
                    <div className={`aspect-video border flex items-center justify-center ${cornerRadiusStyles[design.cornerRadius]}`} style={{ backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }}>
                        <p style={{ color: theme.subtle }}>Invalid video URL. Please use a valid YouTube or Vimeo link.</p>
                    </div>
                )}
                </motion.div>
                <motion.div variants={itemVariant}><EditableText as="p" value={block.caption} onSave={(value) => onUpdateBlock?.(block.id, 'caption', value)} isEditable={isEditable} className={`mt-4 text-center`} style={{ color: captionColor }} /></motion.div>
            </div>
        </div>
    )
};
