/**
 * Computes Net Present Value for a given rate and cash flow array.
 * cashFlows: array of amounts where index represents period t (or explicit period).
 */
export function npvAtRate(rate: number, cashFlows: { period: number; amount: number }[]): number {
  return cashFlows.reduce((sum, cf) => {
    return sum + cf.amount / Math.pow(1 + rate, cf.period);
  }, 0);
}

/**
 * Computes the derivative of NPV with respect to rate.
 */
function npvDerivative(rate: number, cashFlows: { period: number; amount: number }[]): number {
  return cashFlows.reduce((sum, cf) => {
    return sum - (cf.period * cf.amount) / Math.pow(1 + rate, cf.period + 1);
  }, 0);
}

/**
 * Solves for Internal Rate of Return (IRR) using Newton-Raphson with bracketed Bisection fallback.
 * Returns IRR as percentage (e.g. 12.98 for 12.98%), or null if no valid real root is found.
 */
export function calculateIRR(cashFlows: { period: number; amount: number }[]): number | null {
  if (cashFlows.length < 2) return null;

  // Check if there is at least one sign change (at least one negative and one positive)
  const hasNegative = cashFlows.some(cf => cf.amount < 0);
  const hasPositive = cashFlows.some(cf => cf.amount > 0);
  if (!hasNegative || !hasPositive) return null;

  const MAX_ITERATIONS = 100;
  const TOLERANCE = 1e-7;

  // Initial guess: 10%
  let rate = 0.1;

  // Attempt Newton-Raphson first
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const npv = npvAtRate(rate, cashFlows);
    if (Math.abs(npv) < TOLERANCE) {
      return rate * 100;
    }

    const dNpv = npvDerivative(rate, cashFlows);
    if (Math.abs(dNpv) < 1e-12) break; // slope too flat, switch to bisection

    const nextRate = rate - npv / dNpv;
    if (nextRate <= -0.999 || nextRate > 100) break; // out of reasonable financial bounds

    if (Math.abs(nextRate - rate) < TOLERANCE) {
      return nextRate * 100;
    }
    rate = nextRate;
  }

  // Fallback: Bisection search between -90% and +1000%
  let low = -0.9;
  let high = 10.0;
  let npvLow = npvAtRate(low, cashFlows);
  let npvHigh = npvAtRate(high, cashFlows);

  // If signs match, try expanding search
  if (npvLow * npvHigh > 0) {
    high = 50.0;
    npvHigh = npvAtRate(high, cashFlows);
    if (npvLow * npvHigh > 0) return null;
  }

  for (let i = 0; i < 150; i++) {
    const mid = (low + high) / 2;
    const npvMid = npvAtRate(mid, cashFlows);

    if (Math.abs(npvMid) < TOLERANCE || (high - low) / 2 < TOLERANCE) {
      return mid * 100;
    }

    if (npvLow * npvMid < 0) {
      high = mid;
      npvHigh = npvMid;
    } else {
      low = mid;
      npvLow = npvMid;
    }
  }

  return ((low + high) / 2) * 100;
}
