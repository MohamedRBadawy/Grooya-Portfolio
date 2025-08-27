

import React, { useMemo, useRef, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Portfolio, PortfolioBlock, Project, Skill, Page, ShapeDivider, AnimationStyle, Gradient } from '../types';
import EditableText from '../components/ui/EditableText';
import StickyHeaderNav from '../components/ui/StickyHeaderNav';
import ContextualToolbar from '../components/ui/ContextualToolbar';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { defaultPalettes } from '../services/palettes';
import ShapeDividerComponent from '../components/ui/ShapeDivider';

// Import all the new block view components
import { HeroBlockView } from '../components/blocks/public/HeroBlockView';
import { AboutBlockView } from '../components/blocks/public/AboutBlockView';
import { ProjectsBlockView } from '../components/blocks/public/ProjectsBlockView';
import { SkillsBlockView } from '../components/blocks/public/SkillsBlockView';
import { GalleryBlockView } from '../components/blocks/public/GalleryBlockView';
import { TestimonialsBlockView } from '../components/blocks/public/TestimonialsBlockView';
import { VideoBlockView } from '../components/blocks/public/VideoBlockView';
import { CtaBlockView } from '../components/blocks/public/CtaBlockView';
import { ResumeBlockView } from '../components/blocks/public/ResumeBlockView';
import { LinksBlockView } from '../components/blocks/public/LinksBlockView';
import { ExperienceBlockView } from '../components/blocks/public/ExperienceBlockView';
import { ContactBlockView } from '../components/blocks/public/ContactBlockView';
import { CodeBlockView } from '../components/blocks/public/CodeBlockView';
import { ServicesBlockView } from '../components/blocks/public/ServicesBlockView';
import { BlogBlockView } from '../components/blocks/public/BlogBlockView';
import FloatingDotsNav from '../components/ui/FloatingDotsNav';

const animationDefinitions = {
    fadeIn: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 30, stiffness: 200 } } },
    slideInUp: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 30, stiffness: 120 } } },
    scaleIn: { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 30, stiffness: 120 } } },
    slideInFromLeft: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 30, stiffness: 120 } } },
    revealUp: { hidden: { y: '100%', opacity: 0 }, visible: { y: '0%', opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } },
    blurIn: { hidden: { filter: 'blur(8px)', opacity: 0 }, visible: { filter: 'blur(0px)', opacity: 1, transition: { duration: 0.6 } } },
    none: { hidden: {}, visible: {} }
};

const containerVariant = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: i * 0.1 },
    }),
};

const fontWeightStyles: { [key: string]: string } = {
    normal: 'font-normal',
    bold: 'font-bold',
};
const lineHeightStyles: { [key: string]: string } = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
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
    activePageId?: string | null;
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
    focusedBlockId?: string | null;
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
            style={{ 
                backgroundColor: accentColor,
                scaleX 
            } as any}
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
    const motionProps = {
        ref:ref,
        variants:animationVariants,
        initial:"hidden",
        whileInView:"visible",
        viewport:{ once: true, amount: 0.2 }
    };

    return (
        <motion.section 
            key={block.id}
            {...motionProps}
            className="relative overflow-hidden"
        >
             {backgroundImage && <motion.div
                className="absolute inset-[-20%] z-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url("${backgroundImage}")`,
                    y,
                } as any}
             />}
             <div className="absolute inset-0 bg-black z-10" style={{ opacity: backgroundOpacity ?? 0.5 }} />
             {children}
        </motion.section>
    );
};


const PublicPortfolioPage: React.FC<PublicPortfolioPageProps> = ({ 
    portfolioForPreview, 
    activePageForPreview,
    activePageId,
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
    scrollContainerRef,
    focusedBlockId,
}) => {
    const params = useParams();
    const { slug, '*': pagePathSplat = '' } = params;
    const { portfolios, projects, skills, user: loggedInUser } = useData();
    const { t } = useTranslation();
    const location = useLocation();
    
    const portfolio = useMemo(() => {
        if (portfolioForPreview) return portfolioForPreview;
        return portfolios.find(p => p.slug === slug);
    }, [slug, portfolios, portfolioForPreview]);

    const activePage = useMemo(() => {
        if (activePageForPreview) return activePageForPreview;
        if (!portfolio) return null;
        
        let pagePath = `/${pagePathSplat || ''}`.replace(/\/$/, '');
        if (pagePath === '') pagePath = '/';
        
        const foundPage = portfolio.pages.find(p => p.path === pagePath);
        return foundPage || portfolio.pages.find(p => p.path === '/');
    }, [portfolio, pagePathSplat, activePageForPreview]);
    
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location.hash, activePage]);

    const portfolioOwner = useMemo(() => {
        // In preview mode, the logged-in user is always the owner.
        if (isEditable) return loggedInUser;
        // In a real app, you'd fetch the owner's public data. Here we simulate it.
        if (portfolio?.userId === loggedInUser?.id) return loggedInUser;
        return null;
    }, [portfolio, loggedInUser, isEditable]);

    const canRemoveBranding = ['starter', 'pro', 'premium'].includes(portfolioOwner?.subscription?.tier ?? 'free');
    
    const prefersReducedMotion = useMemo(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    if (!portfolio) {
        return <div className="flex items-center justify-center min-h-screen">{t('portfolioNotFound')}</div>;
    }
    
    if (!portfolioForPreview && !portfolio.isPublished) {
         return <div className="flex items-center justify-center min-h-screen">{t('portfolioNotPublished')}</div>;
    }
    
    // Determine the active theme and design based on high contrast mode
    const { theme, design } = useMemo(() => {
        if (portfolio.design.highContrastMode) {
            const highContrastColors = {
                background: '#000000',
                text: '#ffffff',
                heading: '#ffffff',
                subtle: '#dddddd',
                cardBackground: '#000000',
                cardBorder: '#ffffff',
                inputBackground: '#000000',
                inputBorder: '#ffffff',
                inputText: '#ffffff',
                inputPlaceholder: '#bbbbbb',
            };
            return {
                theme: highContrastColors,
                design: {
                    ...portfolio.design,
                    accentColor: '#ffff00', // Bright yellow for high contrast
                    shadowStyle: 'none' as const,
                    globalGradient: undefined,
                    parallax: false,
                    headerBackgroundColor: '#000000',
                    transparentHeader: false,
                }
            };
        }
        
        const originalPalette = [...defaultPalettes, ...(portfolio.customPalettes || [])].find(p => p.id === portfolio.design.paletteId) || defaultPalettes[0];

        return {
            theme: originalPalette.colors,
            design: portfolio.design
        };
    }, [portfolio.design, portfolio.customPalettes]);


    const isMotionActuallyReduced = (design.respectReducedMotion !== false && prefersReducedMotion);

    const fontSizeClass = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    }[design.fontSize];
    
    const fontWeightBodyClass = fontWeightStyles[design.fontWeightBody] || 'font-normal';
    const lineHeightClass = lineHeightStyles[design.lineHeight] || 'leading-normal';

    const linkStyleClass = {
        underline: 'link-style-underline',
        underlineOnHover: 'link-style-underline-hover',
        none: 'link-style-none',
    }[design.linkStyle || 'underlineOnHover'];

    const dynamicStyles = {
        '--font-heading': fontFamilies[design.headingFont] || fontFamilies['Sora'],
        '--font-body': fontFamilies[design.bodyFont] || fontFamilies['Inter'],
        backgroundColor: theme.background,
        color: theme.text,
    } as React.CSSProperties;

    if (design.globalGradient) {
        const { direction, color1, color2 } = design.globalGradient;
        dynamicStyles.backgroundImage = `linear-gradient(${direction}deg, ${color1}, ${color2})`;
    }


    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');

        // Check for internal hash links within the preview
        if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
            e.preventDefault(); // Stop default browser jump
            e.stopPropagation(); // Stop this click from bubbling up to other handlers (like block deselection)

            const href = anchor.getAttribute('href')!;
            const targetId = href.substring(1);
            
            let targetElement = document.getElementById(targetId);

            // If an element with the exact ID isn't found, check if it's a semantic link
            // to a block type (e.g., #projects)
            if (!targetElement && activePage) {
                const semanticBlock = activePage.blocks.find(b => b.type === targetId);
                if (semanticBlock) {
                    targetElement = document.getElementById(semanticBlock.id);
                }
            }

            if (targetElement) {
                const container = scrollContainerRef?.current;
                if (container) {
                    const containerRect = container.getBoundingClientRect();
                    const targetRect = targetElement.getBoundingClientRect();
                    const scrollTop = container.scrollTop;
                    const top = targetRect.top - containerRect.top + scrollTop;

                    container.scrollTo({
                        top: top,
                        behavior: 'smooth',
                    });
                } else {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else {
                console.warn(`Could not find element for internal link: ${href}`);
            }
            return; // Exit early, we've handled the click
        }

        // If it wasn't an internal link, proceed with the editor's block deselection logic
        if (isEditable) {
            setActiveBlockId?.(null);
        }
    };


    // Focused Block Preview Logic
    if (isEditable && focusedBlockId) {
        const focusedBlock = activePage?.blocks.find(b => b.id === focusedBlockId);
        if (focusedBlock) {
             const { backgroundImage, backgroundOpacity, background, shapeDividers } = focusedBlock.designOverrides || {};
             const backgroundStyle: React.CSSProperties = {};
             let hasOverlay = false;
             
             // This is a simplified animation for the focused preview only.
             const itemVariant = animationDefinitions['fadeIn'];

             if (backgroundImage) {
                backgroundStyle.backgroundImage = `url("${backgroundImage}")`;
                hasOverlay = true;
             } else if (background) {
                if (typeof background === 'string') {
                    backgroundStyle.backgroundColor = background;
                } else if (typeof background === 'object') {
                    const gradient = background as Gradient;
                    backgroundStyle.backgroundImage = `linear-gradient(${gradient.direction}deg, ${gradient.color1}, ${gradient.color2})`;
                }
             }

            return (
                <div style={dynamicStyles}>
                    <div className="relative isolate" style={backgroundStyle} >
                        {hasOverlay && <div className="absolute inset-0 bg-black" style={{ opacity: backgroundOpacity ?? 0.5 }} />}
                        <div className="relative z-10 p-4 md:p-8">
                            <BlockRenderer 
                                block={focusedBlock} 
                                design={design} 
                                theme={theme} 
                                allProjects={projects} 
                                allSkills={skills} 
                                isEditable={false} // Disable inline editing in focused preview
                                itemVariant={itemVariant} 
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }


    return (
        <div 
          className={`font-body ${fontSizeClass} ${fontWeightBodyClass} ${lineHeightClass} ${linkStyleClass}`} 
          style={dynamicStyles}
          onClick={handleContainerClick}
        >
            {design.scrollIndicator === 'progressBar' && <ScrollProgressBar accentColor={design.accentColor} />}
            {design.customCss && <style>{design.customCss}</style>}
            {(design.navigationStyle === 'stickyHeader' || design.navigationStyle === 'minimalHeader') && 
                <StickyHeaderNav 
                    pages={portfolio.pages} 
                    design={design} 
                    theme={theme} 
                    variant={design.navigationStyle === 'minimalHeader' ? 'minimal' : 'full'} 
                    userName={portfolioOwner?.name || ''} 
                    portfolioSlug={portfolio.slug}
                    isEditable={isEditable}
                    onPageLinkClick={onPageLinkClick}
                    activePageId={activePageId}
                />
            }
            {design.navigationStyle === 'floatingDots' && activePage &&
                <FloatingDotsNav blocks={activePage.blocks} design={design} scrollContainerRef={scrollContainerRef || undefined} />
            }
            <main>
                {activePage?.blocks.map(block => {
                     const isActive = isEditable && activeBlockId === block.id;
                     const canUseAI = isActive && onAIAssist && (block.type === 'hero' || block.type === 'about');
                     
                     const { backgroundImage, backgroundOpacity, background, shapeDividers, border } = block.designOverrides || {};
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
                     
                    if (border) {
                        if (border.top) backgroundStyle.borderTop = `${border.top.width}px ${border.top.style} ${border.top.color}`;
                        if (border.bottom) backgroundStyle.borderBottom = `${border.bottom.width}px ${border.bottom.style} ${border.bottom.color}`;
                        if (border.left) backgroundStyle.borderLeft = `${border.left.width}px ${border.left.style} ${border.left.color}`;
                        if (border.right) backgroundStyle.borderRight = `${border.right.width}px ${border.right.style} ${border.right.color}`;
                    }


                    const defaultPadding = defaultSpacingValues[design.spacing] || defaultSpacingValues.cozy;
                    const paddingOverrides = block.designOverrides?.padding || {};
                    
                    const topDivider = shapeDividers?.top;
                    const bottomDivider = shapeDividers?.bottom;

                    const contentPaddingStyle: React.CSSProperties = {
                        paddingTop: paddingOverrides.top ?? defaultPadding.vertical,
                        paddingBottom: paddingOverrides.bottom ?? defaultPadding.vertical,
                        paddingLeft: paddingOverrides.left ?? defaultPadding.horizontal,
                        paddingRight: paddingOverrides.right ?? defaultPadding.horizontal,
                    };
                    
                    const useParallax = design.parallax && backgroundImage;
                    
                    const blockAnimation = block.designOverrides?.animationStyle ?? design.animationStyle;
                    const itemVariant = useMemo(() => {
                        if (isMotionActuallyReduced || blockAnimation === 'none') {
                            return { hidden: {}, visible: {} };
                        }
                
                        const definition = animationDefinitions[blockAnimation as keyof typeof animationDefinitions] || animationDefinitions.none;
                        const transitionOverride: any = {};
                
                        if (block.designOverrides?.animationDuration !== undefined) {
                            transitionOverride.duration = block.designOverrides.animationDuration;
                        }
                        if (block.designOverrides?.animationDelay !== undefined) {
                            transitionOverride.delay = block.designOverrides.animationDelay;
                        }
                
                        if (Object.keys(transitionOverride).length > 0) {
                            const newVisible: any = { ...(definition.visible || {}) };
                            newVisible.transition = {
                                ...(newVisible.transition || {}),
                                ...transitionOverride,
                            };
                            return {
                                ...definition,
                                visible: newVisible,
                            };
                        }
                        return definition;
                    }, [isMotionActuallyReduced, blockAnimation, block.designOverrides?.animationDuration, block.designOverrides?.animationDelay]);

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
                            <BlockRenderer block={block} design={design} theme={theme} allProjects={projects} allSkills={skills} isEditable={isEditable} onUpdateBlock={onUpdateBlock} itemVariant={itemVariant} />
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
                            <ParallaxBlock key={block.id} block={block} animationVariants={containerVariant}>
                                {topDivider && <ShapeDividerComponent {...topDivider} position="top" />}
                                {blockContent}
                                {bottomDivider && <ShapeDividerComponent {...bottomDivider} position="bottom" />}
                            </ParallaxBlock>
                        );
                    }
                     
                    const sectionMotionProps = {
                        variants: containerVariant,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: { once: true, amount: 0.2 },
                    };

                    return (
                        <motion.section
                            id={block.id}
                            key={block.id}
                            style={backgroundStyle}
                            className="relative"
                            {...sectionMotionProps}
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
                        <Link to={`/portfolio/${portfolio.slug}`} className="mt-6 px-4 py-2 rounded-md font-semibold text-white" style={{backgroundColor: design.accentColor}}>Go to Home</Link>
                    </div>
                 )}
            </main>
            {!(design.hideBranding && canRemoveBranding) && (
                <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400 border-t" style={{ borderColor: theme.cardBorder }}>
                    Made with <a href="https://github.com/google/generative-ai-docs/tree/main/demos/palm/web/palm-career-app" target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">Grooya</a>
                </footer>
            )}
        </div>
    );
};

export default PublicPortfolioPage;