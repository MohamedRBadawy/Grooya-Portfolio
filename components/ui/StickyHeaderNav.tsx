

import React, { useMemo, useState, useEffect, useRef } from 'react';
import type { Portfolio, Page, NavLinkItem } from '../../types';
import { Menu, X, Plus, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/LocalizationContext';

interface StickyHeaderNavProps {
    pages: Page[];
    design: Portfolio['design'];
    theme: any;
    userName?: string;
    portfolioSlug?: string;
    variant?: 'full' | 'minimal';
    isEditable?: boolean;
    onPageLinkClick?: (pageId: string) => void;
    activePageId?: string | null;
}

/**
 * A sticky navigation header component for the public portfolio view.
 * It supports a transparent-to-solid transition on scroll and a mobile menu.
 */
const StickyHeaderNav: React.FC<StickyHeaderNavProps> = ({ 
    pages, 
    design, 
    theme, 
    userName, 
    portfolioSlug,
    variant = 'full',
    isEditable = false,
    onPageLinkClick,
    activePageId
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { direction } = useApp();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(!design.transparentHeader);
    const homePage = useMemo(() => pages.find(p => p.path === '/'), [pages]);

    useEffect(() => {
        if (!design.transparentHeader || design.headerBackgroundColor) {
            setIsScrolled(true);
            return;
        }
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [design.transparentHeader, design.headerBackgroundColor]);

    const isDarkTheme = useMemo(() => {
        const hexColor = theme.background;
        if (!hexColor || !hexColor.startsWith('#')) return false;
        const color = hexColor.substring(1, 7);
        const r = parseInt(color.substring(0, 2), 16), g = parseInt(color.substring(2, 4), 16), b = parseInt(color.substring(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
    }, [theme.background]);

    const headerStyles: React.CSSProperties = {
        transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
    };

    if (design.headerBackgroundColor) {
        headerStyles.backgroundColor = design.headerBackgroundColor;
    } else {
        headerStyles.backgroundColor = isScrolled ? (isDarkTheme ? 'rgba(15, 23, 42, 0.7)' : 'rgba(248, 250, 252, 0.7)') : 'transparent';
        headerStyles.backdropFilter = isScrolled ? 'blur(8px)' : 'none';
        headerStyles.WebkitBackdropFilter = isScrolled ? 'blur(8px)' : 'none';
        headerStyles.borderColor = isScrolled ? (design.headerBorderStyle?.color || theme.cardBorder) : 'transparent';
    }

    if (design.headerBorderStyle && design.headerBorderStyle.width > 0) {
        headerStyles.borderBottom = `${design.headerBorderStyle.width}px ${design.headerBorderStyle.style} ${design.headerBorderStyle.color}`;
    }

    const textColor = isScrolled || design.headerLinkColor ? (design.headerLinkColor || theme.heading) : '#ffffff';
    const textShadow = isScrolled || design.headerBackgroundColor ? 'none' : '0 1px 3px rgba(0,0,0,0.3)';

    const navLinks: NavLinkItem[] = useMemo(() => {
        if (design.customNavigation) return design.customNavigation;
        // Fallback to page-based navigation if custom navigation is not set up.
        return pages.map(p => ({
            id: p.id,
            label: p.name,
            targetPageId: p.id
        }));
    }, [design.customNavigation, pages]);

    const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-row items-center space-x-4 sm:space-x-6'}`}>
            {navLinks.map(link => {
                const targetPage = pages.find(p => p.id === link.targetPageId);
                if (!targetPage) return null;

                const pathSuffix = targetPage.path === '/' ? '' : targetPage.path;
                let fullPath = `/portfolio/${portfolioSlug}${pathSuffix}`;
                if (link.targetBlockId) {
                    fullPath += `#${link.targetBlockId}`;
                }

                const isActive = location.pathname === `/portfolio/${portfolioSlug}${pathSuffix}`;

                const linkStyle: React.CSSProperties = {
                    color: isMobile ? theme.text : textColor,
                    textShadow: isMobile ? 'none' : textShadow,
                    opacity: isMobile ? 1 : (isActive ? 1 : 0.8),
                };
                if (isActive) {
                    linkStyle.color = design.headerActiveLinkColor || design.accentColor;
                }

                const linkProps: any = {
                    className: `nav-link font-medium transition-all duration-200 ${isMobile ? 'block px-4 py-2 text-lg' : 'text-sm hover:opacity-100'}`,
                    style: linkStyle,
                };

                if (isEditable && onPageLinkClick) {
                    const isSamePageNav = link.targetPageId === activePageId;
                    const href = isSamePageNav && link.targetBlockId ? `#${link.targetBlockId}` : '#';
                    
                    return (
                        <a 
                            key={link.id} 
                            href={href}
                            {...linkProps}
                            onClick={(e) => { 
                                if (!isSamePageNav) {
                                    // This is a multi-page navigation click within the editor.
                                    // We handle it here and prevent any other action.
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onPageLinkClick(link.targetPageId);
                                }
                                // For same-page navigation (isSamePageNav === true), we do NOT stop propagation.
                                // We let the click event bubble up to the PublicPortfolioPage's container,
                                // which has the logic to scroll the preview pane correctly.
                                setIsMenuOpen(false);
                            }}
                        >
                            {link.label}
                        </a>
                    );
                }

                return <Link key={link.id} to={fullPath} {...linkProps} onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
            })}
        </div>
    );

    const homePath = isEditable ? undefined : `/portfolio/${portfolioSlug}`;
    const navAlignmentClass = { left: 'justify-start', center: 'justify-center', right: 'justify-end' }[design.navAlignment || 'right'];
    const logoPosition = design.logoPosition || 'left';

    const Logo = (
        <div className="flex-shrink-0">
             {userName && (
                <Link to={homePath || '#'} onClick={() => homePage && onPageLinkClick?.(homePage.id)} className={`font-bold text-lg font-heading`} style={{ color: textColor, textShadow: textShadow }}>
                    {userName}
                </Link>
             )}
         </div>
    );

    const menuStyle = design.mobileMenuStyle || 'overlay';
    const menuAnimation = design.mobileMenuAnimation || 'fadeIn';
    const backdropVariants: any = { open: { opacity: 1 }, closed: { opacity: 0 } };
    const overlayContentVariants: any = { open: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }, closed: { opacity: 0, y: menuAnimation === 'slideIn' ? '-20%' : 0, scale: 0.95 } };
    const drawerContentVariants: any = { open: { x: 0, transition: { type: 'spring', stiffness: 400, damping: 40 } }, closed: { x: '100%' } };

    const MobileMenuIcon = useMemo(() => {
        switch (design.mobileMenuIconStyle) {
            case 'plus':
                return Plus;
            case 'dots':
                return MoreHorizontal;
            case 'bars':
            default:
                return Menu;
        }
    }, [design.mobileMenuIconStyle]);
    
    return (
        <>
            {design.headerLinkHoverColor && <style>{`.nav-link:hover { color: ${design.headerLinkHoverColor} !important; }`}</style>}
            <header className="sticky top-0 z-40 w-full border-b" style={headerStyles}>
                <div className={`mx-auto px-4 h-16 flex items-center justify-between relative ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                    <div className="hidden md:flex w-full items-center">
                        {logoPosition === 'left' && Logo}
                        <nav className={`flex items-center flex-grow px-6 ${navAlignmentClass}`}><NavLinks /></nav>
                        {logoPosition === 'center' && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{Logo}</div>}
                    </div>
                    <div className="flex-1 flex justify-start md:hidden">{Logo}</div>
                     <div className="flex-shrink-0 md:hidden">
                        <button onClick={() => setIsMenuOpen(true)} style={{ color: textColor }} aria-label="Open menu"><MobileMenuIcon size={24} /></button>
                     </div>
                </div>
            </header>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div className="fixed inset-0 z-50 md:hidden" onClick={() => setIsMenuOpen(false)} aria-modal="true">
                        <motion.div className="absolute inset-0 bg-black/60" variants={backdropVariants} initial="closed" animate="open" exit="closed" />
                        {menuStyle === 'overlay' && (
                            <motion.div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm p-6 rounded-2xl" style={{ backgroundColor: theme.background }} variants={overlayContentVariants} initial="closed" animate="open" exit="closed" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-end mb-4"><button onClick={() => setIsMenuOpen(false)} style={{ color: theme.text }} aria-label="Close menu"><X size={24} /></button></div>
                                <NavLinks isMobile />
                            </motion.div>
                        )}
                        {menuStyle === 'drawer' && (
                            <motion.div className={`absolute top-0 h-full w-[80%] max-w-xs shadow-2xl ${direction === 'ltr' ? 'right-0' : 'left-0'}`} style={{ backgroundColor: theme.background }} variants={drawerContentVariants} initial="closed" animate="open" exit="closed" onClick={e => e.stopPropagation()}>
                                 <div className="flex justify-end p-4"><button onClick={() => setIsMenuOpen(false)} style={{ color: theme.text }} aria-label="Close menu"><X size={24} /></button></div>
                                <div className="p-4"><NavLinks isMobile /></div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default StickyHeaderNav;
