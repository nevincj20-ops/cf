import React from 'react';
import {
  TrendingUp,
  ArrowDownLeft,
  CalendarDays,
  Percent,
  Calculator,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import type { NavTabId } from '../types/tvm';
import { useCurrency } from '../context/CurrencyContext';

interface DashboardProps {
  onNavigate: (tab: NavTabId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { symbol, format } = useCurrency();

  const quickCalculators = [
    {
      id: 'future-value' as NavTabId,
      title: 'Future Value (FV)',
      icon: TrendingUp,
      badge: 'Core',
      formula: 'FV = PV × (1 + r/m)^(n×m)',
      description: 'Calculate how much a lump sum invested today will grow over time with compound interest.',
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'present-value' as NavTabId,
      title: 'Present Value (PV)',
      icon: ArrowDownLeft,
      badge: 'Core',
      formula: 'PV = FV / (1 + r/m)^(n×m)',
      description: 'Determine the current worth of a future sum of money given a specific discount rate.',
      color: 'from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      id: 'annuities' as NavTabId,
      title: 'Annuities',
      icon: CalendarDays,
      badge: 'Popular',
      formula: 'FV = PMT × [((1+r)^n - 1) / r]',
      description: 'Evaluate equal periodic cash flows (SIPs, pensions, leases) for both Ordinary and Due timing.',
      color: 'from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400',
    },
    {
      id: 'compound-interest' as NavTabId,
      title: 'Compound Interest',
      icon: Percent,
      badge: 'Comparison',
      formula: 'FV = PV × e^(rt) (Continuous)',
      description: 'Compare simple interest versus annual, monthly, daily, and continuous compounding frequencies.',
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'discounting' as NavTabId,
      title: 'Discounting Stream',
      icon: Calculator,
      badge: 'Multi-period',
      formula: 'PV = ∑ [ CF_t / (1 + r)^t ]',
      description: 'Discount uneven multiple future cash flows to calculate their combined present value.',
      color: 'from-pink-500/10 to-rose-500/10 text-pink-600 dark:text-pink-400',
    },
    {
      id: 'loan-emi' as NavTabId,
      title: 'Loan / EMI Calculator',
      icon: Landmark,
      badge: 'Essential',
      formula: 'EMI = P × r × (1+r)^n / [(1+r)^n - 1]',
      description: 'Calculate monthly loan installments with complete principal, interest, and amortization schedule.',
      color: 'from-indigo-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Financial Engineering</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Time Value of Money (TVM)
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            "{symbol}1 today is worth more than {symbol}1 received in the future because today's money can be invested and earn a return."
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigate('future-value')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Calculate Future Value</span>
            </button>
            <button
              onClick={() => onNavigate('loan-emi')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <Landmark className="w-4 h-4" />
              <span>Loan EMI & Amortization</span>
            </button>
            <button
              onClick={() => onNavigate('compare-methods')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Compare Methods</span>
            </button>
          </div>
        </div>
      </div>

      {/* TVM Concept Section with Visual Timeline */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base sm:text-lg font-bold">The Core TVM Relationship</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
          Money has time-earning capacity. When you invest capital today (<strong>Present Value</strong>),
          it earns interest over time at a rate <em>r</em> across <em>n</em> periods to become a larger sum (<strong>Future Value</strong>).
          Conversely, evaluating what a future receipt is worth in your hands today requires <strong>Discounting</strong>.
        </p>

        {/* Visual Timeline Bar */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Today / PV */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center font-bold shadow-md shrink-0">
                <span className="text-[10px] uppercase text-slate-400">Time</span>
                <span className="text-xs text-emerald-400">t = 0</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Present Value (PV)</span>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {format(100000)} Today
                </p>
              </div>
            </div>

            {/* Growth Arrow & Compounding */}
            <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
              <div className="flex items-center justify-between w-full text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                <span>Compounding & Interest (+r)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">3 Years @ 10%</span>
                <span>Discounting (-r)</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-500 w-full" />
              </div>
              <div className="flex items-center justify-between w-full text-[10px] text-slate-400 mt-1 font-mono">
                <span>Year 1: {format(110000, { compact: true })}</span>
                <span>Year 2: {format(121000, { compact: true })}</span>
                <span>Year 3: {format(133100, { compact: true })}</span>
              </div>
            </div>

            {/* Future / FV */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-bold shadow-md shadow-emerald-600/30 shrink-0">
                <span className="text-[10px] uppercase text-emerald-200">Time</span>
                <span className="text-xs">t = n</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Future Value (FV)
                </span>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {format(133100)} Future
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Calculators Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              Quick Calculators
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a specialized Time Value of Money calculator to begin
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickCalculators.map(calc => {
            const Icon = calc.icon;
            return (
              <div
                key={calc.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${calc.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {calc.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {calc.title}
                  </h3>

                  <div className="my-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700/60 truncate">
                    {calc.formula}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {calc.description}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate(calc.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-colors group-hover:shadow-sm cursor-pointer"
                >
                  <span>Calculate</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
