import { CalculationStep, ChartDataPoint } from '../types/tvm';

export interface MethodComparisonItem {
  method: string;
  frequencyKey: string;
  periodsPerYear: number | string;
  finalValue: number;
  totalInterest: number;
  effectiveRate: number; // percentage
}

export interface CompoundInterestInput {
  principal: number;
  annualRate: number; // percentage
  years: number;
}

export interface CompoundInterestResult {
  principal: number;
  annualRate: number;
  years: number;
  comparisons: MethodComparisonItem[];
  timelineData: ChartDataPoint[]; // year-by-year trajectory for Simple, Annual, Monthly, Continuous
  steps: CalculationStep[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { principal, annualRate, years } = input;
  const p = Math.max(0, principal);
  const r = Math.max(0, annualRate) / 100;
  const t = Math.max(0, years);

  // 1. Simple Interest
  const simpleInterest = p * r * t;
  const simpleFinalValue = p + simpleInterest;
  const simpleEffectiveRate = t > 0 ? (simpleInterest / p / t) * 100 : 0;

  // Periodic frequencies
  const frequencies = [
    { name: 'Annual Compounding', key: 'annual', m: 1 },
    { name: 'Semi-Annual Compounding', key: 'semi-annual', m: 2 },
    { name: 'Quarterly Compounding', key: 'quarterly', m: 4 },
    { name: 'Monthly Compounding', key: 'monthly', m: 12 },
    { name: 'Daily Compounding', key: 'daily', m: 365 },
  ];

  const comparisons: MethodComparisonItem[] = [
    {
      method: 'Simple Interest',
      frequencyKey: 'simple',
      periodsPerYear: 'None',
      finalValue: simpleFinalValue,
      totalInterest: simpleInterest,
      effectiveRate: simpleEffectiveRate,
    }
  ];

  for (const freq of frequencies) {
    const fv = p * Math.pow(1 + r / freq.m, t * freq.m);
    const interest = Math.max(0, fv - p);
    const ear = (Math.pow(1 + r / freq.m, freq.m) - 1) * 100;

    comparisons.push({
      method: freq.name,
      frequencyKey: freq.key,
      periodsPerYear: freq.m,
      finalValue: fv,
      totalInterest: interest,
      effectiveRate: ear,
    });
  }

  // Continuous Compounding
  const continuousFV = p * Math.exp(r * t);
  const continuousInterest = Math.max(0, continuousFV - p);
  const continuousEAR = (Math.exp(r) - 1) * 100;

  comparisons.push({
    method: 'Continuous Compounding',
    frequencyKey: 'continuous',
    periodsPerYear: '∞ (Continuous)',
    finalValue: continuousFV,
    totalInterest: continuousInterest,
    effectiveRate: continuousEAR,
  });

  // Steps
  const steps: CalculationStep[] = [
    {
      label: 'Simple Interest Formula',
      expression: `FV_simple = P × (1 + r × t) = ${p} × (1 + ${r.toFixed(4)} × ${t}) = ${simpleFinalValue.toFixed(2)}`,
      explanation: 'Interest is earned strictly on the original principal, without compounding.',
    },
    {
      label: 'Periodic Compounding Formula',
      expression: `FV_periodic = P × (1 + r/m)^(m × t)`,
      explanation: 'Interest is added to principal m times per year, generating interest-on-interest.',
    },
    {
      label: 'Monthly Compounding Example (m=12)',
      expression: `FV_monthly = ${p} × (1 + ${r.toFixed(4)}/12)^(12 × ${t}) = ${comparisons.find(c => c.frequencyKey === 'monthly')?.finalValue.toFixed(2)}`,
    },
    {
      label: 'Continuous Compounding Formula',
      expression: `FV_continuous = P × e^(r × t) = ${p} × e^(${r.toFixed(4)} × ${t}) = ${continuousFV.toFixed(2)}`,
      explanation: 'Compounding frequency approaches infinity, reaching the theoretical mathematical limit.',
    },
  ];

  // Multi-line chart timeline from year 0 to year t
  const timelineData: ChartDataPoint[] = [];
  const maxYears = Math.ceil(t);

  for (let y = 0; y <= maxYears; y++) {
    const curT = Math.min(y, t);
    const simpleVal = p * (1 + r * curT);
    const annualVal = p * Math.pow(1 + r, curT);
    const monthlyVal = p * Math.pow(1 + r / 12, curT * 12);
    const contVal = p * Math.exp(r * curT);

    timelineData.push({
      period: y,
      label: y === 0 ? 'Start' : `Year ${y}`,
      balance: Math.round(monthlyVal * 100) / 100, // primary
      simple: Math.round(simpleVal * 100) / 100,
      annual: Math.round(annualVal * 100) / 100,
      monthly: Math.round(monthlyVal * 100) / 100,
      continuous: Math.round(contVal * 100) / 100,
      principal: p,
    });
  }

  return {
    principal: p,
    annualRate,
    years: t,
    comparisons,
    timelineData,
    steps,
  };
}
