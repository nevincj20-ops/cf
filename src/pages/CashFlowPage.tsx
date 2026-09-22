import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import type { CashFlowPoint } from '../calculators/npv';
import { calculateNPV } from '../calculators/npv';
import { useCurrency } from '../context/CurrencyContext';
import { PRESETS } from '../utils/presets';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { FormulaDisplay } from '../components/common/FormulaDisplay';
import { CalculationSteps } from '../components/common/CalculationSteps';
import { PresetSelector } from '../components/common/PresetSelector';
import { CashFlowTimelineChart } from '../components/charts/CashFlowTimelineChart';
import { exportCashFlowCSV } from '../utils/export';

interface CashFlowPageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const CashFlowPage: React.FC<CashFlowPageProps> = ({ onShowToast }) => {
  const { symbol, format } = useCurrency();

  const [discountRate, setDiscountRate] = useState<number>(10.0);
  const [flows, setFlows] = useState<CashFlowPoint[]>([
    { period: 0, amount: -100000, label: 'Initial Investment' },
    { period: 1, amount: 25000, label: 'Year 1 Returns' },
    { period: 2, amount: 30000, label: 'Year 2 Returns' },
    { period: 3, amount: 40000, label: 'Year 3 Returns' },
    { period: 4, amount: 35000, label: 'Year 4 Returns' },
  ]);

  const result = useMemo(() => {
    return calculateNPV({
      discountRate,
      cashFlows: flows,
    });
  }, [discountRate, flows]);

  const handleAddFlow = () => {
    const nextPeriod = flows.length > 0 ? Math.max(...flows.map(f => f.period)) + 1 : 1;
    setFlows(prev => [
      ...prev,
      { period: nextPeriod, amount: 30000, label: `Year ${nextPeriod} Inflow` },
    ]);
  };

  const handleRemoveFlow = (index: number) => {
    if (flows.length <= 2) return;
    setFlows(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAmount = (index: number, val: number) => {
    setFlows(prev =>
      prev.map((f, i) => (i === index ? { ...f, amount: val } : f))
    );
  };

  const handleReset = () => {
    setDiscountRate(10.0);
    setFlows([
      { period: 0, amount: -100000, label: 'Initial Outlay' },
      { period: 1, amount: 25000 },
      { period: 2, amount: 30000 },
      { period: 3, amount: 40000 },
      { period: 4, amount: 35000 },
    ]);
    if (onShowToast) onShowToast('Reset cash flows to default venture', 'info');
  };

  const handleExportCSV = () => {
    exportCashFlowCSV(result.rows);
    if (onShowToast) onShowToast('NPV cash flows exported to CSV!', 'success');
  };

  const copySummaryText = `Cash Flow & Capital Budgeting Analysis:
Discount Rate: ${discountRate}%
Net Present Value (NPV): ${format(result.npv)}
Internal Rate of Return (IRR): ${result.irr !== null ? result.irr.toFixed(2) + '%' : 'N/A'}
Profitability Index (PI): ${result.profitabilityIndex ? result.profitabilityIndex.toFixed(2) : 'N/A'}
Payback Period: ${result.paybackPeriod ? result.paybackPeriod.toFixed(2) + ' periods' : 'N/A'}
Discounted Payback: ${result.discountedPaybackPeriod ? result.discountedPaybackPeriod.toFixed(2) + ' periods' : 'N/A'}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Cash Flow Analysis (NPV & IRR)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Evaluate capital investments, startup ventures, and projects using Net Present Value (NPV), Internal Rate of Return (IRR), and Payback Period.
        </p>
      </div>

      <PresetSelector
        presets={PRESETS.cashFlow}
        onSelect={preset => {
          setDiscountRate(preset.values.discountRate);
          setFlows(preset.values.flows);
          if (onShowToast) onShowToast(`Loaded ${preset.name}`, 'info');
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Cash Flows */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Cash Flow Schedule
              </h3>
              <button
                type="button"
                onClick={handleAddFlow}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Period</span>
              </button>
            </div>

            <InputField
              id="cf-discount"
              label="Hurdle / Discount Rate (Cost of Capital)"
              value={discountRate}
              onChange={setDiscountRate}
              suffix="%"
              min={0}
              max={100}
              step={0.5}
              tooltip="The minimum required rate of return used to discount project cash flows."
            />

            <div className="space-y-2 pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter initial investment (outflows) as <strong>negative numbers</strong> (e.g. -100,000) and revenue as positive.
              </p>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {flows.map((cf, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                  >
                    <span className="w-16 text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                      t = {cf.period}:
                    </span>
                    <div className="flex-1">
                      <InputField
                        id={`npv-cf-${idx}`}
                        label=""
                        value={cf.amount}
                        onChange={val => handleUpdateAmount(idx, val)}
                        prefix={symbol}
                        step={5000}
                      />
                    </div>
                    {flows.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFlow(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete period"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <FormulaDisplay
            formula="NPV = ∑ [ CF_t / (1 + r)^t ] = 0 (at IRR)"
            description="A positive NPV indicates the project generates returns above the required cost of capital, thereby adding net economic value."
            variables={[
              { symbol: 'CF_t', meaning: 'Cash inflow (+) or outflow (-) at period t' },
              { symbol: 'r', meaning: 'Discount rate' },
              { symbol: 'IRR', meaning: 'Discount rate where NPV is exactly 0' },
            ]}
          />
        </div>

        {/* Right Results & Visuals */}
        <div className="lg:col-span-7 space-y-6">
          <ResultCard
            title="Capital Valuation"
            primaryLabel="Net Present Value (NPV)"
            primaryValue={format(result.npv)}
            secondaryMetrics={[
              {
                label: 'Internal Rate of Return (IRR)',
                value: result.irr !== null ? `${result.irr.toFixed(2)}%` : 'N/A',
                type: result.irr !== null && result.irr > discountRate ? 'positive' : 'warning',
              },
              {
                label: 'Profitability Index (PI)',
                value: result.profitabilityIndex ? result.profitabilityIndex.toFixed(2) : 'N/A',
                type: 'accent',
              },
              {
                label: 'Payback Period',
                value: result.paybackPeriod ? `${result.paybackPeriod.toFixed(2)} yrs` : 'N/A',
              },
              {
                label: 'Discounted Payback',
                value: result.discountedPaybackPeriod ? `${result.discountedPaybackPeriod.toFixed(2)} yrs` : 'N/A',
              },
              {
                label: 'Net Nominal Flow',
                value: format(result.netNominalCashFlow),
              },
            ]}
            onReset={handleReset}
            copySummaryText={copySummaryText}
            onShowToast={onShowToast}
          />

          <CashFlowTimelineChart
            data={result.chartData}
            title="Cash Inflows vs Outflows (Nominal vs Discounted)"
          />

          {/* Cash flow detail table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Discounted Cash Flow Table
              </h4>
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Period (t)</th>
                    <th className="py-2.5 px-4">Cash Flow</th>
                    <th className="py-2.5 px-4">Discount Factor</th>
                    <th className="py-2.5 px-4">Discounted PV</th>
                    <th className="py-2.5 px-4">Cumulative Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {result.rows.map(row => (
                    <tr key={row.period} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                        {row.period === 0 ? 'Initial (t=0)' : `Year ${row.period}`}
                      </td>
                      <td
                        className={`py-2.5 px-4 font-mono font-bold ${
                          row.amount < 0 ? 'text-red-500' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {format(row.amount)}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-indigo-600 dark:text-indigo-400">
                        {row.discountFactor.toFixed(4)}
                      </td>
                      <td
                        className={`py-2.5 px-4 font-mono font-bold ${
                          row.discountedAmount < 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {format(row.discountedAmount)}
                      </td>
                      <td
                        className={`py-2.5 px-4 font-mono ${
                          row.cumulativeDiscounted >= 0 ? 'text-emerald-600 font-semibold' : 'text-slate-500'
                        }`}
                      >
                        {format(row.cumulativeDiscounted)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <CalculationSteps steps={result.steps} />
        </div>
      </div>
    </div>
  );
};
