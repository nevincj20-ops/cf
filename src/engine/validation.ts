import { FinancingPlan, PlanValidationErrors, ValidationResult } from './types';

export function validatePlan(plan: FinancingPlan): PlanValidationErrors {
  const errors: PlanValidationErrors = {};

  if (Number.isNaN(plan.existingShares) || plan.existingShares < 0) {
    errors.existingShares = 'Existing shares cannot be negative or invalid.';
  }

  if (Number.isNaN(plan.newShares) || plan.newShares < 0) {
    errors.newShares = 'New shares cannot be negative or invalid.';
  }

  const total = (plan.existingShares || 0) + (plan.newShares || 0);
  if (total <= 0) {
    errors.totalShares = 'Number of equity shares must be greater than zero.';
  }

  if (Number.isNaN(plan.debtAmount) || plan.debtAmount < 0) {
    errors.debtAmount = 'Debt amount cannot be negative.';
  }

  if (Number.isNaN(plan.interestRate) || plan.interestRate < 0) {
    errors.interestRate = 'Interest rate cannot be negative.';
  } else if (plan.interestRate > 100) {
    errors.interestRate = 'Interest rate cannot exceed 100%.';
  }

  if (plan.isManualInterest) {
    if (Number.isNaN(plan.interestAmount) || plan.interestAmount < 0) {
      errors.interestAmount = 'Interest amount cannot be negative.';
    }
  }

  if (Number.isNaN(plan.preferenceShares) || plan.preferenceShares < 0) {
    errors.preferenceShares = 'Preference share capital cannot be negative.';
  }

  if (Number.isNaN(plan.preferenceDividend) || plan.preferenceDividend < 0) {
    errors.preferenceDividend = 'Preference dividend cannot be negative.';
  }

  if (Number.isNaN(plan.taxRate) || plan.taxRate < 0 || plan.taxRate > 100) {
    errors.taxRate = 'Tax rate must be between 0% and 100%.';
  }

  return errors;
}

export function validateBothPlans(planA: FinancingPlan, planB: FinancingPlan): ValidationResult {
  const errorsA = validatePlan(planA);
  const errorsB = validatePlan(planB);

  const isValidA = Object.keys(errorsA).length === 0;
  const isValidB = Object.keys(errorsB).length === 0;

  let generalError: string | undefined;

  if (isValidA && isValidB) {
    const totalA = planA.existingShares + planA.newShares;
    const totalB = planB.existingShares + planB.newShares;
    const intA = planA.isManualInterest ? planA.interestAmount : (planA.debtAmount * planA.interestRate) / 100;
    const intB = planB.isManualInterest ? planB.interestAmount : (planB.debtAmount * planB.interestRate) / 100;

    if (
      totalA === totalB &&
      intA === intB &&
      planA.preferenceDividend === planB.preferenceDividend &&
      planA.taxRate === planB.taxRate
    ) {
      generalError = 'Both financing plans currently contain identical EPS structures, so an indifference point cannot be determined.';
    }
  }

  return {
    isValid: isValidA && isValidB && !generalError,
    errorsA,
    errorsB,
    generalError,
  };
}
