import React, { useState } from 'react';
import {
  SlidersHorizontal,
  LineChart as LineChartIcon,
  Table as TableIcon,
  HelpCircle,
  Sparkles,
  Info,
  Maximize2,
} from 'lucide-react';
import { useEbit } from '../context/EbitContext';
import { PlanInputPanel } from '../components/analyzer/PlanInputPanel';
import { BreakEvenPanel } from '../components/analyzer/BreakEvenPanel';
import { ScenarioTester } from '../components/analyzer/ScenarioTester';
import { EbitEpsChart } from '../components/charts/EbitEpsChart';
import { PlanComparisonTable } from '../components/analyzer/PlanComparisonTable';
import { AcademicInsights } from '../components/analyzer/AcademicInsights';
import { WorkingsModal } from '../components/analyzer/WorkingsModal';
import { GlassCard } from '../components/effects/GlassCard';

export const AnalyzerView: React.FC = () => {
  const {
    planA,
    planB,
    updatePlanA,
    updatePlanB,
    expectedEbit,
    setExpectedEbit,
    scenarioResult,
    breakEvenResult,
    validation,
    academicMode,
  } = useEbit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'statement' | 'algebraic' | 'formula'>('statement');

  const openWorkings = (tab: 'statement' | 'algebraic' | 'formula') => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Financial Analyzer</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Modify capital parameters in real time to observe the live shifts in EPS curves and break-even EBIT.
          </p>
        </div>

        {/* Global validation banner if any */}
        {validation.generalError && (
          <div className="p-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{validation.generalError}</span>
          </div>
        )}
      </div>

      {/* 3-COLUMN DESKTOP WORKSPACE (Section 6) */}
      {/* On desktop: LEFT Plan A (col-span-4), CENTER Break-even (col-span-4), RIGHT Plan B (col-span-4) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Plan A */}
        <div className="lg:col-span-4 order-1">
          <PlanInputPanel
            plan={planA}
            onChange={updatePlanA}
            errors={validation.errorsA}
            onOpenWorking={() => openWorkings('statement')}
          />
        </div>

        {/* Center Column: Break-Even Result (Desktop Center, Mobile 3rd) */}
        <div className="lg:col-span-4 order-3 lg:order-2">
          <BreakEvenPanel
            breakEvenResult={breakEvenResult}
            onOpenAlgebraicWorking={() => openWorkings('algebraic')}
          />
        </div>

        {/* Right Column: Plan B (Desktop Right, Mobile 2nd) */}
        <div className="lg:col-span-4 order-2 lg:order-3">
          <PlanInputPanel
            plan={planB}
            onChange={updatePlanB}
            errors={validation.errorsB}
            onOpenWorking={() => openWorkings('statement')}
          />
        </div>
      </section>

      {/* SECTION: EPS ANALYSIS & SCENARIO TESTING (Section 12 & 15) */}
      <section>
        <ScenarioTester
          expectedEbit={expectedEbit}
          onEbitChange={setExpectedEbit}
          scenarioResult={scenarioResult}
          breakEvenEbit={breakEvenResult.breakEvenEBIT}
        />
      </section>

      {/* SECTION: EPS vs EBIT GRAPH (Section 13) */}
      <section>
        <GlassCard className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <LineChartIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  EPS vs EBIT SENSITIVITY CHART
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual intersection marks the indifference operating earnings point.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Plan A (Equity)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Plan B (Leveraged)
              </span>
            </div>
          </div>

          <EbitEpsChart />
        </GlassCard>
      </section>

      {/* SECTION: PLAN COMPARISON MATRIX (Section 23) */}
      <section>
        <PlanComparisonTable />
      </section>

      {/* SECTION: ACADEMIC INSIGHTS (Sections 19, 21, 22) */}
      {academicMode && (
        <section>
          <AcademicInsights />
        </section>
      )}

      {/* Modal with Full Workings & Algebra */}
      <WorkingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalTab}
      />
    </div>
  );
};
