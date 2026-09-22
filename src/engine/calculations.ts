import {
  FinancingPlan,
  PlanCalculationWorking,
  BreakEvenResult,
  SensitivityRow,
  ScenarioResult,
  AlgebraicDerivationStep,
} from './types';

/**
 * Format helper for currency representation in workings (Indian numbering system)
 */
export function formatCurrencyINR(amount: number, decimals: number = 2): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '₹0.00';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const fixed = absAmount.toFixed(decimals);
  const [integerPart, decimalPart] = fixed.split('.');
  
  // Indian currency formatting: last 3 digits, then groups of 2 digits
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  const result = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  return `${isNegative ? '-' : ''}₹${result}`;
}

/**
 * Calculate Interest expense
 */
export function calculateInterest(
  debtAmount: number,
  interestRate: number,
  isManual: boolean = false,
  manualAmount: number = 0
): number {
  if (isManual) {
    return Math.max(0, manualAmount || 0);
  }
  const principal = Math.max(0, debtAmount || 0);
  const rate = Math.max(0, interestRate || 0);
  return (principal * rate) / 100;
}

/**
 * Calculate Preference Dividend
 */
export function calculatePreferenceDividend(
  preferenceShares: number,
  dividendRate: number,
  isManual: boolean = false,
  manualDividend: number = 0
): number {
  if (isManual) {
    return Math.max(0, manualDividend || 0);
  }
  const capital = Math.max(0, preferenceShares || 0);
  const rate = Math.max(0, dividendRate || 0);
  return (capital * rate) / 100;
}

/**
 * Calculate Earnings Before Tax (EBT)
 */
export function calculateEBT(ebit: number, interest: number): number {
  return ebit - interest;
}

/**
 * Calculate Tax amount
 * Standard Corporate Finance convention: Tax is computed on positive EBT.
 * If EBT <= 0, tax liability is zero (unless tax credit applies, but textbook assumption is 0).
 */
export function calculateTax(ebt: number, taxRatePercentage: number): number {
  const rate = Math.max(0, Math.min(100, taxRatePercentage || 0)) / 100;
  return ebt > 0 ? ebt * rate : 0;
}

/**
 * Calculate Profit After Tax (PAT)
 */
export function calculatePAT(ebt: number, tax: number): number {
  return ebt - tax;
}

/**
 * Calculate Earnings Available to Equity Shareholders
 */
export function calculateEquityEarnings(pat: number, preferenceDividend: number): number {
  return pat - (preferenceDividend || 0);
}

/**
 * Calculate Earnings Per Share (EPS)
 * Formula: [(EBIT - Interest) * (1 - TaxRate) - PreferenceDividend] / TotalShares
 */
export function calculateEPS(
  ebit: number,
  interest: number,
  taxRatePercentage: number,
  preferenceDividend: number,
  totalShares: number
): number {
  if (!totalShares || totalShares <= 0) {
    return 0;
  }
  const ebt = calculateEBT(ebit, interest);
  const tax = calculateTax(ebt, taxRatePercentage);
  const pat = calculatePAT(ebt, tax);
  const equityEarnings = calculateEquityEarnings(pat, preferenceDividend);
  return equityEarnings / totalShares;
}

/**
 * Generate complete step-by-step Income Statement working for a plan at given EBIT
 */
export function calculatePlanWorking(plan: FinancingPlan, ebit: number): PlanCalculationWorking {
  const interest = plan.isManualInterest
    ? plan.interestAmount
    : calculateInterest(plan.debtAmount, plan.interestRate);

  const prefDiv = plan.isManualPrefDividend
    ? plan.preferenceDividend
    : calculatePreferenceDividend(plan.preferenceShares, plan.preferenceDividendRate);

  const totalShares = plan.existingShares + plan.newShares;
  const ebt = calculateEBT(ebit, interest);
  const taxAmount = calculateTax(ebt, plan.taxRate);
  const pat = calculatePAT(ebt, taxAmount);
  const equityEarnings = calculateEquityEarnings(pat, prefDiv);
  const eps = totalShares > 0 ? equityEarnings / totalShares : 0;

  return {
    ebit,
    interest,
    ebt,
    taxRate: plan.taxRate,
    taxAmount,
    pat,
    preferenceDividend: prefDiv,
    equityEarnings,
    totalShares,
    eps,
  };
}

/**
 * Dynamically solve Break-even EBIT (Indifference Point):
 * Equating EPS_A = EPS_B:
 * [(EBIT - IA) * (1 - TA) - PDA] / NA = [(EBIT - IB) * (1 - TB) - PDB] / NB
 */
export function calculateBreakEvenEBIT(planA: FinancingPlan, planB: FinancingPlan): BreakEvenResult {
  const totalSharesA = planA.existingShares + planA.newShares;
  const totalSharesB = planB.existingShares + planB.newShares;

  if (totalSharesA <= 0 || totalSharesB <= 0) {
    return {
      status: 'invalid_inputs',
      breakEvenEBIT: null,
      epsAtBreakEven: null,
      planA_EPS: null,
      planB_EPS: null,
      difference: 0,
      message: 'Both financing plans must have equity share counts greater than zero.',
      algebraicSteps: [],
    };
  }

  const interestA = planA.isManualInterest
    ? planA.interestAmount
    : calculateInterest(planA.debtAmount, planA.interestRate);
  const interestB = planB.isManualInterest
    ? planB.interestAmount
    : calculateInterest(planB.debtAmount, planB.interestRate);

  const prefDivA = planA.isManualPrefDividend
    ? planA.preferenceDividend
    : calculatePreferenceDividend(planA.preferenceShares, planA.preferenceDividendRate);
  const prefDivB = planB.isManualPrefDividend
    ? planB.preferenceDividend
    : calculatePreferenceDividend(planB.preferenceShares, planB.preferenceDividendRate);

  const tA = Math.max(0, Math.min(100, planA.taxRate)) / 100;
  const tB = Math.max(0, Math.min(100, planB.taxRate)) / 100;

  // Coefficient of EBIT in:
  // NB * (1 - TA) * EBIT - NA * (1 - TB) * EBIT = Constant
  const ebitCoeff = totalSharesB * (1 - tA) - totalSharesA * (1 - tB);

  // Constant on the right side:
  // Constant = NB * [IA * (1 - TA) + PDA] - NA * [IB * (1 - TB) + PDB]
  const constA = interestA * (1 - tA) + prefDivA;
  const constB = interestB * (1 - tB) + prefDivB;
  const rightSide = totalSharesB * constA - totalSharesA * constB;

  // Check if slopes are identical (e.g. NA == NB and TA == TB)
  if (Math.abs(ebitCoeff) < 1e-9) {
    if (Math.abs(rightSide) < 1e-9) {
      return {
        status: 'identical_plans',
        breakEvenEBIT: null,
        epsAtBreakEven: null,
        planA_EPS: null,
        planB_EPS: null,
        difference: 0,
        message:
          'Both financing plans have identical financial leverage and share structure. EPS is identical at all EBIT levels.',
        algebraicSteps: [],
      };
    } else {
      return {
        status: 'parallel_lines',
        breakEvenEBIT: null,
        epsAtBreakEven: null,
        planA_EPS: null,
        planB_EPS: null,
        difference: 0,
        message:
          'Both financing plans have identical equity share counts with different fixed charges. The EPS lines are parallel and will never intersect. An indifference EBIT point does not exist.',
        algebraicSteps: [],
      };
    }
  }

  // Break-even EBIT:
  const breakEvenEBIT = rightSide / ebitCoeff;

  // Calculate EPS at breakEvenEBIT:
  const epsA = calculateEPS(breakEvenEBIT, interestA, planA.taxRate, prefDivA, totalSharesA);
  const epsB = calculateEPS(breakEvenEBIT, interestB, planB.taxRate, prefDivB, totalSharesB);
  const difference = Math.abs(epsA - epsB);

  // Generate algebraic step-by-step workings with actual user numbers
  const algebraicSteps = generateBreakEvenSteps({
    planA,
    planB,
    totalSharesA,
    totalSharesB,
    interestA,
    interestB,
    prefDivA,
    prefDivB,
    tA,
    tB,
    breakEvenEBIT,
    epsA,
    epsB,
  });

  return {
    status: breakEvenEBIT < 0 ? 'negative_ebit' : 'valid',
    breakEvenEBIT,
    epsAtBreakEven: epsA,
    planA_EPS: epsA,
    planB_EPS: epsB,
    difference,
    message:
      breakEvenEBIT < 0
        ? 'The calculated indifference EBIT is negative, indicating that the intersection occurs during operating losses under the given capital structures.'
        : 'Indifference EBIT calculated successfully where both financing plans yield the exact same EPS.',
    algebraicSteps,
  };
}

interface StepParams {
  planA: FinancingPlan;
  planB: FinancingPlan;
  totalSharesA: number;
  totalSharesB: number;
  interestA: number;
  interestB: number;
  prefDivA: number;
  prefDivB: number;
  tA: number;
  tB: number;
  breakEvenEBIT: number;
  epsA: number;
  epsB: number;
}

function generateBreakEvenSteps(p: StepParams): AlgebraicDerivationStep[] {
  const steps: AlgebraicDerivationStep[] = [];

  // Step 1: Equilibrium Condition
  steps.push({
    title: 'Step 1: State the Indifference Condition',
    equation: 'EPS_A = EPS_B',
    explanation:
      'Break-even (Indifference) EBIT is the operating profit level where EPS under Financing Plan A is exactly equal to EPS under Financing Plan B.',
  });

  // Step 2: Expanded Formula
  steps.push({
    title: 'Step 2: General EPS Equivalence Equation',
    equation:
      '[(EBIT - I_A) × (1 - T) - PD_A] / N_A = [(EBIT - I_B) × (1 - T) - PD_B] / N_B',
    explanation:
      'Substitute the standard Earnings Per Share formula for both financing plans.',
  });

  // Step 3: Numerical Substitution
  const taxFactorA = (1 - p.tA).toFixed(4);
  const taxFactorB = (1 - p.tB).toFixed(4);
  const eqSub = `[(EBIT - ${p.interestA.toLocaleString('en-IN')}) × ${taxFactorA} - ${p.prefDivA.toLocaleString('en-IN')}] / ${p.totalSharesA.toLocaleString('en-IN')} = [(EBIT - ${p.interestB.toLocaleString('en-IN')}) × ${taxFactorB} - ${p.prefDivB.toLocaleString('en-IN')}] / ${p.totalSharesB.toLocaleString('en-IN')}`;
  steps.push({
    title: 'Step 3: Substitute Plan Parameters',
    equation: eqSub,
    explanation:
      'Plug in actual user values for Interest, Tax Rate, Preference Dividend, and Total Equity Shares.',
  });

  // Step 4: Cross-Multiplication
  const multEq = `${p.totalSharesB.toLocaleString('en-IN')} × [(EBIT - ${p.interestA.toLocaleString('en-IN')}) × ${taxFactorA} - ${p.prefDivA.toLocaleString('en-IN')}] = ${p.totalSharesA.toLocaleString('en-IN')} × [(EBIT - ${p.interestB.toLocaleString('en-IN')}) × ${taxFactorB} - ${p.prefDivB.toLocaleString('en-IN')}]`;
  steps.push({
    title: 'Step 4: Cross-Multiply by Equity Shares',
    equation: multEq,
    explanation:
      `Multiply both sides by (N_A × N_B) to eliminate fractional denominators (${p.totalSharesA.toLocaleString('en-IN')} × ${p.totalSharesB.toLocaleString('en-IN')}).`,
  });

  // Step 5: Algebraic Expansion & Grouping
  const coeffEbit = (p.totalSharesB * (1 - p.tA) - p.totalSharesA * (1 - p.tB)).toFixed(2);
  const constTerm = (
    p.totalSharesB * (p.interestA * (1 - p.tA) + p.prefDivA) -
    p.totalSharesA * (p.interestB * (1 - p.tB) + p.prefDivB)
  ).toFixed(2);
  const groupEq = `${coeffEbit} × EBIT = ${parseFloat(constTerm).toLocaleString('en-IN')}`;
  steps.push({
    title: 'Step 5: Group Terms and Isolate EBIT',
    equation: groupEq,
    explanation:
      'Collect all terms containing EBIT on the left-hand side and all fixed financing charges on the right-hand side.',
  });

  // Step 6: Final Solution
  steps.push({
    title: 'Step 6: Solve for Break-Even EBIT',
    equation: `EBIT* = ${formatCurrencyINR(p.breakEvenEBIT, 2)}`,
    explanation: `Divide the constant term by the EBIT coefficient to find the exact Indifference Operating Earnings.`,
  });

  // Step 7: Proof & Verification
  steps.push({
    title: 'Step 7: Verification of Equal EPS',
    equation: `Plan A EPS = ₹${p.epsA.toFixed(2)} | Plan B EPS = ₹${p.epsB.toFixed(2)} (Δ = ₹${Math.abs(p.epsA - p.epsB).toFixed(4)})`,
    explanation:
      'Substituting EBIT* back into both individual income statements proves both financing plans yield the identical EPS of ₹' +
      p.epsA.toFixed(2) +
      '.',
  });

  return steps;
}

/**
 * Generate Sensitivity Analysis Table
 */
export function generateSensitivityTable(
  planA: FinancingPlan,
  planB: FinancingPlan,
  minEbit: number,
  maxEbit: number,
  intervals: number = 10
): SensitivityRow[] {
  const rows: SensitivityRow[] = [];
  const safeMin = Math.max(0, minEbit || 0);
  const safeMax = Math.max(safeMin + 1000, maxEbit || 1000000);
  const safeIntervals = Math.max(2, Math.min(50, intervals || 10));
  const step = (safeMax - safeMin) / safeIntervals;

  const beResult = calculateBreakEvenEBIT(planA, planB);
  let breakEvenInserted = false;

  for (let i = 0; i <= safeIntervals; i++) {
    const currentEbit = safeMin + i * step;

    // Check if break-even point falls in between this interval
    if (
      beResult.breakEvenEBIT !== null &&
      beResult.breakEvenEBIT > 0 &&
      !breakEvenInserted &&
      beResult.breakEvenEBIT >= safeMin &&
      beResult.breakEvenEBIT <= safeMax
    ) {
      const prevEbit = safeMin + (i - 1) * step;
      if (i > 0 && prevEbit < beResult.breakEvenEBIT && currentEbit > beResult.breakEvenEBIT) {
        // Insert exact break-even row
        const beEpsA = calculateEPS(
          beResult.breakEvenEBIT,
          planA.isManualInterest ? planA.interestAmount : calculateInterest(planA.debtAmount, planA.interestRate),
          planA.taxRate,
          planA.isManualPrefDividend ? planA.preferenceDividend : calculatePreferenceDividend(planA.preferenceShares, planA.preferenceDividendRate),
          planA.existingShares + planA.newShares
        );
        const beEpsB = calculateEPS(
          beResult.breakEvenEBIT,
          planB.isManualInterest ? planB.interestAmount : calculateInterest(planB.debtAmount, planB.interestRate),
          planB.taxRate,
          planB.isManualPrefDividend ? planB.preferenceDividend : calculatePreferenceDividend(planB.preferenceShares, planB.preferenceDividendRate),
          planB.existingShares + planB.newShares
        );
        rows.push({
          ebit: beResult.breakEvenEBIT,
          planA_EPS: beEpsA,
          planB_EPS: beEpsB,
          difference: 0,
          favorablePlan: 'Indifferent',
          isBreakEvenPoint: true,
        });
        breakEvenInserted = true;
      }
    }

    const epsA = calculateEPS(
      currentEbit,
      planA.isManualInterest ? planA.interestAmount : calculateInterest(planA.debtAmount, planA.interestRate),
      planA.taxRate,
      planA.isManualPrefDividend ? planA.preferenceDividend : calculatePreferenceDividend(planA.preferenceShares, planA.preferenceDividendRate),
      planA.existingShares + planA.newShares
    );
    const epsB = calculateEPS(
      currentEbit,
      planB.isManualInterest ? planB.interestAmount : calculateInterest(planB.debtAmount, planB.interestRate),
      planB.taxRate,
      planB.isManualPrefDividend ? planB.preferenceDividend : calculatePreferenceDividend(planB.preferenceShares, planB.preferenceDividendRate),
      planB.existingShares + planB.newShares
    );

    const diff = epsA - epsB;
    let favorable: 'Plan A' | 'Plan B' | 'Indifferent' = 'Indifferent';
    if (Math.abs(diff) < 0.005) {
      favorable = 'Indifferent';
    } else if (diff > 0) {
      favorable = 'Plan A';
    } else {
      favorable = 'Plan B';
    }

    rows.push({
      ebit: currentEbit,
      planA_EPS: epsA,
      planB_EPS: epsB,
      difference: Math.abs(diff),
      favorablePlan: favorable,
      isBreakEvenPoint: beResult.breakEvenEBIT !== null && Math.abs(currentEbit - beResult.breakEvenEBIT) < 1,
    });
  }

  return rows;
}

/**
 * Scenario Testing & Academic Interpretation Engine
 * strictly complies with section 20:
 * State 1: Expected EBIT < Break-even EBIT
 * State 2: Expected EBIT = Break-even EBIT
 * State 3: Expected EBIT > Break-even EBIT
 */
export function evaluateScenario(
  planA: FinancingPlan,
  planB: FinancingPlan,
  expectedEbit: number
): ScenarioResult {
  const beResult = calculateBreakEvenEBIT(planA, planB);

  const interestA = planA.isManualInterest ? planA.interestAmount : calculateInterest(planA.debtAmount, planA.interestRate);
  const interestB = planB.isManualInterest ? planB.interestAmount : calculateInterest(planB.debtAmount, planB.interestRate);
  const prefDivA = planA.isManualPrefDividend ? planA.preferenceDividend : calculatePreferenceDividend(planA.preferenceShares, planA.preferenceDividendRate);
  const prefDivB = planB.isManualPrefDividend ? planB.preferenceDividend : calculatePreferenceDividend(planB.preferenceShares, planB.preferenceDividendRate);
  const totalA = planA.existingShares + planA.newShares;
  const totalB = planB.existingShares + planB.newShares;

  const planA_EPS = calculateEPS(expectedEbit, interestA, planA.taxRate, prefDivA, totalA);
  const planB_EPS = calculateEPS(expectedEbit, interestB, planB.taxRate, prefDivB, totalB);
  const diff = planA_EPS - planB_EPS;

  let percentageDiff: number | null = null;
  const minEPS = Math.min(Math.abs(planA_EPS), Math.abs(planB_EPS));
  if (minEPS > 0.0001) {
    percentageDiff = (Math.abs(diff) / minEPS) * 100;
  }

  if (beResult.status !== 'valid' || beResult.breakEvenEBIT === null) {
    return {
      expectedEbit,
      planA_EPS,
      planB_EPS,
      difference: Math.abs(diff),
      percentageDiff,
      relativePosition: 'INCOMPARABLE',
      interpretation: beResult.message,
    };
  }

  const be = beResult.breakEvenEBIT;
  const tolerance = Math.max(10, be * 0.001); // 0.1% tolerance or ₹10

  if (Math.abs(expectedEbit - be) <= tolerance) {
    return {
      expectedEbit,
      planA_EPS,
      planB_EPS,
      difference: Math.abs(diff),
      percentageDiff: 0,
      relativePosition: 'AT BREAK-EVEN',
      interpretation:
        'The selected EBIT is approximately equal to the break-even EBIT. Under the specified assumptions, both financing alternatives produce approximately the same EPS (Plan A: ' +
        formatCurrencyINR(planA_EPS) +
        ', Plan B: ' +
        formatCurrencyINR(planB_EPS) +
        ').',
    };
  } else if (expectedEbit < be) {
    const higherPlan = planA_EPS > planB_EPS ? 'Plan A' : planB_EPS > planA_EPS ? 'Plan B' : 'Neither';
    return {
      expectedEbit,
      planA_EPS,
      planB_EPS,
      difference: Math.abs(diff),
      percentageDiff,
      relativePosition: 'BELOW BREAK-EVEN',
      interpretation:
        `The selected EBIT (${formatCurrencyINR(expectedEbit)}) is below the calculated break-even EBIT (${formatCurrencyINR(be)}). At this EBIT level, ${higherPlan} produces the higher EPS (${formatCurrencyINR(Math.max(planA_EPS, planB_EPS))}) compared to ${higherPlan === 'Plan A' ? 'Plan B' : 'Plan A'} (${formatCurrencyINR(Math.min(planA_EPS, planB_EPS))}) under the specified assumptions.`,
    };
  } else {
    const higherPlan = planA_EPS > planB_EPS ? 'Plan A' : planB_EPS > planA_EPS ? 'Plan B' : 'Neither';
    return {
      expectedEbit,
      planA_EPS,
      planB_EPS,
      difference: Math.abs(diff),
      percentageDiff,
      relativePosition: 'ABOVE BREAK-EVEN',
      interpretation:
        `The selected EBIT (${formatCurrencyINR(expectedEbit)}) is above the calculated break-even EBIT (${formatCurrencyINR(be)}). At this EBIT level, ${higherPlan} produces the higher EPS (${formatCurrencyINR(Math.max(planA_EPS, planB_EPS))}) compared to ${higherPlan === 'Plan A' ? 'Plan B' : 'Plan A'} (${formatCurrencyINR(Math.min(planA_EPS, planB_EPS))}) under the specified assumptions.`,
    };
  }
}
