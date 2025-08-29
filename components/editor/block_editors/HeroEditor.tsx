import React from 'react';
import type { HeroBlock } from '../../../types';
import { EditorLabel, EditorInput } from '../../ui/editor/EditorControls';

interface HeroEditorProps {
  block: HeroBlock;
  onUpdate: (updates: Partial<HeroBlock>) => void;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ block, onUpdate }) => {
  return (
    <>
      <div>
        <EditorLabel htmlFor={`h-imageUrl-${block.id}`}>Image URL (for no-background fallback)</EditorLabel>
        <EditorInput id={`h-imageUrl-${block.id}`} value={block.imageUrl} onChange={e => onUpdate({ imageUrl: e.target.value })} />
      </div>
      <div>
        <EditorLabel htmlFor={`h-ctaText-${block.id}`}>CTA Button Text</EditorLabel>
        <EditorInput id={`h-ctaText-${block.id}`} value={block.ctaText} onChange={e => onUpdate({ ctaText: e.target.value })} />
      </div>
      <div>
        <EditorLabel htmlFor={`h-ctaLink-${block.id}`}>CTA Link</EditorLabel>
        <EditorInput id={`h-ctaLink-${block.id}`} value={block.ctaLink} onChange={e => onUpdate({ ctaLink: e.target.value })} />
      </div>
    </>
  );
};
