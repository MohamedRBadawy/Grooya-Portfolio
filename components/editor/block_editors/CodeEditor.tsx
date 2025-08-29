import React from 'react';
import type { CodeBlock } from '../../../types';
import { EditorLabel, EditorInput, EditorTextarea } from '../../ui/editor/EditorControls';

interface CodeEditorProps {
  block: CodeBlock;
  onUpdate: (updates: Partial<CodeBlock>) => void;
  t: (key: string) => string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ block, onUpdate, t }) => {
  return (
    <>
      <div>
        <EditorLabel htmlFor={`code-lang-${block.id}`}>{t('code.language')}</EditorLabel>
        <EditorInput id={`code-lang-${block.id}`} value={block.language} onChange={e => onUpdate({ language: e.target.value })} placeholder="e.g., JavaScript" />
      </div>
      <div>
        <EditorLabel htmlFor={`code-code-${block.id}`}>{t('code.code')}</EditorLabel>
        <EditorTextarea id={`code-code-${block.id}`} value={block.code} onChange={e => onUpdate({ code: e.target.value })} rows={10} className="font-mono text-sm" />
      </div>
    </>
  );
};
