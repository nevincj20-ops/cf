import { describe, it, expect } from 'vitest';
import {
  calculateEPS,
  calculateInterest,
  calculateEBT,
  calculateTax,
  calculatePAT,
  calculateEquityEarnings,
  calculateBreakEvenEBIT,
  evaluateScenario,
} from '../calculations';
import { validatePlan, validateBothPlans } from '../validation';
import { SAMPLE_ACADEMIC_PLAN_A, SAMPLE_ACADEMIC_PLAN_B } from '../defaults';
import { FinancingPlan } from '../types';

describe('EBIT INSIGHT Financial Engine Tests', () => {
  // 1. EPS calculation
  it('1. should calculate EPS accurately using [(EBIT - I)*(1 - T) - PD] / N', () => {
    // EBIT = 500,000, Interest = 0, Tax = 30%, PD = 0, Shares = 30,000
    // EBT = 500,000, Tax = 150,000, PAT = 350,000, EPS = 350,000 / 30,000 = 11.6667
    const eps = calculateEPS(500000, 0, 30, 0, 30000);
    expect(eps).toBeCloseTo(11.6667, 3);
  });

  // 2. Interest calculation
  it('2. should calculate interest based on debt amount and interest rate, and handle manual override', () => {
    const autoInterest = calculateInterest(2000000, 10, false);
    expect(autoInterest).toBe(200000);

    const manualInterest = calculateInterest(2000000, 10, true, 250000);
    expect(manualInterest).toBe(250000);
  });

  // 3. Tax calculation
  it('3. should calculate tax accurately on positive EBT and zero on loss', () => {
    const taxPositive = calculateTax(500000, 30);
    expect(taxPositive).toBe(150000);

    const taxLoss = calculateTax(-100000, 30);
    expect(taxLoss).toBe(0);
  });

  // 4. PAT calculation
  it('4. should calculate Profit After Tax (PAT) = EBT - Tax', () => {
    const ebt = calculateEBT(500000, 200000); // 300,000
    const tax = calculateTax(ebt, 30); // 90,000
    const pat = calculatePAT(ebt, tax);
    expect(pat).toBe(210000);
  });

  // 5. Break-even EBIT
  it('5. should calculate break-even EBIT dynamically for sample academic scenario', () => {
    const result = calculateBreakEvenEBIT(SAMPLE_ACADEMIC_PLAN_A, SAMPLE_ACADEMIC_PLAN_B);
    expect(result.status).toBe('valid');
    // For Plan A (30,000 shares, I=0) and Plan B (10,000 shares, I=200,000), break-even is 300,000
    expect(result.breakEvenEBIT).toBeCloseTo(300000, 2);
  });

  // 6. Equal EPS at break-even
  it('6. should verify that EPS_A == EPS_B at the calculated break-even EBIT', () => {
    const result = calculateBreakEvenEBIT(SAMPLE_ACADEMIC_PLAN_A, SAMPLE_ACADEMIC_PLAN_B);
    expect(result.breakEvenEBIT).not.toBeNull();
    const beEbit = result.breakEvenEBIT!;

    const epsA = calculateEPS(beEbit, 0, 30, 0, 30000);
    const epsB = calculateEPS(beEbit, 200000, 30, 0, 10000);

    expect(epsA).toBeCloseTo(7.0, 4);
    expect(epsB).toBeCloseTo(7.0, 4);
    expect(Math.abs(epsA - epsB)).toBeLessThan(1e-4);
  });

  // 7. Below break-even scenario
  it('7. should identify Below Break-Even state when expected EBIT < break-even EBIT', () => {
    const scenario = evaluateScenario(SAMPLE_ACADEMIC_PLAN_A, SAMPLE_ACADEMIC_PLAN_B, 200000);
    expect(scenario.relativePosition).toBe('BELOW BREAK-EVEN');
    // At EBIT = 200,000 (< 300,000):
    // Plan A EPS: (200k * 0.7) / 30k = 4.67
    // Plan B EPS: (200k - 200k)*0.7 / 10k = 0
    expect(scenario.planA_EPS).toBeGreaterThan(scenario.planB_EPS);
  });

  // 8. Above break-even scenario
  it('8. should identify Above Break-Even state when expected EBIT > break-even EBIT', () => {
    const scenario = evaluateScenario(SAMPLE_ACADEMIC_PLAN_A, SAMPLE_ACADEMIC_PLAN_B, 500000);
    expect(scenario.relativePosition).toBe('ABOVE BREAK-EVEN');
    // At EBIT = 500,000 (> 300,000):
    // Plan A EPS = 350,000 / 30,000 = 11.67
    // Plan B EPS = (300,000 * 0.7) / 10,000 = 21.00
    expect(scenario.planB_EPS).toBeGreaterThan(scenario.planA_EPS);
  });

  // 9. Zero interest
  it('9. should handle zero interest gracefully without errors', () => {
    const eps = calculateEPS(300000, 0, 30, 0, 20000);
    expect(eps).toBe((300000 * 0.7) / 20000);
  });

  // 10. Preference dividend
  it('10. should incorporate preference dividend before equity earnings and in break-even EBIT', () => {
    const planWithPref: FinancingPlan = {
      ...SAMPLE_ACADEMIC_PLAN_B,
      preferenceShares: 500000,
      preferenceDividendRate: 10,
      preferenceDividend: 50000,
      isManualPrefDividend: false,
    };
    const result = calculateBreakEvenEBIT(SAMPLE_ACADEMIC_PLAN_A, planWithPref);
    expect(result.status).toBe('valid');
    const beEbit = result.breakEvenEBIT!;

    // Verify EPS at break-even
    const epsA = calculateEPS(beEbit, 0, 30, 0, 30000);
    const epsB = calculateEPS(beEbit, 200000, 30, 50000, 10000);
    expect(epsA).toBeCloseTo(epsB, 3);
  });

  // 11. Different share counts
  it('11. should handle arbitrary non-equal share counts accurately', () => {
    const plan1: FinancingPlan = {
      ...SAMPLE_ACADEMIC_PLAN_A,
      existingShares: 15000,
      newShares: 25000, // total 40,000
    };
    const plan2: FinancingPlan = {
      ...SAMPLE_ACADEMIC_PLAN_B,
      existingShares: 15000,
      newShares: 5000, // total 20,000
    };
    const result = calculateBreakEvenEBIT(plan1, plan2);
    expect(result.status).toBe('valid');
    expect(result.breakEvenEBIT).toBeGreaterThan(0);
  });

  // 12. Invalid inputs & parallel lines
  it('12. should detect parallel lines when both plans have equal shares but different debt', () => {
    const plan1: FinancingPlan = {
      ...SAMPLE_ACADEMIC_PLAN_A,
      existingShares: 10000,
      newShares: 10000, // 20,000 shares
    };
    const plan2: FinancingPlan = {
      ...SAMPLE_ACADEMIC_PLAN_B,
      existingShares: 10000,
      newShares: 10000, // 20,000 shares, but with 200,000 interest
    };
    const result = calculateBreakEvenEBIT(plan1, plan2);
    expect(result.status).toBe('parallel_lines');
    expect(result.breakEvenEBIT).toBeNull();
  });

  // 13. Zero shares validation guard
  it('13. should invalidate plans with zero equity shares and prevent division by zero', () => {
    const zeroSharesPlan: FinancingPlan = {
      ...SAMPLE_ACADEMIC_PLAN_A,
      existingShares: 0,
      newShares: 0,
      totalShares: 0,
    };
    const errors = validatePlan(zeroSharesPlan);
    expect(errors.totalShares).toBeDefined();

    const eps = calculateEPS(500000, 0, 30, 0, 0);
    expect(eps).toBe(0);
    expect(Number.isFinite(eps)).toBe(true);
  });

  // 14. Tax rate boundaries
  it('14. should validate and handle tax rate boundaries (0%, 100%, and negative)', () => {
    // 0% Tax
    const epsZeroTax = calculateEPS(100000, 0, 0, 0, 10000);
    expect(epsZeroTax).toBe(10);

    // 100% Tax
    const eps100Tax = calculateEPS(100000, 0, 100, 0, 10000);
    expect(eps100Tax).toBe(0);

    // Negative tax rate validation
    const invalidPlan: FinancingPlan = {
      ...SAMPLE_ACADEMIC_PLAN_A,
      taxRate: -15,
    };
    const errors = validatePlan(invalidPlan);
    expect(errors.taxRate).toBeDefined();
  });
});
