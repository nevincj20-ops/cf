import React, { useState } from 'react';
import {
  X,
  Calculator,
  Equal,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  FileText,
  Percent,
} from 'lucide-react';
import { useEbit } from '../../context/EbitContext';
import { formatCurrencyINR } from '../../engine/calculations';

interface WorkingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'statement' | 'algebraic' | 'formula';
}

export const WorkingsModal: React.FC<WorkingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'statement',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'statement' | 'algebraic' | 'formula'>(
    initialTab
  );
  const { planA, planB, expectedEbit, planA_Working, planB_Working, breakEvenResult } = useEbit();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header & Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Comprehensive Financial Workings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Standard B.Com Classroom & Examination Format
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('statement')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'statement'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Income Statement Workings</span>
          </button>

          <button
            onClick={() => setActiveSubTab('algebraic')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'algebraic'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Equal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Break-Even Algebraic Steps</span>
          </button>

          <button
            onClick={() => setActiveSubTab('formula')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'formula'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Formula & Glossary</span>
          </button>
        </div>

        {/* TAB 1: Income Statement Working (Section 16) */}
        {activeSubTab === 'statement' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span>Operating Profit Benchmark:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                EBIT = {formatCurrencyINR(expectedEbit, 0)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan A Table */}
              <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/10 overflow-hidden">
                <div className="bg-indigo-100/70 dark:bg-indigo-950/60 px-4 py-2.5 border-b border-indigo-200/80 dark:border-indigo-900/50 flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-900 dark:text-indigo-300">
                    PLAN A ({planA.financingType})
                  </span>
                  <span className="text-[11px] font-mono text-indigo-700 dark:text-indigo-400">
                    Shares: {planA_Working.totalShares.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="divide-y divide-slate-200/60 dark:divide-slate-800 text-xs font-mono">
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Earnings Before Interest & Tax (EBIT)</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrencyINR(planA_Working.ebit)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between text-rose-600 dark:text-rose-400">
                    <span>Less: Interest Expense</span>
                    <span>- {formatCurrencyINR(planA_Working.interest)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between bg-slate-50/50 dark:bg-slate-800/30 font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Earnings Before Tax (EBT)</span>
                    <span className="text-slate-900 dark:text-slate-100">{formatCurrencyINR(planA_Working.ebt)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between text-rose-600 dark:text-rose-400">
                    <span>Less: Tax @ {planA_Working.taxRate}%</span>
                    <span>- {formatCurrencyINR(planA_Working.taxAmount)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between bg-slate-50/50 dark:bg-slate-800/30 font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Profit After Tax (PAT)</span>
                    <span className="text-slate-900 dark:text-slate-100">{formatCurrencyINR(planA_Working.pat)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between text-rose-600 dark:text-rose-400">
                    <span>Less: Preference Dividend</span>
                    <span>- {formatCurrencyINR(planA_Working.preferenceDividend)}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between bg-indigo-50/60 dark:bg-indigo-950/40 font-bold text-slate-900 dark:text-slate-100">
                    <span>Profit Available to Equity</span>
                    <span>{formatCurrencyINR(planA_Working.equityEarnings)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Divided by: Equity Shares</span>
                    <span>{planA_Working.totalShares.toLocaleString('en-IN')} shares</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between bg-indigo-600 text-white font-bold text-sm rounded-b-lg">
                    <span>Earnings Per Share (EPS)</span>
                    <span>{formatCurrencyINR(planA_Working.eps)}</span>
                  </div>
                </div>
              </div>

              {/* Plan B Table */}
              <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10 overflow-hidden">
                <div className="bg-emerald-100/70 dark:bg-emerald-950/60 px-4 py-2.5 border-b border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300">
                    PLAN B ({planB.financingType})
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                    Shares: {planB_Working.totalShares.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="divide-y divide-slate-200/60 dark:divide-slate-800 text-xs font-mono">
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Earnings Before Interest & Tax (EBIT)</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrencyINR(planB_Working.ebit)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between text-rose-600 dark:text-rose-400">
                    <span>Less: Interest Expense</span>
                    <span>- {formatCurrencyINR(planB_Working.interest)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between bg-slate-50/50 dark:bg-slate-800/30 font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Earnings Before Tax (EBT)</span>
                    <span className="text-slate-900 dark:text-slate-100">{formatCurrencyINR(planB_Working.ebt)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between text-rose-600 dark:text-rose-400">
                    <span>Less: Tax @ {planB_Working.taxRate}%</span>
                    <span>- {formatCurrencyINR(planB_Working.taxAmount)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between bg-slate-50/50 dark:bg-slate-800/30 font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Profit After Tax (PAT)</span>
                    <span className="text-slate-900 dark:text-slate-100">{formatCurrencyINR(planB_Working.pat)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between text-rose-600 dark:text-rose-400">
                    <span>Less: Preference Dividend</span>
                    <span>- {formatCurrencyINR(planB_Working.preferenceDividend)}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between bg-emerald-50/60 dark:bg-emerald-950/40 font-bold text-slate-900 dark:text-slate-100">
                    <span>Profit Available to Equity</span>
                    <span>{formatCurrencyINR(planB_Working.equityEarnings)}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Divided by: Equity Shares</span>
                    <span>{planB_Working.totalShares.toLocaleString('en-IN')} shares</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between bg-emerald-600 text-white font-bold text-sm rounded-b-lg">
                    <span>Earnings Per Share (EPS)</span>
                    <span>{formatCurrencyINR(planB_Working.eps)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Dynamic Algebraic Derivation (Section 18) */}
        {activeSubTab === 'algebraic' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-semibold block mb-0.5">Dynamic Algebraic Derivation</span>
              Calculated using the actual parameters entered for Financing Plan A and Financing Plan B.
            </div>

            {breakEvenResult.algebraicSteps.length > 0 ? (
              <div className="space-y-3">
                {breakEvenResult.algebraicSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step.title}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-emerald-700 dark:text-emerald-400 overflow-x-auto">
                      {step.equation}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {step.explanation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                {breakEvenResult.message}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Formula Reference & Variable Dictionary (Section 17) */}
        {activeSubTab === 'formula' && (
          <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
            {/* Core EPS Formula */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                1. Earnings Per Share (EPS) Formula
              </h3>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs text-center text-indigo-600 dark:text-indigo-400 font-bold">
                EPS = [ (EBIT − Interest) × (1 − Tax Rate) − Preference Dividend ] ÷ Number of Equity Shares
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-100/60 dark:bg-slate-800/60">
                  <strong className="text-slate-900 dark:text-white">EBIT:</strong> Earnings Before Interest & Tax (Operating Profit).
                </div>
                <div className="p-2 rounded bg-slate-100/60 dark:bg-slate-800/60">
                  <strong className="text-slate-900 dark:text-white">Interest:</strong> Fixed finance charge payable on debentures / debt.
                </div>
                <div className="p-2 rounded bg-slate-100/60 dark:bg-slate-800/60">
                  <strong className="text-slate-900 dark:text-white">Tax Rate:</strong> Corporate income tax percentage (1 - T is tax adjustment factor).
                </div>
                <div className="p-2 rounded bg-slate-100/60 dark:bg-slate-800/60">
                  <strong className="text-slate-900 dark:text-white">Preference Dividend:</strong> Fixed return distributed to preference shareholders from PAT.
                </div>
                <div className="p-2 rounded bg-slate-100/60 dark:bg-slate-800/60 sm:col-span-2">
                  <strong className="text-slate-900 dark:text-white">Equity Shares:</strong> Total outstanding equity shares under that specific financing plan.
                </div>
              </div>
            </div>

            {/* Break-even EBIT Formula */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                2. Indifference (Break-Even) EBIT Condition
              </h3>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs text-center text-emerald-600 dark:text-emerald-400 font-bold">
                EPS (Plan A) = EPS (Plan B)
              </div>
              <p className="text-[11px] leading-relaxed">
                At the indifference point, the firm generates equal earnings per share irrespective of whether it chooses Plan A or Plan B. If anticipated operating profit exceeds this level, the plan with higher financial leverage typically maximizes shareholder returns.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close Workings
          </button>
        </div>
      </div>
    </div>
  );
};
