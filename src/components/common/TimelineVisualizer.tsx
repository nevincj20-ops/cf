import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

interface Milestone {
  period: number;
  label: string;
  amount: number;
  subtext?: string;
  isStart?: boolean;
  isEnd?: boolean;
}

interface TimelineVisualizerProps {
  milestones: Milestone[];
  title?: string;
  description?: string;
}

export const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({
  milestones,
  title = 'Cash Flow & Growth Timeline',
  description,
}) => {
  const { format } = useCurrency();

  if (milestones.length === 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {title}
          </h4>
        </div>
      </div>

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {description}
        </p>
      )}

      {/* Horizontal / Scrollable timeline */}
      <div className="overflow-x-auto pb-2 pt-4">
        <div className="flex items-center min-w-max gap-1 sm:gap-2 px-2">
          {milestones.map((m, idx) => {
            const isLast = idx === milestones.length - 1;
            return (
              <React.Fragment key={idx}>
                {/* Node */}
                <div className="flex flex-col items-center">
                  <div
                    className={`px-3 py-1.5 rounded-xl border text-center transition-all ${
                      m.isEnd
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20 font-bold'
                        : m.isStart
                        ? 'bg-slate-900 text-white border-slate-700 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] block opacity-80 uppercase tracking-tight">
                      {m.label}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold whitespace-nowrap">
                      {format(m.amount, { compact: true })}
                    </span>
                  </div>
                  {m.subtext && (
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                      {m.subtext}
                    </span>
                  )}
                </div>

                {/* Connector Arrow */}
                {!isLast && (
                  <div className="flex items-center text-slate-300 dark:text-slate-600 px-1">
                    <div className="w-4 sm:w-8 h-0.5 bg-slate-300 dark:bg-slate-700" />
                    <ArrowRight className="w-3.5 h-3.5 -ml-1 text-slate-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
