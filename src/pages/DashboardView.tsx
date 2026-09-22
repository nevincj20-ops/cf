import React from 'react';
import {
  TrendingUp,
  Target,
  TableProperties,
  ArrowRight,
  BookOpen,
  Sparkles,
  Scale,
} from 'lucide-react';
import { useEbit } from '../context/EbitContext';
import { GlassCard } from '../components/effects/GlassCard';
import { MagneticButton } from '../components/effects/MagneticButton';
import { AnimatedNumber } from '../components/effects/AnimatedNumber';

export const DashboardView: React.FC = () => {
  const { setActiveTab, breakEvenResult } = useEbit();

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-4 text-center max-w-4xl mx-auto space-y-5">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Interactive Corporate Finance Analysis • B.Com Semester V</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            EBIT INSIGHT
          </h1>
          <p className="text-lg sm:text-xl font-medium text-emerald-700 dark:text-emerald-400">
            EBIT–EPS & Break-even EBIT Financial Analysis
          </p>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compare financing alternatives, calculate EPS, identify the break-even EBIT and understand how capital structure affects shareholder earnings.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <MagneticButton
            variant="accent"
            size="lg"
            onClick={() => setActiveTab('analyzer')}
            className="w-full sm:w-auto"
          >
            <span>START ANALYSIS</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>

          <MagneticButton
            variant="outline"
            size="lg"
            onClick={() => setActiveTab('formula-guide')}
            className="w-full sm:w-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Formula Guide</span>
          </MagneticButton>
        </div>
      </section>

      {/* Live Benchmark Strip */}
      {breakEvenResult.status === 'valid' && (
        <section className="max-w-4xl mx-auto">
          <GlassCard className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-200/70 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                  Active Sample Break-Even EBIT
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  <AnimatedNumber value={breakEvenResult.breakEvenEBIT} isCurrency={true} />
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">EPS at Indifference:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                ₹{Number(breakEvenResult.epsAtBreakEven).toFixed(2)}
              </span>
              <button
                onClick={() => setActiveTab('analyzer')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Inspect Plan <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        </section>
      )}

      {/* Three Interactive Feature Cards (Section 5) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* CARD 1: EPS ANALYSIS */}
        <GlassCard
          className="p-6 space-y-4 cursor-pointer group hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
          onClick={() => setActiveTab('analyzer')}
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              Card 1
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              EPS ANALYSIS
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Calculate EPS under different financing structures. Contrast all-equity plans against debt-leveraged and preference capital.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
            <span>Explore EPS Models</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </GlassCard>

        {/* CARD 2: BREAK-EVEN EBIT */}
        <GlassCard
          className="p-6 space-y-4 cursor-pointer group hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
          onClick={() => setActiveTab('analyzer')}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Target className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Card 2
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              BREAK-EVEN EBIT
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Find the EBIT level at which two financing plans generate equal EPS. Dynamically solved with complete step-by-step algebra.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>Calculate Indifference Point</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </GlassCard>

        {/* CARD 3: SENSITIVITY ANALYSIS */}
        <GlassCard
          className="p-6 space-y-4 cursor-pointer group hover:border-amber-400 dark:hover:border-amber-600 transition-colors"
          onClick={() => setActiveTab('sensitivity')}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <TableProperties className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Card 3
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              SENSITIVITY ANALYSIS
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore how changes in EBIT affect EPS across configurable operating earnings ranges with dynamic tables and charts.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Generate Sensitivity Grid</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </GlassCard>
      </section>

      {/* Educational Section: WHY EBIT–EPS ANALYSIS? */}
      <section className="max-w-4xl mx-auto">
        <GlassCard className="p-6 sm:p-8 space-y-4 border-l-4 border-l-emerald-600">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              WHY EBIT–EPS ANALYSIS?
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            EBIT–EPS analysis is used in corporate financial management to examine how alternative financing structures affect earnings per share at different levels of operating earnings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                1. Capital Mix Optimization
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Determines when debt enhances or dilutes equity earnings per share.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                2. Risk-Return Tradeoff
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Quantifies the financial risk introduced by contractual interest obligations.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                3. Examination Rigor
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Meets the syllabus requirements for B.Com Semester V Corporate Finance.
              </span>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
