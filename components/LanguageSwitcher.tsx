import React from 'react';
import { useApp } from '../contexts/LocalizationContext';
import Button from './ui/Button';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useApp();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={toggleLanguage} 
      className="flex items-center gap-2"
      aria-label="Toggle language"
    >
      <Languages size={18} />
      <span>{language === 'en' ? 'ع' : 'En'}</span>
    </Button>
  );
};

export default LanguageSwitcher;