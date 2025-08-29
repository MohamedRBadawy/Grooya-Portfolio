
import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import BubbleMenu, { BubbleMenu as BubbleMenuExtension } from '@tiptap/extension-bubble-menu';
import { Bold, Italic, Link as LinkIcon } from 'lucide-react';

interface RichTextEditorProps extends React.HTMLAttributes<HTMLElement> {
  content: string;
  onUpdate: (content: string) => void;
  onBlur: () => void;
  className?: string;
}

const MenuButton: React.FC<{ onClick: (e: React.MouseEvent) => void, isActive: boolean, children: React.ReactNode }> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        type="button"
        className={`p-2 rounded-md transition-colors ${isActive ? 'bg-slate-700 text-slate-50' : 'bg-transparent text-slate-300 hover:bg-slate-700 hover:text-slate-50'}`}
    >
        {children}
    </button>
)

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onUpdate, onBlur, className }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-teal-600 hover:text-teal-500',
        },
      }),
      BubbleMenuExtension,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    onBlur: () => {
        onBlur();
    },
    editorProps: {
        attributes: {
            class: `prose dark:prose-invert max-w-none focus:outline-none w-full min-h-[100px] p-1 ${className}`,
        },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-slate-800 text-slate-50 rounded-lg shadow-lg p-1 flex gap-1">
        <MenuButton onClick={() => editor.chain().focus().toggleMark('bold').run()} isActive={editor.isActive('bold')}><Bold size={16} /></MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleMark('italic').run()} isActive={editor.isActive('italic')}><Italic size={16} /></MenuButton>
        <MenuButton onClick={setLink} isActive={editor.isActive('link')}><LinkIcon size={16} /></MenuButton>
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </>
  );
};

export default RichTextEditor;
