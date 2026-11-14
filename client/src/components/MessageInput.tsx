import React, { useState, useRef, useEffect } from 'react';
import { Square } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
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
    if (!input.trim() || isStreaming || disabled) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      <div className="relative rounded-sm border border-[#E4E0D8] dark:border-white/10 bg-white dark:bg-[#1E1E1D] shadow-sm focus-within:border-[#A459FF] transition-all overflow-hidden">
        <div className="flex items-end gap-2 p-2.5 sm:p-3">
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? 'Synthesizing grounded response...'
                : 'Inquire on operations, compliance, 5-step rhythm, or pricing... (Enter to query)'
            }
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent border-0 text-sm text-[#141413] dark:text-white placeholder-[#7A7A7A] focus:outline-none resize-none max-h-40 py-1 font-sans leading-relaxed"
          />

          {/* Action Button: Stop or Send */}
          {isStreaming ? (
            <button
              onClick={onStopGenerating}
              type="button"
              title="Stop Generating"
              className="px-3 py-2 rounded-sm bg-red-600 hover:bg-red-500 text-white shadow-sm transition-all shrink-0 flex items-center gap-1.5 text-xs font-mono"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim() || disabled}
              type="button"
              title="Execute Query"
              className={`px-3.5 py-2 rounded-sm text-xs font-medium font-sans transition-all shrink-0 flex items-center gap-1.5 ${
                input.trim()
                  ? 'bg-[#141413] hover:bg-[#2B2B2B] text-white dark:bg-white dark:text-[#141413] dark:hover:bg-gray-100 cursor-pointer shadow-sm'
                  : 'bg-black/5 dark:bg-white/5 text-[#7A7A7A] cursor-not-allowed'
              }`}
            >
              <span>Query</span>
              <span className="text-[#A459FF] font-bold" aria-hidden="true">↗</span>
            </button>
          )}
        </div>

        {/* Bottom hairline bar */}
        <div className="flex items-center justify-between px-3.5 py-1 bg-[#FAF9F6] dark:bg-[#141413] border-t border-[#E4E0D8] dark:border-white/10 text-[10px] font-mono text-[#7A7A7A]">
          <span className="uppercase tracking-wider">THΛTJOINT / 01 OPERATING TERMINAL</span>
          <span>Shift+Enter for newline</span>
        </div>
      </div>
    </div>
  );
};
