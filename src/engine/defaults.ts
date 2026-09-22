import { FinancingPlan } from './types';

/**
 * Standard B.Com Semester V Academic Scenario
 * Total capital required: ₹20,00,000
 * Existing shares: 10,000 shares
 * Plan A: Equity Alternative - Issue 20,000 new equity shares @ ₹100 each. (Total shares: 30,000)
 * Plan B: Debt Alternative - Issue ₹20,00,000 10% Debentures. (Total shares: 10,000, Interest: ₹2,00,000)
 * Tax Rate: 30%
 * Break-even EBIT is exactly ₹3,00,000 where EPS under both plans is exactly ₹7.00
 */
export const SAMPLE_ACADEMIC_PLAN_A: FinancingPlan = {
  id: 'A',
  name: 'Plan A (Equity Financing)',
  financingType: 'Equity',
  existingShares: 10000,
  newShares: 20000,
  totalShares: 30000,
  debtAmount: 0,
  interestRate: 10,
  interestAmount: 0,
  isManualInterest: false,
  preferenceShares: 0,
  preferenceDividendRate: 8,
  preferenceDividend: 0,
  isManualPrefDividend: false,
  taxRate: 30,
};

export const SAMPLE_ACADEMIC_PLAN_B: FinancingPlan = {
  id: 'B',
  name: 'Plan B (Debt Financing)',
  financingType: 'Debt',
  existingShares: 10000,
  newShares: 0,
  totalShares: 10000,
  debtAmount: 2000000,
  interestRate: 10,
  interestAmount: 200000,
  isManualInterest: false,
  preferenceShares: 0,
  preferenceDividendRate: 8,
  preferenceDividend: 0,
  isManualPrefDividend: false,
  taxRate: 30,
};

export const SAMPLE_EXPECTED_EBIT = 500000;

export const EMPTY_PLAN_A: FinancingPlan = {
  id: 'A',
  name: 'Plan A',
  financingType: 'Equity',
  existingShares: 0,
  newShares: 0,
  totalShares: 0,
  debtAmount: 0,
  interestRate: 0,
  interestAmount: 0,
  isManualInterest: false,
  preferenceShares: 0,
  preferenceDividendRate: 0,
  preferenceDividend: 0,
  isManualPrefDividend: false,
  taxRate: 30,
};

export const EMPTY_PLAN_B: FinancingPlan = {
  id: 'B',
  name: 'Plan B',
  financingType: 'Debt',
  existingShares: 0,
  newShares: 0,
  totalShares: 0,
  debtAmount: 0,
  interestRate: 0,
  interestAmount: 0,
  isManualInterest: false,
  preferenceShares: 0,
  preferenceDividendRate: 0,
  preferenceDividend: 0,
  isManualPrefDividend: false,
  taxRate: 30,
};
