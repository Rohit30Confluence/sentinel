import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types/chat.js';
import { MessageItem } from './MessageItem.js';
import { MessageInput } from './MessageInput.js';

interface ChatAreaProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
  onStopGenerating: () => void;
  onOpenKnowledge: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isStreaming,
  onSendMessage,
  onStopGenerating,
  onOpenKnowledge
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const promptCards = [
    {
      number: '01',
      category: 'PLATFORM MODULES',
      title: 'Single-Family vs Communities',
      copy: 'Explore address-attached continuous ledgers compared against room & bed-level inventory allocations.',
      query: 'Explain the difference between Single-family and Communities management in ThatJoint.'
    },
    {
      number: '02',
      category: 'OPERATIONS RHYTHM',
      title: 'The 5-Step Protected Rhythm',
      copy: 'Trace property signals from first Intake Capture through to tamper-evident audit Record Proof.',
      query: "Walk through ThatJoint's 5-step operations rhythm from Capture to Prove."
    },
    {
      number: '03',
      category: 'STATUTORY COMPLIANCE',
      title: 'Foreign Form C & DPDP 2023',
      copy: 'Review mandatory 24h FRRO portal submission, passport tracking, and digital data minimization standards.',
      query: 'How does ThatJoint handle Foreign National Form C and DPDP Act 2023 compliance?'
    },
    {
      number: '04',
      category: 'PRICING & RAILS',
      title: 'GCC Currency Tiers & Payment Rails',
      copy: 'Review monthly and annual AED/INR/USD pricing and multi-gateway rails (e-NACH, UPI AutoPay, PayU VAN).',
      query: 'What are the pricing tiers in AED and supported payment rails like e-NACH and UPI AutoPay?'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F7F5F0] relative">
      {/* Scrollable Message History */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="min-h-full flex flex-col justify-center p-6 sm:p-12 max-w-4xl mx-auto">
            {/* Editorial Header matching ThatJoint */}
            <div className="border-b border-[#E4E0D8] pb-8 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs font-semibold text-[#A459FF] uppercase tracking-wider">
                  01 / INTELLIGENCE TERMINAL
                </span>
                <span className="text-xs text-[#7A7A7A]">•</span>
                <span className="font-mono text-xs uppercase tracking-wider text-[#5C5A55]">
                  STRICTLY GROUNDED KNOWLEDGE
                </span>
              </div>

              <h1 className="font-display font-medium text-5xl sm:text-7xl uppercase tracking-tight text-[#141413] leading-[0.88]">
                Rental operations,<br />
                <em className="font-serif italic font-normal text-[#A459FF]">connected.</em>
              </h1>

              <p className="font-sans text-sm sm:text-base text-[#5C5A55] mt-4 max-w-2xl leading-relaxed">
                One calm operating system from first signal to finished work. Inquire across rental platform modules, 5-step operational rhythms, tenant KYC & compliance mandates, and portfolio financial ledgers.
              </p>
            </div>

            {/* 4 Numbered Feature Cards styled identically to ThatJoint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {promptCards.map((card, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(card.query)}
                  type="button"
                  className="p-5 rounded-sm border border-[#E4E0D8] bg-[#FFFFFF] hover:bg-[#EFECE6] hover:border-[#A459FF] transition-all text-left group shadow-xs flex flex-col justify-between min-h-[145px]"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[11px] text-[#7A7A7A] uppercase tracking-wider mb-2">
                      <span>{card.number} / {card.category}</span>
                      <span
                        className="text-[#A459FF] font-bold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-xl text-[#141413] group-hover:text-[#A459FF] transition-colors uppercase tracking-tight">
                      {card.title}
                    </h3>

                    <p className="font-sans text-xs text-[#5C5A55] mt-1.5 leading-relaxed">
                      {card.copy}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#E4E0D8]/60 pb-8">
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

      {/* Floating Bottom Input Dock */}
      <div className="pt-2 bg-gradient-to-t from-[#F7F5F0] via-[#F7F5F0]/95 to-transparent">
        <MessageInput
          onSendMessage={onSendMessage}
          onStopGenerating={onStopGenerating}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
};
