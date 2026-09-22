import React, { useState, useMemo } from 'react';
import type { AnnuityTiming } from '../types/tvm';
import { calculateAnnuity } from '../calculators/annuity';
import { useCurrency } from '../context/CurrencyContext';
import { PRESETS } from '../utils/presets';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import { ResultCard } from '../components/common/ResultCard';
import { FormulaDisplay } from '../components/common/FormulaDisplay';
import { CalculationSteps } from '../components/common/CalculationSteps';
import { PresetSelector } from '../components/common/PresetSelector';
import { GrowthChart } from '../components/charts/GrowthChart';
import { BreakdownPie } from '../components/charts/BreakdownPie';

interface AnnuitiesPageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const AnnuitiesPage: React.FC<AnnuitiesPageProps> = ({ onShowToast }) => {
  const { symbol, format } = useCurrency();

  const [payment, setPayment] = useState<number>(10000);
  const [annualRate, setAnnualRate] = useState<number>(12.0);
  const [years, setYears] = useState<number>(15);
  const [paymentFrequency, setPaymentFrequency] = useState<number>(12); // monthly
  const [timing, setTiming] = useState<AnnuityTiming>('ordinary');
  const [activeView, setActiveView] = useState<'fv' | 'pv'>('fv');

  const result = useMemo(() => {
    return calculateAnnuity({
      payment,
      annualRate,
      years,
      paymentFrequency,
      timing,
    });
  }, [payment, annualRate, years, paymentFrequency, timing]);

  const handleReset = () => {
    setPayment(10000);
    setAnnualRate(12.0);
    setYears(15);
    setPaymentFrequency(12);
    setTiming('ordinary');
    if (onShowToast) onShowToast('Reset annuity inputs to defaults', 'info');
  };

  const frequencyOptions = [
    { value: 12, label: 'Monthly (12 payments/year)' },
    { value: 4, label: 'Quarterly (4 payments/year)' },
    { value: 2, label: 'Semi-Annually (2 payments/year)' },
    { value: 1, label: 'Annually (1 payment/year)' },
  ];

  const timingOptions = [
    { value: 'ordinary', label: 'Ordinary Annuity (End of period, standard investments/SIPs)' },
    { value: 'due', label: 'Annuity Due (Beginning of period, leases/rents/tuition)' },
  ];

  const copySummaryText = `Annuity Calculation:
Payment (PMT): ${format(payment)} (${paymentFrequency === 12 ? 'Monthly' : 'Periodic'})
Annual Rate: ${annualRate}%
Tenure: ${years} years
Timing: ${timing === 'due' ? 'Annuity Due (Beginning)' : 'Ordinary Annuity (End)'}
-----------------------------
Future Value (Accumulated): ${format(result.futureValue)}
Present Value (Lump Sum Needed Today): ${format(result.presentValue)}
Total Principal Contributions: ${format(result.totalPayments)}
FV Wealth Created (Interest): ${format(result.fvInterestEarned)}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Annuity Calculator (FV & PV)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Calculate the accumulated Future Value or discounted Present Value of a recurring series of equal payments.
        </p>
      </div>

      <PresetSelector
        presets={PRESETS.annuities}
        onSelect={preset => {
          setPayment(preset.values.payment);
          setAnnualRate(preset.values.annualRate);
          setYears(preset.values.years);
          setPaymentFrequency(preset.values.paymentFrequency);
          setTiming(preset.values.timing);
          if (onShowToast) onShowToast(`Loaded ${preset.name}`, 'info');
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Annuity Parameters
            </h3>

            <InputField
              id="annuity-pmt"
              label="Periodic Payment (PMT)"
              value={payment}
              onChange={setPayment}
              prefix={symbol}
              min={0}
              step={500}
              tooltip="The regular, equal amount paid or received at each interval."
            />

            <InputField
              id="annuity-rate"
              label="Annual Interest / Expected Return Rate"
              value={annualRate}
              onChange={setAnnualRate}
              suffix="%"
              min={0}
              max={100}
              step={0.1}
              tooltip="Annual interest rate earned on contributions."
            />

            <InputField
              id="annuity-years"
              label="Duration (Years)"
              value={years}
              onChange={setYears}
              suffix="years"
              min={0.1}
              max={100}
              step={1}
              tooltip="Total number of years the recurring payments continue."
            />

            <SelectField
              id="annuity-frequency"
              label="Payment Frequency"
              value={paymentFrequency}
              options={frequencyOptions}
              onChange={val => setPaymentFrequency(Number(val))}
            />

            <SelectField
              id="annuity-timing"
              label="Payment Timing"
              value={timing}
              options={timingOptions}
              onChange={val => setTiming(val as AnnuityTiming)}
            />
          </div>

          <FormulaDisplay
            formula={activeView === 'fv' ? result.fvFormula : result.pvFormula}
            title={activeView === 'fv' ? 'Future Value of Annuity Formula' : 'Present Value of Annuity Formula'}
            description={
              timing === 'due'
                ? 'Because payments happen in advance (at period start), every payment earns one extra compounding cycle: FV_due = FV_ord × (1+r).'
                : 'Ordinary annuity payments occur at the end of each period.'
            }
            variables={[
              { symbol: 'PMT', meaning: 'Periodic payment' },
              { symbol: 'r', meaning: 'Periodic interest rate (annual rate / m)' },
              { symbol: 'n', meaning: 'Total number of payment periods (years × m)' },
            ]}
          />
        </div>

        {/* Right Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* View Mode Toggle: Future Value vs Present Value focus */}
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveView('fv')}
              className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                activeView === 'fv'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Focus: Future Value (Accumulation / Wealth)
            </button>
            <button
              onClick={() => setActiveView('pv')}
              className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                activeView === 'pv'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Focus: Present Value (Lump Sum Equivalent Today)
            </button>
          </div>

          {activeView === 'fv' ? (
            <ResultCard
              title={`Future Value of Annuity (${timing === 'due' ? 'Annuity Due' : 'Ordinary Annuity'})`}
              primaryLabel="Total Accumulated Future Wealth"
              primaryValue={format(result.futureValue)}
              secondaryMetrics={[
                { label: 'Total Contributions', value: format(result.totalPayments) },
                { label: 'Interest / Returns Earned', value: format(result.fvInterestEarned), type: 'positive' },
                { label: 'Lump Sum Equivalent (PV)', value: format(result.presentValue), type: 'accent' },
              ]}
              onReset={handleReset}
              copySummaryText={copySummaryText}
              onShowToast={onShowToast}
            />
          ) : (
            <ResultCard
              title={`Present Value of Annuity (${timing === 'due' ? 'Annuity Due' : 'Ordinary Annuity'})`}
              primaryLabel="Present Value Needed Today"
              primaryValue={format(result.presentValue)}
              secondaryMetrics={[
                { label: 'Total Nominal Payments', value: format(result.totalPayments) },
                { label: 'Discount Interest Saved', value: format(result.pvInterestComponent), type: 'accent' },
                { label: 'Future Value Equivalent', value: format(result.futureValue), type: 'positive' },
              ]}
              onReset={handleReset}
              copySummaryText={copySummaryText}
              onShowToast={onShowToast}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7">
              <GrowthChart
                data={result.chartData}
                title="SIP & Annuity Wealth Trajectory"
                subtitle="Cumulative payments vs compounding growth"
              />
            </div>
            <div className="md:col-span-5">
              <BreakdownPie
                principal={result.totalPayments}
                interest={result.fvInterestEarned}
                principalLabel="Contributions"
                interestLabel="Compound Returns"
                title="Contributions vs Returns"
              />
            </div>
          </div>

          <CalculationSteps
            steps={activeView === 'fv' ? result.stepsFV : result.stepsPV}
            title={activeView === 'fv' ? 'How was Future Value calculated?' : 'How was Present Value calculated?'}
          />
        </div>
      </div>
    </div>
  );
};
