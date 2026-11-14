import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code snippet:', e);
    }
  };

  const cleanLang = (language || 'text').replace('language-', '').toLowerCase();

  return (
    <div className="relative my-3 rounded-sm overflow-hidden border border-[#E4E0D8] dark:border-white/10 bg-[#141413] shadow-sm text-gray-100 font-mono">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1E1E1D] border-b border-white/10 text-xs">
        <div className="flex items-center gap-1.5 text-gray-300">
          <Terminal className="w-3 h-3 text-[#A459FF]" />
          <span className="uppercase font-semibold tracking-wider text-[10px] text-gray-300">
            {cleanLang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px] font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-3.5 overflow-x-auto text-xs leading-relaxed bg-[#141413]">
        <code>{value}</code>
      </div>
    </div>
  );
};
