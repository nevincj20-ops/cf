import { CompoundingFrequency, FREQUENCY_MULTIPLIERS, CalculationStep } from '../types/tvm';

export interface EARInput {
  nominalRate: number; // percentage, e.g. 12%
  frequency: CompoundingFrequency;
}

export interface EARFrequencyComparison {
  frequency: CompoundingFrequency;
  label: string;
  ear: number;
  difference: number;
}

export interface EARResult {
  nominalRate: number;
  effectiveRate: number;
  difference: number; // in percentage points
  formulaUsed: string;
  steps: CalculationStep[];
  allFrequencies: EARFrequencyComparison[];
}

export function calculateEAR(input: EARInput): EARResult {
  const { nominalRate, frequency } = input;
  const r = Math.max(0, nominalRate) / 100;

  let ear = 0;
  let formulaUsed = '';
  const steps: CalculationStep[] = [];

  if (frequency === 'continuous') {
    formulaUsed = 'EAR = e^r - 1';
    ear = (Math.exp(r) - 1) * 100;

    steps.push(
      { label: 'Identify Inputs', expression: `Nominal Rate (r) = ${nominalRate}% (${r.toFixed(4)}), Compounding = Continuous` },
      { label: 'Apply Formula', expression: 'EAR = e^r - 1' },
      { label: 'Substitute Value', expression: `EAR = e^(${r.toFixed(4)}) - 1 ≈ ${Math.exp(r).toFixed(6)} - 1` },
      { label: 'Calculate Result', expression: `EAR = ${(Math.exp(r) - 1).toFixed(6)} = ${ear.toFixed(4)}%` }
    );
  } else {
    const m = FREQUENCY_MULTIPLIERS[frequency] || 1;
    formulaUsed = 'EAR = (1 + r/m)^m - 1';
    const periodicRate = r / m;
    const factor = Math.pow(1 + periodicRate, m);
    ear = (factor - 1) * 100;

    steps.push(
      { label: 'Identify Inputs', expression: `Nominal Rate (r) = ${nominalRate}% (${r.toFixed(4)}), Compounding = ${frequency} (m = ${m})` },
      { label: 'Periodic Rate (r/m)', expression: `Periodic Rate = ${nominalRate}% / ${m} = ${(periodicRate * 100).toFixed(4)}% (${periodicRate.toFixed(6)})` },
      { label: 'Apply Formula', expression: 'EAR = (1 + r/m)^m - 1' },
      { label: 'Substitute Values', expression: `EAR = (1 + ${periodicRate.toFixed(6)})^${m} - 1 = (${(1 + periodicRate).toFixed(6)})^${m} - 1` },
      { label: 'Evaluate Compounding', expression: `(${ (1 + periodicRate).toFixed(6) })^${m} ≈ ${factor.toFixed(6)}` },
      { label: 'Calculate Result', expression: `EAR = (${factor.toFixed(6)} - 1) × 100 = ${ear.toFixed(4)}%` }
    );
  }

  const difference = ear - nominalRate;

  // Compare all frequencies
  const freqList: CompoundingFrequency[] = ['annual', 'semi-annual', 'quarterly', 'monthly', 'daily', 'continuous'];
  const allFrequencies: EARFrequencyComparison[] = freqList.map(f => {
    let currentEar = 0;
    if (f === 'continuous') {
      currentEar = (Math.exp(r) - 1) * 100;
    } else {
      const mVal = FREQUENCY_MULTIPLIERS[f];
      currentEar = (Math.pow(1 + r / mVal, mVal) - 1) * 100;
    }
    return {
      frequency: f,
      label: f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' '),
      ear: currentEar,
      difference: currentEar - nominalRate,
    };
  });

  return {
    nominalRate,
    effectiveRate: ear,
    difference,
    formulaUsed,
    steps,
    allFrequencies,
  };
}
