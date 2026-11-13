import React from 'react';
import { Shield, Settings, Menu, Activity, Zap } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.js';
import { PersonaSelector } from './PersonaSelector.js';
import { Persona, ModelOption } from '../types/chat.js';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  personas: Persona[];
  selectedPersona: string;
  onSelectPersona: (id: string) => void;
  selectedModel: string;
  models: ModelOption[];
  tokensProcessed: number;
  lastDurationMs: number;
  isStreaming: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenSettings,
  personas,
  selectedPersona,
  onSelectPersona,
  selectedModel,
  models,
  tokensProcessed,
  lastDurationMs,
  isStreaming
}) => {
  const currentModel = models.find((m) => m.id === selectedModel) || {
    name: selectedModel,
    provider: 'mock'
  };

  return (
    <header className="h-14 border-b border-gray-200 dark:border-dark-border bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          type="button"
          title="Toggle Navigation Sidebar"
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sentinel-600 to-cyan-400 flex items-center justify-center text-white shadow-sm shadow-sentinel-500/20">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-gray-900 dark:text-white">
                SENTINEL
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold bg-sentinel-500/10 text-sentinel-600 dark:text-sentinel-400 border border-sentinel-500/20">
                AI CORE
              </span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-5 w-px bg-gray-200 dark:bg-dark-border hidden sm:block" />

        {/* Persona Selector */}
        <div className="hidden sm:block">
          <PersonaSelector
            personas={personas}
            selectedId={selectedPersona}
            onSelect={onSelectPersona}
            onOpenCustomModal={onOpenSettings}
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Model status indicator */}
        <button
          onClick={onOpenSettings}
          title="Click to change model or configure API keys"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 transition-colors"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isStreaming
                ? 'bg-amber-400 animate-pulse'
                : currentModel.provider === 'mock'
                ? 'bg-cyan-400'
                : 'bg-emerald-400'
            }`}
          />
          <span className="font-medium truncate max-w-[120px]">{currentModel.name}</span>
        </button>

        {/* Token and Duration telemetry */}
        {(tokensProcessed > 0 || lastDurationMs > 0) && (
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-dark-border">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-sentinel-500" />
              {tokensProcessed} tokens
            </span>
            {lastDurationMs > 0 && (
              <span className="flex items-center gap-1 text-gray-400">
                <Zap className="w-3 h-3 text-amber-500" />
                {(lastDurationMs / 1000).toFixed(1)}s
              </span>
            )}
          </div>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          type="button"
          title="Settings & API Keys"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-dark-card dark:hover:bg-dark-hover transition-colors border border-gray-200 dark:border-dark-border"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
