import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  ArrowDownLeft,
  CalendarDays,
  Infinity as InfinityIcon,
  Percent,
  Calculator,
  Gauge,
  Landmark,
  Layers,
  Sparkles,
  BookOpen,
  GitCompare,
} from 'lucide-react';
import { NavTabId } from '../../types/tvm';

interface NavItem {
  id: NavTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category: 'Fundamentals' | 'Growth & Returns' | 'Valuation & Loans' | 'Tools & Reference';
}

export const NAV_ITEMS: NavItem[] = [
  // Category 1: Fundamentals
  { id: 'dashboard', label: 'TVM Overview', icon: LayoutDashboard, category: 'Fundamentals' },
  { id: 'future-value', label: 'Future Value (FV)', icon: TrendingUp, category: 'Fundamentals' },
  { id: 'present-value', label: 'Present Value (PV)', icon: ArrowDownLeft, category: 'Fundamentals' },
  { id: 'annuities', label: 'Annuities', icon: CalendarDays, category: 'Fundamentals' },
  { id: 'perpetuity', label: 'Perpetuity', icon: InfinityIcon, category: 'Fundamentals' },

  // Category 2: Growth & Returns
  { id: 'compound-interest', label: 'Compound Interest', icon: Percent, category: 'Growth & Returns' },
  { id: 'discounting', label: 'Discounting', icon: Calculator, category: 'Growth & Returns' },
  { id: 'ear', label: 'Effective Rate (EAR)', icon: Gauge, category: 'Growth & Returns' },
  { id: 'rule-of-72', label: 'Rule of 72', icon: Sparkles, category: 'Growth & Returns' },

  // Category 3: Valuation & Loans
  { id: 'loan-emi', label: 'Loan / EMI', icon: Landmark, badge: 'Popular', category: 'Valuation & Loans' },
  { id: 'cash-flow', label: 'Cash Flow (NPV/IRR)', icon: Layers, badge: 'Advanced', category: 'Valuation & Loans' },
  { id: 'compare-methods', label: 'Compare Methods', icon: GitCompare, category: 'Valuation & Loans' },

  // Category 4: Tools & Reference
  { id: 'formula-reference', label: 'Formula Reference', icon: BookOpen, category: 'Tools & Reference' },
];

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const categories = Array.from(new Set(NAV_ITEMS.map(i => i.category)));

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 min-h-[calc(100vh-4rem)] p-4 select-none">
      <div className="space-y-6">
        {categories.map(category => {
          const items = NAV_ITEMS.filter(i => i.category === category);
          return (
            <div key={category}>
              <h2 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {category}
              </h2>
              <div className="space-y-1">
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
