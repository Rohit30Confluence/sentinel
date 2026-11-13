import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip, AlertCircle } from 'lucide-react';
import { FileAttachment } from '../types/chat.js';
import { FileBadge } from './FileBadge.js';

interface MessageInputProps {
  onSendMessage: (content: string, attachments: FileAttachment[]) => void;
  onStopGenerating: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onStopGenerating,
  isStreaming,
  disabled = false
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || isStreaming) return;
    onSendMessage(input.trim(), attachments);
    setInput('');
    setAttachments([]);
    setFileError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFileError(null);
    const newAttachments: FileAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Limit file size to 2MB for browser comfort
      if (file.size > 2 * 1024 * 1024) {
        setFileError(`File "${file.name}" exceeds the 2MB limit.`);
        continue;
      }

      try {
        const textContent = await file.text();
        newAttachments.push({
          filename: file.name,
          content: textContent,
          size: file.size,
          mimeType: file.type || 'text/plain'
        });
      } catch (err) {
        setFileError(`Could not read "${file.name}". Only text/code files supported.`);
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const approxTokens = Math.ceil(
    (input.length + attachments.reduce((acc, f) => acc + f.content.length, 0)) / 4
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* File error notice */}
      {fileError && (
        <div className="flex items-center gap-2 p-2 mb-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Input container box */}
      <div className="relative rounded-2xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface shadow-md focus-within:ring-2 focus-within:ring-sentinel-500/50 focus-within:border-sentinel-500 transition-all overflow-hidden">
        {/* Attached files preview chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3 pb-1 border-b border-gray-100 dark:border-dark-border/60">
            {attachments.map((file, idx) => (
              <FileBadge
                key={idx}
                file={file}
                onRemove={() => removeAttachment(idx)}
              />
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 p-2.5">
          {/* File Attachment Hidden Input & Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.md,.py,.js,.jsx,.ts,.tsx,.json,.html,.css,.sql,.csv,.yaml,.yml,.sh"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach code or text file for context"
            className="p-2 rounded-xl text-gray-400 hover:text-sentinel-500 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? 'Sentinel is generating response...'
                : 'Ask Sentinel anything, or attach files for context... (Enter to send)'
            }
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent border-0 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none resize-none max-h-48 py-1.5"
          />

          {/* Action Button: Stop or Send */}
          {isStreaming ? (
            <button
              onClick={onStopGenerating}
              type="button"
              title="Stop Generating"
              className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-sm transition-all shrink-0 hover:scale-105"
            >
              <Square className="w-4 h-4 fill-white" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={(!input.trim() && attachments.length === 0) || disabled}
              type="button"
              title="Send Message"
              className={`p-2 rounded-xl text-white shadow-sm transition-all shrink-0 ${
                input.trim() || attachments.length > 0
                  ? 'bg-sentinel-600 hover:bg-sentinel-500 hover:scale-105 cursor-pointer'
                  : 'bg-gray-300 dark:bg-dark-card text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom micro-bar */}
        <div className="flex items-center justify-between px-3.5 py-1 bg-gray-50/60 dark:bg-dark-base/50 border-t border-gray-100 dark:border-dark-border/40 text-[10px] text-gray-400 font-mono">
          <span>Shift+Enter for newline</span>
          {input.length > 0 && <span>~{approxTokens} tokens</span>}
        </div>
      </div>
    </div>
  );
};
