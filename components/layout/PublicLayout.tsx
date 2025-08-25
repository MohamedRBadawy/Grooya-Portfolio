


import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Button from '../components/ui/Button';

const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                            <h1 className="text-2xl font-bold text-cyan-500 font-sora">Grooya</h1>
                        </Link>
                        <div className="flex items-center gap-2">
                             <Link to="/dashboard">
                                <Button variant="secondary" size="sm">
                                    Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Grooya. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
