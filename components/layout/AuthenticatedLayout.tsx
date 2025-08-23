
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { FolderKanban, LogOut, Package, Sparkles, Settings, FileText, Menu, X } from 'lucide-react';
import ThemeSwitcher from '../ThemeSwitcher';
import LanguageSwitcher from '../LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderNavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => {
  const activeClasses = "text-slate-900 dark:text-slate-50";
  const inactiveClasses = "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50";
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors ${isActive ? activeClasses : inactiveClasses}`
      }
    >
      {children}
    </NavLink>
  );
};

const AuthenticatedLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { user } = useData();
    const { logout } = useAuth();
    const { t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    
    const userMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && !mobileMenuTriggerRef.current?.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
            <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                                <h1 className="text-2xl font-bold text-teal-500 font-sora">Grooya</h1>
                            </Link>
                             <nav className="hidden md:flex items-center gap-6">
                                <HeaderNavLink to="/">{t('nav.portfolios')}</HeaderNavLink>
                                <HeaderNavLink to="/projects">{t('nav.projects')}</HeaderNavLink>
                                <HeaderNavLink to="/resumes">{t('nav.resumes')}</HeaderNavLink>
                                <div className="text-sm font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed flex items-center relative" title="Coming Soon">
                                    {t('nav.skills')}
                                    <span className="ml-2 text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">Soon</span>
                                </div>
                            </nav>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center">
                                <LanguageSwitcher />
                                <ThemeSwitcher />
                            </div>

                            {/* User Menu */}
                            {user && (
                                <div className="relative" ref={userMenuRef}>
                                    <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="w-9 h-9 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900">
                                        <img src={user.avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
                                    </button>
                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                                            >
                                                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.title}</p>
                                                </div>
                                                <div className="p-2">
                                                    <NavLink to="/profile" onClick={() => setIsUserMenuOpen(false)} className={({isActive}) => `flex items-center w-full px-3 py-2 text-sm rounded-md ${isActive ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
                                                        <Settings size={16} className="mr-3" /> {t('nav.settings')}
                                                    </NavLink>
                                                    <button onClick={logout} className="flex items-center w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-md">
                                                        <LogOut size={16} className="mr-3" /> {t('logout')}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button ref={mobileMenuTriggerRef} onClick={() => setIsMobileMenuOpen(prev => !prev)} className="p-2 rounded-md md:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                {isMobileMenuOpen ? <X size={22}/> : <Menu size={22}/>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Panel */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            ref={mobileMenuRef}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            <nav className="p-4 space-y-3">
                                <HeaderNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.portfolios')}</HeaderNavLink>
                                <HeaderNavLink to="/projects" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.projects')}</HeaderNavLink>
                                <HeaderNavLink to="/resumes" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.resumes')}</HeaderNavLink>
                            </nav>
                             <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Appearance</span>
                                <div className="flex items-center -mr-2">
                                    <LanguageSwitcher />
                                    <ThemeSwitcher />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            
            <main>
                {children}
            </main>
        </div>
    );
};

export default AuthenticatedLayout;
