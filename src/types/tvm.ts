export type CompoundingFrequency = 
  | 'annual' 
  | 'semi-annual' 
  | 'quarterly' 
  | 'monthly' 
  | 'daily' 
  | 'continuous';

export const FREQUENCY_MULTIPLIERS: Record<Exclude<CompoundingFrequency, 'continuous'>, number> = {
  'annual': 1,
  'semi-annual': 2,
  'quarterly': 4,
  'monthly': 12,
  'daily': 365,
};

export const FREQUENCY_LABELS: Record<CompoundingFrequency, string> = {
  'annual': 'Annually (1x/yr)',
  'semi-annual': 'Semi-Annually (2x/yr)',
  'quarterly': 'Quarterly (4x/yr)',
  'monthly': 'Monthly (12x/yr)',
  'daily': 'Daily (365x/yr)',
  'continuous': 'Continuous Compounding (e^rt)',
};

export type AnnuityTiming = 'ordinary' | 'due';

export interface CalculationStep {
  label: string;
  expression: string;
  explanation?: string;
}

export interface MetricCardData {
  label: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
  type?: 'positive' | 'neutral' | 'accent' | 'warning';
}

export interface ChartDataPoint {
  period: number;
  label: string;
  balance: number;
  principal?: number;
  interest?: number;
  cashFlow?: number;
  discountedCashFlow?: number;
  [key: string]: string | number | undefined;
}

export interface AmortizationRow {
  month: number;
  year: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  closingBalance: number;
  totalInterestPaid: number;
}

export interface CashFlowItem {
  id: string;
  period: number;
  amount: number;
  description?: string;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export type NavTabId =
  | 'dashboard'
  | 'future-value'
  | 'present-value'
  | 'annuities'
  | 'perpetuity'
  | 'compound-interest'
  | 'discounting'
  | 'ear'
  | 'loan-emi'
  | 'cash-flow'
  | 'rule-of-72'
  | 'compare-methods'
  | 'formula-reference';
