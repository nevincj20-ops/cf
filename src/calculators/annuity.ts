import { AnnuityTiming, CalculationStep, ChartDataPoint } from '../types/tvm';

export interface AnnuityInput {
  payment: number; // PMT
  annualRate: number; // percentage
  years: number;
  paymentFrequency: number; // e.g. 12 for monthly, 1 for annual, 4 for quarterly
  timing: AnnuityTiming; // ordinary or due
}

export interface AnnuityResult {
  futureValue: number;
  presentValue: number;
  totalPayments: number;
  fvInterestEarned: number;
  pvInterestComponent: number;
  fvFormula: string;
  pvFormula: string;
  stepsFV: CalculationStep[];
  stepsPV: CalculationStep[];
  chartData: ChartDataPoint[];
}

export function calculateAnnuity(input: AnnuityInput): AnnuityResult {
  const { payment, annualRate, years, paymentFrequency, timing } = input;
  const pmt = Math.max(0, payment);
  const r = Math.max(0, annualRate) / 100;
  const m = Math.max(1, paymentFrequency);
  const n = Math.max(0, years);
  const totalPeriods = Math.round(n * m);
  const periodicRate = r / m;

  let fvOrdinary = 0;
  let pvOrdinary = 0;

  if (periodicRate === 0) {
    fvOrdinary = pmt * totalPeriods;
    pvOrdinary = pmt * totalPeriods;
  } else {
    fvOrdinary = pmt * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    pvOrdinary = pmt * ((1 - Math.pow(1 + periodicRate, -totalPeriods)) / periodicRate);
  }

  const timingFactor = timing === 'due' ? (1 + periodicRate) : 1;
  const fv = fvOrdinary * timingFactor;
  const pv = pvOrdinary * timingFactor;
  const totalPayments = pmt * totalPeriods;
  const fvInterestEarned = Math.max(0, fv - totalPayments);
  const pvInterestComponent = Math.max(0, totalPayments - pv);

  // Steps for FV
  const stepsFV: CalculationStep[] = [
    { label: 'Identify Variables', expression: `PMT = ${pmt.toLocaleString()}, Annual Rate = ${annualRate}%, Periods/Yr = ${m}, Years = ${n}, Total Periods (N) = ${totalPeriods}` },
    { label: 'Periodic Interest Rate (i)', expression: `i = ${annualRate}% / ${m} = ${(periodicRate * 100).toFixed(4)}% (${periodicRate.toFixed(6)})` },
    { label: 'Ordinary Annuity FV Formula', expression: `FV_ord = PMT × [((1 + i)^N - 1) / i]` },
    { label: 'Ordinary Annuity Calculation', expression: periodicRate > 0 
        ? `FV_ord = ${pmt} × [((1 + ${periodicRate.toFixed(6)})^${totalPeriods} - 1) / ${periodicRate.toFixed(6)}] ≈ ${fvOrdinary.toFixed(2)}`
        : `FV_ord = ${pmt} × ${totalPeriods} = ${fvOrdinary.toFixed(2)}`
    },
  ];

  if (timing === 'due') {
    stepsFV.push(
      { label: 'Annuity Due Adjustment', expression: `FV_due = FV_ord × (1 + i)` },
      { label: 'Final FV Due', expression: `FV_due = ${fvOrdinary.toFixed(2)} × (1 + ${periodicRate.toFixed(6)}) = ${fv.toFixed(2)}` }
    );
  }

  // Steps for PV
  const stepsPV: CalculationStep[] = [
    { label: 'Identify Variables', expression: `PMT = ${pmt.toLocaleString()}, Periodic Rate (i) = ${(periodicRate * 100).toFixed(4)}%, Total Periods (N) = ${totalPeriods}` },
    { label: 'Ordinary Annuity PV Formula', expression: `PV_ord = PMT × [[1 - (1 + i)^(-N)] / i]` },
    { label: 'Ordinary Annuity Calculation', expression: periodicRate > 0
        ? `PV_ord = ${pmt} × [[1 - (1 + ${periodicRate.toFixed(6)})^(-${totalPeriods})] / ${periodicRate.toFixed(6)}] ≈ ${pvOrdinary.toFixed(2)}`
        : `PV_ord = ${pmt} × ${totalPeriods} = ${pvOrdinary.toFixed(2)}`
    },
  ];

  if (timing === 'due') {
    stepsPV.push(
      { label: 'Annuity Due Adjustment', expression: `PV_due = PV_ord × (1 + i)` },
      { label: 'Final PV Due', expression: `PV_due = ${pvOrdinary.toFixed(2)} × (1 + ${periodicRate.toFixed(6)}) = ${pv.toFixed(2)}` }
    );
  }

  // Chart data generation across years
  const chartData: ChartDataPoint[] = [];
  const maxYears = Math.min(totalPeriods, Math.max(1, Math.ceil(n)));
  const stepPeriods = Math.max(1, Math.floor(totalPeriods / Math.min(20, totalPeriods || 1)));

  let runningBalance = 0;
  let runningContributed = 0;

  for (let k = 0; k <= totalPeriods; k += (k === 0 ? 1 : stepPeriods)) {
    if (k === 0) {
      chartData.push({
        period: 0,
        label: 'Start (0)',
        balance: 0,
        principal: 0,
        interest: 0,
      });
      continue;
    }

    const periodsSoFar = Math.min(k, totalPeriods);
    runningContributed = pmt * periodsSoFar;

    if (periodicRate === 0) {
      runningBalance = runningContributed;
    } else {
      const ordAtK = pmt * ((Math.pow(1 + periodicRate, periodsSoFar) - 1) / periodicRate);
      runningBalance = ordAtK * timingFactor;
    }

    const interestSoFar = Math.max(0, runningBalance - runningContributed);

    const yearNum = (periodsSoFar / m).toFixed(1).replace(/\.0$/, '');
    chartData.push({
      period: periodsSoFar,
      label: m === 1 ? `Year ${periodsSoFar}` : `Yr ${yearNum}`,
      balance: Math.round(runningBalance * 100) / 100,
      principal: Math.round(runningContributed * 100) / 100,
      interest: Math.round(interestSoFar * 100) / 100,
    });

    if (periodsSoFar === totalPeriods) break;
  }

  return {
    futureValue: fv,
    presentValue: pv,
    totalPayments,
    fvInterestEarned,
    pvInterestComponent,
    fvFormula: timing === 'due' ? 'FV_due = PMT × [((1+r)^n - 1) / r] × (1+r)' : 'FV = PMT × [((1+r)^n - 1) / r]',
    pvFormula: timing === 'due' ? 'PV_due = PMT × [[1 - (1+r)^(-n)] / r] × (1+r)' : 'PV = PMT × [[1 - (1+r)^(-n)] / r]',
    stepsFV,
    stepsPV,
    chartData,
  };
}
