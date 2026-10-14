import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Clock } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { DateRangePreset, DateRangeState } from '../../types';

interface DateRangePickerProps {
  className?: string;
  variant?: 'light' | 'dark' | 'transparent';
  compact?: boolean;
}

const PRESET_OPTIONS: { id: DateRangePreset; label: string; periodText: string }[] = [
  { id: 'today', label: 'Today', periodText: 'Oct 14, 2026' },
  { id: '7d', label: 'Last 7 Days', periodText: 'Oct 7 – Oct 14, 2026' },
  { id: '30d', label: 'Last 30 Days', periodText: 'Sep 14 – Oct 14, 2026' },
  { id: 'quarter', label: 'This Quarter (Q3/Q4)', periodText: 'Jul 1 – Oct 14, 2026' },
  { id: 'ytd', label: 'Year to Date (YTD)', periodText: 'Jan 1 – Oct 14, 2026' },
  { id: 'all', label: 'All Time', periodText: 'Jan 2025 – Present' },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  className = '',
  variant = 'light',
  compact = false,
}) => {
  const { dateRange, setDateRange, setDateRangePreset } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(dateRange.preset === 'custom');
  const [customStart, setCustomStart] = useState(dateRange.startDate || '2026-09-01');
  const [customEnd, setCustomEnd] = useState(dateRange.endDate || '2026-10-14');

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPreset = (preset: DateRangePreset) => {
    setIsCustomMode(false);
    setDateRangePreset(preset);
    setIsOpen(false);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart || !customEnd) return;
    const newRange: DateRangeState = {
      preset: 'custom',
      startDate: customStart,
      endDate: customEnd,
      label: `${customStart} – ${customEnd}`,
    };
    setDateRange(newRange);
    setIsOpen(false);
  };

  // Styling variants
  const getButtonClasses = () => {
    if (variant === 'dark') {
      return 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border-slate-700';
    }
    if (variant === 'transparent') {
      return 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700';
    }
    // Default light / adaptable
    return 'bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`inline-flex items-center justify-between gap-2 border rounded-xl font-medium transition cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs sm:text-sm'
        } ${getButtonClasses()}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Select Timeframe Filter"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white">
            {dateRange.label}
          </span>
          {!compact && (
            <span className="hidden sm:inline text-[11px] text-slate-400 dark:text-slate-500 font-normal">
              ({dateRange.startDate} – {dateRange.endDate})
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-emerald-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-3 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              Filter Displayed Timeframe
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              Live Filter
            </span>
          </div>

          {/* Presets List */}
          <div className="p-2 space-y-1">
            {PRESET_OPTIONS.map((opt) => {
              const isActive = dateRange.preset === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectPreset(opt.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                      {opt.periodText}
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Custom Date Range Toggle & Form */}
          <div className="p-3 bg-slate-50/50 dark:bg-slate-850/50">
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer mb-2"
            >
              <span>{isCustomMode ? 'Hide Custom Range' : '+ Custom Date Range'}</span>
            </button>

            {isCustomMode && (
              <form onSubmit={handleApplyCustom} className="space-y-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer shadow-2xs"
                >
                  Apply Custom Range
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
