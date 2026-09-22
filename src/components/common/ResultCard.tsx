import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Share2 } from 'lucide-react';
import { MetricCardData } from '../../types/tvm';
import { copyToClipboard } from '../../utils/export';

interface ResultCardProps {
  title: string;
  primaryValue: string;
  primaryLabel: string;
  secondaryMetrics?: MetricCardData[];
  onReset?: () => void;
  copySummaryText?: string;
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  primaryValue,
  primaryLabel,
  secondaryMetrics = [],
  onReset,
  copySummaryText,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = copySummaryText || `${primaryLabel}: ${primaryValue}`;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      if (onShowToast) onShowToast('Calculation copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {onReset && (
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset inputs to defaults"
              aria-label="Reset inputs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors border border-slate-700/60"
            title="Copy summary to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Primary Metric */}
      <div className="mb-6">
        <p className="text-xs font-medium text-slate-400 mb-1">{primaryLabel}</p>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-400 break-words">
          {primaryValue}
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      {secondaryMetrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          {secondaryMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60"
            >
              <p className="text-[11px] font-medium text-slate-400 line-clamp-1">
                {metric.label}
              </p>
              <p
                className={`text-sm sm:text-base font-bold mt-0.5 truncate ${
                  metric.type === 'positive'
                    ? 'text-emerald-400'
                    : metric.type === 'warning'
                    ? 'text-amber-400'
                    : metric.type === 'accent'
                    ? 'text-indigo-400'
                    : 'text-slate-100'
                }`}
              >
                {metric.value}
              </p>
              {metric.subtext && (
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                  {metric.subtext}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
