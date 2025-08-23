
import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio, Project } from '../../../types';
import EditableText from '../../ui/EditableText';
import { cornerRadiusStyles, fontWeightStyles, letterSpacingStyles, shadowStyles, hexToRgba } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
    allProjects: Project[];
}

export const ProjectsBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, allProjects, isEditable, onUpdateBlock }) => {
    const projects = allProjects.filter(p => block.projectIds.includes(p.id));
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const shadowClass = shadowStyles[design.shadowStyle] || 'shadow-md';
    
    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
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
                <motion.div variants={itemVariant} className="grid md:grid-cols-2 gap-8">
                    {projects.map(project => {
                        const Wrapper = project.link ? 'a' : 'div';
                        const props = project.link ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' } : {};
                        const commonClasses = `block overflow-hidden border ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass}`;
                        const hoverClasses = project.link ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : '';

                        return (
                            <Wrapper 
                                key={project.id} 
                                {...props} 
                                className={`${commonClasses} ${hoverClasses}`}
                                style={{ backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }}
                            >
                                <img src={project.imageUrl} alt={project.title} className="w-full h-56 object-cover" />
                                <div className="p-6">
                                    <h3 className={`text-xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: theme.heading }}>{project.title}</h3>
                                    <p className={`mt-2`} style={{ color: theme.subtle }}>{project.description}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {project.technologies.map(tech => (
                                            <span key={tech} className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: hexToRgba(design.accentColor, 0.1), color: design.accentColor}}>{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </Wrapper>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    );
};
