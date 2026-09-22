import type { CurrencyCode, CurrencyConfig } from '../types/tvm';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar ($)', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (€)', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (£)', locale: 'en-GB' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)', locale: 'ja-JP' },
};

/**
 * Formats a monetary value with proper currency symbol, decimal places, and locale thousands separators.
 */
export function formatCurrency(
  value: number,
  currency: CurrencyCode = 'INR',
  options?: { maximumFractionDigits?: number; minimumFractionDigits?: number; compact?: boolean }
): string {
  if (isNaN(value) || !isFinite(value)) return '—';

  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.INR;
  const minDigits = options?.minimumFractionDigits ?? (currency === 'JPY' ? 0 : 2);
  const maxDigits = options?.maximumFractionDigits ?? (currency === 'JPY' ? 0 : 2);

  if (options?.compact && Math.abs(value) >= 1000) {
    if (currency === 'INR') {
      const absVal = Math.abs(value);
      const sign = value < 0 ? '-' : '';
      if (absVal >= 10000000) {
        return `${sign}${config.symbol}${(absVal / 10000000).toFixed(2)} Cr`;
      } else if (absVal >= 100000) {
        return `${sign}${config.symbol}${(absVal / 100000).toFixed(2)} L`;
      } else if (absVal >= 1000) {
        return `${sign}${config.symbol}${(absVal / 1000).toFixed(1)}k`;
      }
    } else {
      const absVal = Math.abs(value);
      const sign = value < 0 ? '-' : '';
      if (absVal >= 1000000000) {
        return `${sign}${config.symbol}${(absVal / 1000000000).toFixed(2)}B`;
      } else if (absVal >= 1000000) {
        return `${sign}${config.symbol}${(absVal / 1000000).toFixed(2)}M`;
      } else if (absVal >= 1000) {
        return `${sign}${config.symbol}${(absVal / 1000).toFixed(1)}k`;
      }
    }
  }

  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    }).format(value);
    return formatted;
  } catch {
    return `${config.symbol}${value.toLocaleString(undefined, {
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    })}`;
  }
}

/**
 * Formats a decimal/percentage value nicely.
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0.00%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a plain number with locale thousands separator.
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
