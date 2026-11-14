import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Clock, BookOpen } from 'lucide-react';
import { ChatMessage } from '../types/chat.js';
import { CodeBlock } from './CodeBlock.js';

interface MessageItemProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy text:', e);
    }
  };

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className={`group w-full py-5 px-4 sm:px-6 transition-colors border-b border-[#E4E0D8]/60 dark:border-white/5 ${
        isUser
          ? 'bg-transparent'
          : 'bg-white dark:bg-[#1E1E1D]'
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-start gap-3.5 sm:gap-4">
        {/* Avatar badge */}
        <div
          className={`w-7 h-7 rounded-sm shrink-0 flex items-center justify-center text-[10px] font-mono font-bold border transition-colors ${
            isUser
              ? 'bg-[#FAF9F6] dark:bg-[#141413] border-[#E4E0D8] dark:border-white/20 text-[#141413] dark:text-white'
              : 'bg-[#141413] text-white border-[#141413] dark:bg-white dark:text-[#141413] dark:border-white shadow-sm'
          }`}
        >
          {isUser ? '01' : 'TJ'}
        </div>

        {/* Message body */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Metadata bar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold uppercase tracking-wider text-[#141413] dark:text-white text-sm">
                {isUser ? 'OPERATOR' : 'THΛTJOINT / SENTINEL AI'}
              </span>
              {!isUser && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-sm bg-black/5 dark:bg-white/10 text-[#7A7A7A] dark:text-[#9E9B95]">
                  Verified RAG
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="font-mono text-[10px] text-[#7A7A7A]">
                {formattedTime}
              </span>
              <button
                onClick={handleCopyMessage}
                title="Copy entire response"
                className="p-1 rounded-sm hover:bg-black/5 dark:hover:bg-white/10 text-[#7A7A7A] hover:text-[#141413] dark:hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="prose-thatjoint text-sm text-[#141413] dark:text-[#F7F5F0] leading-relaxed break-words font-sans">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    if (!inline && match) {
                      return <CodeBlock language={match[1]} value={codeString} />;
                    }
                    if (!inline && codeString.includes('\n')) {
                      return <CodeBlock language="text" value={codeString} />;
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
            {isStreaming && <span className="cursor-blink" />}
          </div>

          {/* Citations Pill Bar */}
          {message.citations && message.citations.length > 0 && (
            <div className="pt-2 border-t border-[#E4E0D8]/40 dark:border-white/5 flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase text-[#7A7A7A] tracking-wider mr-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-[#A459FF]" />
                Sources:
              </span>
              {message.citations.map((cite, i) => (
                <span key={i} className="citation-pill">
                  {cite}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
