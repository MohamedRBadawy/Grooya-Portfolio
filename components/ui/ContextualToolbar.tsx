import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type MotionProps } from 'framer-motion';
import { Copy, ArrowUp, ArrowDown, Trash2, Sparkles, Users } from 'lucide-react';

interface ContextualToolbarProps {
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onAIAssist?: () => void;
  isAIAssistLoading?: boolean;
  onTune?: (audience: string) => void;
  isTuning?: boolean;
}

const ToolbarButton: React.FC<{ onClick: (e: React.MouseEvent) => void, children: React.ReactNode, 'aria-label': string, disabled?: boolean, title?: string }> = ({ onClick, children, 'aria-label': ariaLabel, disabled = false, title }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        className="p-2 rounded-md text-white hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
        aria-label={ariaLabel}
        disabled={disabled}
        title={title}
    >
        {children}
    </button>
);

const ContextualToolbar: React.FC<ContextualToolbarProps> = ({ onDuplicate, onMoveUp, onMoveDown, onDelete, onAIAssist, isAIAssistLoading, onTune, isTuning }) => {
  const [isTuneMenuOpen, setIsTuneMenuOpen] = useState(false);
  const tuneMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tuneMenuRef.current && !tuneMenuRef.current.contains(event.target as Node)) {
        setIsTuneMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const audiences = ['Technical Recruiter', 'Hiring Manager', 'Potential Client'];

  const motionProps: MotionProps = {
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
            <ToolbarButton 
              onClick={onAIAssist} 
              aria-label="Generate with AI" 
              disabled={isAIAssistLoading}
              title="Generate with AI (1 Text Credit)"
            >
              {isAIAssistLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : (
                  <Sparkles size={16} />
              )}
            </ToolbarButton>
          </>
      )}
      {onTune && (
           <div className="relative" ref={tuneMenuRef}>
            <ToolbarButton 
              onClick={(e) => { e.stopPropagation(); setIsTuneMenuOpen(p => !p); }} 
              aria-label="Tune for Audience" 
              disabled={isTuning}
              title="Tune for Audience (1 Text Credit)"
            >
              {isTuning ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : (
                  <Users size={16} />
              )}
            </ToolbarButton>
            <AnimatePresence>
                {isTuneMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-700 rounded-md shadow-lg z-20 py-1"
                    >
                        {audiences.map(audience => (
                             <button
                                key={audience}
                                onClick={(e) => { e.stopPropagation(); onTune(audience); setIsTuneMenuOpen(false); }}
                                className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-slate-600"
                            >{audience}</button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
      )}
      {(onAIAssist || onTune) && <div className="w-px h-5 bg-teal-500/50 mx-1"></div>}
      <ToolbarButton onClick={onDuplicate} aria-label="Duplicate block"><Copy size={16} /></ToolbarButton>
      <ToolbarButton onClick={onMoveUp} aria-label="Move block up"><ArrowUp size={16} /></ToolbarButton>
      <ToolbarButton onClick={onMoveDown} aria-label="Move block down"><ArrowDown size={16} /></ToolbarButton>
      <div className="w-px h-5 bg-teal-500/50 mx-1"></div>
      <ToolbarButton onClick={onDelete} aria-label="Delete block"><Trash2 size={16} /></ToolbarButton>
    </motion.div>
  );
};

export default ContextualToolbar;
