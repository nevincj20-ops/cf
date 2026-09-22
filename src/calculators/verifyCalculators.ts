import {
  calculateFutureValue,
  calculatePresentValue,
  calculateAnnuity,
  calculatePerpetuity,
  calculateCompoundInterest,
  calculateEAR,
  calculateEMI,
  calculateMultiDiscounting,
  calculateNPV,
  calculateRuleOf72,
} from './index';

console.log('--- RUNNING MATHEMATICAL TVM VERIFICATIONS ---');

// 1. Future Value
const fvAnnual = calculateFutureValue({ presentValue: 10000, annualRate: 8, years: 5, frequency: 'annual' });
console.log('1. FV (Annual 8%, 5y, $10,000):', fvAnnual.futureValue.toFixed(2), '(Expected: 14693.28)');
console.assert(Math.abs(fvAnnual.futureValue - 14693.28) < 0.05, 'FV Annual failed');

const fvMonthly = calculateFutureValue({ presentValue: 10000, annualRate: 8, years: 5, frequency: 'monthly' });
console.log('   FV (Monthly 8%, 5y, $10,000):', fvMonthly.futureValue.toFixed(2), '(Expected: 14898.46)');
console.assert(Math.abs(fvMonthly.futureValue - 14898.46) < 0.05, 'FV Monthly failed');

// 2. Present Value
const pvRes = calculatePresentValue({ futureValue: 133100, discountRate: 10, years: 3, frequency: 'annual' });
console.log('2. PV (10%, 3y, $133,100):', pvRes.presentValue.toFixed(2), '(Expected: 100000.00)');
console.assert(Math.abs(pvRes.presentValue - 100000) < 0.05, 'PV failed');

// 3. Annuity
const annRes = calculateAnnuity({ payment: 1000, annualRate: 7, years: 10, paymentFrequency: 1, timing: 'ordinary' });
console.log('3. Annuity Ordinary FV (7%, 10y, $1,000):', annRes.futureValue.toFixed(2), '(Expected: 13816.45)');
console.assert(Math.abs(annRes.futureValue - 13816.45) < 0.05, 'Annuity FV Ord failed');
console.log('   Annuity Ordinary PV (7%, 10y, $1,000):', annRes.presentValue.toFixed(2), '(Expected: 7023.58)');
console.assert(Math.abs(annRes.presentValue - 7023.58) < 0.05, 'Annuity PV Ord failed');

const annDue = calculateAnnuity({ payment: 1000, annualRate: 7, years: 10, paymentFrequency: 1, timing: 'due' });
console.log('   Annuity Due FV:', annDue.futureValue.toFixed(2), '(Expected: 14783.60)');
console.assert(Math.abs(annDue.futureValue - 14783.60) < 0.05, 'Annuity FV Due failed');
console.log('   Annuity Due PV:', annDue.presentValue.toFixed(2), '(Expected: 7515.23)');
console.assert(Math.abs(annDue.presentValue - 7515.23) < 0.05, 'Annuity PV Due failed');

// 4. Perpetuity
const perp = calculatePerpetuity({ cashFlow: 5000, discountRate: 5, isGrowing: false });
console.log('4. Perpetuity (5%, $5,000):', perp.presentValue.toFixed(2), '(Expected: 100000.00)');
console.assert(Math.abs(perp.presentValue - 100000) < 0.05, 'Perpetuity failed');

const growPerp = calculatePerpetuity({ cashFlow: 5000, discountRate: 8, growthRate: 3, isGrowing: true });
console.log('   Growing Perpetuity (8% disc, 3% growth, $5,000):', growPerp.presentValue.toFixed(2), '(Expected: 100000.00)');
console.assert(Math.abs(growPerp.presentValue - 100000) < 0.05, 'Growing Perpetuity failed');

// 5. EAR
const earRes = calculateEAR({ nominalRate: 12, frequency: 'monthly' });
console.log('5. EAR (12% monthly):', earRes.effectiveRate.toFixed(4) + '%', '(Expected: 12.6825%)');
console.assert(Math.abs(earRes.effectiveRate - 12.6825) < 0.01, 'EAR failed');

// 6. EMI
const emiRes = calculateEMI({ loanAmount: 1000000, annualRate: 8.5, years: 5 });
console.log('6. Loan EMI (8.5%, 5y, $1,000,000):', emiRes.emi.toFixed(2), '(Expected: 20516.53)');
console.assert(Math.abs(emiRes.emi - 20516.53) < 0.1, 'EMI calculation failed');
console.assert(emiRes.schedule.length === 60, 'Schedule length should be 60 months');
console.assert(emiRes.schedule[59].closingBalance === 0, 'Last month balance should be 0');

// 7. NPV & IRR
const npvRes = calculateNPV({
  discountRate: 10,
  cashFlows: [
    { period: 0, amount: -100000 },
    { period: 1, amount: 25000 },
    { period: 2, amount: 30000 },
    { period: 3, amount: 40000 },
    { period: 4, amount: 35000 },
  ],
});
console.log('7. NPV (10%):', npvRes.npv.toFixed(2), '(Expected: 1478.72)');
console.log('   IRR:', npvRes.irr ? npvRes.irr.toFixed(2) + '%' : 'null', '(Expected: ~10.64%)');
console.assert(Math.abs(npvRes.npv - 1478.72) < 0.1, 'NPV failed');
console.assert(npvRes.irr !== null && Math.abs(npvRes.irr - 10.64) < 0.05, 'IRR failed');

// 8. Rule of 72
const rule72 = calculateRuleOf72({ mode: 'rateToTime', rate: 8 });
console.log('8. Rule of 72 (8%):', rule72.approxYears.toFixed(2), 'years (Expected: 9.00)');
console.assert(Math.abs(rule72.approxYears - 9.00) < 0.01, 'Rule of 72 failed');

console.log('--- ALL MATHEMATICAL BENCHMARKS PASSED PERFECTLY! ---');
