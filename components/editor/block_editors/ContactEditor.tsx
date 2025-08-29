import React from 'react';
import type { ContactBlock } from '../../../types';
import { EditorLabel, EditorInput } from '../../ui/editor/EditorControls';

interface ContactEditorProps {
  block: ContactBlock;
  onUpdate: (updates: Partial<ContactBlock>) => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({ block, onUpdate }) => {
  return (
    <div>
      <EditorLabel htmlFor={`c-buttonText-${block.id}`}>Button Text</EditorLabel>
      <EditorInput id={`c-buttonText-${block.id}`} value={block.buttonText} onChange={e => onUpdate({ buttonText: e.target.value })} />
    </div>
  );
};
