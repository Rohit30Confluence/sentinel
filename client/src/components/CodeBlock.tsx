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
    <div className="relative my-3 rounded-lg overflow-hidden border border-gray-300 dark:border-dark-border bg-gray-900 shadow-sm text-gray-100">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-gray-800/90 border-b border-gray-700/60 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-gray-300">
          <Terminal className="w-3.5 h-3.5 text-sentinel-400" />
          <span className="uppercase font-semibold tracking-wider text-[11px] text-gray-300">
            {cleanLang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-gray-300 hover:text-white bg-gray-700/60 hover:bg-gray-700 transition-colors"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[11px] font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed bg-[#0d1117]">
        <code>{value}</code>
      </div>
    </div>
  );
};
