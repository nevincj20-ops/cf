import { CalculationStep } from '../types/tvm';

export interface PerpetuityInput {
  cashFlow: number; // PMT or C1
  discountRate: number; // percentage, e.g., 8 for 8%
  growthRate?: number; // percentage, e.g., 3 for 3% (0 for simple perpetuity)
  isGrowing: boolean;
}

export interface PerpetuityResult {
  presentValue: number;
  cashFlow: number;
  discountRate: number;
  growthRate: number;
  formulaUsed: string;
  isValid: boolean;
  errorMessage?: string;
  steps: CalculationStep[];
}

export function calculatePerpetuity(input: PerpetuityInput): PerpetuityResult {
  const { cashFlow, discountRate, growthRate = 0, isGrowing } = input;
  const c = Math.max(0, cashFlow);
  const r = discountRate / 100;
  const g = (isGrowing ? growthRate : 0) / 100;

  const steps: CalculationStep[] = [];

  if (r <= 0) {
    return {
      presentValue: 0,
      cashFlow: c,
      discountRate,
      growthRate: isGrowing ? growthRate : 0,
      formulaUsed: isGrowing ? 'PV = C1 / (r - g)' : 'PV = PMT / r',
      isValid: false,
      errorMessage: 'Discount rate must be greater than 0% for perpetuity to have a finite present value.',
      steps: [
        { label: 'Validation Error', expression: `Discount rate (r = ${discountRate}%) must be > 0% to avoid infinite valuation.` }
      ],
    };
  }

  if (isGrowing) {
    const formulaUsed = 'PV = C1 / (r - g)';
    if (r <= g) {
      return {
        presentValue: 0,
        cashFlow: c,
        discountRate,
        growthRate,
        formulaUsed,
        isValid: false,
        errorMessage: `For growing perpetuity to converge, discount rate (r = ${discountRate}%) must be strictly greater than growth rate (g = ${growthRate}%).`,
        steps: [
          { label: 'Condition Check', expression: `r (${discountRate}%) <= g (${growthRate}%)` },
          { label: 'Mathematical Constraint', expression: 'The denominator (r - g) must be positive, otherwise the stream diverges to infinity.' }
        ]
      };
    }

    const netRate = r - g;
    const pv = c / netRate;

    steps.push(
      { label: 'Identify Inputs', expression: `Next Period Cash Flow (C1) = ${c.toLocaleString()}, Discount Rate (r) = ${discountRate}%, Growth Rate (g) = ${growthRate}%` },
      { label: 'Check Convergence Condition', expression: `r (${(r * 100).toFixed(2)}%) > g (${(g * 100).toFixed(2)}%) ✓ (Condition satisfied)` },
      { label: 'Formula', expression: `PV = C1 / (r - g)` },
      { label: 'Denominator (r - g)', expression: `r - g = ${r.toFixed(4)} - ${g.toFixed(4)} = ${netRate.toFixed(4)} (${(netRate * 100).toFixed(2)}%)` },
      { label: 'Calculate Present Value', expression: `PV = ${c} / ${netRate.toFixed(4)} = ${pv.toFixed(2)}` }
    );

    return {
      presentValue: pv,
      cashFlow: c,
      discountRate,
      growthRate,
      formulaUsed,
      isValid: true,
      steps,
    };
  } else {
    const formulaUsed = 'PV = PMT / r';
    const pv = c / r;

    steps.push(
      { label: 'Identify Inputs', expression: `Periodic Payment (PMT) = ${c.toLocaleString()}, Discount Rate (r) = ${discountRate}% (${r.toFixed(4)})` },
      { label: 'Formula', expression: `PV = PMT / r` },
      { label: 'Substitute Values', expression: `PV = ${c} / ${r.toFixed(4)}` },
      { label: 'Calculate Present Value', expression: `PV = ${pv.toFixed(2)}` }
    );

    return {
      presentValue: pv,
      cashFlow: c,
      discountRate,
      growthRate: 0,
      formulaUsed,
      isValid: true,
      steps,
    };
  }
}
