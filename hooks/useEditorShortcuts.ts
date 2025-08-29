
import React, { useMemo, useEffect } from 'react';
import { useKeyPress } from './useKeyPress';

interface UseEditorShortcutsProps {
    canUndo: boolean;
    undo: () => void;
    canRedo: boolean;
    redo: () => void;
    setIsCommandPaletteOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
}

export const useEditorShortcuts = ({
    canUndo,
    undo,
    canRedo,
    redo,
    setIsCommandPaletteOpen,
}: UseEditorShortcutsProps) => {
    const isMac = useMemo(() => typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0, []);
        
    // Undo shortcut
    useKeyPress(() => { if (canUndo) undo() }, ['z']);
    
    // Redo shortcut (more complex logic for mac/win)
    useEffect(() => {
        const redoHandler = (event: KeyboardEvent) => {
          const isRedo = isMac 
            ? event.metaKey && event.shiftKey && event.key.toLowerCase() === 'z' // Cmd+Shift+Z
            : event.ctrlKey && event.key.toLowerCase() === 'y'; // Ctrl+Y
          
          if (isRedo) {
            event.preventDefault();
            if (canRedo) redo();
          }
        };

        window.addEventListener('keydown', redoHandler);
        return () => window.removeEventListener('keydown', redoHandler);
    }, [redo, canRedo, isMac]);

    // Command Palette shortcut
    useKeyPress(() => setIsCommandPaletteOpen(prev => !prev), ['k']);
    
    return { isMac };
};
