
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home, Frown } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
            <div className="text-center p-8">
                <Frown className="mx-auto h-24 w-24 text-slate-400 dark:text-slate-600" />
                <h1 className="mt-6 text-6xl font-extrabold text-slate-900 dark:text-slate-50 font-sora tracking-tight">404</h1>
                <h2 className="mt-2 text-2xl font-semibold text-slate-700 dark:text-slate-300">Page Not Found</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/">
                    <Button variant="primary" size="lg" className="mt-8">
                        <Home className="mr-2 h-5 w-5" />
                        Go Back Home
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
