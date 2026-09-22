import React, { useState, useMemo } from 'react';
import { calculateRuleOf72 } from '../calculators/ruleOf72';
import { PRESETS } from '../utils/presets';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { FormulaDisplay } from '../components/common/FormulaDisplay';
import { CalculationSteps } from '../components/common/CalculationSteps';
import { PresetSelector } from '../components/common/PresetSelector';
import { Sparkles } from 'lucide-react';

interface RuleOf72PageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const RuleOf72Page: React.FC<RuleOf72PageProps> = ({ onShowToast }) => {
  const [mode, setMode] = useState<'rateToTime' | 'timeToRate'>('rateToTime');
  const [rate, setRate] = useState<number>(8.0);
  const [years, setYears] = useState<number>(9.0);

  const result = useMemo(() => {
    return calculateRuleOf72({
      mode,
      rate,
      years,
    });
  }, [mode, rate, years]);

  const handleReset = () => {
    setMode('rateToTime');
    setRate(8.0);
    setYears(9.0);
    if (onShowToast) onShowToast('Reset Rule of 72 inputs', 'info');
  };

  const copySummaryText = `Rule of 72 Doubling Calculation:
Mode: ${mode === 'rateToTime' ? 'Find Doubling Time' : 'Find Required Rate'}
${mode === 'rateToTime' ? `Interest Rate: ${rate}%\nDoubling Time: ~${result.approxYears.toFixed(2)} years (Exact: ${result.exactYears.toFixed(2)} yrs)` : `Desired Years: ${years} years\nRequired Rate: ~${result.approxRate.toFixed(2)}% (Exact: ${result.exactRate.toFixed(2)}%)`}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Rule of 72 Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          A famous mental math rule of thumb to estimate doubling time or the interest rate needed to double an investment.
        </p>
      </div>

      <PresetSelector
        presets={PRESETS.ruleOf72}
        onSelect={preset => {
          setMode(preset.values.mode);
          setRate(preset.values.rate);
          setYears(preset.values.years);
          if (onShowToast) onShowToast(`Loaded ${preset.name}`, 'info');
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Calculation Direction
            </h3>

            {/* Mode Selector */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setMode('rateToTime')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                  mode === 'rateToTime'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Find Doubling Time
              </button>
              <button
                type="button"
                onClick={() => setMode('timeToRate')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                  mode === 'timeToRate'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Find Required Rate
              </button>
            </div>

            {mode === 'rateToTime' ? (
              <InputField
                id="rule-rate"
                label="Annual Interest / Growth Rate"
                value={rate}
                onChange={setRate}
                suffix="%"
                min={0.1}
                max={100}
                step={0.5}
                tooltip="Expected rate of return on investment."
              />
            ) : (
              <InputField
                id="rule-years"
                label="Desired Doubling Time (Years)"
                value={years}
                onChange={setYears}
                suffix="years"
                min={0.2}
                max={60}
                step={0.5}
                tooltip="The target number of years you want your money to double in."
              />
            )}
          </div>

          <FormulaDisplay
            formula={
              mode === 'rateToTime'
                ? 'Doubling Time ≈ 72 / Interest Rate(%)   |   Exact = ln(2) / ln(1 + r)'
                : 'Required Rate ≈ 72 / Desired Years   |   Exact = (2^(1/t) - 1) × 100%'
            }
            description="The Rule of 72 works remarkably well for rates between 5% and 15%. For extremely high rates, the logarithmic exact formula provides precision."
            variables={[
              { symbol: '72', meaning: 'Rule constant (derived from ln(2) ≈ 0.693 scaled up for compounding)' },
              { symbol: 'r', meaning: 'Interest rate' },
              { symbol: 't', meaning: 'Time in years' },
            ]}
          />
        </div>

        {/* Right Results */}
        <div className="lg:col-span-7 space-y-6">
          {mode === 'rateToTime' ? (
            <ResultCard
              title="Doubling Time Estimate"
              primaryLabel="Estimated Doubling Time (Rule of 72)"
              primaryValue={`~${result.approxYears.toFixed(2)} Years`}
              secondaryMetrics={[
                { label: 'Exact Logarithmic Time', value: `${result.exactYears.toFixed(2)} yrs`, type: 'accent' },
                { label: 'Variance from Exact', value: `${result.difference.toFixed(2)} yrs`, type: 'neutral' },
                { label: 'Given Return Rate', value: `${rate}%`, type: 'positive' },
              ]}
              onReset={handleReset}
              copySummaryText={copySummaryText}
              onShowToast={onShowToast}
            />
          ) : (
            <ResultCard
              title="Required Return Rate"
              primaryLabel="Estimated Required Annual Return (Rule of 72)"
              primaryValue={`~${result.approxRate.toFixed(2)}%`}
              secondaryMetrics={[
                { label: 'Exact Required Rate', value: `${result.exactRate.toFixed(2)}%`, type: 'accent' },
                { label: 'Variance from Exact', value: `${result.difference.toFixed(2)}%`, type: 'neutral' },
                { label: 'Desired Horizon', value: `${years} yrs`, type: 'positive' },
              ]}
              onReset={handleReset}
              copySummaryText={copySummaryText}
              onShowToast={onShowToast}
            />
          )}

          {/* Educational Comparison Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Why does the number 72 work?</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mathematically, to double a quantity with continuous compounding requires <em>e^(rt) = 2</em>, so <em>rt = ln(2) ≈ 0.693</em> (69.3%).
              With discrete annual compounding, the effective number rises slightly to ~70–72. <strong>72</strong> is chosen in finance because it is conveniently divisible by 2, 3, 4, 6, 8, 9, 12, 18, and 24!
            </p>
          </div>

          <CalculationSteps steps={result.steps} />
        </div>
      </div>
    </div>
  );
};
