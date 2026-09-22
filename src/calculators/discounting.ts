import { CalculationStep, ChartDataPoint } from '../types/tvm';

export interface DiscountedItem {
  period: number;
  cashFlow: number;
  discountFactor: number;
  presentValue: number;
  cumulativePV: number;
}

export interface MultiDiscountInput {
  discountRate: number; // percentage, e.g. 10%
  cashFlows: { period: number; amount: number }[];
}

export interface MultiDiscountResult {
  discountRate: number;
  totalCashFlow: number;
  totalPresentValue: number;
  totalDiscountAmount: number;
  items: DiscountedItem[];
  steps: CalculationStep[];
  chartData: ChartDataPoint[];
}

export function calculateMultiDiscounting(input: MultiDiscountInput): MultiDiscountResult {
  const { discountRate, cashFlows } = input;
  const r = Math.max(0, discountRate) / 100;

  let totalCashFlow = 0;
  let totalPV = 0;
  let cumPV = 0;

  const items: DiscountedItem[] = cashFlows.map(cf => {
    const t = cf.period;
    const factor = Math.pow(1 + r, -t);
    const pv = cf.amount * factor;
    cumPV += pv;
    totalCashFlow += cf.amount;

    return {
      period: t,
      cashFlow: cf.amount,
      discountFactor: factor,
      presentValue: pv,
      cumulativePV: cumPV,
    };
  });

  totalPV = cumPV;
  const totalDiscountAmount = Math.max(0, totalCashFlow - totalPV);

  const steps: CalculationStep[] = [
    {
      label: 'Discount Factor Formula',
      expression: 'DF_t = 1 / (1 + r)^t = (1 + r)^(-t)',
      explanation: `Using annual discount rate r = ${discountRate}% (${r.toFixed(4)}).`,
    },
    ...items.slice(0, 5).map(item => ({
      label: `Period ${item.period} Discounting`,
      expression: `PV_${item.period} = ${item.cashFlow.toLocaleString()} × (1 + ${r.toFixed(4)})^(-${item.period}) = ${item.cashFlow.toLocaleString()} × ${item.discountFactor.toFixed(4)} = ${item.presentValue.toFixed(2)}`,
    })),
    {
      label: 'Sum of Present Values',
      expression: `Total PV = ∑ PV_t = ${totalPV.toFixed(2)}`,
    },
  ];

  const chartData: ChartDataPoint[] = items.map(item => ({
    period: item.period,
    label: `Period ${item.period}`,
    balance: Math.round(item.presentValue * 100) / 100,
    cashFlow: item.cashFlow,
    discountedCashFlow: Math.round(item.presentValue * 100) / 100,
    discountAmount: Math.round((item.cashFlow - item.presentValue) * 100) / 100,
  }));

  return {
    discountRate,
    totalCashFlow,
    totalPresentValue: totalPV,
    totalDiscountAmount,
    items,
    steps,
    chartData,
  };
}
