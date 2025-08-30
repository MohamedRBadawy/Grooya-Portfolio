import React from 'react';
// FIX: The type `MotionProps` does not seem to include animation properties in this project's setup, so we remove the explicit type to let TypeScript infer it.
import { motion, HTMLMotionProps } from 'framer-motion';

const Card: React.FC<HTMLMotionProps<'div'>> = ({ children, className = '', ...props }) => {
  // FIX: Removed incorrect `MotionProps` type.
  const motionProps = {
      whileHover: { y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1), 0 0 15px 0 rgba(22, 163, 175, 0.2)" },
      transition: { type: 'spring', stiffness: 300, damping: 20 }
  };
  return (
    <motion.div
      className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 hover:border-slate-300 dark:hover:border-slate-700 ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;