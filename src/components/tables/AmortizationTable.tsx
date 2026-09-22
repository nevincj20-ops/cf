import React, { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Calendar, ListFilter } from 'lucide-react';
import { AmortizationRow } from '../../types/tvm';
import { YearlyAmortizationSummary } from '../../calculators/emi';
import { useCurrency } from '../../context/CurrencyContext';
import { exportAmortizationCSV } from '../../utils/export';

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  yearlySummary: YearlyAmortizationSummary[];
  onShowToast?: (text: string, type?: 'success' | 'info') => void;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  schedule,
  yearlySummary,
  onShowToast,
}) => {
  const { format } = useCurrency();
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 1 year per page in monthly mode

  const totalPages = Math.ceil(schedule.length / pageSize);
  const currentMonthRows = schedule.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    exportAmortizationCSV(schedule);
    if (onShowToast) onShowToast('Amortization schedule exported to CSV!', 'success');
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header controls */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Amortization Schedule
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {viewMode === 'yearly'
              ? `Annual breakdown across ${yearlySummary.length} years`
              : `Month-by-month payments (${schedule.length} total payments)`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('yearly')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'yearly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Yearly</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('monthly')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Monthly</span>
            </button>
          </div>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 select-none">
            <tr>
              <th className="py-3 px-4">{viewMode === 'yearly' ? 'Year' : 'Month'}</th>
              <th className="py-3 px-4">Opening Balance</th>
              <th className="py-3 px-4">{viewMode === 'yearly' ? 'Total Annual EMI' : 'EMI'}</th>
              <th className="py-3 px-4">Principal Paid</th>
              <th className="py-3 px-4">Interest Paid</th>
              <th className="py-3 px-4">Closing Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {viewMode === 'yearly'
              ? yearlySummary.map(row => (
                  <tr
                    key={row.year}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                      Year {row.year}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {format(row.openingBalance)}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {format(row.totalEMI)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                      {format(row.totalPrincipal)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-amber-600 dark:text-amber-400">
                      {format(row.totalInterest)}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {format(row.closingBalance)}
                    </td>
                  </tr>
                ))
              : currentMonthRows.map(row => (
                  <tr
                    key={row.month}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      Month {row.month}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        (Yr {row.year})
                      </span>
                    </td>
                    <td className="py-2 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {format(row.openingBalance)}
                    </td>
                    <td className="py-2 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {format(row.emi)}
                    </td>
                    <td className="py-2 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                      {format(row.principal)}
                    </td>
                    <td className="py-2 px-4 font-mono text-amber-600 dark:text-amber-400">
                      {format(row.interest)}
                    </td>
                    <td className="py-2 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {format(row.closingBalance)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination bar in monthly mode */}
      {viewMode === 'monthly' && totalPages > 1 && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing months {(currentPage - 1) * pageSize + 1} –{' '}
            {Math.min(currentPage * pageSize, schedule.length)} of {schedule.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
