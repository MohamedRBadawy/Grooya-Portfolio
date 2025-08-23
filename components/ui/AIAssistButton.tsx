import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIAssistButtonProps {
  onClick: () => void;
  isLoading: boolean;
  className?: string;
}

const AIAssistButton: React.FC<AIAssistButtonProps> = ({ onClick, isLoading, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center p-2 rounded-full text-amber-500 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors disabled:opacity-50 disabled:cursor-wait ${className}`}
      title="Generate with AI"
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <Sparkles size={16} />
      )}
    </button>
  );
};

export default AIAssistButton;