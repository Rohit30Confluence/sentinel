import React from 'react';
import { Menu, BookOpen, ExternalLink, Activity } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.js';
import { KnowledgeStatus } from '../types/chat.js';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenKnowledge: () => void;
  knowledgeStatus: KnowledgeStatus | null;
  tokensProcessed: number;
  lastDurationMs: number;
  isStreaming: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenKnowledge,
  knowledgeStatus,
  tokensProcessed,
  lastDurationMs,
  isStreaming
}) => {
  return (
    <header className="h-[62px] border-b border-[#E4E0D8] dark:border-white/10 bg-[#F7F5F0]/90 dark:bg-[#141413]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 transition-colors">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          type="button"
          title="Toggle Navigation Sidebar"
          className="p-1.5 rounded-sm text-[#141413] hover:text-[#A459FF] dark:text-[#F7F5F0] dark:hover:text-[#A459FF] hover:bg-black/5 dark:hover:bg-white/5 transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* ThatJoint Brand */}
        <div className="flex items-center gap-2">
          <a
            href="https://rohit30confluence.github.io/ThatJoint"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-baseline gap-1.5 group cursor-pointer"
            title="Open ThatJoint Platform"
          >
            <span className="font-display font-semibold text-xl tracking-tight text-[#141413] dark:text-white uppercase">
              THΛTJOINT<span className="text-[#A459FF]">.</span>
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#7A7A7A] dark:text-[#9E9B95] group-hover:text-[#A459FF] transition-colors">
              / SENTINEL AI
            </span>
          </a>
        </div>

        {/* Live Status Pulse */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>● Live</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Knowledge Base Inspector button */}
        <button
          onClick={onOpenKnowledge}
          type="button"
          title="View Service-Provider Grounded Knowledge"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono font-medium bg-white dark:bg-[#1E1E1D] hover:bg-black/5 dark:hover:bg-white/5 border border-[#E4E0D8] dark:border-white/10 text-[#141413] dark:text-[#F7F5F0] transition-colors shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#A459FF]" />
          <span className="hidden md:inline">02 / KNOWLEDGE</span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 font-mono text-[#5C5A55] dark:text-[#9E9B95]">
            {knowledgeStatus?.totalFiles ? `${knowledgeStatus.totalFiles} Docs` : 'Grounded'}
          </span>
        </button>

        {/* Live Telemetry */}
        {(tokensProcessed > 0 || lastDurationMs > 0) && (
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-[#7A7A7A] dark:text-[#9E9B95] px-2 py-1 rounded-sm bg-white/60 dark:bg-[#1E1E1D]/60 border border-[#E4E0D8] dark:border-white/10">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#A459FF]" />
              {tokensProcessed} tokens
            </span>
            {lastDurationMs > 0 && <span>{(lastDurationMs / 1000).toFixed(1)}s</span>}
          </div>
        )}

        {/* ThatJoint Platform link with arrow */}
        <a
          href="https://rohit30confluence.github.io/ThatJoint"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-medium bg-[#141413] hover:bg-[#2B2B2B] text-white dark:bg-white dark:text-[#141413] dark:hover:bg-gray-100 transition-colors shadow-sm"
        >
          <span>ThatJoint</span>
          <span aria-hidden="true">↗</span>
        </a>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};
