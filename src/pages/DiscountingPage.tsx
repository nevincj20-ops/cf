import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import { calculateMultiDiscounting } from '../calculators/discounting';
import { useCurrency } from '../context/CurrencyContext';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { FormulaDisplay } from '../components/common/FormulaDisplay';
import { CalculationSteps } from '../components/common/CalculationSteps';
import { CashFlowTimelineChart } from '../components/charts/CashFlowTimelineChart';
import { exportCashFlowCSV } from '../utils/export';

interface CashFlowRowInput {
  id: string;
  period: number;
  amount: number;
}

interface DiscountingPageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const DiscountingPage: React.FC<DiscountingPageProps> = ({ onShowToast }) => {
  const { symbol, format } = useCurrency();

  const [discountRate, setDiscountRate] = useState<number>(10.0);
  const [cashFlows, setCashFlows] = useState<CashFlowRowInput[]>([
    { id: '1', period: 1, amount: 10000 },
    { id: '2', period: 2, amount: 15000 },
    { id: '3', period: 3, amount: 20000 },
  ]);

  const result = useMemo(() => {
    return calculateMultiDiscounting({
      discountRate,
      cashFlows: cashFlows.map(cf => ({ period: cf.period, amount: cf.amount })),
    });
  }, [discountRate, cashFlows]);

  const handleAddPeriod = () => {
    const nextPeriod = cashFlows.length > 0 ? Math.max(...cashFlows.map(c => c.period)) + 1 : 1;
    setCashFlows(prev => [
      ...prev,
      { id: Date.now().toString(), period: nextPeriod, amount: 25000 },
    ]);
  };

  const handleRemovePeriod = (id: string) => {
    if (cashFlows.length <= 1) return;
    setCashFlows(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateAmount = (id: string, newAmount: number) => {
    setCashFlows(prev =>
      prev.map(c => (c.id === id ? { ...c, amount: newAmount } : c))
    );
  };

  const handleReset = () => {
    setDiscountRate(10.0);
    setCashFlows([
      { id: '1', period: 1, amount: 10000 },
      { id: '2', period: 2, amount: 15000 },
      { id: '3', period: 3, amount: 20000 },
    ]);
    if (onShowToast) onShowToast('Reset cash flows to default stream', 'info');
  };

  const handleExportCSV = () => {
    const rowsForExport = result.items.map(item => ({
      period: item.period,
      amount: item.cashFlow,
      discountFactor: item.discountFactor,
      discountedAmount: item.presentValue,
    }));
    exportCashFlowCSV(rowsForExport);
    if (onShowToast) onShowToast('Discounted cash flows exported to CSV!', 'success');
  };

  const copySummaryText = `Cash Flow Discounting:
Discount Rate: ${discountRate}%
Total Nominal Cash Flows: ${format(result.totalCashFlow)}
-----------------------------
Total Present Value (PV): ${format(result.totalPresentValue)}
Total Time Value Discount: ${format(result.totalDiscountAmount)}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Multi-Period Cash Flow Discounting
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Discount arbitrary streams of future payments into an aggregate present value using the discount factor DF = 1 / (1+r)^t.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs & Dynamic Cash Flow Builder */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Discount Parameters & Schedule
              </h3>
              <button
                type="button"
                onClick={handleAddPeriod}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Year</span>
              </button>
            </div>

            <InputField
              id="disc-rate"
              label="Annual Discount / Hurdle Rate (r)"
              value={discountRate}
              onChange={setDiscountRate}
              suffix="%"
              min={0}
              max={100}
              step={0.5}
              tooltip="Rate used to discount future cash flows back to today."
            />

            {/* Cash flow list table */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Expected Future Cash Inflows:
              </label>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {cashFlows.map((cf) => (
                  <div
                    key={cf.id}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                  >
                    <span className="w-20 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      Year {cf.period}:
                    </span>
                    <div className="flex-1">
                      <InputField
                        id={`cf-input-${cf.id}`}
                        label=""
                        value={cf.amount}
                        onChange={val => handleUpdateAmount(cf.id, val)}
                        prefix={symbol}
                        step={1000}
                      />
                    </div>
                    {cashFlows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePeriod(cf.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove period"
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
            formula="PV = ∑ [ CF_t / (1 + r)^t ] = CF_1/(1+r)^1 + CF_2/(1+r)^2 + ... + CF_n/(1+r)^n"
            description="Each future payment is scaled down by its respective discount factor 1/(1+r)^t, reflecting the opportunity cost of waiting."
            variables={[
              { symbol: 'CF_t', meaning: 'Cash flow received in period t' },
              { symbol: 'r', meaning: 'Discount rate' },
              { symbol: 't', meaning: 'Time period (year)' },
            ]}
          />
        </div>

        {/* Right Results & Visuals */}
        <div className="lg:col-span-6 space-y-6">
          <ResultCard
            title="Discounted Present Value"
            primaryLabel="Total Present Value (Worth Today)"
            primaryValue={format(result.totalPresentValue)}
            secondaryMetrics={[
              { label: 'Nominal Cash Flows Sum', value: format(result.totalCashFlow) },
              { label: 'Discount Amount (Time Loss)', value: format(result.totalDiscountAmount), type: 'accent' },
              { label: 'Discount Rate', value: `${discountRate}%` },
            ]}
            onReset={handleReset}
            copySummaryText={copySummaryText}
            onShowToast={onShowToast}
          />

          <CashFlowTimelineChart
            data={result.chartData}
            title="Nominal vs Discounted Present Value per Year"
          />

          {/* Discount Factor Breakdown Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Period Discount Factors
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
                    <th className="py-2.5 px-4">Period</th>
                    <th className="py-2.5 px-4">Nominal Flow</th>
                    <th className="py-2.5 px-4">Discount Factor</th>
                    <th className="py-2.5 px-4">Present Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {result.items.map(item => (
                    <tr key={item.period} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                        Year {item.period}
                      </td>
                      <td className="py-2.5 px-4 font-mono">{format(item.cashFlow)}</td>
                      <td className="py-2.5 px-4 font-mono text-indigo-600 dark:text-indigo-400">
                        {item.discountFactor.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {format(item.presentValue)}
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
