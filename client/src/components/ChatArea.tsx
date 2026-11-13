import React, { useRef, useEffect } from 'react';
import { Shield, Sparkles, Code2, ShieldCheck, GraduationCap } from 'lucide-react';
import { ChatMessage, FileAttachment } from '../types/chat.js';
import { MessageItem } from './MessageItem.js';
import { MessageInput } from './MessageInput.js';

interface ChatAreaProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSendMessage: (content: string, attachments: FileAttachment[]) => void;
  onStopGenerating: () => void;
  selectedPersonaName: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isStreaming,
  onSendMessage,
  onStopGenerating,
  selectedPersonaName
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const quickStarters = [
    {
      title: 'Analyze Architecture & Code',
      desc: 'Refactor TypeScript for concurrent async streaming',
      prompt: 'Can you show me how to architect a type-safe streaming pipeline in TypeScript with backpressure?',
      icon: <Code2 className="w-4 h-4 text-emerald-500" />
    },
    {
      title: 'Conduct Security Threat Model',
      desc: 'Audit modern web app authentication & token handling',
      prompt: 'Perform an AppSec threat assessment on storing JWT tokens in memory vs HTTP-only cookies.',
      icon: <ShieldCheck className="w-4 h-4 text-sentinel-500" />
    },
    {
      title: 'First-Principles Technical Breakdown',
      desc: 'Explain Raft consensus protocol simply',
      prompt: 'Explain the Raft consensus algorithm using an intuitive real-world analogy.',
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />
    },
    {
      title: 'Attach Source Code for Audit',
      desc: 'Upload files via 📎 and inspect bugs or vulnerabilities',
      prompt: 'I am attaching my code file. Can you review it for security vulnerabilities and performance bottlenecks?',
      icon: <Sparkles className="w-4 h-4 text-cyan-500" />
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-dark-base relative">
      {/* Scrollable Message History Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="min-h-full flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
            {/* Center Logo / Glow */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sentinel-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-sentinel-500/25 mb-4 animate-in zoom-in-95 duration-200">
              <Shield className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Sentinel Intelligence
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
              Adaptive multi-provider AI chat with plug-and-play keys, context-aware file Q&A, and specialized personas.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full text-xs font-medium bg-sentinel-500/10 text-sentinel-600 dark:text-sentinel-400 border border-sentinel-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Persona: {selectedPersonaName}</span>
            </div>

            {/* Quick Starters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full text-left">
              {quickStarters.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(starter.prompt, [])}
                  type="button"
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50/70 hover:bg-gray-100 dark:bg-dark-card/50 dark:hover:bg-dark-card transition-all hover:scale-[1.01] hover:border-sentinel-500/40 group shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {starter.icon}
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 group-hover:text-sentinel-500 transition-colors">
                      {starter.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                    {starter.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-dark-border/30 pb-6">
            {messages.map((msg, index) => (
              <MessageItem
                key={msg.id}
                message={msg}
                isStreaming={isStreaming && index === messages.length - 1 && msg.role === 'assistant'}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Floating Input Dock */}
      <div className="pt-2 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-dark-base dark:via-dark-base/95 dark:to-transparent">
        <MessageInput
          onSendMessage={onSendMessage}
          onStopGenerating={onStopGenerating}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
};
