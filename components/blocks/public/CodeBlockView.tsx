
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../hooks/useTranslation';
import type { Portfolio } from '../../../types';
import EditableText from '../../ui/EditableText';
import { Clipboard, Check } from 'lucide-react';
import { cornerRadiusStyles, fontWeightStyles, letterSpacingStyles, shadowStyles } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const CodeBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(block.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const shadowClass = shadowStyles[design.shadowStyle] || 'shadow-md';

    const isDarkTheme = useMemo(() => {
        if (hasBgImage) return true;
        const hexColor = theme.background;
        if (!hexColor || !hexColor.startsWith('#')) return false;
        const color = hexColor.substring(1, 7);
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    }, [theme.background, hasBgImage]);

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full max-w-4xl' : 'container max-w-4xl'}`}>
                 <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-8 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                 <motion.div variants={itemVariant} className={`font-mono text-sm overflow-hidden ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass}`} style={{ backgroundColor: isDarkTheme ? '#0f172a' : '#f1f5f9', color: isDarkTheme ? '#e2e8f0' : '#475569' }}>
                    <div className="flex justify-between items-center px-4 py-2 border-b" style={{ backgroundColor: isDarkTheme ? 'rgba(30, 41, 59, 0.5)' : 'rgba(226, 232, 240, 0.5)', borderColor: isDarkTheme ? 'rgba(51, 65, 85, 0.5)' : theme.cardBorder }}>
                        <span style={{ color: theme.subtle }}>{block.language}</span>
                        <button onClick={handleCopy} className="flex items-center gap-2 text-xs" style={{ color: theme.subtle }}>
                            {copied ? <Check size={14} className="text-teal-400"/> : <Clipboard size={14}/>}
                            {copied ? t('code.copied') : t('code.copy')}
                        </button>
                    </div>
                    <pre className="p-4 overflow-x-auto"><code>{block.code}</code></pre>
                 </motion.div>
            </div>
        </div>
    );
};
