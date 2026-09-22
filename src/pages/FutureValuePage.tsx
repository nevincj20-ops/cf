import React, { useState, useMemo } from 'react';
import type { CompoundingFrequency } from '../types/tvm';
import { FREQUENCY_LABELS } from '../types/tvm';
import { calculateFutureValue } from '../calculators/futureValue';
import { useCurrency } from '../context/CurrencyContext';
import { PRESETS } from '../utils/presets';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import { ResultCard } from '../components/common/ResultCard';
import { FormulaDisplay } from '../components/common/FormulaDisplay';
import { CalculationSteps } from '../components/common/CalculationSteps';
import { TimelineVisualizer } from '../components/common/TimelineVisualizer';
import { PresetSelector } from '../components/common/PresetSelector';
import { GrowthChart } from '../components/charts/GrowthChart';
import { BreakdownPie } from '../components/charts/BreakdownPie';

interface FutureValuePageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const FutureValuePage: React.FC<FutureValuePageProps> = ({ onShowToast }) => {
  const { symbol, format } = useCurrency();

  const [pv, setPv] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8.0);
  const [years, setYears] = useState<number>(5);
  const [frequency, setFrequency] = useState<CompoundingFrequency>('annual');

  const result = useMemo(() => {
    return calculateFutureValue({
      presentValue: pv,
      annualRate: rate,
      years,
      frequency,
    });
  }, [pv, rate, years, frequency]);

  const handleReset = () => {
    setPv(100000);
    setRate(8.0);
    setYears(5);
    setFrequency('annual');
    if (onShowToast) onShowToast('Reset inputs to standard defaults', 'info');
  };

  const frequencyOptions = Object.keys(FREQUENCY_LABELS).map(key => ({
    value: key,
    label: FREQUENCY_LABELS[key as CompoundingFrequency],
  }));

  const copySummaryText = `Future Value Calculation:
Present Value: ${format(pv)}
Annual Interest Rate: ${rate}%
Years: ${years}
Compounding Frequency: ${FREQUENCY_LABELS[frequency]}
-----------------------------
Future Value: ${format(result.futureValue)}
Total Interest Earned: ${format(result.totalInterest)}
Effective Growth: ${result.effectiveGrowthRate.toFixed(2)}%`;

  const timelineMilestones = [
    { period: 0, label: 'Today (PV)', amount: pv, isStart: true },
    ...result.chartData.slice(1, -1).filter((_, i, arr) => i === 0 || i === Math.floor(arr.length / 2)).map(d => ({
      period: d.period,
      label: d.label,
      amount: d.balance,
    })),
    { period: years, label: 'Future (FV)', amount: result.futureValue, isEnd: true },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Future Value (FV) Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Calculate the compounded future worth of an investment lump sum over time.
        </p>
      </div>

      {/* Preset Scenarios */}
      <PresetSelector
        presets={PRESETS.futureValue}
        onSelect={preset => {
          setPv(preset.values.presentValue);
          setRate(preset.values.annualRate);
          setYears(preset.values.years);
          setFrequency(preset.values.frequency);
          if (onShowToast) onShowToast(`Loaded ${preset.name}`, 'info');
        }}
      />

      {/* Main Two-Column Layout: Inputs on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Investment Parameters
            </h3>

            <InputField
              id="fv-pv"
              label="Present Value (Initial Lump Sum)"
              value={pv}
              onChange={setPv}
              prefix={symbol}
              min={0}
              step={1000}
              tooltip="The starting capital or lump sum invested today at time zero."
            />

            <InputField
              id="fv-rate"
              label="Annual Interest Rate (r)"
              value={rate}
              onChange={setRate}
              suffix="%"
              min={0}
              max={100}
              step={0.1}
              tooltip="Nominal annual interest rate (e.g., 8 for 8% per annum)."
            />

            <InputField
              id="fv-years"
              label="Time Horizon (Years)"
              value={years}
              onChange={setYears}
              suffix="years"
              min={0.1}
              max={100}
              step={1}
              tooltip="Number of years the principal remains invested."
            />

            <SelectField
              id="fv-frequency"
              label="Compounding Frequency"
              value={frequency}
              options={frequencyOptions}
              onChange={val => setFrequency(val as CompoundingFrequency)}
            />
          </div>

          {/* Formula Display Card */}
          <FormulaDisplay
            formula={result.formulaUsed}
            variables={[
              { symbol: 'PV', meaning: 'Present Value (initial amount)' },
              { symbol: 'r', meaning: 'Annual interest rate' },
              { symbol: 'n', meaning: 'Number of years' },
              { symbol: 'm', meaning: 'Compounding periods per year' },
            ]}
          />
        </div>

        {/* Right: Results, Charts & Visualizations */}
        <div className="lg:col-span-7 space-y-6">
          <ResultCard
            title="Future Value Summary"
            primaryLabel="Future Value (Maturity Amount)"
            primaryValue={format(result.futureValue)}
            secondaryMetrics={[
              { label: 'Original Investment', value: format(result.originalInvestment) },
              { label: 'Total Interest Earned', value: format(result.totalInterest), type: 'positive' },
              { label: 'Effective Growth', value: `${result.effectiveGrowthRate.toFixed(2)}%`, type: 'accent' },
            ]}
            onReset={handleReset}
            copySummaryText={copySummaryText}
            onShowToast={onShowToast}
          />

          {/* Timeline Visualizer */}
          <TimelineVisualizer
            milestones={timelineMilestones}
            title="Growth Milestones Timeline"
          />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7">
              <GrowthChart
                data={result.chartData}
                title="Portfolio Growth Trajectory"
                subtitle="Principal vs Compounded Interest over time"
              />
            </div>
            <div className="md:col-span-5">
              <BreakdownPie
                principal={result.originalInvestment}
                interest={result.totalInterest}
                principalLabel="Original Principal"
                interestLabel="Total Interest"
              />
            </div>
          </div>

          {/* Dynamic Step-by-Step Breakdown */}
          <CalculationSteps steps={result.steps} />
        </div>
      </div>
    </div>
  );
};
