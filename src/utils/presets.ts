import type { CompoundingFrequency, AnnuityTiming } from '../types/tvm';
import type { CashFlowPoint } from '../calculators/npv';

export interface PresetOption<T> {
  id: string;
  name: string;
  description: string;
  values: T;
}

export interface FVPresetValues {
  presentValue: number;
  annualRate: number;
  years: number;
  frequency: CompoundingFrequency;
}

export interface PVPresetValues {
  futureValue: number;
  discountRate: number;
  years: number;
  frequency: CompoundingFrequency;
}

export interface AnnuityPresetValues {
  payment: number;
  annualRate: number;
  years: number;
  paymentFrequency: number;
  timing: AnnuityTiming;
}

export interface PerpetuityPresetValues {
  cashFlow: number;
  discountRate: number;
  growthRate: number;
  isGrowing: boolean;
}

export interface CompoundInterestPresetValues {
  principal: number;
  annualRate: number;
  years: number;
}

export interface LoanEMIPresetValues {
  loanAmount: number;
  annualRate: number;
  years: number;
}

export interface CashFlowPresetValues {
  discountRate: number;
  flows: CashFlowPoint[];
}

export interface EARPresetValues {
  nominalRate: number;
  frequency: CompoundingFrequency;
}

export interface RuleOf72PresetValues {
  mode: 'rateToTime' | 'timeToRate';
  rate: number;
  years: number;
}

export const PRESETS = {
  futureValue: [
    {
      id: 'fd-growth',
      name: 'Fixed Deposit (FD)',
      description: '₹100,000 at 7.5% for 5 years compounded quarterly',
      values: { presentValue: 100000, annualRate: 7.5, years: 5, frequency: 'quarterly' as CompoundingFrequency },
    },
    {
      id: 'equity-longterm',
      name: 'Long-term Mutual Fund',
      description: '₹500,000 at 12% for 15 years compounded annually',
      values: { presentValue: 500000, annualRate: 12, years: 15, frequency: 'annual' as CompoundingFrequency },
    },
    {
      id: 'continuous-growth',
      name: 'Continuous Scientific Yield',
      description: '₹50,000 at 6% for 10 years compounded continuously',
      values: { presentValue: 50000, annualRate: 6, years: 10, frequency: 'continuous' as CompoundingFrequency },
    },
  ] as PresetOption<FVPresetValues>[],

  presentValue: [
    {
      id: 'college-target',
      name: 'Higher Education Fund',
      description: 'Need ₹2,500,000 in 10 years at 8% annual return',
      values: { futureValue: 2500000, discountRate: 8, years: 10, frequency: 'annual' as CompoundingFrequency },
    },
    {
      id: 'textbook-benchmark',
      name: 'Textbook Example',
      description: 'Discounting ₹133,100 at 10% for 3 years',
      values: { futureValue: 133100, discountRate: 10, years: 3, frequency: 'annual' as CompoundingFrequency },
    },
    {
      id: 'retirement-lump-sum',
      name: 'Retirement Goal',
      description: 'Target ₹10,000,000 in 20 years at 9% discount rate',
      values: { futureValue: 10000000, discountRate: 9, years: 20, frequency: 'annual' as CompoundingFrequency },
    },
  ] as PresetOption<PVPresetValues>[],

  annuities: [
    {
      id: 'sip-wealth',
      name: 'Monthly Mutual Fund SIP',
      description: '₹10,000 per month at 12% for 15 years (Ordinary)',
      values: { payment: 10000, annualRate: 12, years: 15, paymentFrequency: 12, timing: 'ordinary' as AnnuityTiming },
    },
    {
      id: 'retirement-pension',
      name: 'Annuity Due (Advance)',
      description: '₹50,000 monthly at 8% for 20 years (Annuity Due)',
      values: { payment: 50000, annualRate: 8, years: 20, paymentFrequency: 12, timing: 'due' as AnnuityTiming },
    },
    {
      id: 'annual-savings',
      name: 'Annual Provident Fund',
      description: '₹150,000 annually at 7.1% for 15 years',
      values: { payment: 150000, annualRate: 7.1, years: 15, paymentFrequency: 1, timing: 'ordinary' as AnnuityTiming },
    },
  ] as PresetOption<AnnuityPresetValues>[],

  perpetuity: [
    {
      id: 'scholarship-endowment',
      name: 'University Scholarship Endowment',
      description: 'Annual payout ₹200,000 at 6% endowment discount rate',
      values: { cashFlow: 200000, discountRate: 6, growthRate: 0, isGrowing: false },
    },
    {
      id: 'dividend-growing',
      name: 'Growing Dividend Stock',
      description: '₹50,000 next year cash flow, 9% discount rate, 4% growth',
      values: { cashFlow: 50000, discountRate: 9, growthRate: 4, isGrowing: true },
    },
  ] as PresetOption<PerpetuityPresetValues>[],

  compoundInterest: [
    {
      id: 'compounding-10y',
      name: 'Power of Compounding (10 Yrs)',
      description: '₹100,000 at 10% across all frequencies',
      values: { principal: 100000, annualRate: 10, years: 10 },
    },
    {
      id: 'compounding-25y',
      name: 'Long-term Horizon (25 Yrs)',
      description: '₹200,000 at 8% across all frequencies',
      values: { principal: 200000, annualRate: 8, years: 25 },
    },
  ] as PresetOption<CompoundInterestPresetValues>[],

  loanEMI: [
    {
      id: 'home-loan',
      name: 'Home Loan (Housing)',
      description: '₹5,000,000 at 8.5% for 20 years',
      values: { loanAmount: 5000000, annualRate: 8.5, years: 20 },
    },
    {
      id: 'car-loan',
      name: 'Car / Auto Loan',
      description: '₹1,000,000 at 9.0% for 5 years',
      values: { loanAmount: 1000000, annualRate: 9.0, years: 5 },
    },
    {
      id: 'personal-loan',
      name: 'Personal Loan',
      description: '₹300,000 at 14.0% for 3 years',
      values: { loanAmount: 300000, annualRate: 14.0, years: 3 },
    },
  ] as PresetOption<LoanEMIPresetValues>[],

  cashFlow: [
    {
      id: 'startup-seed',
      name: 'Tech Venture Seed Funding',
      description: 'Initial -₹100,000 followed by 4 years of expanding returns at 10%',
      values: {
        discountRate: 10,
        flows: [
          { period: 0, amount: -100000, label: 'Initial Outlay' },
          { period: 1, amount: 25000, label: 'Year 1' },
          { period: 2, amount: 30000, label: 'Year 2' },
          { period: 3, amount: 40000, label: 'Year 3' },
          { period: 4, amount: 35000, label: 'Year 4' },
        ],
      },
    },
    {
      id: 'commercial-property',
      name: 'Rental Property Acquisition',
      description: 'Initial -₹2,500,000 followed by 5 years net rental income at 8.5%',
      values: {
        discountRate: 8.5,
        flows: [
          { period: 0, amount: -2500000, label: 'Purchase Outlay' },
          { period: 1, amount: 360000, label: 'Year 1 Rent' },
          { period: 2, amount: 390000, label: 'Year 2 Rent' },
          { period: 3, amount: 420000, label: 'Year 3 Rent' },
          { period: 4, amount: 450000, label: 'Year 4 Rent' },
          { period: 5, amount: 3200000, label: 'Sale Proceeds' },
        ],
      },
    },
  ] as PresetOption<CashFlowPresetValues>[],

  ear: [
    {
      id: 'credit-card',
      name: 'Credit Card APR vs EAR',
      description: 'Nominal 42% APR compounded monthly',
      values: { nominalRate: 42, frequency: 'monthly' as CompoundingFrequency },
    },
    {
      id: 'savings-account',
      name: 'High Yield Savings',
      description: 'Nominal 7.0% compounded daily',
      values: { nominalRate: 7.0, frequency: 'daily' as CompoundingFrequency },
    },
  ] as PresetOption<EARPresetValues>[],

  ruleOf72: [
    {
      id: 'index-growth',
      name: 'Equity Index 12%',
      description: '12% annual return doubling estimate',
      values: { mode: 'rateToTime' as const, rate: 12, years: 6 },
    },
    {
      id: 'conservative-bond',
      name: 'Safe Bond 6%',
      description: '6% bond doubling estimate',
      values: { mode: 'rateToTime' as const, rate: 6, years: 12 },
    },
    {
      id: 'double-in-5y',
      name: 'Double in 5 Years Goal',
      description: 'Calculate return rate to double in 5 years',
      values: { mode: 'timeToRate' as const, rate: 14.4, years: 5 },
    },
  ] as PresetOption<RuleOf72PresetValues>[],
};
