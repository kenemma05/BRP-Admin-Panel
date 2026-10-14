import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface ThemeToggleSwitchProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ThemeToggleSwitch: React.FC<ThemeToggleSwitchProps> = ({
  className = '',
  showLabel = false,
  size = 'md',
}) => {
  const { isDarkMode, toggleDarkMode } = useAdmin();

  const isSmall = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
          {isDarkMode ? 'Dark' : 'Light'}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={isDarkMode}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        onClick={toggleDarkMode}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
          isSmall ? 'h-6 w-11' : 'h-7 w-13'
        } ${
          isDarkMode
            ? 'bg-slate-700 border border-slate-600/80 shadow-inner'
            : 'bg-slate-200 border border-slate-300/80'
        }`}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span className="sr-only">Toggle Dark Mode</span>
        
        {/* Track Icons for visual feedback */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none"
        >
          <Sun
            className={`${
              isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'
            } text-amber-500 transition-opacity duration-150 ${
              isDarkMode ? 'opacity-30' : 'opacity-100'
            }`}
          />
          <Moon
            className={`${
              isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'
            } text-indigo-300 transition-opacity duration-150 ${
              isDarkMode ? 'opacity-100' : 'opacity-30'
            }`}
          />
        </span>

        {/* Sliding Thumb */}
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-flex items-center justify-center transform rounded-full bg-white dark:bg-slate-900 shadow-md ring-0 transition duration-200 ease-in-out ${
            isSmall
              ? `h-5 w-5 ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'}`
              : `h-5.5 w-5.5 ${isDarkMode ? 'translate-x-6.5' : 'translate-x-0.5'}`
          } my-auto`}
        >
          {isDarkMode ? (
            <Moon className={`${isSmall ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-indigo-400`} />
          ) : (
            <Sun className={`${isSmall ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-amber-500`} />
          )}
        </span>
      </button>
    </div>
  );
};
