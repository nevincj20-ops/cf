export interface ValidationRule {
  min?: number;
  max?: number;
  allowNegative?: boolean;
  required?: boolean;
  custom?: (val: number) => string | null;
}

/**
 * Validates a numerical value against constraints and returns an error string or null if valid.
 */
export function validateNumber(value: number, name: string, rules: ValidationRule = {}): string | null {
  if (isNaN(value)) {
    return `${name} must be a valid number`;
  }

  if (!rules.allowNegative && value < 0) {
    return `${name} cannot be negative`;
  }

  if (rules.min !== undefined && value < rules.min) {
    return `${name} must be at least ${rules.min}`;
  }

  if (rules.max !== undefined && value > rules.max) {
    return `${name} cannot exceed ${rules.max}`;
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
}

/**
 * Safely parses a string input into a clean numeric float.
 */
export function parseNumericInput(raw: string, defaultValue: number = 0): number {
  const cleaned = raw.replace(/,/g, '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? defaultValue : parsed;
}
