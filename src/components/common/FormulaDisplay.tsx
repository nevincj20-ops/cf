import React from 'react';
import { BookOpen } from 'lucide-react';

interface VariableLegend {
  symbol: string;
  meaning: string;
}

interface FormulaDisplayProps {
  formula: string;
  title?: string;
  description?: string;
  variables?: VariableLegend[];
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  formula,
  title = 'Formula Applied',
  description,
  variables = [],
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300">
        <BookOpen className="w-4 h-4 text-emerald-500" />
        <h4 className="text-xs font-bold uppercase tracking-wider">{title}</h4>
      </div>

      <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm font-semibold tracking-wide overflow-x-auto shadow-inner border border-slate-800">
        {formula}
      </div>

      {description && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          {description}
        </p>
      )}

      {variables.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Where:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            {variables.map((v, i) => (
              <div key={i} className="flex items-baseline gap-1.5">
                <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{v.symbol}</span>
                <span className="text-slate-400">=</span>
                <span>{v.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
