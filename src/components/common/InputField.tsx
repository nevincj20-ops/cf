import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface InputFieldProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  tooltip?: string;
  error?: string | null;
  helperText?: string;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step = 1,
  placeholder,
  tooltip,
  error,
  helperText,
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(0);
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label and Tooltip Header */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
        >
          <span>{label}</span>
          {tooltip && (
            <div className="relative inline-block">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded focus:outline-none"
                aria-label={`Info about ${label}`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {showTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700">
                  {tooltip}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-900" />
                </div>
              )}
            </div>
          )}
        </label>
        {helperText && !error && (
          <span className="text-[11px] text-slate-400">{helperText}</span>
        )}
      </div>

      {/* Input element container */}
      <div
        className={`relative flex items-center rounded-xl bg-slate-50 dark:bg-slate-800/80 border transition-all ${
          error
            ? 'border-red-400 dark:border-red-500/70 focus-within:ring-2 focus-within:ring-red-400'
            : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {prefix && (
          <span className="pl-3.5 text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500 select-none">
            {prefix}
          </span>
        )}

        <input
          id={id}
          type="number"
          value={value === 0 && placeholder ? '' : value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full py-2.5 px-3 bg-transparent text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
            prefix ? 'pl-2' : 'pl-3.5'
          } ${suffix ? 'pr-2' : 'pr-3.5'}`}
        />

        {suffix && (
          <span className="pr-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none bg-slate-100 dark:bg-slate-700/50 py-1 px-2 rounded-md mr-2">
            {suffix}
          </span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <span className="text-[11px] font-medium text-red-500 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
};
