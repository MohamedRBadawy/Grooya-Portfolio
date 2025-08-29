import React from 'react';
import type { VideoBlock } from '../../../types';
import { EditorLabel, EditorInput } from '../../ui/editor/EditorControls';

interface VideoEditorProps {
  block: VideoBlock;
  onUpdate: (updates: Partial<VideoBlock>) => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({ block, onUpdate }) => {
  return (
    <div>
      <EditorLabel>Video URL (YouTube or Vimeo)</EditorLabel>
      <EditorInput value={block.videoUrl} onChange={e => onUpdate({ videoUrl: e.target.value })} />
    </div>
  );
};
