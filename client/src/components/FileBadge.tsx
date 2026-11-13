import React from 'react';
import { FileText, X } from 'lucide-react';
import { FileAttachment } from '../types/chat.js';

interface FileBadgeProps {
  file: FileAttachment;
  onRemove?: () => void;
  readOnly?: boolean;
}

export const FileBadge: React.FC<FileBadgeProps> = ({ file, onRemove, readOnly = false }) => {
  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-sentinel-500/10 text-sentinel-700 dark:text-sentinel-300 border border-sentinel-500/20 max-w-full">
      <FileText className="w-3.5 h-3.5 text-sentinel-500 shrink-0" />
      <span className="truncate font-mono font-medium max-w-[140px] sm:max-w-[200px]" title={file.filename}>
        {file.filename}
      </span>
      {file.size && (
        <span className="text-[10px] text-gray-500 dark:text-gray-400 shrink-0 font-sans">
          ({formatSize(file.size)})
        </span>
      )}
      {!readOnly && onRemove && (
        <button
          onClick={onRemove}
          type="button"
          title="Remove file attachment"
          className="ml-1 p-0.5 rounded hover:bg-sentinel-500/20 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
