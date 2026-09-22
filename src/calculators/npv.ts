import { CalculationStep, ChartDataPoint } from '../types/tvm';
import { calculateIRR, npvAtRate } from './irr';

export interface CashFlowPoint {
  period: number;
  amount: number;
  label?: string;
}

export interface NPVInput {
  discountRate: number; // percentage, e.g. 10%
  cashFlows: CashFlowPoint[];
}

export interface CashFlowRowResult {
  period: number;
  amount: number;
  discountFactor: number;
  discountedAmount: number;
  cumulativeNet: number;
  cumulativeDiscounted: number;
}

export interface NPVResult {
  discountRate: number;
  npv: number;
  totalInflows: number;
  totalOutflows: number;
  netNominalCashFlow: number;
  irr: number | null;
  profitabilityIndex: number | null;
  paybackPeriod: number | null; // in periods
  discountedPaybackPeriod: number | null;
  rows: CashFlowRowResult[];
  chartData: ChartDataPoint[];
  steps: CalculationStep[];
  formulaUsed: string;
}

export function calculateNPV(input: NPVInput): NPVResult {
  const { discountRate, cashFlows } = input;
  const r = Math.max(-0.99, discountRate) / 100;

  // Sort cash flows by period
  const sorted = [...cashFlows].sort((a, b) => a.period - b.period);

  let totalInflows = 0;
  let totalOutflows = 0;
  let runningCumulative = 0;
  let runningDiscounted = 0;

  let totalPVInflows = 0;
  let totalPVOutflows = 0;

  const rows: CashFlowRowResult[] = sorted.map(cf => {
    if (cf.amount >= 0) {
      totalInflows += cf.amount;
    } else {
      totalOutflows += Math.abs(cf.amount);
    }

    const factor = Math.pow(1 + r, -cf.period);
    const discounted = cf.amount * factor;

    if (cf.amount >= 0) {
      totalPVInflows += discounted;
    } else {
      totalPVOutflows += Math.abs(discounted);
    }

    runningCumulative += cf.amount;
    runningDiscounted += discounted;

    return {
      period: cf.period,
      amount: cf.amount,
      discountFactor: factor,
      discountedAmount: discounted,
      cumulativeNet: runningCumulative,
      cumulativeDiscounted: runningDiscounted,
    };
  });

  const npv = runningDiscounted;
  const netNominalCashFlow = runningCumulative;

  // Calculate Payback Period
  let paybackPeriod: number | null = null;
  let prevRow: CashFlowRowResult | null = null;
  for (const row of rows) {
    if (row.cumulativeNet >= 0 && prevRow && prevRow.cumulativeNet < 0) {
      const needed = Math.abs(prevRow.cumulativeNet);
      const gained = row.amount;
      paybackPeriod = prevRow.period + (gained > 0 ? needed / gained : 0);
      break;
    }
    prevRow = row;
  }

  // Calculate Discounted Payback Period
  let discountedPaybackPeriod: number | null = null;
  let prevDiscRow: CashFlowRowResult | null = null;
  for (const row of rows) {
    if (row.cumulativeDiscounted >= 0 && prevDiscRow && prevDiscRow.cumulativeDiscounted < 0) {
      const needed = Math.abs(prevDiscRow.cumulativeDiscounted);
      const gained = row.discountedAmount;
      discountedPaybackPeriod = prevDiscRow.period + (gained > 0 ? needed / gained : 0);
      break;
    }
    prevDiscRow = row;
  }

  // Profitability Index = Total PV of future inflows / Initial outflow
  const profitabilityIndex = totalPVOutflows > 0 ? (totalPVInflows / totalPVOutflows) : null;

  // Calculate IRR
  const irr = calculateIRR(sorted);

  // Generate Steps
  const formulaUsed = 'NPV = ∑ [ CF_t / (1 + r)^t ]';
  const steps: CalculationStep[] = [
    {
      label: 'Formula',
      expression: formulaUsed,
      explanation: `Sum of discounted cash flows over all periods at discount rate r = ${discountRate}%.`,
    },
    ...rows.slice(0, 6).map(row => ({
      label: `Period ${row.period} Cash Flow`,
      expression: `PV_${row.period} = ${row.amount.toLocaleString()} / (1 + ${r.toFixed(4)})^${row.period} = ${row.amount.toLocaleString()} × ${row.discountFactor.toFixed(4)} = ${row.discountedAmount.toFixed(2)}`,
    })),
    {
      label: 'Sum of Discounted Flows (NPV)',
      expression: `NPV = ${npv.toFixed(2)}`,
    },
  ];

  if (irr !== null) {
    steps.push({
      label: 'Internal Rate of Return (IRR)',
      expression: `Rate r where NPV(r) = 0 ⟹ IRR = ${irr.toFixed(2)}%`,
    });
  }

  // Chart data
  const chartData: ChartDataPoint[] = rows.map(r => ({
    period: r.period,
    label: `Period ${r.period}`,
    balance: Math.round(r.cumulativeDiscounted * 100) / 100,
    cashFlow: r.amount,
    discountedCashFlow: Math.round(r.discountedAmount * 100) / 100,
  }));

  return {
    discountRate,
    npv,
    totalInflows,
    totalOutflows,
    netNominalCashFlow,
    irr,
    profitabilityIndex,
    paybackPeriod,
    discountedPaybackPeriod,
    rows,
    chartData,
    steps,
    formulaUsed,
  };
}
