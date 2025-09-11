
import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Button from './Button';

interface ImageUploaderProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  label: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, label, className = 'h-40' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const triggerFileInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/gif, image/webp"
        className="hidden"
      />
      <div 
        className={`flex items-center justify-center w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 relative group ${className}`}
        onClick={triggerFileInput}
        role="button"
        tabIndex={0}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="h-full w-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={triggerFileInput}>Change</Button>
              <Button size="sm" variant="danger" onClick={handleRemove}>Remove</Button>
            </div>
          </>
        ) : (
          <div className="text-center text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">
              <Upload size={32} className="mx-auto" />
              <span className="mt-2 text-sm font-semibold block">{label}</span>
              <span className="text-xs block">Click to upload</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
