import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MethodComparisonItem } from '../../calculators/compoundInterest';
import { useCurrency } from '../../context/CurrencyContext';

interface CompoundingBarChartProps {
  data: MethodComparisonItem[];
  title?: string;
  height?: number;
}

export const CompoundingBarChart: React.FC<CompoundingBarChartProps> = ({
  data,
  title = 'Final Value by Compounding Frequency',
  height = 280,
}) => {
  const { format } = useCurrency();

  const colors = ['#94a3b8', '#38bdf8', '#818cf8', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
        {title}
      </h4>

      <div style={{ width: '100%', height }} className="min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
            <XAxis
              dataKey="method"
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={val => format(val, { compact: true })}
            />
            <Tooltip
              formatter={(val: any) => [format(Number(val)), 'Final Value']}
              labelStyle={{ fontWeight: 'bold', color: '#cbd5e1' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="finalValue" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
