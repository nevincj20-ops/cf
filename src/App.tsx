import React from 'react';
import { EbitProvider, useEbit } from './context/EbitContext';
import { useCursorPhysics } from './components/effects/useCursorPhysics';
import { Navbar } from './components/Navbar';
import { DashboardView } from './pages/DashboardView';
import { AnalyzerView } from './pages/AnalyzerView';
import { SensitivityView } from './pages/SensitivityView';
import { FormulaGuideView } from './pages/FormulaGuideView';
import { ReportView } from './pages/ReportView';

function AppContent() {
  useCursorPhysics();
  const { activeTab } = useEbit();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'analyzer':
        return <AnalyzerView />;
      case 'sensitivity':
        return <SensitivityView />;
      case 'formula-guide':
        return <FormulaGuideView />;
      case 'reports':
        return <ReportView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-800 dark:selection:text-emerald-300">
      {/* Dynamic Cursor Light Field (Section 28) */}
      <div className="pointer-events-none fixed inset-0 z-0 cursor-light-field" />

      {/* Ambient Moving Glass Light Fields (Section 31) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/5 dark:bg-emerald-500/5 blur-[120px] animate-ambient-1" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[55vw] h-[55vw] rounded-full bg-indigo-400/5 dark:bg-indigo-500/5 blur-[140px] animate-ambient-2" />
      </div>

      {/* Floating Glass Navigation (Section 32) */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
        {renderActiveTab()}
      </main>

      {/* Footer */}
      <footer className="relative z-10 print:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">EBIT INSIGHT</span>
            <span>•</span>
            <span>B.Com Semester V Corporate Finance Examination Suite</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Dynamic Algebraic Solver</span>
            <span>•</span>
            <span>Zero External Tracking</span>
            <span>•</span>
            <span>Client-Side Precision Math Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <EbitProvider>
      <AppContent />
    </EbitProvider>
  );
}
