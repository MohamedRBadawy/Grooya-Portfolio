








import React, { useMemo, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Portfolio, PortfolioBlock, Project, Skill, ExternalLink, ExperienceItem, ContactBlock, CodeBlock, PricingTier, BlogPost, Gradient, Page, ShapeDivider, AnimationStyle } from '../types';
import EditableText from '../components/ui/EditableText';
import StickyHeaderNav from '../components/ui/StickyHeaderNav';
import ContextualToolbar from '../components/ui/ContextualToolbar';
import { Github, Linkedin, Twitter, Globe, Link as LinkIcon, Clipboard, Check, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { defaultPalettes } from '../services/palettes';
import ShapeDividerComponent from '../components/ui/ShapeDivider';
import toast from 'react-hot-toast';

// THEME STYLES - are now dynamically generated from palettes

const cornerRadiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-md',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
};

const animationVariants = {
    container: {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: i * 0.1 },
        }),
    },
    item: {
        fadeIn: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 30, stiffness: 200 } } },
        slideInUp: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 30, stiffness: 120 } } },
        scaleIn: { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 30, stiffness: 120 } } },
        slideInFromLeft: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 30, stiffness: 120 } } },
        revealUp: { hidden: { y: '100%', opacity: 0 }, visible: { y: '0%', opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } },
        blurIn: { hidden: { filter: 'blur(8px)', opacity: 0 }, visible: { filter: 'blur(0px)', opacity: 1, transition: { duration: 0.6 } } },
        none: { hidden: {}, visible: {} }
    }
};

const getVariant = (style: AnimationStyle) => animationVariants.item[style] || {};

const fontWeightStyles: { [key: string]: string } = {
    normal: 'font-normal',
    bold: 'font-bold',
};
const lineHeightStyles: { [key: string]: string } = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
};
const letterSpacingStyles: { [key: string]: string } = {
    normal: 'tracking-normal',
    wide: 'tracking-wider',
};

const shadowStyles: { [key: string]: string } = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
};

const hexToRgba = (hex: string, alpha: number) => {
    if (!hex.startsWith('#')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors']; // Palette colors
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

const HeroBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const buttonCornerClass = {
        rounded: design.cornerRadius === 'lg' ? 'rounded-lg' : 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
    }[design.buttonStyle];

    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';

    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const hasFallbackImage = block.imageUrl && block.imageUrl.trim() !== '';

    if (hasBgImage || hasFallbackImage) {
        const bgImage = block.designOverrides?.backgroundImage || block.imageUrl;
        return (
            <div 
                className={`text-center relative bg-cover bg-center h-full flex flex-col items-center justify-center`} 
                id={block.id}
                style={{ backgroundImage: design.parallax ? 'none' : `url("${bgImage}")` }} // Don't set image here if parallax is on
            >
                {/* Overlay is handled by parent for parallax */}
                {!design.parallax && <div className="absolute inset-0 bg-black/60"></div>}

                <div className={`mx-auto px-4 relative z-10 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                    <motion.div variants={itemVariant} className="overflow-hidden">
                        <EditableText
                            as="h1"
                            value={block.headline}
                            onSave={(value) => onUpdateBlock?.(block.id, 'headline', value)}
                            isEditable={isEditable}
                            className={`text-4xl md:text-6xl font-heading text-white ${fontWeightHeadingClass} ${letterSpacingClass}`}
                        />
                    </motion.div>
                    <motion.div variants={itemVariant} className="overflow-hidden">
                        <EditableText
                            as="p"
                            value={block.subheadline}
                            onSave={(value) => onUpdateBlock?.(block.id, 'subheadline', value)}
                            isEditable={isEditable}
                            className={`mt-4 text-lg md:text-xl max-w-3xl mx-auto text-slate-200`}
                        />
                    </motion.div>
                     <motion.div variants={itemVariant} className="mt-8">
                        <EditableText
                            as="a"
                            value={block.ctaText}
                            onSave={(value) => onUpdateBlock?.(block.id, 'ctaText', value)}
                            isEditable={isEditable}
                            href={block.ctaLink}
                            style={{ backgroundColor: design.accentColor }}
                            className={`inline-block px-8 py-3 ${buttonCornerClass} font-semibold text-white`}
                        />
                    </motion.div>
                </div>
            </div>
        );
    }
    
    // Fallback for no image
    return (
        <div className="text-center h-full flex flex-col items-center justify-center" id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden">
                    <EditableText
                        as="h1"
                        value={block.headline}
                        onSave={(value) => onUpdateBlock?.(block.id, 'headline', value)}
                        isEditable={isEditable}
                        className={`text-4xl md:text-6xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                        style={{ color: theme.heading }}
                    />
                </motion.div>
                <motion.div variants={itemVariant} className="overflow-hidden">
                    <EditableText
                        as="p"
                        value={block.subheadline}
                        onSave={(value) => onUpdateBlock?.(block.id, 'subheadline', value)}
                        isEditable={isEditable}
                        className={`mt-4 text-lg md:text-xl max-w-3xl mx-auto`}
                        style={{ color: theme.subtle }}
                    />
                </motion.div>
                 <motion.div variants={itemVariant} className="mt-8">
                    <EditableText
                        as="a"
                        value={block.ctaText}
                        onSave={(value) => onUpdateBlock?.(block.id, 'ctaText', value)}
                        isEditable={isEditable}
                        href={block.ctaLink}
                        style={{ backgroundColor: design.accentColor }}
                        className={`inline-block px-8 py-3 ${buttonCornerClass} font-semibold text-white`}
                    />
                </motion.div>
            </div>
        </div>
    )
};

const AboutBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const textColor = hasBgImage ? '#f1f5f9' : theme.text;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';

    if (!block.imageUrl) {
        return (
            <div id={block.id}>
                <div className={`mx-auto px-4 text-center ${design.pageWidth === 'full' ? 'w-full' : 'container max-w-3xl'}`}>
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
            </div>
        );
    }
    
    // Two-column layout with sticky image
    const imageContainerClasses = `w-full md:w-5/12 lg:w-4/12`;
    const stickyImageClasses = block.stickyImage ? `md:sticky md:top-24` : '';
    const textContainerClasses = 'w-full md:w-7/12 lg:w-8/12';
    const flexOrderClass = block.imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row';

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 flex flex-col ${flexOrderClass} gap-8 md:gap-12 items-start ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className={imageContainerClasses}>
                    <div className={stickyImageClasses}>
                        <img src={block.imageUrl} alt={block.title} className={`w-full h-auto object-cover ${cornerRadiusStyles[design.cornerRadius]}`} />
                    </div>
                </motion.div>
                <motion.div variants={itemVariant} className={textContainerClasses}>
                    <EditableText
                        as="h2"
                        value={block.title}
                        onSave={(value) => onUpdateBlock?.(block.id, 'title', value)}
                        isEditable={isEditable}
                        className={`text-3xl mb-4 font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                        style={{ color: headingColor }}
                    />
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
        </div>
    );
};

const ProjectsBlockView: React.FC<BlockViewProps & {allProjects: Project[]}> = ({ block, design, theme, itemVariant, allProjects, isEditable, onUpdateBlock }) => {
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

const SkillsBlockView: React.FC<BlockViewProps & {allSkills: Skill[]}> = ({ block, design, theme, itemVariant, allSkills, isEditable, onUpdateBlock }) => {
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

const GalleryBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const captionColor = hasBgImage ? '#f1f5f9' : theme.subtle;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-8 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                <motion.div variants={itemVariant} className={block.layout === 'masonry' ? 'columns-1 sm:columns-2 md:columns-3 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'}>
                    {block.images.map((image: any) => (
                        <div key={image.id} className="mb-4 break-inside-avoid">
                            <img src={image.url} alt={image.caption} className={`w-full h-auto object-cover ${cornerRadiusStyles[design.cornerRadius]}`} />
                            {image.caption && <p className={`mt-2 text-sm text-center`} style={{ color: captionColor }}>{image.caption}</p>}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

const TestimonialsBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const shadowClass = shadowStyles[design.shadowStyle] || 'shadow-md';
    
    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-12 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                <motion.div variants={itemVariant} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {block.testimonials.map((testimonial: any) => (
                        <div key={testimonial.id} className={`p-6 border ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass}`} style={{ backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }}>
                            <p className={`italic`} style={{ color: theme.text }}>"{testimonial.quote}"</p>
                            <div className="flex items-center mt-4">
                                {testimonial.authorAvatarUrl && <img src={testimonial.authorAvatarUrl} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4" />}
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

const VideoBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
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

const CtaBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const buttonCornerClass = {
        rounded: design.cornerRadius === 'lg' ? 'rounded-lg' : 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
    }[design.buttonStyle];
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 text-center ${design.pageWidth === 'full' ? 'w-full' : 'container'} ${cornerRadiusStyles[design.cornerRadius]}`} style={{backgroundColor: hasBgImage ? 'transparent' : hexToRgba(design.accentColor, 0.1)}}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{color: hasBgImage ? '#FFFFFF' : design.accentColor}} /></motion.div>
                <motion.div variants={itemVariant}><EditableText as="p" value={block.subtitle} onSave={(value) => onUpdateBlock?.(block.id, 'subtitle', value)} isEditable={isEditable} className={`mt-2 max-w-2xl mx-auto`} style={{color: hasBgImage ? '#f1f5f9' : hexToRgba(design.accentColor, 0.8)}} /></motion.div>
                <motion.div variants={itemVariant} className="mt-8">
                     <EditableText
                        as="a"
                        value={block.buttonText}
                        onSave={(value) => onUpdateBlock?.(block.id, 'buttonText', value)}
                        isEditable={isEditable}
                        href={block.buttonLink}
                        style={{ backgroundColor: design.accentColor }}
                        className={`inline-block px-8 py-3 ${buttonCornerClass} font-semibold text-white`}
                    />
                </motion.div>
            </div>
        </div>
    );
}

const ResumeBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const buttonCornerClass = {
        rounded: design.cornerRadius === 'lg' ? 'rounded-lg' : 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
    }[design.buttonStyle];
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
                    style={{ backgroundColor: design.accentColor }}
                    className={`inline-block px-8 py-3 ${buttonCornerClass} font-semibold text-white`}
                />
                </motion.div>
            </div>
        </div>
    )
};

const PlatformIcon: React.FC<{platform: ExternalLink['platform']}> = ({ platform }) => {
    switch (platform) {
        case 'github': return <Github size={20} className="inline-block me-2" />;
        case 'linkedin': return <Linkedin size={20} className="inline-block me-2" />;
        case 'twitter': return <Twitter size={20} className="inline-block me-2" />;
        case 'website': return <Globe size={20} className="inline-block me-2" />;
        default: return <LinkIcon size={20} className="inline-block me-2" />;
    }
};

const LinksBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
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

const ExperienceBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const textColor = hasBgImage ? '#f1f5f9' : theme.text;
    const subtleColor = hasBgImage ? '#cbd5e1' : theme.subtle;
    const accent = design.accentColor;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    
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
                <motion.div variants={itemVariant} className="relative border-s-2 max-w-3xl mx-auto" style={{ borderColor: hasBgImage ? hexToRgba('#FFFFFF', 0.2) : hexToRgba(design.accentColor, 0.2) }}>
                    {block.items.map((item: ExperienceItem) => (
                        <div key={item.id} className="mb-10 ms-8 relative">
                            <span className="absolute flex items-center justify-center w-4 h-4 rounded-full -start-[9px] border-2" style={{ backgroundColor: hasBgImage ? 'transparent' : theme.background, borderColor: accent }}></span>
                            <h3 className={`text-xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }}>{item.title} at <span style={{ color: accent }}>{item.company}</span></h3>
                            <time className={`block mb-2 text-sm font-normal leading-none`} style={{ color: subtleColor }}>{item.dateRange}</time>
                            <p className={`text-base font-normal`} style={{ color: textColor }}>{item.description}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

const ContactBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const { t } = useTranslation();
    const buttonCornerClass = {
        rounded: design.cornerRadius === 'lg' ? 'rounded-lg' : 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
    }[design.buttonStyle];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast(t('contact.formDisabled'));
    };
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const subtleColor = hasBgImage ? '#cbd5e1' : theme.subtle;
    const inputBg = hasBgImage ? 'rgba(255, 255, 255, 0.1)' : theme.inputBackground;
    const inputBorder = hasBgImage ? 'rgba(255, 255, 255, 0.2)' : theme.inputBorder;
    const inputColor = hasBgImage ? '#FFFFFF' : theme.inputText;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    
    const inputStyle = `w-full border p-3 transition-colors duration-200 focus:outline-none ${cornerRadiusStyles[design.cornerRadius]}`;

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full max-w-2xl' : 'container max-w-2xl'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-4 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                <motion.div variants={itemVariant}><EditableText as="p" value={block.subtitle} onSave={(value) => onUpdateBlock?.(block.id, 'subtitle', value)} isEditable={isEditable} className={`mb-8 text-center`} style={{ color: subtleColor }} /></motion.div>
                
                <motion.form variants={itemVariant} onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="sr-only">{t('contact.name')}</label>
                        <input type="text" id="name" name="name" placeholder={t('contact.name')} required className={inputStyle} style={{'--tw-ring-color': design.accentColor, backgroundColor: inputBg, borderColor: inputBorder, color: inputColor} as React.CSSProperties} />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">{t('contact.email')}</label>
                        <input type="email" id="email" name="email" placeholder={t('contact.email')} required className={inputStyle} style={{'--tw-ring-color': design.accentColor, backgroundColor: inputBg, borderColor: inputBorder, color: inputColor} as React.CSSProperties} />
                    </div>
                    <div>
                        <label htmlFor="message" className="sr-only">{t('contact.message')}</label>
                        <textarea id="message" name="message" placeholder={t('contact.message')} required rows={5} className={inputStyle} style={{'--tw-ring-color': design.accentColor, backgroundColor: inputBg, borderColor: inputBorder, color: inputColor} as React.CSSProperties}></textarea>
                    </div>
                    <button type="submit" style={{ backgroundColor: design.accentColor }} className={`w-full px-8 py-3 ${buttonCornerClass} font-semibold text-white`}>
                        {block.buttonText || t('contact.submit')}
                    </button>
                </motion.form>
            </div>
        </div>
    );
};

const CodeBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
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

const ServicesBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const buttonCornerClass = {
        rounded: design.cornerRadius === 'lg' ? 'rounded-lg' : 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
    }[design.buttonStyle];
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const shadowClass = shadowStyles[design.shadowStyle] || 'shadow-md';

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-12 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                <motion.div variants={itemVariant} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {block.tiers.map((tier: PricingTier) => (
                        <div 
                            key={tier.id}
                            className={`p-8 border flex flex-col h-full transition-all duration-300 ${tier.isFeatured ? 'transform lg:scale-105' : ''} ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass}`}
                            style={{ backgroundColor: theme.cardBackground, borderColor: tier.isFeatured ? design.accentColor : theme.cardBorder }}
                        >
                            <h3 className={`text-2xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: theme.heading }}>{tier.title}</h3>
                            <p className={`mt-2`} style={{ color: theme.subtle }}>{tier.description}</p>
                            <div className="my-6">
                                <span className={`text-4xl font-heading ${fontWeightHeadingClass}`} style={{ color: theme.heading }}>{tier.price}</span>
                                <span style={{ color: theme.subtle }}>{tier.frequency}</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {tier.features.map((feature: string, index: number) => (
                                    <li key={index} className="flex items-center">
                                        <CheckCircle2 size={18} className="me-3" style={{ color: design.accentColor }}/>
                                        <span style={{ color: theme.text }}>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <a 
                                href={tier.link || '#'}
                                className={`block w-full text-center px-6 py-3 font-semibold ${buttonCornerClass}`}
                                style={{
                                    backgroundColor: tier.isFeatured ? design.accentColor : 'transparent',
                                    color: tier.isFeatured ? 'white' : theme.heading,
                                    border: tier.isFeatured ? 'none' : `1px solid ${theme.cardBorder}`
                                }}
                            >
                                {tier.buttonText}
                            </a>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

const BlogBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
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
                        className={`text-3xl mb-12 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`}
                        style={{ color: headingColor }}
                    />
                </motion.div>
                <motion.div variants={itemVariant} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {block.posts.map((post: BlogPost) => (
                        <a 
                            key={post.id} 
                            href={post.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`block group overflow-hidden border ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass} transition-all duration-300 hover:-translate-y-1`}
                            style={{ backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }}
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


const BlockRenderer: React.FC<{ block: PortfolioBlock, design: Portfolio['design'], theme: any, allProjects: Project[], allSkills: Skill[], isEditable?: boolean, onUpdateBlock?: (blockId: string, field: string, value: any) => void, itemVariant: any }> = (props) => {
    switch (props.block.type) {
        case 'hero': return <HeroBlockView {...props} />;
        case 'about': return <AboutBlockView {...props} />;
        case 'projects': return <ProjectsBlockView {...props} />;
        case 'skills': return <SkillsBlockView {...props} />;
        case 'gallery': return <GalleryBlockView {...props} />;
        case 'testimonials': return <TestimonialsBlockView {...props} />;
        case 'video': return <VideoBlockView {...props} />;
        case 'cta': return <CtaBlockView {...props} />;
        case 'resume': return <ResumeBlockView {...props} />;
        case 'links': return <LinksBlockView {...props} />;
        case 'experience': return <ExperienceBlockView {...props} />;
        case 'contact': return <ContactBlockView {...props} />;
        case 'code': return <CodeBlockView {...props} />;
        case 'services': return <ServicesBlockView {...props} />;
        case 'blog': return <BlogBlockView {...props} />;
        default: return null;
    }
};

interface PublicPortfolioPageProps {
    portfolioForPreview?: Portfolio | null;
    activePageForPreview?: Page | null;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
    activeBlockId?: string | null;
    setActiveBlockId?: (id: string | null) => void;
    onDuplicateBlock?: (id: string) => void;
    onMoveBlock?: (id: string, direction: 'up' | 'down') => void;
    onDeleteBlock?: (id: string) => void;
    onPageLinkClick?: (pageId: string) => void;
    onAIAssist?: () => void;
    isAIAssistLoading?: boolean;
    scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

const fontFamilies: { [key: string]: string } = {
  'Sora': 'Sora, sans-serif',
  'Poppins': 'Poppins, sans-serif',
  'Montserrat': 'Montserrat, sans-serif',
  'Playfair Display': "'Playfair Display', serif",
  'Inter': 'Inter, sans-serif',
  'Lato': 'Lato, sans-serif',
  'Open Sans': "'Open Sans', sans-serif",
  'Lora': 'Lora, serif',
  'Merriweather': 'Merriweather, serif',
  'Roboto': 'Roboto, sans-serif',
  'Noto Sans': "'Noto Sans', sans-serif",
  'Raleway': 'Raleway, sans-serif',
  'EB Garamond': "'EB Garamond', serif",
};

const defaultSpacingValues = {
    compact: { vertical: '4rem', horizontal: '1rem' }, // Corresponds to Tailwind py-16, px-4
    cozy: { vertical: '6rem', horizontal: '1rem' }, // Corresponds to Tailwind py-24, px-4
    spacious: { vertical: '8rem', horizontal: '1rem' }, // Corresponds to Tailwind py-32, px-4
};

const ScrollProgressBar: React.FC<{ accentColor: string }> = ({ accentColor }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div 
            className="fixed top-0 left-0 right-0 h-1 origin-left z-50" 
            style={{ scaleX, backgroundColor: accentColor }}
        />
    );
};

const ParallaxBlock: React.FC<{
    block: PortfolioBlock,
    children: React.ReactNode,
    animationVariants: any
}> = ({ block, children, animationVariants }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
    const { backgroundImage, backgroundOpacity } = block.designOverrides || {};

    return (
        <motion.section 
            ref={ref}
            key={block.id}
            variants={animationVariants.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative overflow-hidden"
        >
             <motion.div
                className="absolute inset-[-20%] z-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url("${backgroundImage}")`,
                    y
                }}
             />
             <div className="absolute inset-0 bg-black z-10" style={{ opacity: backgroundOpacity ?? 0.5 }} />
             {children}
        </motion.section>
    );
};


const PublicPortfolioPage: React.FC<PublicPortfolioPageProps> = ({ 
    portfolioForPreview, 
    activePageForPreview,
    isEditable = false, 
    onUpdateBlock,
    activeBlockId,
    setActiveBlockId,
    onDuplicateBlock,
    onMoveBlock,
    onDeleteBlock,
    onPageLinkClick,
    onAIAssist,
    isAIAssistLoading,
}) => {
    const params = useParams();
    const { slug, '*': pagePathSplat = '' } = params;
    const { portfolios, projects, skills, user } = useData();
    const { t } = useTranslation();
    
    const portfolio = useMemo(() => {
        if (portfolioForPreview) return portfolioForPreview;
        return portfolios.find(p => p.slug === slug);
    }, [slug, portfolios, portfolioForPreview]);

    const activePage = useMemo(() => {
        if (activePageForPreview) return activePageForPreview;
        if (!portfolio) return null;

        const pagePath = `/${pagePathSplat}`;
        const foundPage = portfolio.pages.find(p => p.path === pagePath);
        return foundPage || portfolio.pages.find(p => p.path === '/');
    }, [portfolio, pagePathSplat, activePageForPreview]);

    if (!portfolio) {
        return <div className="flex items-center justify-center min-h-screen">{t('portfolioNotFound')}</div>;
    }
    
    if (!portfolioForPreview && !portfolio.isPublished) {
         return <div className="flex items-center justify-center min-h-screen">{t('portfolioNotPublished')}</div>;
    }

    const activePalette = useMemo(() => {
        const allPalettes = [...defaultPalettes, ...(portfolio.customPalettes || [])];
        return allPalettes.find(p => p.id === portfolio.design.paletteId) || defaultPalettes[0];
    }, [portfolio.design.paletteId, portfolio.customPalettes]);
    
    const theme = activePalette.colors;
    const selectedItemVariant = getVariant(portfolio.design.animationStyle);
    const fontSizeClass = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    }[portfolio.design.fontSize];
    
    const fontWeightBodyClass = fontWeightStyles[portfolio.design.fontWeightBody] || 'font-normal';
    const lineHeightClass = lineHeightStyles[portfolio.design.lineHeight] || 'leading-normal';


    const dynamicStyles = {
        '--font-heading': fontFamilies[portfolio.design.headingFont] || fontFamilies['Sora'],
        '--font-body': fontFamilies[portfolio.design.bodyFont] || fontFamilies['Inter'],
        backgroundColor: theme.background,
        color: theme.text,
    } as React.CSSProperties;


    return (
        <div 
          className={`font-body ${fontSizeClass} ${fontWeightBodyClass} ${lineHeightClass}`} 
          style={dynamicStyles}
          onClick={() => isEditable && setActiveBlockId?.(null)}
        >
            {portfolio.design.scrollIndicator === 'progressBar' && <ScrollProgressBar accentColor={portfolio.design.accentColor} />}
            {portfolio.design.customCss && <style>{portfolio.design.customCss}</style>}
            {(portfolio.design.navigationStyle === 'stickyHeader' || portfolio.design.navigationStyle === 'minimalHeader') && 
                <StickyHeaderNav 
                    pages={portfolio.pages} 
                    design={portfolio.design} 
                    theme={theme} 
                    variant={portfolio.design.navigationStyle === 'minimalHeader' ? 'minimal' : 'full'} 
                    userName={user?.name || ''} 
                    portfolioSlug={portfolio.slug}
                    isEditable={isEditable}
                    onPageLinkClick={onPageLinkClick}
                />
            }
            <main>
                {activePage?.blocks.map(block => {
                     const isActive = isEditable && activeBlockId === block.id;
                     const canUseAI = isActive && onAIAssist && (block.type === 'hero' || block.type === 'about');
                     
                     const { backgroundImage, backgroundOpacity, background, shapeDividers } = block.designOverrides || {};
                     const backgroundStyle: React.CSSProperties = {};
                     let hasOverlay = false;

                     if (backgroundImage) {
                        backgroundStyle.backgroundImage = `url("${backgroundImage}")`;
                        backgroundStyle.backgroundSize = 'cover';
                        backgroundStyle.backgroundPosition = 'center';
                        hasOverlay = true;
                     } else if (background) {
                        if (typeof background === 'string') {
                            backgroundStyle.backgroundColor = background;
                        } else if (typeof background === 'object') {
                            const gradient = background as Gradient;
                            backgroundStyle.backgroundImage = `linear-gradient(${gradient.direction}deg, ${gradient.color1}, ${gradient.color2})`;
                        }
                     }

                    const defaultPadding = defaultSpacingValues[portfolio.design.spacing] || defaultSpacingValues.cozy;
                    const paddingOverrides = block.designOverrides?.padding || {};
                    
                    const topDivider = shapeDividers?.top;
                    const bottomDivider = shapeDividers?.bottom;

                    const contentPaddingStyle: React.CSSProperties = {
                        paddingTop: paddingOverrides.top ?? defaultPadding.vertical,
                        paddingBottom: paddingOverrides.bottom ?? defaultPadding.vertical,
                        paddingLeft: paddingOverrides.left ?? defaultPadding.horizontal,
                        paddingRight: paddingOverrides.right ?? defaultPadding.horizontal,
                    };
                    
                    const useParallax = portfolio.design.parallax && backgroundImage;
                    
                    const blockContent = (
                        <div 
                            style={contentPaddingStyle}
                            className={`relative transition-shadow duration-300 z-20 ${isEditable ? 'cursor-pointer' : ''} ${isActive ? 'shadow-[0_0_0_3px_rgba(20,184,166,0.5)] rounded-lg' : ''}`}
                            onClick={(e) => {
                                if (isEditable) {
                                    e.stopPropagation();
                                    setActiveBlockId?.(block.id);
                                }
                            }}
                        >
                            <BlockRenderer block={block} design={portfolio.design} theme={theme} allProjects={projects} allSkills={skills} isEditable={isEditable} onUpdateBlock={onUpdateBlock} itemVariant={selectedItemVariant} />
                            {isActive && onDuplicateBlock && onMoveBlock && onDeleteBlock && (
                                <ContextualToolbar
                                    onDuplicate={() => onDuplicateBlock(block.id)}
                                    onMoveUp={() => onMoveBlock(block.id, 'up')}
                                    onMoveDown={() => onMoveBlock(block.id, 'down')}
                                    onDelete={() => onDeleteBlock(block.id)}
                                    onAIAssist={canUseAI ? onAIAssist : undefined}
                                    isAIAssistLoading={isAIAssistLoading}
                                />
                            )}
                        </div>
                    );

                    if (useParallax) {
                        return (
                            <ParallaxBlock key={block.id} block={block} animationVariants={animationVariants}>
                                {topDivider && <ShapeDividerComponent {...topDivider} position="top" />}
                                {blockContent}
                                {bottomDivider && <ShapeDividerComponent {...bottomDivider} position="bottom" />}
                            </ParallaxBlock>
                        );
                    }
                     
                    return (
                        <motion.section
                            key={block.id}
                            style={backgroundStyle}
                            className="relative"
                            variants={animationVariants.container}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                             {topDivider && <ShapeDividerComponent {...topDivider} position="top" />}
                             {hasOverlay && <div className="absolute inset-0 bg-black" style={{ opacity: backgroundOpacity ?? 0.5 }} />}
                             {blockContent}
                            {bottomDivider && <ShapeDividerComponent {...bottomDivider} position="bottom" />}
                        </motion.section>
                    )
                })}
                 {!activePage && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <h2 className="text-2xl font-bold" style={{color: theme.heading}}>Page Not Found</h2>
                        <p className="mt-2" style={{color: theme.subtle}}>The page you're looking for doesn't exist.</p>
                        <Link to={`/portfolio/${portfolio.slug}`} className="mt-6 px-4 py-2 rounded-md font-semibold text-white" style={{backgroundColor: portfolio.design.accentColor}}>Go to Home</Link>
                    </div>
                 )}
            </main>
        </div>
    );
};

export default PublicPortfolioPage;