import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  Legend,
} from 'recharts';
import { useEbit } from '../../context/EbitContext';
import { generateSensitivityTable, formatCurrencyINR } from '../../engine/calculations';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: number;
  breakEvenEbit: number | null;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  breakEvenEbit,
}) => {
  if (!active || !payload || !payload.length || label === undefined) return null;

  const planA_EPS = payload.find((p) => p.dataKey === 'planA_EPS')?.value ?? 0;
  const planB_EPS = payload.find((p) => p.dataKey === 'planB_EPS')?.value ?? 0;
  const diff = Math.abs(planA_EPS - planB_EPS);
  const isAtBreakEven = breakEvenEbit !== null && Math.abs(label - breakEvenEbit) < 100;

  return (
    <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 font-semibold text-slate-200">
        <span>Operating Earnings (EBIT)</span>
        <span className="font-mono text-emerald-400">{formatCurrencyINR(label, 0)}</span>
      </div>

      <div className="space-y-1 pt-0.5">
        <div className="flex items-center justify-between text-indigo-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Plan A EPS:
          </span>
          <span className="font-mono font-medium">₹{Number(planA_EPS).toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-emerald-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Plan B EPS:
          </span>
          <span className="font-mono font-medium">₹{Number(planB_EPS).toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
          <span>Difference:</span>
          <span className="font-mono">₹{diff.toFixed(2)}</span>
        </div>
      </div>

      {isAtBreakEven && (
        <div className="mt-1 pt-1 border-t border-emerald-500/30 text-[11px] text-emerald-300 font-medium text-center bg-emerald-950/40 rounded py-0.5">
          🎯 Indifference / Break-Even Point
        </div>
      )}
    </div>
  );
};

export const EbitEpsChart: React.FC = () => {
  const { planA, planB, breakEvenResult, expectedEbit } = useEbit();

  // Dynamic range computation based on Break-even and Expected EBIT
  const chartData = useMemo(() => {
    const be = breakEvenResult.breakEvenEBIT ?? 300000;
    const baseTarget = Math.max(be > 0 ? be : 0, expectedEbit || 0, 200000);

    const minEbit = 0;
    const maxEbit = Math.max(baseTarget * 2, 600000);

    return generateSensitivityTable(planA, planB, minEbit, maxEbit, 18);
  }, [planA, planB, breakEvenResult, expectedEbit]);

  const beEbit = breakEvenResult.breakEvenEBIT;
  const beEps = breakEvenResult.epsAtBreakEven;

  return (
    <div className="w-full h-[360px] sm:h-[420px] select-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
          
          <XAxis
            dataKey="ebit"
            tickFormatter={(val) => {
              if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
              if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
              if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
              return `₹${val}`;
            }}
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            label={{
              value: 'Earnings Before Interest & Tax (EBIT)',
              position: 'bottom',
              offset: 12,
              fill: '#64748b',
              fontSize: 12,
              fontWeight: 500,
            }}
          />

          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => `₹${Number(val).toFixed(1)}`}
            label={{
              value: 'Earnings Per Share (EPS)',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              fill: '#64748b',
              fontSize: 12,
              fontWeight: 500,
            }}
          />

          <Tooltip
            content={<CustomTooltip breakEvenEbit={beEbit} />}
            cursor={{ stroke: 'rgba(100, 116, 139, 0.3)', strokeWidth: 1 }}
          />

          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {value === 'planA_EPS' ? 'Plan A EPS (Equity Focus)' : 'Plan B EPS (Leveraged Focus)'}
              </span>
            )}
          />

          {/* Reference line for Break-Even EBIT */}
          {beEbit !== null && beEbit > 0 && (
            <ReferenceLine
              x={beEbit}
              stroke="#059669"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Break-even: ${formatCurrencyINR(beEbit, 0)}`,
                position: 'top',
                fill: '#059669',
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          )}

          {/* Reference line for Expected EBIT */}
          {expectedEbit > 0 && (
            <ReferenceLine
              x={expectedEbit}
              stroke="#6366f1"
              strokeDasharray="2 2"
              strokeWidth={1.5}
              label={{
                value: `Expected: ${formatCurrencyINR(expectedEbit, 0)}`,
                position: 'insideTopRight',
                fill: '#4f46e5',
                fontSize: 11,
              }}
            />
          )}

          {/* Highlighted Break-even Point Intersection Dot */}
          {beEbit !== null && beEps !== null && beEbit > 0 && (
            <ReferenceDot
              x={beEbit}
              y={beEps}
              r={6}
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth={2}
            />
          )}

          {/* Plan A Line */}
          <Line
            type="monotone"
            dataKey="planA_EPS"
            name="planA_EPS"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 1.5, stroke: '#ffffff' }}
          />

          {/* Plan B Line */}
          <Line
            type="monotone"
            dataKey="planB_EPS"
            name="planB_EPS"
            stroke="#059669"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 1.5, stroke: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
