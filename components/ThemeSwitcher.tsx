import React from 'react';
import { useApp } from '../contexts/LocalizationContext';
import { Sun, Moon } from 'lucide-react';
// FIX: The type `MotionProps` does not seem to include animation properties in this project's setup, so we remove the explicit type to let TypeScript infer it.
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useApp();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 p-2 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeSwitcher;