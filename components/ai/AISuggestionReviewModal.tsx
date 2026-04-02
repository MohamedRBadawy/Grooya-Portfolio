import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, RotateCcw, Sparkles, X } from 'lucide-react';

import Button from '../ui/Button';

interface AISuggestionReviewModalProps {
  isOpen: boolean;
  title: string;
  summary: string;
  original: Record<string, string>;
  suggestion: Record<string, string>;
  onApply: (editedSuggestion: Record<string, string>) => void;
  onClose: () => void;
}

const fieldLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (value) => value.toUpperCase())
    .trim();

const AISuggestionReviewModal: React.FC<AISuggestionReviewModalProps> = ({
  isOpen,
  title,
  summary,
  original,
  suggestion,
  onApply,
  onClose,
}) => {
  const [draft, setDraft] = useState(suggestion);

  useEffect(() => {
    setDraft(suggestion);
  }, [suggestion]);

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h3 className="flex items-center gap-2 font-sora text-lg font-bold text-slate-900 dark:text-slate-100">
              <Sparkles size={18} className="text-amber-500" />
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{summary}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Close AI suggestion review"
          >
            <X size={18} />
          </button>
        </header>

        <div className="grid flex-1 gap-0 overflow-y-auto md:grid-cols-2">
          <section className="border-b border-slate-200 p-5 dark:border-slate-800 md:border-b-0 md:border-r">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Original</h4>
            <div className="space-y-4">
              {Object.entries(original).map(([key, value]) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{fieldLabel(key)}</label>
                  <div className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                    {value || 'No existing content yet.'}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Suggested Draft</h4>
              <Button variant="ghost" size="sm" onClick={() => setDraft(suggestion)}>
                <RotateCcw size={14} className="me-2" />
                Reset
              </Button>
            </div>
            <div className="space-y-4">
              {Object.entries(draft).map(([key, value]) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{fieldLabel(key)}</label>
                  <textarea
                    value={value}
                    onChange={(event) => setDraft((prev) => ({ ...prev, [key]: event.target.value }))}
                    rows={key.toLowerCase().includes('headline') ? 3 : 6}
                    className="block w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/70">
          <Button variant="secondary" onClick={onClose}>
            Reject
          </Button>
          <Button variant="primary" onClick={() => onApply(draft)}>
            <Check size={14} className="me-2" />
            Apply Suggestion
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default AISuggestionReviewModal;
