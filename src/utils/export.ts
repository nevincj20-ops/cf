import type { AmortizationRow } from '../types/tvm';

/**
 * Copies text content to the user's clipboard and returns a promise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

/**
 * Exports loan amortization schedule to a CSV file download.
 */
export function exportAmortizationCSV(schedule: AmortizationRow[], filename: string = 'amortization-schedule.csv') {
  const headers = ['Month', 'Year', 'Opening Balance', 'EMI', 'Principal Paid', 'Interest Paid', 'Closing Balance', 'Total Interest Paid'];
  const rows = schedule.map(r => [
    r.month,
    r.year,
    r.openingBalance.toFixed(2),
    r.emi.toFixed(2),
    r.principal.toFixed(2),
    r.interest.toFixed(2),
    r.closingBalance.toFixed(2),
    r.totalInterestPaid.toFixed(2),
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Exports cash flow analysis table to a CSV file download.
 */
export function exportCashFlowCSV(
  rows: { period: number; amount: number; discountFactor: number; discountedAmount: number }[],
  filename: string = 'cash-flows.csv'
) {
  const headers = ['Period', 'Cash Flow', 'Discount Factor', 'Present Value'];
  const data = rows.map(r => [
    r.period,
    r.amount.toFixed(2),
    r.discountFactor.toFixed(4),
    r.discountedAmount.toFixed(2),
  ]);

  const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Helper to download text as a file.
 */
function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
