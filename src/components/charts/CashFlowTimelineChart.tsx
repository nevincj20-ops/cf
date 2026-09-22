import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { ChartDataPoint } from '../../types/tvm';
import { useCurrency } from '../../context/CurrencyContext';

interface CashFlowTimelineChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
}

export const CashFlowTimelineChart: React.FC<CashFlowTimelineChartProps> = ({
  data,
  title = 'Nominal vs Discounted Cash Flows',
  height = 280,
}) => {
  const { format } = useCurrency();

  if (!data || data.length === 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
        {title}
      </h4>

      <div style={{ width: '100%', height }} className="min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
            <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={val => format(val, { compact: true })}
            />
            <ReferenceLine y={0} stroke="#64748b" />
            <Tooltip
              formatter={(val: any, name: any) => [
                format(Number(val)),
                name === 'cashFlow' ? 'Nominal Cash Flow' : 'Present Value (Discounted)',
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
                  {value === 'cashFlow' ? 'Nominal Flow' : 'Discounted Present Value'}
                </span>
              )}
            />
            <Bar dataKey="cashFlow" name="cashFlow" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="discountedCashFlow" name="discountedCashFlow" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
