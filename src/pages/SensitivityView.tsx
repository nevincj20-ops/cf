import React, { useState, useMemo } from 'react';
import {
  TableProperties,
  Download,
  Filter,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useEbit } from '../context/EbitContext';
import { GlassCard } from '../components/effects/GlassCard';
import { MagneticButton } from '../components/effects/MagneticButton';
import { generateSensitivityTable, formatCurrencyINR } from '../engine/calculations';

export const SensitivityView: React.FC = () => {
  const { planA, planB, breakEvenResult } = useEbit();

  const be = breakEvenResult.breakEvenEBIT ?? 300000;
  const defaultMax = Math.max(be > 0 ? be * 2 : 1000000, 1000000);

  const [minEbit, setMinEbit] = useState<number>(0);
  const [maxEbit, setMaxEbit] = useState<number>(defaultMax);
  const [intervals, setIntervals] = useState<number>(10);

  const tableData = useMemo(() => {
    return generateSensitivityTable(planA, planB, minEbit, maxEbit, intervals);
  }, [planA, planB, minEbit, maxEbit, intervals]);

  const exportCSV = () => {
    const headers = ['EBIT', 'Plan A EPS', 'Plan B EPS', 'Difference', 'Favorable Plan'];
    const rows = tableData.map((row) => [
      row.ebit.toFixed(2),
      row.planA_EPS.toFixed(2),
      row.planB_EPS.toFixed(2),
      row.difference.toFixed(2),
      row.favorablePlan,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ebit_sensitivity_analysis.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Sensitivity Analysis Engine</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate how varying levels of EBIT impact the relative EPS superiority of both financing structures.
          </p>
        </div>

        <MagneticButton variant="accent" size="sm" onClick={exportCSV} className="text-xs">
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </MagneticButton>
      </div>

      {/* Filter / Range Configuration Card */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interval & Range Configuration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Minimum EBIT (₹)
            </label>
            <input
              type="number"
              min="0"
              step="50000"
              value={minEbit}
              onChange={(e) => setMinEbit(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Maximum EBIT (₹)
            </label>
            <input
              type="number"
              min="10000"
              step="50000"
              value={maxEbit}
              onChange={(e) => setMaxEbit(Math.max(minEbit + 1000, parseFloat(e.target.value) || 100000))}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Number of Intervals
            </label>
            <select
              value={intervals}
              onChange={(e) => setIntervals(parseInt(e.target.value) || 10)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="5">5 intervals</option>
              <option value="10">10 intervals (Standard)</option>
              <option value="15">15 intervals</option>
              <option value="20">20 intervals</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Sensitivity Chart */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>EPS Trajectory Across Selected Range</span>
        </h3>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tableData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
              <XAxis
                dataKey="ebit"
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => {
                  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
                  return `₹${val}`;
                }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `₹${Number(val).toFixed(1)}`}
              />
              <Tooltip
                formatter={(val: any, name: any) => [
                  `₹${Number(val).toFixed(2)}`,
                  name === 'planA_EPS' ? 'Plan A EPS' : 'Plan B EPS',
                ]}
                labelFormatter={(label: any) => `EBIT: ${formatCurrencyINR(Number(label) || 0, 0)}`}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '12px',
                  border: '1px solid #334155',
                }}
              />
              <Legend
                formatter={(val) => (
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {val === 'planA_EPS' ? 'Plan A EPS' : 'Plan B EPS'}
                  </span>
                )}
              />
              {breakEvenResult.breakEvenEBIT !== null && (
                <ReferenceLine
                  x={breakEvenResult.breakEvenEBIT}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Indifference',
                    position: 'top',
                    fill: '#10b981',
                    fontSize: 10,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="planA_EPS"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="planB_EPS"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Sensitivity Table */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Sensitivity Data Table</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {tableData.length} Data Points
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 font-semibold text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3">EBIT (Operating Earnings)</th>
                <th className="py-2.5 px-3 text-indigo-700 dark:text-indigo-400">Plan A EPS</th>
                <th className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400">Plan B EPS</th>
                <th className="py-2.5 px-3">EPS Difference</th>
                <th className="py-2.5 px-3">Superior EPS Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {tableData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    row.isBreakEvenPoint
                      ? 'bg-emerald-100/60 dark:bg-emerald-950/40 font-bold border-y-2 border-emerald-400'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrencyINR(row.ebit, 0)}
                    {row.isBreakEvenPoint && (
                      <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white font-sans uppercase">
                        Break-Even
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-indigo-700 dark:text-indigo-300">
                    ₹{row.planA_EPS.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-emerald-700 dark:text-emerald-300">
                    ₹{row.planB_EPS.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                    ₹{row.difference.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 font-sans">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        row.favorablePlan === 'Plan A'
                          ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                          : row.favorablePlan === 'Plan B'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {row.favorablePlan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
