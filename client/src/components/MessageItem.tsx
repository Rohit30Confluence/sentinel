import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, BookOpen } from 'lucide-react';
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

  if (isUser) {
    // User Message Bubble: Deep charcoal #141413 with crisp white text and sharp rounded-sm corners
    return (
      <div className="w-full py-4 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex justify-end">
          <div className="max-w-[85%] sm:max-w-[75%] rounded-sm bg-[#141413] text-[#FFFFFF] p-4 shadow-sm border border-[#141413]">
            <div className="flex items-center justify-between gap-4 mb-1.5 font-mono text-[10px] text-[#A459FF] uppercase tracking-wider">
              <span>01 / OPERATOR</span>
              <span className="text-[#9E9B95]">{formattedTime}</span>
            </div>
            <p className="text-sm font-sans leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Assistant Message: Elevated pure white #FFFFFF card with 1px solid #E4E0D8 border and THΛTJOINT / SENTINEL monospace header
  return (
    <div className="w-full py-4 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-sm bg-[#FFFFFF] border border-[#E4E0D8] p-5 shadow-xs transition-colors">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E4E0D8] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#141413] tracking-wider uppercase">
                THΛTJOINT / SENTINEL
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-[#EFECE6] text-[#2D8A78] font-bold">
                ● GROUNDED
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#7A7A7A]">
                {formattedTime}
              </span>
              <button
                onClick={handleCopyMessage}
                title="Copy response"
                className="p-1 rounded-sm hover:bg-[#EFECE6] text-[#7A7A7A] hover:text-[#141413] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2D8A78]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="prose-thatjoint text-sm text-[#141413] leading-relaxed break-words font-sans">
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
            {isStreaming && <span className="cursor-blink" />}
          </div>

          {/* Citations Bar */}
          {message.citations && message.citations.length > 0 && (
            <div className="pt-3 mt-3 border-t border-[#E4E0D8] flex flex-wrap items-center gap-1.5">
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
