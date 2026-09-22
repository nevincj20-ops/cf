import React, { useMemo } from 'react';
import {
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
} from 'lucide-react';
import { useEbit } from '../context/EbitContext';
import { MagneticButton } from '../components/effects/MagneticButton';
import { EbitEpsChart } from '../components/charts/EbitEpsChart';
import { formatCurrencyINR, generateSensitivityTable } from '../engine/calculations';

export const ReportView: React.FC = () => {
  const {
    planA,
    planB,
    expectedEbit,
    breakEvenResult,
    scenarioResult,
    planA_Working,
    planB_Working,
  } = useEbit();

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const sensitivityRows = useMemo(() => {
    const be = breakEvenResult.breakEvenEBIT ?? 300000;
    const maxEbit = Math.max(be * 2, 800000);
    return generateSensitivityTable(planA, planB, 0, maxEbit, 8);
  }, [planA, planB, breakEvenResult]);

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    const headers = ['EBIT', 'Plan A EPS', 'Plan B EPS', 'Difference', 'Favorable Plan'];
    const rows = sensitivityRows.map((r) => [
      r.ebit.toFixed(2),
      r.planA_EPS.toFixed(2),
      r.planB_EPS.toFixed(2),
      r.difference.toFixed(2),
      r.favorablePlan,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ebit_insight_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Bar (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Academic Financial Analysis Report</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full comprehensive case report formatted for college submission and portfolio documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <MagneticButton variant="primary" size="sm" onClick={handlePrint} className="text-xs">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </MagneticButton>

          <MagneticButton variant="accent" size="sm" onClick={handlePrint} className="text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </MagneticButton>

          <MagneticButton variant="outline" size="sm" onClick={exportCSV} className="text-xs">
            <FileText className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </MagneticButton>
        </div>
      </div>

      {/* Formal Printable Document Card */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900 dark:text-slate-100">
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              Corporate Finance Analytical Report
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              EBIT INSIGHT
            </h1>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              EBIT–EPS & Break-even EBIT Financial Analysis
            </p>
            <p className="text-xs text-slate-500">
              Coursework & Examination Standard: B.Com Semester V
            </p>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1 text-slate-500">
            <div className="flex items-center sm:justify-end gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentDate}</span>
            </div>
            <p>Model Status: Verified Mathematical Solver</p>
            <p className="font-mono text-[11px]">Tolerance: &lt; 0.0001</p>
          </div>
        </div>

        {/* Section 1: Executive Summary & Indifference Point */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
            1. Executive Analytical Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 block">Break-Even EBIT (Indifference)</span>
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrencyINR(breakEvenResult.breakEvenEBIT ?? 0)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 block">EPS at Break-Even</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                ₹{Number(breakEvenResult.epsAtBreakEven ?? 0).toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 block">Benchmark Expected EBIT</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {formatCurrencyINR(expectedEbit)}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-900 dark:text-emerald-300">
            <strong>Academic Interpretation:</strong> {scenarioResult.interpretation}
          </div>
        </section>

        {/* Section 2: Capital Structure Parameters */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
            2. Capital Structure & Financing Plan Assumptions
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 dark:border-slate-700">Parameter</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-slate-700">Plan A</th>
                  <th className="p-2.5">Plan B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-mono">
                <tr>
                  <td className="p-2 border-r font-sans font-medium text-slate-600 dark:text-slate-400">Financing Classification</td>
                  <td className="p-2 border-r">{planA.financingType}</td>
                  <td className="p-2">{planB.financingType}</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-sans font-medium text-slate-600 dark:text-slate-400">Existing Equity Shares</td>
                  <td className="p-2 border-r">{planA.existingShares.toLocaleString('en-IN')}</td>
                  <td className="p-2">{planB.existingShares.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-sans font-medium text-slate-600 dark:text-slate-400">New Equity Shares Issued</td>
                  <td className="p-2 border-r">{planA.newShares.toLocaleString('en-IN')}</td>
                  <td className="p-2">{planB.newShares.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/30 font-bold">
                  <td className="p-2 border-r font-sans font-medium">Total Equity Shares (N)</td>
                  <td className="p-2 border-r">{planA_Working.totalShares.toLocaleString('en-IN')}</td>
                  <td className="p-2">{planB_Working.totalShares.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-sans font-medium text-slate-600 dark:text-slate-400">Debt Capital Amount</td>
                  <td className="p-2 border-r">{formatCurrencyINR(planA.debtAmount, 0)}</td>
                  <td className="p-2">{formatCurrencyINR(planB.debtAmount, 0)}</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-sans font-medium text-slate-600 dark:text-slate-400">Annual Interest Charge</td>
                  <td className="p-2 border-r">{formatCurrencyINR(planA_Working.interest, 0)}</td>
                  <td className="p-2">{formatCurrencyINR(planB_Working.interest, 0)}</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-sans font-medium text-slate-600 dark:text-slate-400">Preference Capital & Dividend</td>
                  <td className="p-2 border-r">{formatCurrencyINR(planA_Working.preferenceDividend, 0)}</td>
                  <td className="p-2">{formatCurrencyINR(planB_Working.preferenceDividend, 0)}</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-sans font-medium text-slate-600 dark:text-slate-400">Corporate Tax Rate</td>
                  <td className="p-2 border-r">{planA.taxRate}%</td>
                  <td className="p-2">{planB.taxRate}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Income Statement Working */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
            3. Detailed Income Statement Working (at EBIT = {formatCurrencyINR(expectedEbit, 0)})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Plan A Statement */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 font-bold font-sans text-indigo-700 dark:text-indigo-400">
                Financing Plan A ({planA.financingType})
              </div>
              <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 space-y-1">
                <div className="flex justify-between py-1">
                  <span>EBIT</span>
                  <span>{formatCurrencyINR(planA_Working.ebit)}</span>
                </div>
                <div className="flex justify-between py-1 text-rose-600">
                  <span>Less: Interest</span>
                  <span>- {formatCurrencyINR(planA_Working.interest)}</span>
                </div>
                <div className="flex justify-between py-1 font-semibold">
                  <span>EBT</span>
                  <span>{formatCurrencyINR(planA_Working.ebt)}</span>
                </div>
                <div className="flex justify-between py-1 text-rose-600">
                  <span>Less: Tax ({planA_Working.taxRate}%)</span>
                  <span>- {formatCurrencyINR(planA_Working.taxAmount)}</span>
                </div>
                <div className="flex justify-between py-1 font-semibold">
                  <span>PAT</span>
                  <span>{formatCurrencyINR(planA_Working.pat)}</span>
                </div>
                <div className="flex justify-between py-1 text-rose-600">
                  <span>Less: Preference Dividend</span>
                  <span>- {formatCurrencyINR(planA_Working.preferenceDividend)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-indigo-700 dark:text-indigo-400">
                  <span>Earnings to Equity</span>
                  <span>{formatCurrencyINR(planA_Working.equityEarnings)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Equity Shares</span>
                  <span>{planA_Working.totalShares.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-sm bg-slate-50 dark:bg-slate-800/60 px-1 rounded">
                  <span>EPS</span>
                  <span>₹{planA_Working.eps.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Plan B Statement */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 font-bold font-sans text-emerald-700 dark:text-emerald-400">
                Financing Plan B ({planB.financingType})
              </div>
              <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 space-y-1">
                <div className="flex justify-between py-1">
                  <span>EBIT</span>
                  <span>{formatCurrencyINR(planB_Working.ebit)}</span>
                </div>
                <div className="flex justify-between py-1 text-rose-600">
                  <span>Less: Interest</span>
                  <span>- {formatCurrencyINR(planB_Working.interest)}</span>
                </div>
                <div className="flex justify-between py-1 font-semibold">
                  <span>EBT</span>
                  <span>{formatCurrencyINR(planB_Working.ebt)}</span>
                </div>
                <div className="flex justify-between py-1 text-rose-600">
                  <span>Less: Tax ({planB_Working.taxRate}%)</span>
                  <span>- {formatCurrencyINR(planB_Working.taxAmount)}</span>
                </div>
                <div className="flex justify-between py-1 font-semibold">
                  <span>PAT</span>
                  <span>{formatCurrencyINR(planB_Working.pat)}</span>
                </div>
                <div className="flex justify-between py-1 text-rose-600">
                  <span>Less: Preference Dividend</span>
                  <span>- {formatCurrencyINR(planB_Working.preferenceDividend)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-emerald-700 dark:text-emerald-400">
                  <span>Earnings to Equity</span>
                  <span>{formatCurrencyINR(planB_Working.equityEarnings)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Equity Shares</span>
                  <span>{planB_Working.totalShares.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-sm bg-slate-50 dark:bg-slate-800/60 px-1 rounded">
                  <span>EPS</span>
                  <span>₹{planB_Working.eps.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Dynamic Algebraic Solution */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
            4. Break-Even EBIT Algebraic Derivation
          </h2>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-mono">
            {breakEvenResult.algebraicSteps.map((step, idx) => (
              <div key={idx} className="pb-2 border-b border-slate-200/60 dark:border-slate-700/60 last:border-none">
                <span className="font-bold text-slate-700 dark:text-slate-300 font-sans block">
                  {step.title}:
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{step.equation}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Graphical Representation */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
            5. Graphical EPS–EBIT Trajectory
          </h2>
          <div className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl">
            <EbitEpsChart />
          </div>
        </section>

        {/* Section 6: Sensitivity Table Snapshot */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
            6. Sensitivity Table Snapshot
          </h2>

          <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700">
            <thead className="bg-slate-100 dark:bg-slate-800 font-semibold">
              <tr>
                <th className="p-2">EBIT</th>
                <th className="p-2">Plan A EPS</th>
                <th className="p-2">Plan B EPS</th>
                <th className="p-2">Difference</th>
                <th className="p-2">Superior Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-mono">
              {sensitivityRows.map((r, i) => (
                <tr key={i} className={r.isBreakEvenPoint ? 'bg-emerald-50 font-bold' : ''}>
                  <td className="p-2">{formatCurrencyINR(r.ebit, 0)}</td>
                  <td className="p-2">₹{r.planA_EPS.toFixed(2)}</td>
                  <td className="p-2">₹{r.planB_EPS.toFixed(2)}</td>
                  <td className="p-2">₹{r.difference.toFixed(2)}</td>
                  <td className="p-2 font-sans">{r.favorablePlan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Section 7: Financial Significance & Model Assumptions */}
        <section className="space-y-3 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
            7. Financial Significance & Theoretical Observations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 font-sans block">
                Impact of Financial Leverage
              </span>
              <p>
                When expected EBIT exceeds the break-even EBIT point of {formatCurrencyINR(breakEvenResult.breakEvenEBIT ?? 0)}, financial leverage acts favourably. Debt interest is fixed, allowing excess operating returns to multiply EPS for equity holders.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 font-sans block">
                Downside Operating Risk
              </span>
              <p>
                If EBIT falls below the indifference threshold, fixed debt interest burdens the firm, causing EPS under the debt alternative to drop significantly faster than under equity financing.
              </p>
            </div>
          </div>
        </section>

        {/* Sign-off / Verification Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400">
          <span>Prepared using EBIT INSIGHT Academic Engine</span>
          <span>B.Com Semester V Corporate Finance Examination Suite</span>
        </div>
      </div>
    </div>
  );
};
