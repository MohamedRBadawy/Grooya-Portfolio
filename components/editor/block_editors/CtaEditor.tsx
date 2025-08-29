import React from 'react';
import type { CtaBlock } from '../../../types';
import { EditorLabel, EditorInput } from '../../ui/editor/EditorControls';

interface CtaEditorProps {
  block: CtaBlock;
  onUpdate: (updates: Partial<CtaBlock>) => void;
}

export const CtaEditor: React.FC<CtaEditorProps> = ({ block, onUpdate }) => {
  return (
    <>
      <div>
        <EditorLabel htmlFor={`cta-buttonText-${block.id}`}>Button Text</EditorLabel>
        <EditorInput id={`cta-buttonText-${block.id}`} value={block.buttonText} onChange={e => onUpdate({ buttonText: e.target.value })} />
      </div>
      <div>
        <EditorLabel htmlFor={`cta-buttonLink-${block.id}`}>Button Link</EditorLabel>
        <EditorInput id={`cta-buttonLink-${block.id}`} value={block.buttonLink} onChange={e => onUpdate({ buttonLink: e.target.value })} />
      </div>
    </>
  );
};
