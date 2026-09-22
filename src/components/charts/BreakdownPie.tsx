import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

interface BreakdownPieProps {
  principal: number;
  interest: number;
  principalLabel?: string;
  interestLabel?: string;
  title?: string;
}

export const BreakdownPie: React.FC<BreakdownPieProps> = ({
  principal,
  interest,
  principalLabel = 'Principal',
  interestLabel = 'Interest Earned',
  title = 'Total Breakdown',
}) => {
  const { format } = useCurrency();

  const total = principal + interest;
  const principalPct = total > 0 ? ((principal / total) * 100).toFixed(1) : '0';
  const interestPct = total > 0 ? ((interest / total) * 100).toFixed(1) : '0';

  const data = [
    { name: principalLabel, value: Math.max(0, principal), color: '#6366f1' },
    { name: interestLabel, value: Math.max(0, interest), color: '#10b981' },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 self-start mb-2">
        {title}
      </h4>

      <div className="w-full h-44 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: any) => [format(Number(val)), '']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
            {format(total, { compact: true })}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 w-full pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
            <span className="truncate">{principalLabel}</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {format(principal, { compact: true })} ({principalPct}%)
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">{interestLabel}</span>
          </div>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {format(interest, { compact: true })} ({interestPct}%)
          </span>
        </div>
      </div>
    </div>
  );
};
