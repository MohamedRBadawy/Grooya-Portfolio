import React from 'react';
import { motion } from 'framer-motion';
import { Copy, ArrowUp, ArrowDown, Trash2, Sparkles } from 'lucide-react';

interface ContextualToolbarProps {
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onAIAssist?: () => void;
  isAIAssistLoading?: boolean;
}

const ToolbarButton: React.FC<{ onClick: (e: React.MouseEvent) => void, children: React.ReactNode, 'aria-label': string, disabled?: boolean }> = ({ onClick, children, 'aria-label': ariaLabel, disabled = false }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        className="p-2 rounded-md text-white hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
        aria-label={ariaLabel}
        disabled={disabled}
    >
        {children}
    </button>
);

const ContextualToolbar: React.FC<ContextualToolbarProps> = ({ onDuplicate, onMoveUp, onMoveDown, onDelete, onAIAssist, isAIAssistLoading }) => {
  const motionProps: any = {
      initial: { opacity: 0, y: 10, x: '-50%' },
      animate: { opacity: 1, y: 0, x: '-50%' },
      exit: { opacity: 0, y: 10, x: '-50%' },
      transition: { duration: 0.2 },
  };
  return (
    <motion.div
      {...motionProps}
      className="absolute top-[-44px] left-1/2 z-30 flex items-center gap-1 bg-teal-600/95 backdrop-blur-sm rounded-lg shadow-lg p-1"
      onClick={e => e.stopPropagation()}
    >
      {onAIAssist && (
          <>
            <ToolbarButton onClick={onAIAssist} aria-label="Generate with AI" disabled={isAIAssistLoading}>
              {isAIAssistLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : (
                  <Sparkles size={16} />
              )}
            </ToolbarButton>
            <div className="w-px h-5 bg-teal-500/50 mx-1"></div>
          </>
      )}
      <ToolbarButton onClick={onDuplicate} aria-label="Duplicate block"><Copy size={16} /></ToolbarButton>
      <ToolbarButton onClick={onMoveUp} aria-label="Move block up"><ArrowUp size={16} /></ToolbarButton>
      <ToolbarButton onClick={onMoveDown} aria-label="Move block down"><ArrowDown size={16} /></ToolbarButton>
      <div className="w-px h-5 bg-teal-500/50 mx-1"></div>
      <ToolbarButton onClick={onDelete} aria-label="Delete block"><Trash2 size={16} /></ToolbarButton>
    </motion.div>
  );
};

export default ContextualToolbar;
