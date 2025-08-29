import React from 'react';
import type { ResumeBlock } from '../../../types';
import { EditorLabel, EditorInput } from '../../ui/editor/EditorControls';

interface ResumeEditorProps {
  block: ResumeBlock;
  onUpdate: (updates: Partial<ResumeBlock>) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ block, onUpdate }) => {
  return (
    <>
      <div>
        <EditorLabel htmlFor={`resume-buttonText-${block.id}`}>Button Text</EditorLabel>
        <EditorInput id={`resume-buttonText-${block.id}`} value={block.buttonText} onChange={e => onUpdate({ buttonText: e.target.value })} />
      </div>
      <div>
        <EditorLabel htmlFor={`resume-fileUrl-${block.id}`}>Resume PDF URL</EditorLabel>
        <EditorInput id={`resume-fileUrl-${block.id}`} value={block.fileUrl} onChange={e => onUpdate({ fileUrl: e.target.value })} />
      </div>
    </>
  );
};
