import React from 'react';
import {
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Info,
} from 'lucide-react';
import { ScenarioResult } from '../../engine/types';
import { GlassCard } from '../effects/GlassCard';
import { AnimatedNumber } from '../effects/AnimatedNumber';
import { formatCurrencyINR } from '../../engine/calculations';

interface ScenarioTesterProps {
  expectedEbit: number;
  onEbitChange: (val: number) => void;
  scenarioResult: ScenarioResult;
  breakEvenEbit: number | null;
}

export const ScenarioTester: React.FC<ScenarioTesterProps> = ({
  expectedEbit,
  onEbitChange,
  scenarioResult,
  breakEvenEbit,
}) => {
  const { planA_EPS, planB_EPS, difference, percentageDiff, relativePosition, interpretation } =
    scenarioResult;

  const badgeStyles = {
    'BELOW BREAK-EVEN':
      'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    'AT BREAK-EVEN':
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    'ABOVE BREAK-EVEN':
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    INCOMPARABLE:
      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  };

  const badgeIcons = {
    'BELOW BREAK-EVEN': <ArrowDownRight className="w-3.5 h-3.5" />,
    'AT BREAK-EVEN': <Minus className="w-3.5 h-3.5" />,
    'ABOVE BREAK-EVEN': <ArrowUpRight className="w-3.5 h-3.5" />,
    INCOMPARABLE: <Info className="w-3.5 h-3.5" />,
  };

  return (
    <GlassCard className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">
              EPS ANALYSIS & SCENARIO TESTING
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test custom operating profit scenarios to observe shareholder earnings sensitivity.
          </p>
        </div>

        {/* Position Relative to Break-even Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold self-start sm:self-auto ${badgeStyles[relativePosition]}`}
        >
          {badgeIcons[relativePosition]}
          <span>{relativePosition}</span>
        </div>
      </div>

      {/* Input Slider and Number Input */}
      <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            EXPECTED OPERATING EARNINGS (EBIT)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Quick set:</span>
            {breakEvenEbit && breakEvenEbit > 0 && (
              <button
                type="button"
                onClick={() => onEbitChange(breakEvenEbit)}
                className="px-2 py-0.5 text-[10px] rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium hover:bg-emerald-200 cursor-pointer"
              >
                Exact Break-Even ({formatCurrencyINR(breakEvenEbit, 0)})
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max={Math.max((breakEvenEbit || 300000) * 2.5, 1000000)}
            step="10000"
            value={expectedEbit}
            onChange={(e) => onEbitChange(parseFloat(e.target.value) || 0)}
            className="flex-1 accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="w-36">
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={expectedEbit === 0 ? '' : expectedEbit}
                onChange={(e) => onEbitChange(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-6 pr-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Primary EPS Outcome Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Plan A EPS */}
        <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-800 dark:text-indigo-300">
            <span>PLAN A EPS</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            <AnimatedNumber value={planA_EPS} decimals={2} isCurrency={true} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            At EBIT {formatCurrencyINR(expectedEbit, 0)}
          </p>
        </div>

        {/* Plan B EPS */}
        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span>PLAN B EPS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            <AnimatedNumber value={planB_EPS} decimals={2} isCurrency={true} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            At EBIT {formatCurrencyINR(expectedEbit, 0)}
          </p>
        </div>

        {/* EPS Difference */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>EPS DIFFERENCE</span>
            {percentageDiff !== null && (
              <span className="text-[10px] font-mono text-slate-500">
                Δ {percentageDiff.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            <AnimatedNumber value={difference} decimals={2} isCurrency={true} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Absolute variance in per-share returns
          </p>
        </div>
      </div>

      {/* Academic Neutral Interpretation (Section 12 & 20) */}
      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border-l-4 border-l-emerald-500 border border-slate-200/60 dark:border-slate-800 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Academic Financial Interpretation</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          {interpretation}
        </p>
      </div>
    </GlassCard>
  );
};
