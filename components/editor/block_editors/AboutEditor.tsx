
import React from 'react';
import type { AboutBlock } from '../../../types';
import { EditorLabel } from '../../ui/editor/EditorControls';
import Button from '../../ui/Button';
import ImageUploader from '../../ui/ImageUploader';

interface AboutEditorProps {
  block: AboutBlock;
  onUpdate: (updates: Partial<AboutBlock>) => void;
}

export const AboutEditor: React.FC<AboutEditorProps> = ({ block, onUpdate }) => {
  return (
    <>
      <ImageUploader
        label="Upload Media Image"
        value={block.mediaUrl}
        onChange={(value) => onUpdate({ mediaUrl: value, mediaType: value ? 'image' : undefined })}
      />
      {block.mediaUrl && (
        <>
          <div className="space-y-4">
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
