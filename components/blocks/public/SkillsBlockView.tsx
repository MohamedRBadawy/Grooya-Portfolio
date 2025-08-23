
import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio, Skill } from '../../../types';
import EditableText from '../../ui/EditableText';
import { cornerRadiusStyles, fontWeightStyles, letterSpacingStyles } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
    allSkills: Skill[];
}

export const SkillsBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, allSkills, isEditable, onUpdateBlock }) => {
    const skills = allSkills.filter(s => block.skillIds.includes(s.id));
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const skillBg = hasBgImage ? 'rgba(255, 255, 255, 0.1)' : theme.cardBackground;
    const skillBorder = hasBgImage ? 'rgba(255, 255, 255, 0.2)' : theme.cardBorder;
    const skillColor = hasBgImage ? '#FFFFFF' : theme.text;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    
    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full max-w-4xl' : 'container max-w-4xl'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden">
                    <EditableText
                        as="h2"
                        value={block.title}
                        onSave={(value) => onUpdateBlock?.(block.id, 'title', value)}
                        isEditable={isEditable}
                        className={`text-3xl mb-8 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                        style={{ color: headingColor }}
                    />
                </motion.div>
                <motion.div variants={itemVariant} className="flex flex-wrap justify-center gap-3">
                    {skills.map(skill => (
                        <span key={skill.id} className={`px-4 py-2 font-medium border ${cornerRadiusStyles[design.cornerRadius]}`} style={{ backgroundColor: skillBg, borderColor: skillBorder, color: skillColor }}>
                            {skill.name}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
