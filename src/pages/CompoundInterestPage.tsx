import React, { useState, useMemo } from 'react';
import { calculateCompoundInterest } from '../calculators/compoundInterest';
import { useCurrency } from '../context/CurrencyContext';
import { PRESETS } from '../utils/presets';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { FormulaDisplay } from '../components/common/FormulaDisplay';
import { CalculationSteps } from '../components/common/CalculationSteps';
import { PresetSelector } from '../components/common/PresetSelector';
import { CompoundingBarChart } from '../components/charts/CompoundingBarChart';
import { GrowthChart } from '../components/charts/GrowthChart';

interface CompoundInterestPageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const CompoundInterestPage: React.FC<CompoundInterestPageProps> = ({ onShowToast }) => {
  const { symbol, format } = useCurrency();

  const [principal, setPrincipal] = useState<number>(100000);
  const [annualRate, setAnnualRate] = useState<number>(10.0);
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
    setAnnualRate(10.0);
    setYears(10);
    if (onShowToast) onShowToast('Reset compound interest inputs', 'info');
  };

  const continuousResult = result.comparisons.find(c => c.frequencyKey === 'continuous')!;
  const simpleResult = result.comparisons.find(c => c.frequencyKey === 'simple')!;
  const monthlyResult = result.comparisons.find(c => c.frequencyKey === 'monthly')!;

  const copySummaryText = `Compound Interest Comparison:
Principal: ${format(principal)}
Annual Rate: ${annualRate}%
Tenure: ${years} years
-----------------------------
Simple Interest Final: ${format(simpleResult.finalValue)}
Monthly Compounding Final: ${format(monthlyResult.finalValue)}
Continuous Compounding Final: ${format(continuousResult.finalValue)}
Difference (Continuous vs Simple): ${format(continuousResult.finalValue - simpleResult.finalValue)}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Compound Interest & Frequency Comparison
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Compare how accelerating compounding frequencies—from simple interest all the way to continuous compounding—magnify total returns.
        </p>
      </div>

      <PresetSelector
        presets={PRESETS.compoundInterest}
        onSelect={preset => {
          setPrincipal(preset.values.principal);
          setAnnualRate(preset.values.annualRate);
          setYears(preset.values.years);
          if (onShowToast) onShowToast(`Loaded ${preset.name}`, 'info');
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Compounding Parameters
            </h3>

            <InputField
              id="ci-principal"
              label="Starting Principal"
              value={principal}
              onChange={setPrincipal}
              prefix={symbol}
              min={0}
              step={5000}
              tooltip="Original initial capital deposited or invested."
            />

            <InputField
              id="ci-rate"
              label="Annual Nominal Rate (r)"
              value={annualRate}
              onChange={setAnnualRate}
              suffix="%"
              min={0}
              max={100}
              step={0.1}
              tooltip="Nominal interest rate before compounding adjustments."
            />

            <InputField
              id="ci-years"
              label="Time Horizon (Years)"
              value={years}
              onChange={setYears}
              suffix="years"
              min={0.1}
              max={60}
              step={1}
              tooltip="Duration of compounding."
            />
          </div>

          <FormulaDisplay
            formula="FV = PV × (1 + r/m)^(m×t)   |   FV_cont = PV × e^(r×t)"
            description="As compounding frequency m increases towards infinity, the growth reaches Euler's constant e^(rt), representing the theoretical maximum compounding."
            variables={[
              { symbol: 'm', meaning: 'Compounding periods per year' },
              { symbol: 'e', meaning: 'Euler’s mathematical constant (≈ 2.71828)' },
              { symbol: 't', meaning: 'Time in years' },
            ]}
          />
        </div>

        {/* Right Results */}
        <div className="lg:col-span-7 space-y-6">
          <ResultCard
            title="Continuous Compounding Peak"
            primaryLabel="Max Potential Final Value (Continuous)"
            primaryValue={format(continuousResult.finalValue)}
            secondaryMetrics={[
              { label: 'Simple Interest Value', value: format(simpleResult.finalValue) },
              { label: 'Compounding Bonus (vs Simple)', value: format(continuousResult.finalValue - simpleResult.finalValue), type: 'positive' },
              { label: 'Monthly Compounding', value: format(monthlyResult.finalValue), type: 'accent' },
            ]}
            onReset={handleReset}
            copySummaryText={copySummaryText}
            onShowToast={onShowToast}
          />

          {/* Comparison Bar Chart */}
          <CompoundingBarChart
            data={result.comparisons}
            title="Final Value by Compounding Frequency"
          />

          {/* Growth Curve Chart */}
          <GrowthChart
            data={result.timelineData}
            title="Portfolio Trajectory (Monthly Compounding)"
            subtitle="Evolution of balance and principal over the investment period"
          />

          {/* Comparison Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Method-by-Method Breakdown
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Method / Frequency</th>
                    <th className="py-3 px-4">Periods/Yr</th>
                    <th className="py-3 px-4">Final Value</th>
                    <th className="py-3 px-4">Interest Earned</th>
                    <th className="py-3 px-4">Effective Rate (EAR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {result.comparisons.map((c, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                        {c.method}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                        {c.periodsPerYear}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {format(c.finalValue)}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {format(c.totalInterest)}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                        {c.effectiveRate.toFixed(3)}%
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
