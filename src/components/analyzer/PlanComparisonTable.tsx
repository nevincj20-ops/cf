import React from 'react';
import { Table, Check, ArrowRight } from 'lucide-react';
import { useEbit } from '../../context/EbitContext';
import { GlassCard } from '../effects/GlassCard';
import { formatCurrencyINR } from '../../engine/calculations';

export const PlanComparisonTable: React.FC = () => {
  const { planA, planB, expectedEbit, scenarioResult, breakEvenResult } = useEbit();

  const intA = planA.isManualInterest ? planA.interestAmount : (planA.debtAmount * planA.interestRate) / 100;
  const intB = planB.isManualInterest ? planB.interestAmount : (planB.debtAmount * planB.interestRate) / 100;

  const prefA = planA.isManualPrefDividend
    ? planA.preferenceDividend
    : (planA.preferenceShares * planA.preferenceDividendRate) / 100;
  const prefB = planB.isManualPrefDividend
    ? planB.preferenceDividend
    : (planB.preferenceShares * planB.preferenceDividendRate) / 100;

  const totalA = planA.existingShares + planA.newShares;
  const totalB = planB.existingShares + planB.newShares;

  const be = breakEvenResult.breakEvenEBIT;
  let relA = '—';
  let relB = '—';
  if (be !== null && be > 0) {
    if (expectedEbit > be) {
      relA = scenarioResult.planA_EPS > scenarioResult.planB_EPS ? 'Higher EPS' : 'Lower EPS';
      relB = scenarioResult.planB_EPS > scenarioResult.planA_EPS ? 'Higher EPS' : 'Lower EPS';
    } else if (expectedEbit < be) {
      relA = scenarioResult.planA_EPS > scenarioResult.planB_EPS ? 'Higher EPS' : 'Lower EPS';
      relB = scenarioResult.planB_EPS > scenarioResult.planA_EPS ? 'Higher EPS' : 'Lower EPS';
    } else {
      relA = 'Equal EPS';
      relB = 'Equal EPS';
    }
  }

  const rows = [
    { metric: 'Financing Type', planA: planA.financingType, planB: planB.financingType },
    { metric: 'Total Debt Capital', planA: formatCurrencyINR(planA.debtAmount, 0), planB: formatCurrencyINR(planB.debtAmount, 0) },
    { metric: 'Annual Interest Expense', planA: formatCurrencyINR(intA, 0), planB: formatCurrencyINR(intB, 0) },
    { metric: 'Preference Dividend', planA: formatCurrencyINR(prefA, 0), planB: formatCurrencyINR(prefB, 0) },
    { metric: 'Total Equity Shares', planA: `${totalA.toLocaleString('en-IN')} shares`, planB: `${totalB.toLocaleString('en-IN')} shares` },
    { metric: 'Applicable Tax Rate', planA: `${planA.taxRate}%`, planB: `${planB.taxRate}%` },
    {
      metric: `EPS at Selected EBIT (${formatCurrencyINR(expectedEbit, 0)})`,
      planA: `₹${scenarioResult.planA_EPS.toFixed(2)}`,
      planB: `₹${scenarioResult.planB_EPS.toFixed(2)}`,
      highlight: true,
    },
    { metric: 'Break-even Relationship', planA: relA, planB: relB },
  ];

  return (
    <GlassCard className="p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3">
        <Table className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
          PLAN COMPARISON MATRIX
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <th className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">Metric</th>
              <th className="py-2.5 px-3 font-semibold text-indigo-700 dark:text-indigo-400">Plan A</th>
              <th className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">Plan B</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, i) => (
              <tr
                key={i}
                className={
                  row.highlight
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 font-semibold'
                    : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20'
                }
              >
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                  {row.metric}
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-800 dark:text-slate-200">
                  {row.planA}
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-800 dark:text-slate-200">
                  {row.planB}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
