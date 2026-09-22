import React from 'react';
import { BookOpen } from 'lucide-react';
import { GlassCard } from '../components/effects/GlassCard';

export const FormulaGuideView: React.FC = () => {
  const formulas = [
    {
      title: '1. Earnings Per Share (EPS)',
      equation: 'EPS = [ (EBIT − I) × (1 − T) − PD ] ÷ N',
      variables: [
        { symbol: 'EBIT', label: 'Earnings Before Interest and Tax (Operating Profit)' },
        { symbol: 'I', label: 'Annual contractual interest on debt capital' },
        { symbol: 'T', label: 'Applicable corporate tax rate expressed as a decimal' },
        { symbol: 'PD', label: 'Preference dividend payable to preference shareholders' },
        { symbol: 'N', label: 'Total outstanding number of equity shares' },
      ],
      meaning:
        'Quantifies the net monetary return accrued to each individual equity share from operating activities after satisfying all contractual fixed claims (interest, taxes, and preference dividends).',
      whenUsed:
        'Used to compare alternative capital structures and identify which financial mix maximizes shareholder wealth at a specific EBIT level.',
      assumptions:
        'Assumes uniform tax rate application, full distribution capacity for fixed preference dividends, and steady-state equity share counts.',
      example:
        'If EBIT = ₹5,00,000, Interest = ₹1,00,000, Tax = 30% (0.30), PD = ₹0, Shares = 20,000:\nEPS = [ (5,00,000 - 1,00,000) × (1 - 0.30) - 0 ] ÷ 20,000\nEPS = [ 4,00,000 × 0.70 ] ÷ 20,000 = ₹2,80,000 ÷ 20,000 = ₹14.00 per share.',
    },
    {
      title: '2. Indifference (Break-Even) EBIT Equation',
      equation:
        '[(EBIT − I_A) × (1 − T) − PD_A] / N_A = [(EBIT − I_B) × (1 − T) − PD_B] / N_B',
      variables: [
        { symbol: 'I_A, I_B', label: 'Interest expenses under Plan A and Plan B respectively' },
        { symbol: 'PD_A, PD_B', label: 'Preference dividends under Plan A and Plan B' },
        { symbol: 'N_A, N_B', label: 'Total equity share counts under Plan A and Plan B' },
        { symbol: 'T', label: 'Corporate income tax rate' },
      ],
      meaning:
        'Identifies the exact critical operating earnings level (EBIT*) at which the earnings per share under two distinct financing alternatives are mathematically identical.',
      whenUsed:
        'Employed during capital budgeting and financing decisions when deciding whether to raise new capital via equity issue, debentures, or preference shares.',
      assumptions:
        'Both plans must differ in their equity share counts (N_A ≠ N_B) to possess intersecting EPS curves; otherwise, their slopes are parallel.',
      example:
        'Plan A: 30,000 shares, ₹0 Interest. Plan B: 10,000 shares, ₹2,00,000 Interest. Tax = 30%.\n(EBIT × 0.70) / 30,000 = [ (EBIT - 2,00,000) × 0.70 ] / 10,000\nCross-multiplying: 10,000 × 0.70 × EBIT = 30,000 × 0.70 × (EBIT - 2,00,000)\n7,000 EBIT = 21,000 EBIT - 4,20,00,00,000\n14,000 EBIT = 4,20,00,00,000\nEBIT* = ₹3,00,000 (EPS at this point is ₹7.00 for both plans).',
    },
    {
      title: '3. Tax-Adjusted Earnings (Profit After Tax)',
      equation: 'PAT = (EBIT − Interest) × (1 − Tax Rate)',
      variables: [
        { symbol: 'EBT', label: 'Earnings Before Tax = EBIT - Interest' },
        { symbol: 'Tax', label: 'Tax liability = EBT × T (for EBT > 0)' },
        { symbol: 'PAT', label: 'Profit After Tax = EBT - Tax' },
      ],
      meaning:
        'Represents residual operating profits remaining inside the company after servicing debt providers and settling governmental tax obligations.',
      whenUsed:
        'Fundamental line item in the income statement prior to deducting preference dividends and distributing equity dividends or retained earnings.',
      assumptions:
        'Assumes taxable income mirrors accounting income with no loss carryforwards.',
      example:
        'EBIT = ₹4,00,000, Interest = ₹80,000, Tax Rate = 25%.\nEBT = ₹3,20,000. Tax = 25% of 3,20,000 = ₹80,000.\nPAT = ₹3,20,000 - ₹80,000 = ₹2,40,000.',
    },
    {
      title: '4. Contractual Interest Expense Calculation',
      equation: 'Interest = Debt Principal × Coupon Rate (%)',
      variables: [
        { symbol: 'Debt Principal', label: 'Nominal face value of debentures, bonds, or term loans' },
        { symbol: 'Coupon Rate', label: 'Annual contractual interest rate agreed with lenders' },
      ],
      meaning:
        'Calculates the fixed annual financial charge that the firm is legally committed to disburse to debt holders before paying taxes.',
      whenUsed:
        'Applied whenever a financing proposal involves debt capital, debentures, or bank credit.',
      assumptions:
        'Assumes standard simple annual interest without floating-rate adjustments or amortization during the analytical period.',
      example:
        '₹15,00,000 raised via 12% Debentures:\nAnnual Interest = 15,00,000 × 12/100 = ₹1,80,000 per year.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200/60 dark:border-slate-800 pb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Academic Formula Reference & Derivation Guide</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Curated for B.Com Semester V Corporate Finance numerical problem solving and university examinations.
        </p>
      </div>

      {/* Formula Cards */}
      <div className="space-y-6">
        {formulas.map((item, index) => (
          <GlassCard key={index} className="p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span>{item.title}</span>
            </h3>

            {/* Formula Block */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm text-center shadow-inner overflow-x-auto">
              {item.equation}
            </div>

            {/* Variables */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Variables & Parameters:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {item.variables.map((v, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2"
                  >
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 min-w-10">
                      {v.symbol}:
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 text-[11px]">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/60 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Theoretical Meaning
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.meaning}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/60 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  When It Is Used
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.whenUsed}
                </p>
              </div>
            </div>

            {/* Assumptions & Example */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                <span className="font-semibold text-amber-900 dark:text-amber-300 block mb-0.5">
                  Underlying Assumptions:
                </span>
                <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed">
                  {item.assumptions}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Standard Numerical Example:
                </span>
                <pre className="text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {item.example}
                </pre>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
