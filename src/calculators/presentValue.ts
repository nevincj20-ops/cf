import { CompoundingFrequency, FREQUENCY_MULTIPLIERS, CalculationStep, ChartDataPoint } from '../types/tvm';

export interface PresentValueInput {
  futureValue: number;
  discountRate: number; // in percentage, e.g., 10 for 10%
  years: number;
  frequency: CompoundingFrequency;
}

export interface PresentValueResult {
  presentValue: number;
  discountAmount: number;
  futureAmount: number;
  discountRate: number;
  formulaUsed: string;
  steps: CalculationStep[];
  chartData: ChartDataPoint[];
}

export function calculatePresentValue(input: PresentValueInput): PresentValueResult {
  const { futureValue, discountRate, years, frequency } = input;
  const fv = Math.max(0, futureValue);
  const r = Math.max(0, discountRate) / 100;
  const n = Math.max(0, years);

  let pv = 0;
  let formulaUsed = '';
  const steps: CalculationStep[] = [];

  if (frequency === 'continuous') {
    formulaUsed = 'PV = FV / e^(r × t) = FV × e^(-r × t)';
    pv = fv * Math.exp(-r * n);

    steps.push(
      { label: 'Identify Inputs', expression: `FV = ${fv.toLocaleString()}, Discount Rate (r) = ${discountRate}%, Years (t) = ${n}, Compounding = Continuous` },
      { label: 'Apply Formula', expression: `PV = FV × e^(-r × t)` },
      { label: 'Substitute Values', expression: `PV = ${fv} × e^(-${r.toFixed(4)} × ${n}) = ${fv} × e^(-${(r * n).toFixed(4)})` },
      { label: 'Evaluate Discount Factor', expression: `e^(-${(r * n).toFixed(4)}) ≈ ${Math.exp(-r * n).toFixed(6)}` },
      { label: 'Calculate Present Value', expression: `PV = ${fv} × ${Math.exp(-r * n).toFixed(6)} = ${pv.toFixed(2)}` }
    );
  } else {
    const m = FREQUENCY_MULTIPLIERS[frequency] || 1;
    const periodicRate = r / m;
    const totalPeriods = n * m;

    if (m === 1) {
      formulaUsed = 'PV = FV / (1 + r)^n';
      const denominator = Math.pow(1 + r, n);
      pv = denominator > 0 ? fv / denominator : 0;

      steps.push(
        { label: 'Identify Inputs', expression: `FV = ${fv.toLocaleString()}, Discount Rate (r) = ${discountRate}%, Years (n) = ${n}, Compounding = Annual (m = 1)` },
        { label: 'Apply Formula', expression: `PV = FV / (1 + r)^n` },
        { label: 'Substitute Values', expression: `PV = ${fv} / (1 + ${r.toFixed(4)})^${n}` },
        { label: 'Calculate Denominator', expression: `(1 + ${r.toFixed(4)})^${n} = (${(1 + r).toFixed(4)})^${n} ≈ ${denominator.toFixed(6)}` },
        { label: 'Calculate Present Value', expression: `PV = ${fv} / ${denominator.toFixed(6)} = ${pv.toFixed(2)}` }
      );
    } else {
      formulaUsed = 'PV = FV / (1 + r/m)^(n × m)';
      const denominator = Math.pow(1 + periodicRate, totalPeriods);
      pv = denominator > 0 ? fv / denominator : 0;

      steps.push(
        { label: 'Identify Inputs', expression: `FV = ${fv.toLocaleString()}, Discount Rate (r) = ${discountRate}%, Years (n) = ${n}, Frequency = ${m} periods/yr` },
        { label: 'Periodic Rate (r/m)', expression: `Periodic Rate = ${discountRate}% / ${m} = ${(periodicRate * 100).toFixed(4)}% (${periodicRate.toFixed(6)})` },
        { label: 'Total Periods (n × m)', expression: `Total Periods = ${n} × ${m} = ${totalPeriods}` },
        { label: 'Apply Formula', expression: `PV = FV / (1 + r/m)^(n × m)` },
        { label: 'Substitute Values', expression: `PV = ${fv} / (1 + ${periodicRate.toFixed(6)})^${totalPeriods}` },
        { label: 'Calculate Compounded Factor', expression: `(1 + ${periodicRate.toFixed(6)})^${totalPeriods} ≈ ${denominator.toFixed(6)}` },
        { label: 'Calculate Present Value', expression: `PV = ${fv} / ${denominator.toFixed(6)} = ${pv.toFixed(2)}` }
      );
    }
  }

  const discountAmount = Math.max(0, fv - pv);

  // Generate chart trajectory from year 0 to year n
  const chartData: ChartDataPoint[] = [];
  const totalYears = Math.ceil(n);

  for (let y = 0; y <= totalYears; y++) {
    const t = Math.min(y, n);
    let discountedAtT = 0;
    if (frequency === 'continuous') {
      discountedAtT = fv * Math.exp(-r * (n - t));
    } else {
      const m = FREQUENCY_MULTIPLIERS[frequency] || 1;
      const factor = Math.pow(1 + r / m, (n - t) * m);
      discountedAtT = factor > 0 ? fv / factor : 0;
    }

    chartData.push({
      period: y,
      label: y === 0 ? 'Today (PV)' : y === totalYears ? `Year ${y} (FV)` : `Year ${y}`,
      balance: Math.round(discountedAtT * 100) / 100,
      principal: Math.round(pv * 100) / 100,
      interest: Math.round(Math.max(0, discountedAtT - pv) * 100) / 100,
    });
  }

  return {
    presentValue: pv,
    discountAmount,
    futureAmount: fv,
    discountRate: discountRate,
    formulaUsed,
    steps,
    chartData,
  };
}
