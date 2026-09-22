import React, { useState } from 'react';
import {
  TrendingUp,
  SlidersHorizontal,
  TableProperties,
  BookOpen,
  FileSpreadsheet,
  GraduationCap,
  RotateCcw,
  Sparkles,
  Menu,
  X,
  Briefcase,
} from 'lucide-react';
import { useEbit, NavTab } from '../context/EbitContext';
import { MagneticButton } from './effects/MagneticButton';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, academicMode, setAcademicMode, resetToSample, clearAll } =
    useEbit();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'analyzer', label: 'Analyzer', icon: SlidersHorizontal },
    { id: 'sensitivity', label: 'Sensitivity', icon: TableProperties },
    { id: 'formula-guide', label: 'Formula Guide', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
      <nav className="max-w-7xl mx-auto rounded-2xl bg-white/75 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] px-4 py-2.5 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 dark:from-slate-100 dark:via-slate-200 dark:to-emerald-400 p-0.5 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-[10px] bg-slate-900 dark:bg-slate-950 flex items-center justify-center text-emerald-400 dark:text-emerald-300">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">
                EBIT INSIGHT
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                B.Com V
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              EBIT–EPS & Break-even Analysis
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Academic Mode Toggle (Section 25) */}
          <button
            onClick={() => setAcademicMode((prev) => !prev)}
            title="Toggle between Academic Mode (detailed workings, assumptions, theory) and Executive Mode"
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              academicMode
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            {academicMode ? (
              <>
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Academic Mode</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4 text-slate-500" />
                <span>Executive Mode</span>
              </>
            )}
          </button>

          {/* Reset to Academic Scenario (Section 37 & 38) */}
          <MagneticButton
            variant="outline"
            size="sm"
            onClick={resetToSample}
            title="Restore standard B.Com sample scenario"
            className="text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Sample Data</span>
          </MagneticButton>

          {/* Clear Inputs */}
          <button
            onClick={clearAll}
            title="Clear all inputs"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setAcademicMode((prev) => !prev)}
            className="p-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="Toggle Academic Mode"
          >
            <GraduationCap className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-left text-xs font-medium flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                resetToSample();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Reset Sample
            </button>
            <button
              onClick={() => {
                clearAll();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 rounded-xl text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
