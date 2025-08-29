import React from 'react';
import type { AboutBlock } from '../../../types';
import { EditorLabel, EditorInput } from '../../ui/editor/EditorControls';
import Button from '../../ui/Button';

interface AboutEditorProps {
  block: AboutBlock;
  onUpdate: (updates: Partial<AboutBlock>) => void;
}

export const AboutEditor: React.FC<AboutEditorProps> = ({ block, onUpdate }) => {
  return (
    <>
      <div>
        <EditorLabel htmlFor={`a-mediaUrl-${block.id}`}>Image/Video URL (optional)</EditorLabel>
        <EditorInput id={`a-mediaUrl-${block.id}`} value={block.mediaUrl || ''} onChange={e => onUpdate({ mediaUrl: e.target.value })} />
      </div>
      {block.mediaUrl && (
        <>
          <div className="space-y-4">
            <div>
              <EditorLabel>Media Type</EditorLabel>
              <div className="flex gap-2">
                <Button size="sm" variant={!block.mediaType || block.mediaType === 'image' ? 'primary' : 'secondary'} onClick={() => onUpdate({ mediaType: 'image' })}>Image</Button>
                <Button size="sm" variant={block.mediaType === 'video' ? 'primary' : 'secondary'} onClick={() => onUpdate({ mediaType: 'video' })}>Video</Button>
              </div>
            </div>
            <div>
              <EditorLabel>Media Position</EditorLabel>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant={block.mediaPosition === 'left' || !block.mediaPosition ? 'primary' : 'secondary'} onClick={() => onUpdate({ mediaPosition: 'left' })}>Left</Button>
                <Button size="sm" variant={block.mediaPosition === 'right' ? 'primary' : 'secondary'} onClick={() => onUpdate({ mediaPosition: 'right' })}>Right</Button>
                <Button size="sm" variant={block.mediaPosition === 'top' ? 'primary' : 'secondary'} onClick={() => onUpdate({ mediaPosition: 'top' })}>Top</Button>
                <Button size="sm" variant={block.mediaPosition === 'bottom' ? 'primary' : 'secondary'} onClick={() => onUpdate({ mediaPosition: 'bottom' })}>Bottom</Button>
              </div>
            </div>
          </div>
          <div>
            <label className="flex items-center justify-between cursor-pointer p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg mt-4">
              <span className="text-sm text-slate-700 dark:text-slate-300">Sticky Media on Scroll</span>
              <input
                type="checkbox"
                checked={block.stickyMedia || false}
                onChange={e => onUpdate({ stickyMedia: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
            </label>
          </div>
        </>
      )}
    </>
  );
};
