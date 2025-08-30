import React, { useState, useMemo } from 'react';
import { Search, Check, FilePenLine } from 'lucide-react';
// FIX: The type `MotionProps` does not seem to include animation properties in this project's setup, so we remove the explicit type to let TypeScript infer it.
import { motion, AnimatePresence } from 'framer-motion';

interface Item {
  id: string;
  name: string;
}

interface MultiItemSelectorProps {
  items: Item[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  placeholder: string;
  onEditItem?: (id: string) => void;
  renderFooter?: () => React.ReactNode;
}

export const MultiItemSelector: React.FC<MultiItemSelectorProps> = ({
  items,
  selectedIds,
  onToggle,
  placeholder,
  onEditItem,
  renderFooter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm">
      <div className="relative p-2 border-b border-slate-300 dark:border-slate-700">
        <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-transparent ps-8 pe-4 py-1 sm:text-sm focus:outline-none text-slate-900 dark:text-slate-50 placeholder-slate-500"
        />
      </div>
      <div className="max-h-60 overflow-y-auto p-2">
        {filteredItems.length > 0 ? (
          <ul>
            {filteredItems.map(item => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <li
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/50 group"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-teal-500 border-teal-500' : 'border-slate-400 dark:border-slate-500'}`}>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="text-sm text-slate-800 dark:text-slate-200">{item.name}</span>
                  </div>
                  {onEditItem && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditItem(item.id);
                      }}
                      className="p-1 rounded text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-opacity"
                      aria-label={`Edit ${item.name}`}
                    >
                      <FilePenLine size={14} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 py-4">No items found.</p>
        )}
      </div>
      {renderFooter && (
        <div className="p-2 border-t border-slate-300 dark:border-slate-700">
          {renderFooter()}
        </div>
      )}
    </div>
  );
};