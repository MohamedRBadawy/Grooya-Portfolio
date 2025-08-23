
import React, { FormEvent } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM;
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { Github } from 'lucide-react';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-slate-700 dark:text-slate-200">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        login();
        navigate('/');
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-teal-500 font-sora">
                    Grooya
                </h1>
                <h2 className="text-2xl mt-4 font-semibold text-slate-800 dark:text-slate-200">
                    Welcome Back!
                </h2>
            </div>
            <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" className="!bg-slate-100/80 dark:!bg-slate-800 hover:!bg-slate-200 dark:hover:!bg-slate-700 !text-slate-800 dark:!text-slate-200">
                       <GoogleIcon />
                       <span className="ml-2">Google</span>
                    </Button>
                    <Button variant="secondary" className="!bg-slate-100/80 dark:!bg-slate-800 hover:!bg-slate-200 dark:hover:!bg-slate-700 !text-slate-800 dark:!text-slate-200">
                        <Github size={18} />
                        <span className="ml-2">GitHub</span>
                    </Button>
                </div>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                    <span className="flex-shrink mx-4 text-xs text-slate-500 dark:text-slate-400">Or continue with</span>
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                defaultValue="you@example.com"
                                className="appearance-none block w-full px-3 py-2 border border-slate-400 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                defaultValue="••••••••"
                                className="appearance-none block w-full px-3 py-2 border border-slate-400 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <a href="#" className="text-sm text-teal-600 hover:text-teal-500 font-medium">
                            Forgot your password?
                        </a>
                    </div>

                    <div>
                        <Button type="submit" variant="primary" className="w-full">
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;