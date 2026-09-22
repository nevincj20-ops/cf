/**
 * EBIT INSIGHT - Financial Calculation Engine Types
 * Specifically designed for B.Com Semester V Corporate Finance Analysis
 */

export type FinancingType = 'Equity' | 'Debt' | 'Mixed Financing';

export interface FinancingPlan {
  id: 'A' | 'B';
  name: string;
  financingType: FinancingType;
  existingShares: number;
  newShares: number;
  totalShares: number;
  debtAmount: number;
  interestRate: number; // percentage (e.g. 10 for 10%)
  interestAmount: number; // calculated or manual
  isManualInterest: boolean;
  preferenceShares: number; // amount of preference capital
  preferenceDividendRate: number; // percentage (e.g. 8 for 8%)
  preferenceDividend: number; // total dividend payable
  isManualPrefDividend: boolean;
  taxRate: number; // percentage (e.g. 30 for 30%)
}

export interface PlanCalculationWorking {
  ebit: number;
  interest: number;
  ebt: number;
  taxRate: number;
  taxAmount: number;
  pat: number;
  preferenceDividend: number;
  equityEarnings: number;
  totalShares: number;
  eps: number;
}

export type BreakEvenStatus =
  | 'valid'
  | 'parallel_lines'
  | 'identical_plans'
  | 'negative_ebit'
  | 'invalid_inputs';

export interface AlgebraicDerivationStep {
  title: string;
  equation: string;
  explanation: string;
}

export interface BreakEvenResult {
  status: BreakEvenStatus;
  breakEvenEBIT: number | null;
  epsAtBreakEven: number | null;
  planA_EPS: number | null;
  planB_EPS: number | null;
  difference: number;
  message: string;
  algebraicSteps: AlgebraicDerivationStep[];
}

export interface SensitivityRow {
  ebit: number;
  planA_EPS: number;
  planB_EPS: number;
  difference: number;
  favorablePlan: 'Plan A' | 'Plan B' | 'Indifferent' | 'N/A';
  isBreakEvenPoint?: boolean;
}

export interface ScenarioResult {
  expectedEbit: number;
  planA_EPS: number;
  planB_EPS: number;
  difference: number;
  percentageDiff: number | null;
  relativePosition: 'BELOW BREAK-EVEN' | 'AT BREAK-EVEN' | 'ABOVE BREAK-EVEN' | 'INCOMPARABLE';
  interpretation: string;
}

export interface PlanValidationErrors {
  existingShares?: string;
  newShares?: string;
  totalShares?: string;
  debtAmount?: string;
  interestRate?: string;
  interestAmount?: string;
  preferenceShares?: string;
  preferenceDividend?: string;
  taxRate?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorsA: PlanValidationErrors;
  errorsB: PlanValidationErrors;
  generalError?: string;
}
