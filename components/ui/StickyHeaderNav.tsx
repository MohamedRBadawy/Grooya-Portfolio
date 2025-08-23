
import React, { useMemo, useState, useEffect, useRef } from 'react';
import type { Portfolio, Page } from '../../types';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface StickyHeaderNavProps {
    pages: Page[];
    design: Portfolio['design'];
    theme: any;
    userName?: string;
    portfolioSlug?: string;
    variant?: 'full' | 'minimal';
    isEditable?: boolean;
    onPageLinkClick?: (pageId: string) => void;
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
    onPageLinkClick
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    // State to track if the page has been scrolled down from the top.
    // Defaults to `true` if the header is not meant to be transparent initially.
    const [isScrolled, setIsScrolled] = useState(!design.transparentHeader);

    const homePage = useMemo(() => pages.find(p => p.path === '/'), [pages]);

    // Effect to handle the scroll event for transparent headers.
    useEffect(() => {
        // If transparency is disabled, the header is always "scrolled" (i.e., has a background).
        if (!design.transparentHeader) {
            setIsScrolled(true);
            return;
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, [design.transparentHeader]);

    // Effect to close the mobile menu when clicking outside of it.
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Determine if the current theme background is dark to apply appropriate glassmorphism effect.
    const isDarkTheme = useMemo(() => {
        const hexColor = theme.background;
        if (!hexColor || !hexColor.startsWith('#')) return false;
        const color = hexColor.substring(1, 7);
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    }, [theme.background]);

    // Dynamic styles for the header based on scroll position and theme.
    const headerStyles: React.CSSProperties = {
        backgroundColor: isScrolled
            ? (isDarkTheme ? 'rgba(15, 23, 42, 0.7)' : 'rgba(248, 250, 252, 0.7)') // Glassmorphism effect
            : 'transparent',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(8px)' : 'none',
        borderColor: isScrolled ? theme.cardBorder : 'transparent',
        transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
    };

    // Dynamic styles for text elements inside the header.
    const textColor = isScrolled ? theme.heading : '#ffffff';
    const textShadow = isScrolled ? 'none' : '0 1px 3px rgba(0,0,0,0.3)';
    
    // Reusable component to render navigation links for both desktop and mobile.
    const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
        <>
        {pages.map(page => {
            // Construct the path for react-router-dom Link component.
            const pathSuffix = page.path === '/' ? '' : page.path;
            const fullPath = `/portfolio/${portfolioSlug}${pathSuffix}`;
            const isActive = location.pathname === fullPath || (location.pathname === `/portfolio/${portfolioSlug}` && page.path === '/');

            const linkProps = {
                className: `font-medium transition-all duration-200 ${isMobile ? 'block px-4 py-2' : 'text-sm hover:opacity-100'}`,
                style: {
                    color: isActive ? design.accentColor : textColor,
                    textShadow: textShadow,
                    opacity: isMobile ? 1 : (isActive ? 1 : 0.8),
                },
                onClick: () => setIsMenuOpen(false)
            };

            // In editable preview mode, render buttons that trigger page switches instead of navigating.
            if (isEditable && onPageLinkClick) {
                return (
                    <button key={page.id} {...linkProps} onClick={() => { setIsMenuOpen(false); onPageLinkClick(page.id); }}>
                        {page.name}
                    </button>
                )
            }
            
            // In public view, render actual <Link> components.
            return (
                <Link key={page.id} to={fullPath} {...linkProps}>
                    {page.name}
                </Link>
            )
        })}
        </>
    );

    const homePath = isEditable ? undefined : `/portfolio/${portfolioSlug}`;

    return (
        <header className="sticky top-0 z-40 w-full border-b" style={headerStyles}>
            <div className={`mx-auto px-4 h-16 flex items-center justify-between ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                 <div className="flex-1 flex justify-start">
                     {userName && (
                        <Link to={homePath || '#'} onClick={() => homePage && onPageLinkClick?.(homePage.id)} className={`font-bold text-lg font-heading`} style={{ color: textColor, textShadow: textShadow }}>
                            {userName}
                        </Link>
                     )}
                 </div>
                 
                 {/* Desktop Navigation */}
                 <nav className="hidden md:flex items-center space-x-4 sm:space-x-6">
                    <NavLinks />
                 </nav>

                 {/* Mobile Navigation */}
                 <div className="flex-1 flex justify-end md:hidden" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ color: textColor }}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg py-1"
                            style={headerStyles} // Reuse header styles for consistency
                        >
                           <NavLinks isMobile />
                        </motion.div>
                    )}
                    </AnimatePresence>
                 </div>

                 {variant !== 'minimal' && <div className="hidden md:flex flex-1 justify-end"></div>}
            </div>
        </header>
    );
};

export default StickyHeaderNav;