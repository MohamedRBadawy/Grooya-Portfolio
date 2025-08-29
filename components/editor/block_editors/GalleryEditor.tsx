import React from 'react';
import type { GalleryBlock, GalleryImage } from '../../../types';
import { EditorLabel, EditorInput } from '../../ui/editor/EditorControls';
import Button from '../../ui/Button';
import { X, Plus } from 'lucide-react';

interface GalleryEditorProps {
  block: GalleryBlock;
  onUpdate: (updates: Partial<GalleryBlock>) => void;
  t: (key: string) => string;
}

export const GalleryEditor: React.FC<GalleryEditorProps> = ({ block, onUpdate, t }) => {
  const updateImage = (imgId: string, field: keyof GalleryImage, value: string) => {
    const newImages = block.images.map(img => img.id === imgId ? { ...img, [field]: value } : img);
    onUpdate({ images: newImages });
  };
  
  const addImage = () => {
    const newImage = { id: `img-${Date.now()}`, url: 'https://picsum.photos/seed/new-gallery/800/600', caption: 'A new image' };
    onUpdate({ images: [...block.images, newImage] });
  };
  
  const removeImage = (imgId: string) => {
    onUpdate({ images: block.images.filter(img => img.id !== imgId) });
  };
  
  return (
    <>
      <div>
        <EditorLabel>Layout</EditorLabel>
        <div className="flex gap-2">
          <Button size="sm" variant={block.layout === 'grid' ? 'primary' : 'secondary'} onClick={() => onUpdate({ layout: 'grid' })}>Grid</Button>
          <Button size="sm" variant={block.layout === 'masonry' ? 'primary' : 'secondary'} onClick={() => onUpdate({ layout: 'masonry' })}>Masonry</Button>
        </div>
      </div>
      {block.images.length > 0 ? (
        <div className="space-y-3">
          <EditorLabel>Images</EditorLabel>
          {block.images.map(img => (
            <div key={img.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
              <div className="flex justify-end"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeImage(img.id)}><X size={14} /></Button></div>
              <EditorInput placeholder="Image URL" value={img.url} onChange={e => updateImage(img.id, 'url', e.target.value)} />
              <EditorInput placeholder="Caption (optional)" value={img.caption} onChange={e => updateImage(img.id, 'caption', e.target.value)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('gallery.emptyState')}</p>
        </div>
      )}
      <Button size="sm" variant="secondary" onClick={addImage}><Plus size={14} className="me-2" />{t('addImage')}</Button>
    </>
  );
};
