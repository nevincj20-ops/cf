import { CalculationStep, AmortizationRow, ChartDataPoint } from '../types/tvm';

export interface EMIInput {
  loanAmount: number;
  annualRate: number; // percentage, e.g. 8.5%
  years: number;
  frequency?: number; // 12 for monthly
}

export interface YearlyAmortizationSummary {
  year: number;
  openingBalance: number;
  totalEMI: number;
  totalPrincipal: number;
  totalInterest: number;
  closingBalance: number;
}

export interface EMIResult {
  emi: number;
  totalAmountPaid: number;
  totalInterest: number;
  principal: number;
  schedule: AmortizationRow[];
  yearlySummary: YearlyAmortizationSummary[];
  chartData: ChartDataPoint[];
  steps: CalculationStep[];
  formulaUsed: string;
}

export function calculateEMI(input: EMIInput): EMIResult {
  const { loanAmount, annualRate, years, frequency = 12 } = input;
  const p = Math.max(0, loanAmount);
  const r = Math.max(0, annualRate) / 100;
  const n = Math.max(0, years);
  const m = Math.max(1, frequency);
  const totalPeriods = Math.round(n * m);
  const periodicRate = r / m;

  let emi = 0;
  if (totalPeriods === 0) {
    emi = p;
  } else if (periodicRate === 0) {
    emi = p / totalPeriods;
  } else {
    const factor = Math.pow(1 + periodicRate, totalPeriods);
    emi = p * (periodicRate * factor) / (factor - 1);
  }

  const totalAmountPaid = emi * totalPeriods;
  const totalInterest = Math.max(0, totalAmountPaid - p);

  // Generate complete amortization schedule
  const schedule: AmortizationRow[] = [];
  let currentBalance = p;
  let runningTotalInterest = 0;

  for (let period = 1; period <= totalPeriods; period++) {
    const openingBalance = currentBalance;
    const interestComponent = currentBalance * periodicRate;
    let principalComponent = emi - interestComponent;

    // Boundary check on the last period
    if (period === totalPeriods || principalComponent > currentBalance) {
      principalComponent = currentBalance;
    }

    const closingBalance = Math.max(0, openingBalance - principalComponent);
    runningTotalInterest += interestComponent;

    schedule.push({
      month: period,
      year: Math.ceil(period / m),
      openingBalance: Math.round(openingBalance * 100) / 100,
      emi: Math.round(emi * 100) / 100,
      principal: Math.round(principalComponent * 100) / 100,
      interest: Math.round(interestComponent * 100) / 100,
      closingBalance: Math.round(closingBalance * 100) / 100,
      totalInterestPaid: Math.round(runningTotalInterest * 100) / 100,
    });

    currentBalance = closingBalance;
    if (currentBalance <= 0) break;
  }

  // Generate yearly summary
  const yearlyMap = new Map<number, YearlyAmortizationSummary>();
  schedule.forEach(row => {
    const y = row.year;
    if (!yearlyMap.has(y)) {
      yearlyMap.set(y, {
        year: y,
        openingBalance: row.openingBalance,
        totalEMI: 0,
        totalPrincipal: 0,
        totalInterest: 0,
        closingBalance: row.closingBalance,
      });
    }
    const item = yearlyMap.get(y)!;
    item.totalEMI += row.emi;
    item.totalPrincipal += row.principal;
    item.totalInterest += row.interest;
    item.closingBalance = row.closingBalance; // will update to last period of year
  });

  const yearlySummary: YearlyAmortizationSummary[] = Array.from(yearlyMap.values()).map(y => ({
    ...y,
    openingBalance: Math.round(y.openingBalance * 100) / 100,
    totalEMI: Math.round(y.totalEMI * 100) / 100,
    totalPrincipal: Math.round(y.totalPrincipal * 100) / 100,
    totalInterest: Math.round(y.totalInterest * 100) / 100,
    closingBalance: Math.round(y.closingBalance * 100) / 100,
  }));

  // Chart data (yearly progression for balance & principal/interest)
  const chartData: ChartDataPoint[] = [
    {
      period: 0,
      label: 'Start (Year 0)',
      balance: p,
      principal: 0,
      interest: 0,
    },
    ...yearlySummary.map(y => ({
      period: y.year,
      label: `Year ${y.year}`,
      balance: y.closingBalance,
      principal: y.totalPrincipal,
      interest: y.totalInterest,
    }))
  ];

  // Dynamic steps
  const formulaUsed = 'EMI = P × r × (1 + r)^n / [(1 + r)^n - 1]';
  const steps: CalculationStep[] = [
    {
      label: 'Identify Parameters',
      expression: `Principal (P) = ${p.toLocaleString()}, Annual Rate = ${annualRate}%, Tenure = ${years} yrs (${totalPeriods} monthly payments)`,
    },
    {
      label: 'Monthly Interest Rate (r)',
      expression: `Monthly Rate (r) = ${annualRate}% / 12 = ${(periodicRate * 100).toFixed(4)}% (${periodicRate.toFixed(6)})`,
    },
    {
      label: 'Formula',
      expression: formulaUsed,
    },
    {
      label: 'Substitution',
      expression: periodicRate > 0 
        ? `EMI = ${p} × ${periodicRate.toFixed(6)} × (1 + ${periodicRate.toFixed(6)})^${totalPeriods} / [ (1 + ${periodicRate.toFixed(6)})^${totalPeriods} - 1 ]`
        : `EMI = ${p} / ${totalPeriods}`,
    },
    {
      label: 'Calculated Monthly EMI',
      expression: `EMI = ${emi.toFixed(2)}`,
    },
    {
      label: 'Total Payment & Interest',
      expression: `Total Payment = ${emi.toFixed(2)} × ${totalPeriods} = ${totalAmountPaid.toFixed(2)} | Total Interest = ${totalInterest.toFixed(2)}`,
    },
  ];

  return {
    emi,
    totalAmountPaid,
    totalInterest,
    principal: p,
    schedule,
    yearlySummary,
    chartData,
    steps,
    formulaUsed,
  };
}
