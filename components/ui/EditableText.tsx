
import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor from './RichTextEditor';

interface EditableTextProps extends React.HTMLAttributes<HTMLElement> {
  as: 'h1' | 'h2' | 'p' | 'a' | 'div';
  value: string;
  onSave: (value: string) => void;
  isEditable?: boolean;
  multiline?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * A component that displays text but becomes an input field on click for inline editing.
 * It supports both single-line input and a multi-line rich text editor.
 */
const EditableText: React.FC<EditableTextProps> = ({ 
    as: Tag, 
    value, 
    onSave, 
    isEditable = false, 
    className, 
    multiline = false,
    ...props 
}) => {
  // State to track if the component is in editing mode.
  const [isEditing, setIsEditing] = useState(false);
  // Local state to hold the value during editing.
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local state if the external value prop changes.
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Focus and select the text when entering editing mode for single-line inputs.
  useEffect(() => {
    if (isEditing && !multiline) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing, multiline]);
  
  // Save the changes and exit editing mode.
  const handleSave = () => {
    if (currentValue !== value) {
        onSave(currentValue);
    }
    setIsEditing(false);
  };
  
  // Handle keyboard events for single-line inputs.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
    }
    if (e.key === 'Escape') {
        setCurrentValue(value); // Revert changes
        setIsEditing(false);
    }
  };
  
  // Render the editing UI if in edit mode.
  if (isEditable && isEditing) {
    // For multiline, use the Rich Text Editor.
    if (multiline) {
        return (
            <RichTextEditor 
                content={currentValue}
                onUpdate={setCurrentValue}
                onBlur={handleSave}
                className={className}
            />
        )
    }
    // For single-line, use a standard input.
    return (
        <input 
            ref={inputRef}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${className} bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-teal-400 p-0 m-0 w-full resize-none`} 
        />
    );
  }
  
  // Render the display mode.
  const editableProps = isEditable ? {
      onClick: (e: React.MouseEvent) => {
        // Stop propagation to prevent deselecting the active block in the editor.
        e.stopPropagation();
        setIsEditing(true);
      },
      className: `${className} cursor-pointer hover:bg-teal-500/10 rounded-sm transition-colors p-1 -m-1`,
      title: "Click to edit"
  } : { className };

  // For multiline display, render raw HTML content inside a container with prose styles.
  if (multiline) {
    return (
        <Tag
            {...props}
            {...editableProps}
            className={`${editableProps.className} prose dark:prose-invert max-w-none`}
            dangerouslySetInnerHTML={{ __html: value }}
        />
    );
  }

  // For single-line display, render the text content directly.
  return <Tag {...props} {...editableProps}>{value}</Tag>;
};

export default EditableText;