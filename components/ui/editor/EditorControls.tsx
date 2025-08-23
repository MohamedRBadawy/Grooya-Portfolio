
import React from 'react';

export const EditorLabel: React.FC<{ children: React.ReactNode, htmlFor?: string, className?: string }> = ({ children, htmlFor, className }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ${className || ''}`}>{children}</label>
);

export const EditorInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 transition-colors ${props.className}`} />
);
export const EditorTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100 transition-colors ${props.className}`} />
);
