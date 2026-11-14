import React from 'react';
import { Menu, BookOpen, Activity, ExternalLink } from 'lucide-react';
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
    <header className="h-[64px] border-b border-[#E4E0D8] bg-[#F7F5F0]/95 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          type="button"
          title="Toggle Navigation"
          className="p-1.5 rounded-sm text-[#141413] hover:text-[#A459FF] hover:bg-[#EFECE6] transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* ThatJoint Brand */}
        <a
          href="https://rohit30confluence.github.io/ThatJoint"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-baseline gap-1.5 group cursor-pointer"
          title="Open ThatJoint Platform"
        >
          <span className="font-display font-semibold text-2xl tracking-tight text-[#141413] uppercase">
            THΛTJOINT<span className="text-[#A459FF]">.</span>
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#7A7A7A] group-hover:text-[#A459FF] transition-colors">
            / SENTINEL AI
          </span>
        </a>

        {/* Section Index Navigation Markers */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-mono text-[#5C5A55]">
          <span className="flex items-center gap-1.5 text-[#141413] font-semibold border-b border-[#141413] pb-0.5">
            <span className="text-[#A459FF]">01</span>
            <span>Chat Terminal</span>
          </span>
          <button
            onClick={onOpenKnowledge}
            type="button"
            className="flex items-center gap-1.5 hover:text-[#141413] transition-colors"
          >
            <span className="text-[#7A7A7A]">02</span>
            <span>Knowledge Scope</span>
          </button>
          <button
            onClick={onOpenKnowledge}
            type="button"
            className="flex items-center gap-1.5 hover:text-[#141413] transition-colors"
          >
            <span className="text-[#7A7A7A]">03</span>
            <span>Operations</span>
          </button>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3F2EE] text-[#2D8A78] border border-[#2D8A78]/30 text-xs font-mono font-medium">
          <span className="w-2 h-2 rounded-full bg-[#2D8A78] animate-pulse" />
          <span>● Live</span>
        </div>

        {/* Knowledge Scope Button */}
        <button
          onClick={onOpenKnowledge}
          type="button"
          title="Inspect Grounded Service-Provider Knowledge"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono font-medium bg-[#FFFFFF] hover:bg-[#EFECE6] border border-[#E4E0D8] text-[#141413] transition-colors shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#A459FF]" />
          <span className="hidden sm:inline">02 / KNOWLEDGE</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-[#EFECE6] text-[#5C5A55] font-mono">
            {knowledgeStatus?.totalFiles ? `${knowledgeStatus.totalFiles} Docs` : 'Grounded'}
          </span>
        </button>

        {/* Telemetry Counter if active */}
        {(tokensProcessed > 0 || lastDurationMs > 0) && (
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-[#5C5A55] px-2.5 py-1 rounded-sm bg-[#FFFFFF] border border-[#E4E0D8]">
            <Activity className="w-3.5 h-3.5 text-[#A459FF]" />
            <span>{tokensProcessed} tokens</span>
            {lastDurationMs > 0 && <span>{(lastDurationMs / 1000).toFixed(1)}s</span>}
          </div>
        )}

        {/* Directional Link to ThatJoint */}
        <a
          href="https://rohit30confluence.github.io/ThatJoint"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-medium font-sans bg-[#141413] hover:bg-[#2B2B2B] text-white transition-colors shadow-sm"
        >
          <span>ThatJoint</span>
          <span className="text-[#A459FF] font-bold" aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
};
