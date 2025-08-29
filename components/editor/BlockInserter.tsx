
import React from 'react';
import { Plus } from 'lucide-react';

const BlockInserter: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
    return (
        <div className="relative h-4 group">
            <div className="absolute inset-x-0 top-1/2 h-px bg-transparent transition-colors group-hover:bg-slate-300 dark:group-hover:bg-slate-700"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <button
                    onClick={onAdd}
                    className="flex items-center justify-center w-6 h-6 bg-slate-400 dark:bg-slate-600 text-white rounded-full border-2 border-slate-50 dark:border-slate-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-teal-600"
                    aria-label="Add new block here"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};

export default BlockInserter;
