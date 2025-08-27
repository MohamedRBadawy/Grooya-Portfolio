

import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio, ExternalLink } from '../../../types';
import EditableText from '../../ui/EditableText';
import { Github, Linkedin, Twitter, Globe, Link as LinkIcon } from 'lucide-react';
import { cornerRadiusStyles, fontWeightStyles, letterSpacingStyles } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

const PlatformIcon: React.FC<{platform: ExternalLink['platform']}> = ({ platform }) => {
    switch (platform) {
        case 'github': return <Github size={20} className="inline-block me-2" />;
        case 'linkedin': return <Linkedin size={20} className="inline-block me-2" />;
        case 'twitter': return <Twitter size={20} className="inline-block me-2" />;
        case 'website': return <Globe size={20} className="inline-block me-2" />;
        default: return <LinkIcon size={20} className="inline-block me-2" />;
    }
};

export const LinksBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    
    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 text-center ${design.pageWidth === 'full' ? 'w-full max-w-3xl' : 'container max-w-3xl'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden">
                    <EditableText
                        as="h2"
                        value={block.title}
                        onSave={(value) => onUpdateBlock?.(block.id, 'title', value)}
                        isEditable={isEditable}
                        className={`text-3xl mb-8 font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                        style={{ color: headingColor }}
                    />
                </motion.div>
                <motion.div variants={itemVariant} className="flex flex-wrap justify-center gap-4">
                    {block.links.map((link: ExternalLink) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ backgroundColor: design.accentColor }}
                            className={`inline-flex items-center px-6 py-3 font-semibold text-white transform hover:scale-105 transition-transform ${cornerRadiusStyles[design.cornerRadius]}`}
                        >
                            <PlatformIcon platform={link.platform} />
                            {link.text || link.platform}
                        </a>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};