import React, { useState, useMemo } from 'react';
import { calculatePerpetuity } from '../calculators/perpetuity';
import { useCurrency } from '../context/CurrencyContext';
import { PRESETS } from '../utils/presets';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { FormulaDisplay } from '../components/common/FormulaDisplay';
import { CalculationSteps } from '../components/common/CalculationSteps';
import { PresetSelector } from '../components/common/PresetSelector';
import { AlertTriangle, Infinity as InfinityIcon } from 'lucide-react';

interface PerpetuityPageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const PerpetuityPage: React.FC<PerpetuityPageProps> = ({ onShowToast }) => {
  const { symbol, format } = useCurrency();

  const [cashFlow, setCashFlow] = useState<number>(200000);
  const [discountRate, setDiscountRate] = useState<number>(6.0);
  const [isGrowing, setIsGrowing] = useState<boolean>(false);
  const [growthRate, setGrowthRate] = useState<number>(2.0);

  const result = useMemo(() => {
    return calculatePerpetuity({
      cashFlow,
      discountRate,
      growthRate,
      isGrowing,
    });
  }, [cashFlow, discountRate, growthRate, isGrowing]);

  const handleReset = () => {
    setCashFlow(200000);
    setDiscountRate(6.0);
    setIsGrowing(false);
    setGrowthRate(2.0);
    if (onShowToast) onShowToast('Reset perpetuity inputs', 'info');
  };

  const copySummaryText = `Perpetuity Valuation:
Type: ${isGrowing ? 'Growing Perpetuity' : 'Constant Perpetuity'}
Annual Cash Flow: ${format(cashFlow)}
Discount Rate: ${discountRate}%
${isGrowing ? `Growth Rate (g): ${growthRate}%\n` : ''}-----------------------------
Present Value: ${result.isValid ? format(result.presentValue) : 'Invalid (r <= g)'}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Perpetuity & Growing Perpetuity Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Calculate the present value of an infinite stream of periodic cash flows (e.g. university endowments, preferred stock dividends).
        </p>
      </div>

      <PresetSelector
        presets={PRESETS.perpetuity}
        onSelect={preset => {
          setCashFlow(preset.values.cashFlow);
          setDiscountRate(preset.values.discountRate);
          setIsGrowing(preset.values.isGrowing);
          if (preset.values.growthRate !== undefined) setGrowthRate(preset.values.growthRate);
          if (onShowToast) onShowToast(`Loaded ${preset.name}`, 'info');
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Perpetuity Type & Stream
            </h3>

            {/* Toggle standard vs growing */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsGrowing(false)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                  !isGrowing
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Constant Perpetuity
              </button>
              <button
                type="button"
                onClick={() => setIsGrowing(true)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                  isGrowing
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Growing Perpetuity
              </button>
            </div>

            <InputField
              id="perp-cf"
              label={isGrowing ? 'Next Period Cash Flow (C1)' : 'Periodic Annual Payment (PMT)'}
              value={cashFlow}
              onChange={setCashFlow}
              prefix={symbol}
              min={0}
              step={5000}
              tooltip="The infinite recurring cash flow amount received every year."
            />

            <InputField
              id="perp-r"
              label="Discount / Capitalization Rate (r)"
              value={discountRate}
              onChange={setDiscountRate}
              suffix="%"
              min={0.01}
              max={100}
              step={0.1}
              tooltip="The required rate of return or discount rate."
            />

            {isGrowing && (
              <InputField
                id="perp-g"
                label="Constant Annual Growth Rate (g)"
                value={growthRate}
                onChange={setGrowthRate}
                suffix="%"
                min={0}
                max={50}
                step={0.1}
                error={discountRate <= growthRate ? 'Growth rate (g) must be strictly less than discount rate (r).' : null}
                tooltip="The steady continuous annual percentage rate at which payouts grow indefinitely."
              />
            )}
          </div>

          <FormulaDisplay
            formula={result.formulaUsed}
            description={
              isGrowing
                ? 'The Gordon Growth Model. Because payments grow forever at rate g, the required rate r must be strictly higher than g for the infinite geometric series to converge to a finite number.'
                : 'A constant perpetuity values an infinite stream of identical payments. Each year, the capital PV generates exactly PMT in interest.'
            }
            variables={
              isGrowing
                ? [
                    { symbol: 'PV', meaning: 'Present Value of infinite growing stream' },
                    { symbol: 'C1', meaning: 'Next year initial cash flow' },
                    { symbol: 'r', meaning: 'Discount rate' },
                    { symbol: 'g', meaning: 'Constant perpetual growth rate' },
                  ]
                : [
                    { symbol: 'PV', meaning: 'Present Value of perpetuity' },
                    { symbol: 'PMT', meaning: 'Annual recurring payment' },
                    { symbol: 'r', meaning: 'Annual discount rate' },
                  ]
            }
          />
        </div>

        {/* Right Results */}
        <div className="lg:col-span-7 space-y-6">
          {!result.isValid ? (
            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Convergence Condition Violated</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                {result.errorMessage}
              </p>
              <div className="text-xs p-3 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 font-mono">
                Constraint: Discount Rate (r = {discountRate}%) &gt; Growth Rate (g = {growthRate}%)
              </div>
            </div>
          ) : (
            <ResultCard
              title={isGrowing ? 'Growing Perpetuity Valuation' : 'Perpetuity Valuation'}
              primaryLabel="Required Endowment / Present Value"
              primaryValue={format(result.presentValue)}
              secondaryMetrics={[
                { label: 'Annual Cash Flow', value: format(result.cashFlow) },
                { label: 'Discount Rate', value: `${discountRate}%` },
                {
                  label: isGrowing ? 'Growth Rate' : 'Duration',
                  value: isGrowing ? `${growthRate}%` : '∞ Forever',
                  type: 'accent',
                },
              ]}
              onReset={handleReset}
              copySummaryText={copySummaryText}
              onShowToast={onShowToast}
            />
          )}

          {/* Educational Concept Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
              <InfinityIcon className="w-4 h-4 text-emerald-500" />
              <span>How Perpetuity Works In Real Life</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If an endowment fund holds <strong>{result.isValid ? format(result.presentValue) : format(cashFlow / 0.06)}</strong> invested at{' '}
              <strong>{discountRate}%</strong>, it earns exactly <strong>{format(cashFlow)}</strong> every single year in interest without ever touching the underlying principal.
              The principal stays intact forever!
            </p>
          </div>

          <CalculationSteps steps={result.steps} />
        </div>
      </div>
    </div>
  );
};
