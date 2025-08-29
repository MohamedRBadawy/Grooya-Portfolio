import React from 'react';
import type { LinksBlock, ExternalLink } from '../../../types';
import { EditorLabel, EditorInput } from '../../ui/editor/EditorControls';
import Button from '../../ui/Button';
import { X, Plus } from 'lucide-react';

interface LinksEditorProps {
  block: LinksBlock;
  onUpdate: (updates: Partial<LinksBlock>) => void;
  t: (key: string) => string;
}

export const LinksEditor: React.FC<LinksEditorProps> = ({ block, onUpdate, t }) => {
  const updateLink = (linkId: string, field: keyof Omit<ExternalLink, 'id'>, value: string) => {
    const newLinks = block.links.map(link => link.id === linkId ? { ...link, [field]: value } : link);
    onUpdate({ links: newLinks });
  };
  
  const addLink = () => {
    const newLink: ExternalLink = { id: `link-${Date.now()}`, platform: 'github', url: 'https://github.com/your-username', text: 'GitHub' };
    onUpdate({ links: [...block.links, newLink] });
  };
  
  const removeLink = (linkId: string) => {
    onUpdate({ links: block.links.filter(link => link.id !== linkId) });
  };

  return (
    <>
      {block.links.length > 0 ? (
        <div className="space-y-3">
          <EditorLabel>Links</EditorLabel>
          {block.links.map(link => (
            <div key={link.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
              <div className="flex justify-end"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeLink(link.id)}><X size={14} /></Button></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <EditorLabel htmlFor={`link-platform-${link.id}`}>Platform</EditorLabel>
                  <select
                    id={`link-platform-${link.id}`}
                    value={link.platform}
                    onChange={e => updateLink(link.id, 'platform', e.target.value as ExternalLink['platform'])}
                    className="block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-slate-100"
                  >
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="website">Website</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <EditorLabel htmlFor={`link-text-${link.id}`}>Display Text</EditorLabel>
                  <EditorInput id={`link-text-${link.id}`} placeholder="e.g., My GitHub" value={link.text} onChange={e => updateLink(link.id, 'text', e.target.value)} />
                </div>
              </div>
              <div>
                <EditorLabel htmlFor={`link-url-${link.id}`}>URL</EditorLabel>
                <EditorInput id={`link-url-${link.id}`} placeholder="https://..." value={link.url} onChange={e => updateLink(link.id, 'url', e.target.value)} type="url" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('links.emptyState')}</p>
        </div>
      )}
      <Button size="sm" variant="secondary" onClick={addLink}><Plus size={14} className="me-2" />{t('addLink')}</Button>
    </>
  );
};
