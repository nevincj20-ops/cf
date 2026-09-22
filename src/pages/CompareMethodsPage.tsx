import React, { useState, useMemo } from 'react';
import { calculateCompoundInterest } from '../calculators/compoundInterest';
import { useCurrency } from '../context/CurrencyContext';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { CompoundingBarChart } from '../components/charts/CompoundingBarChart';
import { GrowthChart } from '../components/charts/GrowthChart';
import { GitCompare } from 'lucide-react';

interface CompareMethodsPageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const CompareMethodsPage: React.FC<CompareMethodsPageProps> = ({ onShowToast }) => {
  const { symbol, format } = useCurrency();

  const [principal, setPrincipal] = useState<number>(100000);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [years, setYears] = useState<number>(10);

  const result = useMemo(() => {
    return calculateCompoundInterest({
      principal,
      annualRate,
      years,
    });
  }, [principal, annualRate, years]);

  const handleReset = () => {
    setPrincipal(100000);
    setAnnualRate(8.5);
    setYears(10);
    if (onShowToast) onShowToast('Reset comparison parameters', 'info');
  };

  const simple = result.comparisons.find(c => c.frequencyKey === 'simple')!;
  const annual = result.comparisons.find(c => c.frequencyKey === 'annual')!;
  const monthly = result.comparisons.find(c => c.frequencyKey === 'monthly')!;
  const daily = result.comparisons.find(c => c.frequencyKey === 'daily')!;
  const continuous = result.comparisons.find(c => c.frequencyKey === 'continuous')!;

  const filteredMethods = [simple, annual, monthly, daily, continuous].filter(Boolean);

  const copySummaryText = `TVM Multi-Method Comparison:
Principal: ${format(principal)}
Rate: ${annualRate}%
Tenure: ${years} years
-----------------------------
Simple Interest: ${format(simple.finalValue)} (Interest: ${format(simple.totalInterest)})
Annual Compounding: ${format(annual.finalValue)} (Interest: ${format(annual.totalInterest)})
Monthly Compounding: ${format(monthly.finalValue)} (Interest: ${format(monthly.totalInterest)})
Daily Compounding: ${format(daily.finalValue)} (Interest: ${format(daily.totalInterest)})
Continuous Compounding: ${format(continuous.finalValue)} (Interest: ${format(continuous.totalInterest)})
Compounding Advantage: +${format(continuous.finalValue - simple.finalValue)}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Advanced Comparative Analysis</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Compare Compounding Methods Side-by-Side
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Analyze how the exact same principal and interest rate perform under Simple, Annual, Monthly, Daily, and Continuous compounding regimes.
        </p>
      </div>

      {/* Inputs Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Shared Investment Inputs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            id="cmp-pv"
            label="Initial Investment"
            value={principal}
            onChange={setPrincipal}
            prefix={symbol}
            min={100}
            step={5000}
          />
          <InputField
            id="cmp-rate"
            label="Annual Interest Rate"
            value={annualRate}
            onChange={setAnnualRate}
            suffix="%"
            min={0.1}
            max={50}
            step={0.1}
          />
          <InputField
            id="cmp-years"
            label="Time Period (Years)"
            value={years}
            onChange={setYears}
            suffix="years"
            min={0.5}
            max={50}
            step={1}
          />
        </div>
      </div>

      {/* Results Hero */}
      <ResultCard
        title="Comparative Spread"
        primaryLabel="Continuous Compounding Maturity (Max Yield)"
        primaryValue={format(continuous.finalValue)}
        secondaryMetrics={[
          { label: 'Simple Interest Baseline', value: format(simple.finalValue) },
          { label: 'Monthly Compounding', value: format(monthly.finalValue) },
          { label: 'Compounding Surplus', value: format(continuous.finalValue - simple.finalValue), type: 'positive' },
        ]}
        onReset={handleReset}
        copySummaryText={copySummaryText}
        onShowToast={onShowToast}
      />

      {/* Comparison Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Side-by-Side Compounding Matrix
          </h4>
          <span className="text-xs text-slate-400">
            Ranked by terminal wealth
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Compounding Frequency</th>
                <th className="py-3 px-4 text-right">Final Value</th>
                <th className="py-3 px-4 text-right">Interest Earned</th>
                <th className="py-3 px-4 text-right">Effective Yield (EAR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredMethods.map((m, idx) => {
                const isContinuous = m.frequencyKey === 'continuous';
                const isSimple = m.frequencyKey === 'simple';
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isContinuous
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 font-bold'
                        : isSimple
                        ? 'text-slate-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-900 dark:text-white flex items-center gap-1.5">
                      {m.method}
                      {isContinuous && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">
                          Maximum
                        </span>
                      )}
                      {isSimple && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Baseline
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {m.periodsPerYear}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {format(m.finalValue)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                      {format(m.totalInterest)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {m.effectiveRate.toFixed(3)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Chart Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-6">
          <CompoundingBarChart
            data={filteredMethods}
            title="Final Capital Output by Frequency"
          />
        </div>
        <div className="md:col-span-6">
          <GrowthChart
            data={result.timelineData}
            title="Compounding Divergence Over Time"
            subtitle="Trajectory of monthly compounding vs principal"
          />
        </div>
      </div>
    </div>
  );
};
