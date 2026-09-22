import React from 'react';
import {
  Coins,
  Percent,
  Calculator,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { FinancingPlan, FinancingType, PlanValidationErrors } from '../../engine/types';
import { GlassCard } from '../effects/GlassCard';

interface PlanInputPanelProps {
  plan: FinancingPlan;
  onChange: (updates: Partial<FinancingPlan>) => void;
  errors: PlanValidationErrors;
  onOpenWorking: () => void;
}

export const PlanInputPanel: React.FC<PlanInputPanelProps> = ({
  plan,
  onChange,
  errors,
  onOpenWorking,
}) => {
  const isPlanA = plan.id === 'A';
  const themeColor = isPlanA ? 'indigo' : 'emerald';

  const financingTypes: FinancingType[] = ['Equity', 'Debt', 'Mixed Financing'];

  return (
    <GlassCard className="p-5 sm:p-6 space-y-5 border-t-4" style={{
      borderTopColor: isPlanA ? '#6366f1' : '#10b981'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              isPlanA
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
            }`}
          >
            {plan.id}
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight">
              FINANCING PLAN {plan.id}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isPlanA ? 'Primary financing alternative' : 'Comparative financing alternative'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenWorking}
          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Show Working</span>
        </button>
      </div>

      {/* Financing Type Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>Financing Structure</span>
          <span className="text-[10px] text-slate-400 font-normal">Capital mix type</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl">
          {financingTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ financingType: type })}
              className={`py-1.5 px-2 text-xs rounded-lg font-medium transition-all text-center cursor-pointer ${
                plan.financingType === type
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Equity Shares Section */}
      <div className="space-y-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-slate-500" />
            Equity Shares
          </span>
          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            Total: {(plan.existingShares + plan.newShares).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Existing Shares
            </label>
            <input
              type="number"
              min="0"
              value={plan.existingShares === 0 ? '' : plan.existingShares}
              placeholder="0"
              onChange={(e) => onChange({ existingShares: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            {errors.existingShares && (
              <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {errors.existingShares}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              New Shares
            </label>
            <input
              type="number"
              min="0"
              value={plan.newShares === 0 ? '' : plan.newShares}
              placeholder="0"
              onChange={(e) => onChange({ newShares: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            {errors.newShares && (
              <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {errors.newShares}
              </p>
            )}
          </div>
        </div>

        {errors.totalShares && (
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.totalShares}
          </p>
        )}
      </div>

      {/* Debt & Interest Section */}
      <div className="space-y-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
            Debt & Interest
          </span>
          <button
            type="button"
            onClick={() => onChange({ isManualInterest: !plan.isManualInterest })}
            className="flex items-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
          >
            {plan.isManualInterest ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-600" />
                <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                  MANUAL INPUT
                </span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-slate-400" />
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                  AUTO CALCULATED
                </span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Debt Capital (₹)
            </label>
            <input
              type="number"
              min="0"
              value={plan.debtAmount === 0 ? '' : plan.debtAmount}
              placeholder="0"
              onChange={(e) => onChange({ debtAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            {errors.debtAmount && (
              <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {errors.debtAmount}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Interest Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={plan.interestRate === 0 ? '' : plan.interestRate}
                placeholder="0"
                disabled={plan.isManualInterest}
                onChange={(e) => onChange({ interestRate: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono pr-7"
              />
              <span className="absolute right-2.5 top-1.5 text-slate-400 text-xs">%</span>
            </div>
            {errors.interestRate && (
              <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {errors.interestRate}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
            Interest Amount (₹ / year)
          </label>
          <input
            type="number"
            min="0"
            value={plan.interestAmount === 0 ? '' : plan.interestAmount}
            placeholder="0"
            disabled={!plan.isManualInterest}
            onChange={(e) => onChange({ interestAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
            className={`w-full px-3 py-1.5 text-xs rounded-lg border font-mono ${
              plan.isManualInterest
                ? 'border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 cursor-not-allowed'
            }`}
          />
          {errors.interestAmount && (
            <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              {errors.interestAmount}
            </p>
          )}
        </div>
      </div>

      {/* Preference Shares Section */}
      <div className="space-y-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-slate-500" />
            Preference Capital & Dividend
          </span>
          <button
            type="button"
            onClick={() => onChange({ isManualPrefDividend: !plan.isManualPrefDividend })}
            className="flex items-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
          >
            {plan.isManualPrefDividend ? (
              <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                MANUAL
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                AUTO
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Pref. Capital (₹)
            </label>
            <input
              type="number"
              min="0"
              value={plan.preferenceShares === 0 ? '' : plan.preferenceShares}
              placeholder="0"
              onChange={(e) => onChange({ preferenceShares: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            {errors.preferenceShares && (
              <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {errors.preferenceShares}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Pref. Dividend (₹)
            </label>
            <input
              type="number"
              min="0"
              value={plan.preferenceDividend === 0 ? '' : plan.preferenceDividend}
              placeholder="0"
              disabled={!plan.isManualPrefDividend}
              onChange={(e) => onChange({ preferenceDividend: Math.max(0, parseFloat(e.target.value) || 0) })}
              className={`w-full px-3 py-1.5 text-xs rounded-lg border font-mono ${
                plan.isManualPrefDividend
                  ? 'border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
              }`}
            />
            {errors.preferenceDividend && (
              <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {errors.preferenceDividend}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tax Rate */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Corporate Tax Rate (%)
          </label>
          <span className="text-[11px] font-mono text-slate-500">{plan.taxRate}%</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={plan.taxRate}
            onChange={(e) => onChange({ taxRate: parseFloat(e.target.value) || 0 })}
            className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="w-16">
            <input
              type="number"
              min="0"
              max="100"
              value={plan.taxRate}
              onChange={(e) => onChange({ taxRate: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) })}
              className="w-full px-2 py-1 text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
            />
          </div>
        </div>
        {errors.taxRate && (
          <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {errors.taxRate}
          </p>
        )}
      </div>
    </GlassCard>
  );
};
