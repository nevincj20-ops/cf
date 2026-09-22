import React, { useState, useMemo } from 'react';
import type { CompoundingFrequency } from '../types/tvm';
import { FREQUENCY_LABELS } from '../types/tvm';
import { calculatePresentValue } from '../calculators/presentValue';
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

interface PresentValuePageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const PresentValuePage: React.FC<PresentValuePageProps> = ({ onShowToast }) => {
  const { symbol, format } = useCurrency();

  const [fv, setFv] = useState<number>(133100);
  const [discountRate, setDiscountRate] = useState<number>(10.0);
  const [years, setYears] = useState<number>(3);
  const [frequency, setFrequency] = useState<CompoundingFrequency>('annual');

  const result = useMemo(() => {
    return calculatePresentValue({
      futureValue: fv,
      discountRate,
      years,
      frequency,
    });
  }, [fv, discountRate, years, frequency]);

  const handleReset = () => {
    setFv(133100);
    setDiscountRate(10.0);
    setYears(3);
    setFrequency('annual');
    if (onShowToast) onShowToast('Reset inputs to textbook defaults', 'info');
  };

  const frequencyOptions = Object.keys(FREQUENCY_LABELS).map(key => ({
    value: key,
    label: FREQUENCY_LABELS[key as CompoundingFrequency],
  }));

  const copySummaryText = `Present Value Calculation:
Future Target (FV): ${format(fv)}
Discount Rate: ${discountRate}%
Years: ${years}
Compounding Frequency: ${FREQUENCY_LABELS[frequency]}
-----------------------------
Present Value (Worth Today): ${format(result.presentValue)}
Discount Amount: ${format(result.discountAmount)}`;

  const timelineMilestones = [
    { period: 0, label: 'Today (PV)', amount: result.presentValue, isStart: true },
    { period: years, label: `Future (FV - Yr ${years})`, amount: fv, isEnd: true },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Present Value (PV) / Discounting Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          "Discounting converts future cash flows into their equivalent value today."
        </p>
      </div>

      {/* Presets */}
      <PresetSelector
        presets={PRESETS.presentValue}
        onSelect={preset => {
          setFv(preset.values.futureValue);
          setDiscountRate(preset.values.discountRate);
          setYears(preset.values.years);
          setFrequency(preset.values.frequency);
          if (onShowToast) onShowToast(`Loaded ${preset.name}`, 'info');
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Discounting Parameters
            </h3>

            <InputField
              id="pv-fv"
              label="Future Amount Desired / Promised (FV)"
              value={fv}
              onChange={setFv}
              prefix={symbol}
              min={0}
              step={1000}
              tooltip="The target amount of money to be received or required in the future."
            />

            <InputField
              id="pv-rate"
              label="Annual Discount Rate (r)"
              value={discountRate}
              onChange={setDiscountRate}
              suffix="%"
              min={0}
              max={100}
              step={0.1}
              tooltip="The expected opportunity rate, inflation hurdle rate, or cost of capital."
            />

            <InputField
              id="pv-years"
              label="Time Horizon (Years)"
              value={years}
              onChange={setYears}
              suffix="years"
              min={0.1}
              max={100}
              step={1}
              tooltip="The number of years until the future sum is received."
            />

            <SelectField
              id="pv-frequency"
              label="Compounding / Discounting Frequency"
              value={frequency}
              options={frequencyOptions}
              onChange={val => setFrequency(val as CompoundingFrequency)}
            />
          </div>

          <FormulaDisplay
            formula={result.formulaUsed}
            description="Present value represents how much money you need to invest today at rate r to accumulate the desired future value."
            variables={[
              { symbol: 'PV', meaning: 'Present Value (value today)' },
              { symbol: 'FV', meaning: 'Future Value' },
              { symbol: 'r', meaning: 'Discount rate per period' },
              { symbol: 'n', meaning: 'Number of periods' },
            ]}
          />
        </div>

        {/* Right Results & Visuals */}
        <div className="lg:col-span-7 space-y-6">
          <ResultCard
            title="Present Value Valuation"
            primaryLabel="Required Investment Today (PV)"
            primaryValue={format(result.presentValue)}
            secondaryMetrics={[
              { label: 'Future Value', value: format(result.futureAmount) },
              { label: 'Discount Amount (Time Value)', value: format(result.discountAmount), type: 'accent' },
              { label: 'Discount Rate Applied', value: `${discountRate}%`, type: 'neutral' },
            ]}
            onReset={handleReset}
            copySummaryText={copySummaryText}
            onShowToast={onShowToast}
          />

          <TimelineVisualizer
            milestones={timelineMilestones}
            title="Discounting Timeline"
            description="Discounting reverses the effect of compounding over time."
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7">
              <GrowthChart
                data={result.chartData}
                title="Present Value to Future Value Progression"
                subtitle="How the present investment compounds towards the target amount"
              />
            </div>
            <div className="md:col-span-5">
              <BreakdownPie
                principal={result.presentValue}
                interest={result.discountAmount}
                principalLabel="Present Value"
                interestLabel="Discount (Growth Gap)"
              />
            </div>
          </div>

          <CalculationSteps steps={result.steps} />
        </div>
      </div>
    </div>
  );
};
