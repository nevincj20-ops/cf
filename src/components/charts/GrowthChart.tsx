import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint } from '../../types/tvm';
import { useCurrency } from '../../context/CurrencyContext';

interface GrowthChartProps {
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  data,
  title = 'Balance Growth Over Time',
  subtitle,
  height = 280,
}) => {
  const { format, config } = useCurrency();

  if (!data || data.length === 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="mb-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ width: '100%', height }} className="min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1', strokeOpacity: 0.4 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={val => format(val, { compact: true })}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 text-xs">
                    <p className="font-bold text-slate-300 mb-1.5">{label}</p>
                    {payload.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.name === 'balance' ? 'Total Value' : 'Principal'}:
                        </span>
                        <span className="font-mono font-bold text-white">
                          {format(Number(entry.value))}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            {data[0]?.principal !== undefined && (
              <Area
                type="monotone"
                dataKey="principal"
                name="principal"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#principalGrad)"
              />
            )}
            <Area
              type="monotone"
              dataKey="balance"
              name="balance"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#balanceGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Total Balance</span>
        </div>
        {data[0]?.principal !== undefined && (
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            <span>Principal Invested</span>
          </div>
        )}
      </div>
    </div>
  );
};
