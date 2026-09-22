import React from 'react';
import { X, LayoutDashboard, TrendingUp, ArrowDownLeft, Landmark, Menu } from 'lucide-react';
import { NavTabId } from '../../types/tvm';
import { NAV_ITEMS } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
}) => {
  const handleSelect = (tab: NavTabId) => {
    onSelectTab(tab);
    onClose();
  };

  const categories = Array.from(new Set(NAV_ITEMS.map(i => i.category)));

  return (
    <>
      {/* Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-over Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white">Navigation</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {category}
              </h3>
              <div className="space-y-1">
                {NAV_ITEMS.filter(i => i.category === category).map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => onSelectTab('future-value')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'future-value' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>FV</span>
        </button>
        <button
          onClick={() => onSelectTab('present-value')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'present-value' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>PV</span>
        </button>
        <button
          onClick={() => onSelectTab('loan-emi')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'loan-emi' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>EMI</span>
        </button>
        <button
          onClick={onClose}
          className="flex flex-col items-center gap-1 p-1 rounded-lg text-[10px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
        >
          <Menu className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
