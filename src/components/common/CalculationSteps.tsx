import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Calculator } from 'lucide-react';
import { CalculationStep } from '../../types/tvm';

interface CalculationStepsProps {
  steps: CalculationStep[];
  title?: string;
  defaultExpanded?: boolean;
}

export const CalculationSteps: React.FC<CalculationStepsProps> = ({
  steps,
  title = 'How was this calculated?',
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
      {/* Header Accordion Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dynamic step-by-step substitution & intermediate arithmetic
            </p>
          </div>
        </div>

        <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Steps List */}
      {expanded && (
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-3.5 space-y-4">
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              return (
                <li key={idx} className="ml-5 group">
                  {/* Step dot */}
                  <span
                    className={`absolute -left-2 flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white dark:ring-slate-900 ${
                      isLast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {isLast ? (
                      <CheckCircle className="w-3 h-3 text-white" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 dark:bg-slate-400" />
                    )}
                  </span>

                  {/* Step Label */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step {idx + 1}: {step.label}
                    </span>
                  </div>

                  {/* Step Expression */}
                  <div
                    className={`mt-1.5 p-3 rounded-xl font-mono text-xs sm:text-sm font-semibold overflow-x-auto ${
                      isLast
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {step.expression}
                  </div>

                  {step.explanation && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {step.explanation}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
};
