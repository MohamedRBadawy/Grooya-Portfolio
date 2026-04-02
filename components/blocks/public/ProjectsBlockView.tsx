import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio, Project } from '../../../types';
import EditableText from '../../ui/EditableText';
import { cornerRadiusStyles, fontWeightStyles, letterSpacingStyles, shadowStyles, hexToRgba, getCardStyles, getGridGapClass } from './utils';

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
    const { backgroundImage, textColor: textColorOverride } = block.designOverrides || {};
    const hasBgImage = !!backgroundImage;
    const headingColor = textColorOverride || (hasBgImage ? '#FFFFFF' : theme.heading);
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const shadowClass = shadowStyles[design.shadowStyle] || 'shadow-md';
    const cardStyles = getCardStyles(design, theme);
    const gridGapClass = getGridGapClass(design.gridGap);
    const layoutVariant = block.layoutVariant || 'grid';

    if (layoutVariant === 'spotlight' && projects.length > 0) {
        const [featuredProject, ...otherProjects] = projects;

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
                    <motion.div variants={itemVariant} className={`grid gap-6 lg:grid-cols-[1.5fr_1fr] ${gridGapClass}`}>
                        <div className={`overflow-hidden ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass}`} style={cardStyles}>
                            <img src={featuredProject.imageUrl} alt={featuredProject.title} className="h-80 w-full object-cover" loading="lazy" decoding="async" />
                            <div className="space-y-4 p-8">
                                <h3 className={`text-3xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: theme.heading }}>{featuredProject.title}</h3>
                                <p style={{ color: theme.text }}>{featuredProject.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {featuredProject.technologies.map((tech) => (
                                        <span key={tech} className="rounded-full px-2 py-1 text-xs font-medium" style={{ backgroundColor: hexToRgba(design.accentColor, 0.1), color: design.accentColor }}>{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {otherProjects.map((project) => (
                                <div key={project.id} className={`overflow-hidden ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass}`} style={cardStyles}>
                                    <div className="grid grid-cols-[96px_1fr] gap-4 p-4">
                                        <img src={project.imageUrl} alt={project.title} className="h-24 w-24 rounded-2xl object-cover" loading="lazy" decoding="async" />
                                        <div>
                                            <h3 className={`text-lg font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: theme.heading }}>{project.title}</h3>
                                            <p className="mt-2 text-sm" style={{ color: theme.subtle }}>{project.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (layoutVariant === 'alternating') {
        return (
            <div id={block.id}>
                <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                    <motion.div variants={itemVariant} className="overflow-hidden">
                        <EditableText
                            as="h2"
                            value={block.title}
                            onSave={(value) => onUpdateBlock?.(block.id, 'title', value)}
                            isEditable={isEditable}
                            className={`text-3xl mb-10 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                            style={{ color: headingColor }}
                        />
                    </motion.div>
                    <div className="space-y-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                variants={itemVariant}
                                className={`grid items-center gap-6 ${index % 2 === 0 ? 'lg:grid-cols-[1.1fr_0.9fr]' : 'lg:grid-cols-[0.9fr_1.1fr]'}`}
                            >
                                <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                                    <img src={project.imageUrl} alt={project.title} className={`h-72 w-full object-cover ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass}`} loading="lazy" decoding="async" />
                                </div>
                                <div className={index % 2 === 0 ? 'order-2' : 'order-1'}>
                                    <h3 className={`text-2xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: theme.heading }}>{project.title}</h3>
                                    <p className="mt-3" style={{ color: theme.text }}>{project.description}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {project.technologies.map((tech) => (
                                            <span key={tech} className="rounded-full px-2 py-1 text-xs font-medium" style={{ backgroundColor: hexToRgba(design.accentColor, 0.1), color: design.accentColor }}>{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
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
                <motion.div variants={itemVariant} className={`grid md:grid-cols-2 ${gridGapClass}`}>
                    {projects.map(project => {
                        const Wrapper = project.link ? 'a' : 'div';
                        const props = project.link ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' } : {};
                        const commonClasses = `block overflow-hidden ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass}`;
                        const hoverClasses = project.link ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : '';

                        return (
                            <Wrapper 
                                key={project.id} 
                                {...props} 
                                className={`${commonClasses} ${hoverClasses}`}
                                style={cardStyles}
                            >
                                <img src={project.imageUrl} alt={project.title} className="w-full h-56 object-cover" loading="lazy" decoding="async" />
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
