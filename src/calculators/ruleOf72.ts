import { CalculationStep } from '../types/tvm';

export interface RuleOf72Input {
  mode: 'rateToTime' | 'timeToRate';
  rate?: number; // annual rate in %
  years?: number; // target years
}

export interface RuleOf72Result {
  mode: 'rateToTime' | 'timeToRate';
  inputRate: number;
  inputYears: number;
  approxYears: number;
  exactYears: number;
  approxRate: number;
  exactRate: number;
  difference: number;
  steps: CalculationStep[];
  formulaUsed: string;
}

export function calculateRuleOf72(input: RuleOf72Input): RuleOf72Result {
  const mode = input.mode;
  const steps: CalculationStep[] = [];

  if (mode === 'rateToTime') {
    const rate = Math.max(0.01, input.rate || 7.2);
    const approxYears = 72 / rate;
    const exactYears = Math.log(2) / Math.log(1 + rate / 100);
    const difference = Math.abs(approxYears - exactYears);

    steps.push(
      {
        label: 'Rule of 72 Approximation',
        expression: `Doubling Time ≈ 72 / Rate(%) = 72 / ${rate} = ${approxYears.toFixed(2)} years`,
        explanation: 'A quick rule of thumb for estimating when an investment doubles with compound growth.',
      },
      {
        label: 'Exact Formula (Logarithmic)',
        expression: `t_exact = ln(2) / ln(1 + r) = ${Math.log(2).toFixed(6)} / ln(${ (1 + rate / 100).toFixed(4) }) = ${exactYears.toFixed(2)} years`,
        explanation: `Difference between Rule of 72 and exact compound growth is only ${difference.toFixed(2)} years.`,
      }
    );

    return {
      mode,
      inputRate: rate,
      inputYears: approxYears,
      approxYears,
      exactYears,
      approxRate: rate,
      exactRate: rate,
      difference,
      steps,
      formulaUsed: 'Doubling Time ≈ 72 / Interest Rate',
    };
  } else {
    const years = Math.max(0.1, input.years || 9);
    const approxRate = 72 / years;
    const exactRate = (Math.pow(2, 1 / years) - 1) * 100;
    const difference = Math.abs(approxRate - exactRate);

    steps.push(
      {
        label: 'Rule of 72 Reverse Approximation',
        expression: `Required Rate ≈ 72 / Desired Years = 72 / ${years} = ${approxRate.toFixed(2)}%`,
        explanation: 'Annual return required to double the capital within the specified time horizon.',
      },
      {
        label: 'Exact Formula (Root)',
        expression: `r_exact = (2^(1 / t) - 1) × 100 = (2^(1 / ${years}) - 1) × 100 = ${exactRate.toFixed(2)}%`,
        explanation: `Difference between approximation and exact formula is ${difference.toFixed(2)} percentage points.`,
      }
    );

    return {
      mode,
      inputRate: approxRate,
      inputYears: years,
      approxYears: years,
      exactYears: years,
      approxRate,
      exactRate,
      difference,
      steps,
      formulaUsed: 'Required Rate ≈ 72 / Desired Years',
    };
  }
}
