import React from 'react';
import type { TestimonialsBlock, Testimonial } from '../../../types';
import { EditorLabel, EditorInput, EditorTextarea } from '../../ui/editor/EditorControls';
import Button from '../../ui/Button';
import { X, Plus } from 'lucide-react';
import ImageUploader from '../../ui/ImageUploader';

interface TestimonialsEditorProps {
  block: TestimonialsBlock;
  onUpdate: (updates: Partial<TestimonialsBlock>) => void;
  t: (key: string) => string;
}

export const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({ block, onUpdate, t }) => {
  const updateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    const newTestimonials = block.testimonials.map(t => t.id === id ? { ...t, [field]: value } : t);
    onUpdate({ testimonials: newTestimonials });
  };
  
  const addTestimonial = () => {
    const newTestimonial = { id: `test-${Date.now()}`, quote: 'A glowing review about my work.', author: 'Satisfied Client', authorTitle: 'CEO, Acme Inc.', authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' };
    onUpdate({ testimonials: [...block.testimonials, newTestimonial] });
  };
  
  const removeTestimonial = (id: string) => {
    onUpdate({ testimonials: block.testimonials.filter(t => t.id !== id) });
  };
  
  return (
    <>
      {block.testimonials.length > 0 ? (
        <div className="space-y-3">
          <EditorLabel>Testimonials</EditorLabel>
          {block.testimonials.map(item => (
            <div key={item.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
              <div className="flex justify-end"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeTestimonial(item.id)}><X size={14} /></Button></div>
              <EditorTextarea placeholder="Quote" value={item.quote} onChange={e => updateTestimonial(item.id, 'quote', e.target.value)} rows={3} />
              <EditorInput placeholder="Author Name" value={item.author} onChange={e => updateTestimonial(item.id, 'author', e.target.value)} />
              <EditorInput placeholder="Author Title" value={item.authorTitle} onChange={e => updateTestimonial(item.id, 'authorTitle', e.target.value)} />
              <ImageUploader 
                label="Upload Author Avatar"
                value={item.authorAvatarUrl}
                onChange={(value) => updateTestimonial(item.id, 'authorAvatarUrl', value || '')}
                className="h-24"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('testimonials.emptyState')}</p>
        </div>
      )}
      <Button size="sm" variant="secondary" onClick={addTestimonial}><Plus size={14} className="me-2" />{t('addTestimonial')}</Button>
    </>
  );
};