
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define the types for language, direction and theme
type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';
type Theme = 'light' | 'dark';

// Define the shape of the context
interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  direction: Direction;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define keys for local storage
const THEME_STORAGE_KEY = 'grooya_theme';
const LANGUAGE_STORAGE_KEY = 'grooya_language';

/**
 * Provides application-level state for language and theming.
 * It persists these settings to localStorage.
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize language state from localStorage or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const storedLang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLang === 'en' || storedLang === 'ar') {
        return storedLang;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  // Initialize theme state from localStorage, system preference, or default to 'light'
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === 'light' || storedTheme === 'dark') {
          return storedTheme;
      }
      // If no stored theme, check system preference for dark mode
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  // Determine text direction based on the current language
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  // Effect to update the DOM for language and direction.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    if (language === 'ar') {
        document.body.classList.add('font-arabic');
        document.body.classList.remove('font-sans');
    } else {
        document.body.classList.remove('font-arabic');
        document.body.classList.add('font-sans');
    }
  }, [language, direction]);
  
  // Effect to update the DOM and localStorage when the theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        console.error("Error writing theme to local storage", error);
    }
  }, [theme]);
  
  // Public function to update the language
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
        console.error("Error writing language to local storage", error);
    }
  };
  
  // Public function to update the theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Provide the context value to children
  return (
    <AppContext.Provider value={{ language, setLanguage, direction, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook to easily access the AppContext.
 */
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
