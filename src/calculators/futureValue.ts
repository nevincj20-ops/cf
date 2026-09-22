import { CompoundingFrequency, FREQUENCY_MULTIPLIERS, CalculationStep, ChartDataPoint } from '../types/tvm';

export interface FutureValueInput {
  presentValue: number;
  annualRate: number; // in percentage, e.g., 8 for 8%
  years: number;
  frequency: CompoundingFrequency;
}

export interface FutureValueResult {
  futureValue: number;
  totalInterest: number;
  originalInvestment: number;
  effectiveGrowthRate: number; // total percentage growth
  formulaUsed: string;
  steps: CalculationStep[];
  chartData: ChartDataPoint[];
}

export function calculateFutureValue(input: FutureValueInput): FutureValueResult {
  const { presentValue, annualRate, years, frequency } = input;
  const pv = Math.max(0, presentValue);
  const r = Math.max(0, annualRate) / 100;
  const n = Math.max(0, years);

  let fv = 0;
  let formulaUsed = '';
  const steps: CalculationStep[] = [];

  if (frequency === 'continuous') {
    formulaUsed = 'FV = PV × e^(r × t)';
    fv = pv * Math.exp(r * n);

    steps.push(
      { label: 'Identify Inputs', expression: `PV = ${pv.toLocaleString()}, Annual Rate (r) = ${annualRate}%, Years (t) = ${n}, Compounding = Continuous` },
      { label: 'Apply Formula', expression: `FV = PV × e^(r × t)` },
      { label: 'Substitute Values', expression: `FV = ${pv} × e^(${r.toFixed(4)} × ${n}) = ${pv} × e^(${(r * n).toFixed(4)})` },
      { label: 'Evaluate Exponent', expression: `e^(${(r * n).toFixed(4)}) ≈ ${Math.exp(r * n).toFixed(6)}` },
      { label: 'Calculate Final Value', expression: `FV = ${pv} × ${Math.exp(r * n).toFixed(6)} = ${fv.toFixed(2)}` }
    );
  } else {
    const m = FREQUENCY_MULTIPLIERS[frequency] || 1;
    const periodicRate = r / m;
    const totalPeriods = n * m;

    if (m === 1) {
      formulaUsed = 'FV = PV × (1 + r)^n';
      fv = pv * Math.pow(1 + r, n);

      steps.push(
        { label: 'Identify Inputs', expression: `PV = ${pv.toLocaleString()}, Annual Rate (r) = ${annualRate}%, Years (n) = ${n}, Compounding = Annual (m = 1)` },
        { label: 'Apply Formula', expression: `FV = PV × (1 + r)^n` },
        { label: 'Substitute Values', expression: `FV = ${pv} × (1 + ${(annualRate / 100).toFixed(4)})^${n}` },
        { label: 'Evaluate Base & Exponent', expression: `(1 + ${(annualRate / 100).toFixed(4)})^${n} = (${(1 + r).toFixed(4)})^${n} ≈ ${Math.pow(1 + r, n).toFixed(6)}` },
        { label: 'Calculate Final Value', expression: `FV = ${pv} × ${Math.pow(1 + r, n).toFixed(6)} = ${fv.toFixed(2)}` }
      );
    } else {
      formulaUsed = 'FV = PV × (1 + r/m)^(n × m)';
      fv = pv * Math.pow(1 + periodicRate, totalPeriods);

      steps.push(
        { label: 'Identify Inputs', expression: `PV = ${pv.toLocaleString()}, Annual Rate (r) = ${annualRate}%, Years (n) = ${n}, Frequency (m) = ${m} periods/yr` },
        { label: 'Periodic Rate (r/m)', expression: `Periodic Rate = ${annualRate}% / ${m} = ${(periodicRate * 100).toFixed(4)}% (${periodicRate.toFixed(6)})` },
        { label: 'Total Periods (n × m)', expression: `Total Periods = ${n} × ${m} = ${totalPeriods}` },
        { label: 'Apply Formula', expression: `FV = PV × (1 + r/m)^(n × m)` },
        { label: 'Substitute Values', expression: `FV = ${pv} × (1 + ${periodicRate.toFixed(6)})^${totalPeriods}` },
        { label: 'Calculate Growth Factor', expression: `(1 + ${periodicRate.toFixed(6)})^${totalPeriods} ≈ ${Math.pow(1 + periodicRate, totalPeriods).toFixed(6)}` },
        { label: 'Calculate Final Value', expression: `FV = ${pv} × ${Math.pow(1 + periodicRate, totalPeriods).toFixed(6)} = ${fv.toFixed(2)}` }
      );
    }
  }

  const totalInterest = Math.max(0, fv - pv);
  const effectiveGrowthRate = pv > 0 ? (totalInterest / pv) * 100 : 0;

  // Generate yearly trajectory for charting
  const chartData: ChartDataPoint[] = [];
  const totalYears = Math.ceil(n);
  
  for (let y = 0; y <= totalYears; y++) {
    const t = Math.min(y, n);
    let balanceAtT = 0;
    if (frequency === 'continuous') {
      balanceAtT = pv * Math.exp(r * t);
    } else {
      const m = FREQUENCY_MULTIPLIERS[frequency] || 1;
      balanceAtT = pv * Math.pow(1 + r / m, t * m);
    }
    const interestAtT = Math.max(0, balanceAtT - pv);

    chartData.push({
      period: y,
      label: y === 0 ? 'Today (Yr 0)' : `Year ${y}`,
      balance: Math.round(balanceAtT * 100) / 100,
      principal: pv,
      interest: Math.round(interestAtT * 100) / 100,
    });
  }

  return {
    futureValue: fv,
    totalInterest,
    originalInvestment: pv,
    effectiveGrowthRate,
    formulaUsed,
    steps,
    chartData,
  };
}
