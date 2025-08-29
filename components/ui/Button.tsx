import React from 'react';
import { motion, HTMLMotionProps, type MotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform';

  const variantStyles = {
    primary: 'bg-gradient-to-b from-cyan-400 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-600 focus-visible:ring-cyan-400 shadow-md hover:shadow-lg hover:-translate-y-px',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-cyan-500 border border-slate-300 dark:border-slate-700 shadow-sm',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500 shadow-md hover:shadow-lg hover:-translate-y-px',
    ghost: 'text-slate-600 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100 focus-visible:ring-cyan-500'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const motionProps: MotionProps = {
      whileTap: { scale: 0.97, y: 0 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
  };

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;