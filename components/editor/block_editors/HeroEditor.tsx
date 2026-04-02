
import React from 'react';
import type { HeroBlock } from '../../../types';
import { EditorLabel, EditorInput } from '../../ui/editor/EditorControls';
import ImageUploader from '../../ui/ImageUploader';

interface HeroEditorProps {
  block: HeroBlock;
  onUpdate: (updates: Partial<HeroBlock>) => void;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ block, onUpdate }) => {
  return (
    <>
      <div>
        <EditorLabel htmlFor={`h-layout-${block.id}`}>Hero Layout</EditorLabel>
        <select
          id={`h-layout-${block.id}`}
          value={block.layoutVariant || 'centered'}
          onChange={(e) => onUpdate({ layoutVariant: e.target.value as HeroBlock['layoutVariant'] })}
          className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="centered">Centered</option>
          <option value="split">Split Layout</option>
          <option value="editorial">Editorial</option>
        </select>
      </div>
      <ImageUploader 
        label="Upload Hero Image"
        value={block.imageUrl}
        onChange={(value) => onUpdate({ imageUrl: value || '' })}
      />
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
