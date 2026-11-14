import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.js';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme"
      className="p-2 rounded-sm text-[#5C5A55] hover:text-[#141413] dark:text-[#9E9B95] dark:hover:text-white bg-white hover:bg-black/5 dark:bg-[#1E1E1D] dark:hover:bg-white/5 transition-colors border border-[#E4E0D8] dark:border-white/10 shadow-sm"
    >
      {theme === 'dark' ? (
        <Sun className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#A459FF]" />
      )}
    </button>
  );
};
