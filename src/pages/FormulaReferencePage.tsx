import React, { useState } from 'react';
import { Search, Copy, Check, ExternalLink, BookOpen } from 'lucide-react';
import type { NavTabId } from '../types/tvm';
import { copyToClipboard } from '../utils/export';

interface FormulaEntry {
  id: string;
  category: string;
  name: string;
  formula: string;
  variables: { symbol: string; meaning: string }[];
  explanation: string;
  example: string;
  calculatorId?: NavTabId;
}

interface FormulaReferencePageProps {
  onNavigate: (tab: NavTabId) => void;
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const FormulaReferencePage: React.FC<FormulaReferencePageProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const formulas: FormulaEntry[] = [
    {
      id: 'fv-lump',
      category: 'Lump Sum',
      name: 'Future Value (Periodic Compounding)',
      formula: 'FV = PV × (1 + r/m)^(n × m)',
      variables: [
        { symbol: 'PV', meaning: 'Present Value (Initial Investment)' },
        { symbol: 'r', meaning: 'Annual Nominal Interest Rate' },
        { symbol: 'm', meaning: 'Compounding frequency per year' },
        { symbol: 'n', meaning: 'Time horizon in years' },
      ],
      explanation: 'Measures how much a single lump-sum sum invested today will grow after compounding interest over n years.',
      example: '₹10,000 at 8% compounded monthly for 5 years = ₹14,898.46',
      calculatorId: 'future-value',
    },
    {
      id: 'pv-lump',
      category: 'Lump Sum',
      name: 'Present Value (Discounting)',
      formula: 'PV = FV / (1 + r/m)^(n × m)',
      variables: [
        { symbol: 'FV', meaning: 'Future amount promised or desired' },
        { symbol: 'r', meaning: 'Annual discount rate' },
        { symbol: 'm', meaning: 'Compounding frequency per year' },
        { symbol: 'n', meaning: 'Years until maturity' },
      ],
      explanation: 'Discounts a future expected cash amount to its present purchasing power today.',
      example: '₹133,100 received in 3 years at 10% discount rate = ₹100,000 today',
      calculatorId: 'present-value',
    },
    {
      id: 'fv-annuity-ord',
      category: 'Annuities',
      name: 'Future Value of Ordinary Annuity',
      formula: 'FV = PMT × [((1 + r)^n - 1) / r]',
      variables: [
        { symbol: 'PMT', meaning: 'Periodic payment amount' },
        { symbol: 'r', meaning: 'Periodic interest rate' },
        { symbol: 'n', meaning: 'Total number of payment periods' },
      ],
      explanation: 'Accumulated wealth from equal recurring deposits made at the END of each period (standard SIP).',
      example: '₹10,000 monthly at 12% for 15 years = ₹50,45,760',
      calculatorId: 'annuities',
    },
    {
      id: 'fv-annuity-due',
      category: 'Annuities',
      name: 'Future Value of Annuity Due',
      formula: 'FV_due = FV_ordinary × (1 + r) = PMT × [((1 + r)^n - 1) / r] × (1 + r)',
      variables: [
        { symbol: 'PMT', meaning: 'Payment made in advance' },
        { symbol: 'r', meaning: 'Periodic interest rate' },
        { symbol: 'n', meaning: 'Total number of periods' },
      ],
      explanation: 'Used when payments occur at the START of each period (advance rentals, tuition). Gains one extra compounding cycle.',
      example: 'Adds an extra (1 + r) factor to every payment.',
      calculatorId: 'annuities',
    },
    {
      id: 'pv-annuity',
      category: 'Annuities',
      name: 'Present Value of Ordinary Annuity',
      formula: 'PV = PMT × [[1 - (1 + r)^(-n)] / r]',
      variables: [
        { symbol: 'PMT', meaning: 'Periodic payment' },
        { symbol: 'r', meaning: 'Periodic discount rate' },
        { symbol: 'n', meaning: 'Total number of payments' },
      ],
      explanation: 'Lump sum required today to fund a future series of equal payouts.',
      example: '₹1,000 annual pension for 10 years at 7% = ₹7,023.58 today',
      calculatorId: 'annuities',
    },
    {
      id: 'perpetuity-ord',
      category: 'Perpetuity',
      name: 'Ordinary Perpetuity',
      formula: 'PV = PMT / r',
      variables: [
        { symbol: 'PMT', meaning: 'Infinite periodic payout' },
        { symbol: 'r', meaning: 'Discount rate' },
      ],
      explanation: 'Present value of an infinite continuous series of equal cash flows (endowments, British consols).',
      example: '₹200,000 annual scholarship at 6% endowment yield = ₹33,33,333 corpus',
      calculatorId: 'perpetuity',
    },
    {
      id: 'perpetuity-grow',
      category: 'Perpetuity',
      name: 'Growing Perpetuity (Gordon Growth)',
      formula: 'PV = C1 / (r - g)   (requires r > g)',
      variables: [
        { symbol: 'C1', meaning: 'Next year expected cash flow' },
        { symbol: 'r', meaning: 'Discount rate' },
        { symbol: 'g', meaning: 'Constant annual growth rate' },
      ],
      explanation: 'Used in stock equity valuation where dividends are expected to grow at steady rate g forever.',
      example: '₹50,000 next year cash flow at 9% rate with 4% growth = ₹10,00,000',
      calculatorId: 'perpetuity',
    },
    {
      id: 'continuous-growth',
      category: 'Compound Interest',
      name: 'Continuous Compounding',
      formula: 'FV = PV × e^(r × t)',
      variables: [
        { symbol: 'PV', meaning: 'Principal' },
        { symbol: 'e', meaning: 'Euler constant ≈ 2.71828' },
        { symbol: 'r', meaning: 'Annual rate' },
        { symbol: 't', meaning: 'Years' },
      ],
      explanation: 'The mathematical upper bound of compound interest when compounding occurs every infinitesimally small instant.',
      example: '₹10,000 at 6% for 5 years = ₹13,498.59',
      calculatorId: 'compound-interest',
    },
    {
      id: 'ear',
      category: 'Interest Rates',
      name: 'Effective Annual Rate (EAR / APY)',
      formula: 'EAR = (1 + r/m)^m - 1   |   EAR_cont = e^r - 1',
      variables: [
        { symbol: 'r', meaning: 'Nominal APR' },
        { symbol: 'm', meaning: 'Compounding periods per year' },
      ],
      explanation: 'True annual interest rate accounting for intra-year compounding effects.',
      example: '12% APR compounded monthly = 12.6825% EAR',
      calculatorId: 'ear',
    },
    {
      id: 'loan-emi',
      category: 'Loans & Amortization',
      name: 'Equated Monthly Installment (EMI)',
      formula: 'EMI = P × r × (1 + r)^n / [(1 + r)^n - 1]',
      variables: [
        { symbol: 'P', meaning: 'Loan Principal' },
        { symbol: 'r', meaning: 'Monthly interest rate (Annual rate / 12)' },
        { symbol: 'n', meaning: 'Total monthly tenure' },
      ],
      explanation: 'Fixed monthly payment that completely amortizes a loan over its term.',
      example: '₹10,00,000 at 8.5% for 5 years = ₹20,516.53 / month',
      calculatorId: 'loan-emi',
    },
    {
      id: 'npv',
      category: 'Capital Budgeting',
      name: 'Net Present Value (NPV)',
      formula: 'NPV = ∑ [ CF_t / (1 + r)^t ]',
      variables: [
        { symbol: 'CF_t', meaning: 'Net cash flow at period t' },
        { symbol: 'r', meaning: 'Discount rate' },
        { symbol: 't', meaning: 'Period number' },
      ],
      explanation: 'Difference between present value of cash inflows and initial capital outlay. Key metric in corporate finance.',
      example: 'NPV > 0 implies value creation; project exceeds hurdle rate.',
      calculatorId: 'cash-flow',
    },
    {
      id: 'rule-72',
      category: 'Rule of Thumb',
      name: 'Rule of 72',
      formula: 'Doubling Time ≈ 72 / r(%)   |   Required Rate ≈ 72 / t(years)',
      variables: [
        { symbol: 'r', meaning: 'Annual growth rate percentage' },
        { symbol: 't', meaning: 'Years to double capital' },
      ],
      explanation: 'Quick mental approximation for compound growth doubling time.',
      example: 'At 8% return, money doubles in ≈ 72 / 8 = 9.0 years.',
      calculatorId: 'rule-of-72',
    },
  ];

  const filtered = formulas.filter(
    f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = async (formulaText: string, id: string) => {
    const success = await copyToClipboard(formulaText);
    if (success) {
      setCopiedFormula(id);
      if (onShowToast) onShowToast('Formula copied to clipboard!', 'success');
      setTimeout(() => setCopiedFormula(null), 2000);
    }
  };

  const categories = Array.from(new Set(formulas.map(f => f.category)));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-800 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Formula Reference Library</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Time Value of Money (TVM) Mathematical Reference
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete encyclopedia of standard financial engineering formulas, mathematical derivations, variable definitions, and textbook examples.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search formulas, variables, or techniques..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
        />
      </div>

      {/* Formulas by Category */}
      <div className="space-y-8">
        {categories.map(category => {
          const categoryFormulas = filtered.filter(f => f.category === category);
          if (categoryFormulas.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
                {category}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {categoryFormulas.map(entry => (
                  <div
                    key={entry.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {entry.name}
                        </h4>
                        <button
                          onClick={() => handleCopy(entry.formula, entry.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Copy formula text"
                        >
                          {copiedFormula === entry.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Formula Code Box */}
                      <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm font-bold tracking-wide overflow-x-auto border border-slate-800 shadow-inner mb-3">
                        {entry.formula}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                        {entry.explanation}
                      </p>

                      {/* Variables Legend */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 mb-3 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Variables:
                        </span>
                        {entry.variables.map((v, i) => (
                          <div key={i} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-baseline gap-1.5">
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {v.symbol}
                            </span>
                            <span className="text-slate-400">=</span>
                            <span>{v.meaning}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-500 italic mb-4">
                        <strong>Example:</strong> {entry.example}
                      </p>
                    </div>

                    {entry.calculatorId && (
                      <button
                        onClick={() => onNavigate(entry.calculatorId!)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-colors cursor-pointer"
                      >
                        <span>Open Calculator</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
