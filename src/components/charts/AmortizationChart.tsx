import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartDataPoint } from '../../types/tvm';
import { useCurrency } from '../../context/CurrencyContext';

interface AmortizationChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export const AmortizationChart: React.FC<AmortizationChartProps> = ({
  data,
  height = 280,
}) => {
  const { format } = useCurrency();
  const [viewMode, setViewMode] = useState<'balance' | 'breakdown'>('balance');

  if (!data || data.length === 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {viewMode === 'balance' ? 'Remaining Loan Balance Curve' : 'Yearly Principal vs Interest Paid'}
        </h4>

        {/* View mode toggle */}
        <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('balance')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'balance'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Balance Curve
          </button>
          <button
            type="button"
            onClick={() => setViewMode('breakdown')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'breakdown'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Payment Breakdown
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height }} className="min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'balance' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradLoan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={val => format(val, { compact: true })}
              />
              <Tooltip
                formatter={(val: any) => [format(Number(val)), 'Remaining Balance']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#balanceGradLoan)"
              />
            </AreaChart>
          ) : (
            <BarChart
              data={data.filter(d => d.period > 0)}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={val => format(val, { compact: true })}
              />
              <Tooltip
                formatter={(val: any, name: any) => [
                  format(Number(val)),
                  name === 'principal' ? 'Principal Paid' : 'Interest Paid',
                ]}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="top"
                height={30}
                formatter={value => (
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {value === 'principal' ? 'Principal Repayment' : 'Interest Charge'}
                  </span>
                )}
              />
              <Bar dataKey="principal" name="principal" stackId="a" fill="#10b981" />
              <Bar dataKey="interest" name="interest" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
