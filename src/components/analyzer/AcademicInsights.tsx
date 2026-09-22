import React, { useState } from 'react';
import {
  HelpCircle,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { GlassCard } from '../effects/GlassCard';

export const AcademicInsights: React.FC = () => {
  const [assumptionsOpen, setAssumptionsOpen] = useState(true);

  return (
    <div className="space-y-6">
      {/* 2-Column Grid for Financial Significance & Why Debt Changes EPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 21: Financial Significance */}
        <GlassCard className="p-6 space-y-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              FINANCIAL SIGNIFICANCE
            </h3>
          </div>

          <ol className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside leading-relaxed">
            <li>
              <strong className="text-slate-800 dark:text-slate-200">Operating vs. Equity Returns:</strong> EBIT–EPS analysis helps examine the relationship between operating earnings and earnings per share under alternative financing structures.
            </li>
            <li>
              <strong className="text-slate-800 dark:text-slate-200">The Indifference Threshold:</strong> Break-even EBIT identifies the operating earnings level at which two financing alternatives generate equal EPS.
            </li>
            <li>
              <strong className="text-slate-800 dark:text-slate-200">Fixed Cost Inflexibility:</strong> Financing structures involving debt introduce fixed interest obligations that must be serviced irrespective of earnings.
            </li>
            <li>
              <strong className="text-slate-800 dark:text-slate-200">Differential Volatility:</strong> Changes in EBIT produce magnified EPS fluctuations under debt structures compared to all-equity plans.
            </li>
            <li>
              <strong className="text-slate-800 dark:text-slate-200">Capital Decision Benchmark:</strong> The break-even point provides a reference benchmark for comparing the EPS consequences of alternative financing plans.
            </li>
            <li>
              <strong className="text-slate-800 dark:text-slate-200">Parameter Sensitivity:</strong> The analysis strictly depends on assumptions including interest, taxation, preference dividends and equity share counts.
            </li>
          </ol>
        </GlassCard>

        {/* Section 22: Financial Leverage Explanation */}
        <GlassCard className="p-6 space-y-4 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              WHY DOES DEBT CHANGE EPS?
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="bg-indigo-50/50 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40 font-medium text-indigo-950 dark:text-indigo-200">
              Debt financing creates a <span className="underline decoration-indigo-400 underline-offset-2">fixed contractual interest obligation</span>. When EBIT changes, interest remains constant according to the financing terms.
            </p>

            <p>
              Because interest is deductible before taxes, debt shields a portion of operating profits from taxation (the <em>interest tax shield</em>). However, when EBIT is low, fixed interest still consumes a disproportionate share of earnings, causing EPS to fall sharply.
            </p>

            <p>
              Conversely, when EBIT rises comfortably above the break-even EBIT point, every additional rupee of operating income flows directly to a smaller base of equity shares, creating <strong>favorable financial leverage (trading on equity)</strong>.
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Section 19: Assumptions & Conditions Collapsible */}
      <GlassCard className="p-5">
        <button
          type="button"
          onClick={() => setAssumptionsOpen(!assumptionsOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              ASSUMPTIONS & CONDITIONS (Corporate Finance Model)
            </span>
          </div>
          {assumptionsOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {assumptionsOpen && (
          <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <span>Interest is treated as a contractual financing cost deductible before tax.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <span>Tax rate is applied according to the entered corporate tax percentage assumption.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <span>Preference dividend is deducted after tax before determining earnings attributable to equity shareholders.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <span>Equity share count is based on the selected financing plan (existing + newly issued shares).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <span>Break-even EBIT is determined dynamically by solving EPS(Plan A) = EPS(Plan B).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <span>Results depend entirely on the assumptions and input parameters provided.</span>
            </div>
            <div className="flex items-start gap-2 sm:col-span-2 text-slate-500 italic">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
              <span>Academic Notice: This application is an educational financial-modeling tool for B.Com coursework and does not constitute investment advice.</span>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
