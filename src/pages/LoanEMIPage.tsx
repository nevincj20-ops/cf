import React, { useState, useMemo } from 'react';
import { calculateEMI } from '../calculators/emi';
import { useCurrency } from '../context/CurrencyContext';
import { PRESETS } from '../utils/presets';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { FormulaDisplay } from '../components/common/FormulaDisplay';
import { CalculationSteps } from '../components/common/CalculationSteps';
import { PresetSelector } from '../components/common/PresetSelector';
import { AmortizationChart } from '../components/charts/AmortizationChart';
import { BreakdownPie } from '../components/charts/BreakdownPie';
import { AmortizationTable } from '../components/tables/AmortizationTable';

interface LoanEMIPageProps {
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const LoanEMIPage: React.FC<LoanEMIPageProps> = ({ onShowToast }) => {
  const { symbol, format } = useCurrency();

  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [years, setYears] = useState<number>(20);

  const result = useMemo(() => {
    return calculateEMI({
      loanAmount,
      annualRate,
      years,
      frequency: 12,
    });
  }, [loanAmount, annualRate, years]);

  const handleReset = () => {
    setLoanAmount(5000000);
    setAnnualRate(8.5);
    setYears(20);
    if (onShowToast) onShowToast('Reset loan parameters to defaults', 'info');
  };

  const copySummaryText = `Loan EMI Calculation:
Loan Principal: ${format(loanAmount)}
Interest Rate: ${annualRate}%
Tenure: ${years} years (${years * 12} installments)
-----------------------------
Monthly EMI: ${format(result.emi)}
Total Amount Payable: ${format(result.totalAmountPaid)}
Total Interest Cost: ${format(result.totalInterest)}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Loan & EMI Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Calculate equated monthly installments (EMI), analyze principal vs interest amortization, and review year-by-year loan paydown.
        </p>
      </div>

      <PresetSelector
        presets={PRESETS.loanEMI}
        onSelect={preset => {
          setLoanAmount(preset.values.loanAmount);
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
              Loan Inputs
            </h3>

            <InputField
              id="loan-amount"
              label="Loan Amount (Principal)"
              value={loanAmount}
              onChange={setLoanAmount}
              prefix={symbol}
              min={1000}
              step={50000}
              tooltip="The total borrowing or mortgage amount requested."
            />

            <InputField
              id="loan-rate"
              label="Annual Interest Rate"
              value={annualRate}
              onChange={setAnnualRate}
              suffix="%"
              min={0.1}
              max={40}
              step={0.1}
              tooltip="Fixed or floating interest rate per year charged by the lender."
            />

            <InputField
              id="loan-tenure"
              label="Loan Tenure (Years)"
              value={years}
              onChange={setYears}
              suffix="years"
              min={0.5}
              max={40}
              step={1}
              tooltip="Total duration of the loan in years."
            />
          </div>

          <FormulaDisplay
            formula={result.formulaUsed}
            description="The reducing balance formula determines the equal monthly payment required to amortize both principal and compounded interest down to exactly zero at the end of tenure."
            variables={[
              { symbol: 'P', meaning: 'Loan Principal amount' },
              { symbol: 'r', meaning: 'Monthly interest rate (Annual rate / 12)' },
              { symbol: 'n', meaning: 'Total number of months (Tenure in years × 12)' },
            ]}
          />
        </div>

        {/* Right Results & Visuals */}
        <div className="lg:col-span-7 space-y-6">
          <ResultCard
            title="Monthly EMI Summary"
            primaryLabel="Monthly Equated Installment (EMI)"
            primaryValue={format(result.emi)}
            secondaryMetrics={[
              { label: 'Total Loan Principal', value: format(result.principal) },
              { label: 'Total Interest Payable', value: format(result.totalInterest), type: 'warning' },
              { label: 'Total Amount Paid', value: format(result.totalAmountPaid), type: 'accent' },
            ]}
            onReset={handleReset}
            copySummaryText={copySummaryText}
            onShowToast={onShowToast}
          />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7">
              <AmortizationChart
                data={result.chartData}
              />
            </div>
            <div className="md:col-span-5">
              <BreakdownPie
                principal={result.principal}
                interest={result.totalInterest}
                principalLabel="Principal Repaid"
                interestLabel="Total Interest Charge"
                title="Principal vs Total Interest"
              />
            </div>
          </div>

          {/* Full Amortization Schedule Table */}
          <AmortizationTable
            schedule={result.schedule}
            yearlySummary={result.yearlySummary}
            onShowToast={onShowToast}
          />

          <CalculationSteps steps={result.steps} />
        </div>
      </div>
    </div>
  );
};
