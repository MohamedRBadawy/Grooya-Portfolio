import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 ${className}`}
      whileHover={{ y: -4, boxShadow: "var(--tw-shadow-lift)" }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;