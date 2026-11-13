import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Code2, ShieldCheck, GraduationCap, Feather, Settings2, ChevronDown } from 'lucide-react';
import { Persona } from '../types/chat.js';

interface PersonaSelectorProps {
  personas: Persona[];
  selectedId: string;
  onSelect: (id: string) => void;
  onOpenCustomModal?: () => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  personas,
  selectedId,
  onSelect,
  onOpenCustomModal
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activePersona = personas.find((p) => p.id === selectedId) || personas[0];

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-sentinel-500" />;
      case 'Code2':
        return <Code2 className="w-4 h-4 text-emerald-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-amber-500" />;
      case 'Feather':
        return <Feather className="w-4 h-4 text-rose-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-sentinel-500" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-dark-card dark:hover:bg-dark-hover border border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-200 transition-colors shadow-sm"
      >
        <span className="flex items-center gap-1.5">
          {getIcon(activePersona?.icon)}
          <span className="font-semibold">{activePersona?.name || 'Select Persona'}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1.5 w-72 origin-top-left rounded-xl bg-white dark:bg-dark-card shadow-xl ring-1 ring-black/5 dark:ring-white/10 border border-gray-200 dark:border-dark-border divide-y divide-gray-100 dark:divide-dark-border z-50">
          <div className="p-1.5 space-y-0.5">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Specialized Personas
            </div>
            {personas.map((persona) => {
              const isSelected = persona.id === selectedId;
              return (
                <button
                  key={persona.id}
                  onClick={() => {
                    onSelect(persona.id);
                    setOpen(false);
                  }}
                  type="button"
                  className={`w-full flex items-start gap-2.5 px-2.5 py-2 text-left rounded-lg transition-colors text-xs ${
                    isSelected
                      ? 'bg-sentinel-500/10 text-sentinel-700 dark:text-sentinel-300 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(persona.icon)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">{persona.name}</span>
                      {persona.tag && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-200/70 dark:bg-dark-border text-gray-600 dark:text-gray-400">
                          {persona.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 font-normal">
                      {persona.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {onOpenCustomModal && (
            <div className="p-1.5">
              <button
                onClick={() => {
                  setOpen(false);
                  onOpenCustomModal();
                }}
                type="button"
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-sentinel-600 dark:hover:text-sentinel-400 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Configure Custom System Prompt...</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
