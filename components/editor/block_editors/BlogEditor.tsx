import React from 'react';
import type { BlogBlock, BlogPost } from '../../../types';
import { EditorLabel, EditorInput, EditorTextarea } from '../../ui/editor/EditorControls';
import Button from '../../ui/Button';
import { X, Plus } from 'lucide-react';

interface BlogEditorProps {
  block: BlogBlock;
  onUpdate: (updates: Partial<BlogBlock>) => void;
  t: (key: string) => string;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ block, onUpdate, t }) => {
  const updatePost = (postId: string, field: keyof Omit<BlogPost, 'id'>, value: string) => {
    const newPosts = block.posts.map(post => post.id === postId ? { ...post, [field]: value } : post);
    onUpdate({ posts: newPosts });
  };
  
  const addPost = () => {
    const newPost: BlogPost = { id: `post-${Date.now()}`, title: 'New Article', excerpt: 'A brief description of the article.', imageUrl: 'https://picsum.photos/seed/new-post-2/600/400', link: '#' };
    onUpdate({ posts: [...block.posts, newPost] });
  };
  
  const removePost = (postId: string) => {
    onUpdate({ posts: block.posts.filter(post => post.id !== postId) });
  };
  
  return (
    <>
      {block.posts.length > 0 ? (
        <div className="space-y-3">
          <EditorLabel>Posts</EditorLabel>
          {block.posts.map(post => (
            <div key={post.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
              <div className="flex justify-end"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removePost(post.id)}><X size={14} /></Button></div>
              <EditorInput placeholder="Post Title" value={post.title} onChange={e => updatePost(post.id, 'title', e.target.value)} />
              <EditorTextarea placeholder="Excerpt" value={post.excerpt} onChange={e => updatePost(post.id, 'excerpt', e.target.value)} rows={2} />
              <EditorInput placeholder="Image URL" value={post.imageUrl} onChange={e => updatePost(post.id, 'imageUrl', e.target.value)} />
              <EditorInput placeholder="Article Link URL" value={post.link} onChange={e => updatePost(post.id, 'link', e.target.value)} type="url" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('blog.emptyState')}</p>
        </div>
      )}
      <Button size="sm" variant="secondary" onClick={addPost}><Plus size={14} className="me-2" />{t('addPost')}</Button>
    </>
  );
};
