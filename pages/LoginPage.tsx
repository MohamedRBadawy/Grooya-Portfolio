

import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { Github, Eye, EyeOff } from 'lucide-react';
import { ApiRequestError } from '../services/platform/api';

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
    const { login, register, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [name, setName] = useState('Grooya User');
    const [title, setTitle] = useState('Frontend Developer');
    const [email, setEmail] = useState('admin@Grooya.com');
    const [password, setPassword] = useState('Password123');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);
        try {
            if (mode === 'login') {
                await login({ email, password });
            } else {
                await register({ name, title, email, password });
            }
            navigate('/dashboard');
        } catch (error) {
            if (error instanceof ApiRequestError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Authentication failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl mt-4 font-semibold text-slate-800 dark:text-slate-200">
                    {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {mode === 'login'
                        ? 'Sign in with your backend account to continue to the dashboard.'
                        : 'Create a real account that syncs your portfolios, resumes, and AI quotas from the backend.'}
                </p>
            </div>
            <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                <div className="mb-6 flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                            mode === 'login'
                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                                : 'text-slate-500 dark:text-slate-400'
                        }`}
                    >
                        Log In
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('register')}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                            mode === 'register'
                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                                : 'text-slate-500 dark:text-slate-400'
                        }`}
                    >
                        Register
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" disabled className="!bg-slate-100/80 dark:!bg-slate-800 !text-slate-800 dark:!text-slate-200 disabled:opacity-60">
                       <GoogleIcon />
                       <span className="ml-2">Google</span>
                    </Button>
                    <Button variant="secondary" disabled className="!bg-slate-100/80 dark:!bg-slate-800 !text-slate-800 dark:!text-slate-200 disabled:opacity-60">
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
                    {mode === 'register' && (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Full name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-slate-400 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Professional title
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-slate-400 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                            </div>
                        </>
                    )}

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
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-slate-400 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="appearance-none block w-full pl-3 pr-10 py-2 border border-slate-400 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            />
                             <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
                            {errorMessage}
                        </div>
                    )}

                    {mode === 'login' && (
                    <div className="text-right">
                        <a href="#" className="text-sm text-teal-600 hover:text-teal-500 font-medium">
                            Forgot your password?
                        </a>
                    </div>
                    )}

                    <div>
                        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting || isLoading}>
                            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
