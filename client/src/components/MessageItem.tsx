import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Shield, User, Copy, Check, Clock, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../types/chat.js';
import { CodeBlock } from './CodeBlock.js';
import { FileBadge } from './FileBadge.js';

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
      className={`group w-full py-4 px-4 sm:px-6 transition-colors ${
        isUser
          ? 'bg-transparent'
          : 'bg-gray-50/70 dark:bg-dark-surface/40 border-y border-gray-100 dark:border-dark-border/40'
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-semibold shadow-sm ${
            isUser
              ? 'bg-gray-200 dark:bg-dark-card text-gray-700 dark:text-gray-300'
              : 'bg-gradient-to-tr from-sentinel-600 to-cyan-400 text-white shadow-sentinel-500/20'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
        </div>

        {/* Message Content Container */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Header metadata */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                {isUser ? 'You' : 'Sentinel AI'}
              </span>
              {message.modelUsed && !isUser && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-200/60 dark:bg-dark-card text-gray-500 dark:text-gray-400">
                  {message.modelUsed}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3" />
                {formattedTime}
              </span>
              <button
                onClick={handleCopyMessage}
                title="Copy entire message"
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-card text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Attached Files Badge Display */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 pb-1">
              {message.attachments.map((file, idx) => (
                <FileBadge key={idx} file={file} readOnly />
              ))}
            </div>
          )}

          {/* Body Content */}
          <div className="prose-sentinel text-sm text-gray-800 dark:text-gray-200 leading-relaxed break-words">
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

          {/* Error Banner */}
          {message.error && (
            <div className="flex items-center gap-2 p-2 mt-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Generation was interrupted or encountered an upstream issue.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
