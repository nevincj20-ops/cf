import React from 'react';
import { Target, HelpCircle, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { BreakEvenResult } from '../../engine/types';
import { GlassCard } from '../effects/GlassCard';
import { AnimatedNumber } from '../effects/AnimatedNumber';
import { MagneticButton } from '../effects/MagneticButton';

interface BreakEvenPanelProps {
  breakEvenResult: BreakEvenResult;
  onOpenAlgebraicWorking: () => void;
}

export const BreakEvenPanel: React.FC<BreakEvenPanelProps> = ({
  breakEvenResult,
  onOpenAlgebraicWorking,
}) => {
  const { status, breakEvenEBIT, planA_EPS, planB_EPS, difference, message } = breakEvenResult;

  return (
    <GlassCard
      variant="default"
      className="p-6 text-center space-y-6 flex flex-col justify-between h-full border-t-4 border-t-emerald-500 shadow-lg relative overflow-hidden"
    >
      {/* Background ambient badge */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide uppercase">
          <Target className="w-3.5 h-3.5" />
          <span>Indifference Analysis</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          BREAK-EVEN EBIT
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          The operating earnings level where both financing alternatives produce the identical EPS.
        </p>
      </div>

      {/* Main Big Number or Status Callout */}
      <div className="py-4 px-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
        {status === 'valid' ? (
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Equilibrium Operating Profit
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight text-emerald-600 dark:text-emerald-400">
              <AnimatedNumber value={breakEvenEBIT} decimals={2} isCurrency={true} />
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block pt-1">
              At this EBIT, capital structure choice does not alter EPS
            </span>
          </div>
        ) : status === 'negative_ebit' ? (
          <div className="space-y-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-8 h-8 mx-auto" />
            <div className="text-2xl font-bold">
              <AnimatedNumber value={breakEvenEBIT} decimals={2} isCurrency={true} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Indifference occurs at an operating loss under the given debt loads.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-2 text-slate-600 dark:text-slate-400">
            <HelpCircle className="w-8 h-8 mx-auto text-amber-500" />
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {status === 'parallel_lines' ? 'Parallel EPS Slopes' : 'Indifference Undefined'}
            </div>
            <p className="text-xs max-w-xs mx-auto leading-relaxed">{message}</p>
          </div>
        )}
      </div>

      {/* EPS at Break-even breakdown */}
      {status === 'valid' && (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            EPS at Break-even EBIT
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              <span className="text-[10px] font-medium text-indigo-700 dark:text-indigo-300 block">
                Plan A EPS
              </span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
                <AnimatedNumber value={planA_EPS} decimals={2} isCurrency={true} />
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 block">
                Plan B EPS
              </span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
                <AnimatedNumber value={planB_EPS} decimals={2} isCurrency={true} />
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-mono">
            <span>Difference:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ₹{difference.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Button to view exact step-by-step algebra */}
      <div className="pt-2">
        <MagneticButton
          variant="outline"
          size="sm"
          onClick={onOpenAlgebraicWorking}
          className="w-full text-xs"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Break-even EBIT Working</span>
          <ArrowRight className="w-3 h-3 ml-auto opacity-70" />
        </MagneticButton>
      </div>
    </GlassCard>
  );
};
