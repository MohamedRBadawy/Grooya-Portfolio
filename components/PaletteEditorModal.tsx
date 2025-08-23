import React, { useState, useEffect } from 'react';
import type { Palette } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaletteEditorModalProps {
  palette?: Palette | null;
  onClose: () => void;
  onSave: (palette: Palette) => void;
}

const newPaletteTemplate = (): Palette => ({
  id: `custom-${Date.now()}`,
  name: 'My Custom Palette',
  colors: {
    background: '#ffffff',
    text: '#333333',
    heading: '#000000',
    subtle: '#666666',
    cardBackground: '#f9f9f9',
    cardBorder: '#eeeeee',
    inputBackground: '#ffffff',
    inputBorder: '#cccccc',
    inputText: '#000000',
    inputPlaceholder: '#999999',
  },
});

const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm text-cream-700 dark:text-cream-300 capitalize">{label.replace(/([A-Z])/g, ' $1')}</label>
        <div className="flex items-center gap-2 border border-cream-400 dark:border-cream-600 rounded-md p-1">
             <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-20 text-sm bg-transparent focus:outline-none text-right"
            />
            <div className="relative w-6 h-6 rounded-sm overflow-hidden">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-[-2px] w-8 h-8 cursor-pointer"
                />
            </div>
        </div>
    </div>
);

const PaletteEditorModal: React.FC<PaletteEditorModalProps> = ({ palette, onClose, onSave }) => {
  const { t } = useTranslation();
  const [currentPalette, setCurrentPalette] = useState<Palette>(newPaletteTemplate());

  useEffect(() => {
    if (palette) {
      setCurrentPalette(JSON.parse(JSON.stringify(palette))); // Deep copy
    } else {
      setCurrentPalette(newPaletteTemplate());
    }
  }, [palette]);

  const handleColorChange = (key: keyof Palette['colors'], value: string) => {
    setCurrentPalette(p => ({
      ...p,
      colors: {
        ...p.colors,
        [key]: value,
      },
    }));
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPalette(p => ({...p, name: e.target.value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentPalette);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-cream-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-cream-200 dark:bg-cream-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col relative border border-cream-300 dark:border-cream-700"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <header className="flex-shrink-0 p-4 border-b border-cream-300 dark:border-cream-700 flex justify-between items-center">
          <h3 className="font-bold text-cream-800 dark:text-cream-200 text-lg font-sora">
            {palette ? 'Edit Palette' : 'Create New Palette'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full text-cream-500 dark:text-cream-400 hover:bg-cream-300 dark:hover:bg-cream-800" aria-label={t('close')}>
            <X size={20} />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
          <div>
            <label htmlFor="paletteName" className="block text-sm font-medium text-cream-700 dark:text-cream-300 mb-1.5">Palette Name</label>
            <input id="paletteName" value={currentPalette.name} onChange={handleNameChange} required className="block w-full bg-cream-300 dark:bg-cream-800 border-cream-400 dark:border-cream-600 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-cream-900 dark:text-cream-100 p-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {(Object.keys(currentPalette.colors) as Array<keyof Palette['colors']>).map(key => (
              <ColorInput
                key={key}
                label={key}
                value={currentPalette.colors[key]}
                onChange={(value) => handleColorChange(key, value)}
              />
            ))}
          </div>
        </form>
        <footer className="flex-shrink-0 p-4 border-t border-cream-300 dark:border-cream-700 flex justify-end gap-3 bg-cream-200/50 dark:bg-cream-900/50">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button variant="primary" onClick={handleSubmit} type="submit">
            <Save size={16} className="me-2" />
            Save Palette
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default PaletteEditorModal;