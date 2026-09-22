import React, { useState, useMemo } from 'react';
import type { CompoundingFrequency } from '../types/tvm';
import { FREQUENCY_LABELS } from '../types/tvm';
import { calculateEAR } from '../calculators/ear';
import { PRESETS } from '../utils/presets';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import { ResultCard } from '../components/common/ResultCard';
import { FormulaDisplay } from '../components/common/FormulaDisplay';
import { CalculationSteps } from '../components/common/CalculationSteps';
import { PresetSelector } from '../components/common/PresetSelector';

interface EffectiveRatePageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const EffectiveRatePage: React.FC<EffectiveRatePageProps> = ({ onShowToast }) => {
  const [nominalRate, setNominalRate] = useState<number>(12.0);
  const [frequency, setFrequency] = useState<CompoundingFrequency>('monthly');

  const result = useMemo(() => {
    return calculateEAR({
      nominalRate,
      frequency,
    });
  }, [nominalRate, frequency]);

  const handleReset = () => {
    setNominalRate(12.0);
    setFrequency('monthly');
    if (onShowToast) onShowToast('Reset EAR inputs to defaults', 'info');
  };

  const frequencyOptions = Object.keys(FREQUENCY_LABELS).map(key => ({
    value: key,
    label: FREQUENCY_LABELS[key as CompoundingFrequency],
  }));

  const copySummaryText = `Effective Annual Rate (EAR) Calculation:
Stated Nominal APR: ${nominalRate}%
Compounding Frequency: ${FREQUENCY_LABELS[frequency]}
-----------------------------
Effective Annual Rate (APY/EAR): ${result.effectiveRate.toFixed(4)}%
Compounding Impact (Difference): +${result.difference.toFixed(4)}%`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Effective Annual Rate (EAR / APY) Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Calculate the true annualized return or borrowing cost when interest is compounded more than once a year.
        </p>
      </div>

      <PresetSelector
        presets={PRESETS.ear}
        onSelect={preset => {
          setNominalRate(preset.values.nominalRate);
          setFrequency(preset.values.frequency);
          if (onShowToast) onShowToast(`Loaded ${preset.name}`, 'info');
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Interest Rate Inputs
            </h3>

            <InputField
              id="ear-nominal"
              label="Stated Nominal Annual Rate (APR)"
              value={nominalRate}
              onChange={setNominalRate}
              suffix="%"
              min={0}
              max={150}
              step={0.25}
              tooltip="The stated quoted annual interest rate before accounting for compounding."
            />

            <SelectField
              id="ear-freq"
              label="Compounding Frequency"
              value={frequency}
              options={frequencyOptions}
              onChange={val => setFrequency(val as CompoundingFrequency)}
            />
          </div>

          <FormulaDisplay
            formula={result.formulaUsed}
            description="The Effective Annual Rate (EAR), also known as Annual Percentage Yield (APY), measures the exact interest earned or paid over a year taking into account periodic compounding."
            variables={[
              { symbol: 'EAR', meaning: 'Effective Annual Rate' },
              { symbol: 'r', meaning: 'Nominal annual rate' },
              { symbol: 'm', meaning: 'Number of compounding periods per year' },
            ]}
          />
        </div>

        {/* Right Results */}
        <div className="lg:col-span-7 space-y-6">
          <ResultCard
            title="Effective Annual Rate"
            primaryLabel="True Annualized Return / Cost (EAR / APY)"
            primaryValue={`${result.effectiveRate.toFixed(4)}%`}
            secondaryMetrics={[
              { label: 'Stated Nominal Rate', value: `${nominalRate}%` },
              {
                label: 'Compounding Boost',
                value: `+${result.difference.toFixed(4)}%`,
                type: 'positive',
                subtext: 'Percentage points higher',
              },
              {
                label: 'Frequency',
                value: frequency.toUpperCase(),
                type: 'accent',
              },
            ]}
            onReset={handleReset}
            copySummaryText={copySummaryText}
            onShowToast={onShowToast}
          />

          {/* All Frequencies Comparison Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Comparison Across All Compounding Frequencies
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Frequency</th>
                    <th className="py-2.5 px-4">Nominal APR</th>
                    <th className="py-2.5 px-4">Effective Rate (EAR)</th>
                    <th className="py-2.5 px-4">Additional Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {result.allFrequencies.map(f => {
                    const isCurrent = f.frequency === frequency;
                    return (
                      <tr
                        key={f.frequency}
                        className={`transition-colors ${
                          isCurrent
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2.5 px-4 text-slate-900 dark:text-white flex items-center gap-1.5">
                          {f.label}
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-semibold">
                              Selected
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">{nominalRate}%</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {f.ear.toFixed(4)}%
                        </td>
                        <td className="py-2.5 px-4 font-mono text-indigo-600 dark:text-indigo-400">
                          +{f.difference.toFixed(4)}%
                        </td>
                      </tr>
                    );
                  })}
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
