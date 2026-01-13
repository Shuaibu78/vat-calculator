/**
 * VAT Calculation Utilities
 * 
 * These functions handle VAT calculations with proper floating-point precision
 * to avoid IEEE 754 errors (e.g., 0.1 + 0.2 !== 0.3).
 * 
 * All monetary values are rounded to 2 decimal places.
 */

export type CalculationMode = 'add' | 'extract';

export interface CalculationResult {
  mode: CalculationMode;
  vatRate: number;
  priceExcludingVat: number;
  vatAmount: number;
  priceIncludingVat: number;
  timestamp: number;
}

/**
 * Rounds a number to a specified number of decimal places
 * Uses proper rounding to avoid floating-point errors
 */
export function roundToDecimal(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

/**
 * Calculates VAT when adding it to a base price (Exclusive calculation)
 * Formula: VAT Amount = Price × (VAT Rate / 100)
 * 
 * @param price - Base price excluding VAT
 * @param vatRate - VAT rate as a percentage (e.g., 7.5 for 7.5%)
 * @returns Calculation result with all components
 */
export function addVat(price: number, vatRate: number): CalculationResult {
  if (price < 0) {
    throw new Error('Price cannot be negative');
  }
  if (vatRate < 0 || vatRate > 100) {
    throw new Error('VAT rate must be between 0 and 100');
  }

  const priceExcludingVat = roundToDecimal(price);
  const vatAmount = roundToDecimal(price * (vatRate / 100));
  const priceIncludingVat = roundToDecimal(priceExcludingVat + vatAmount);

  return {
    mode: 'add',
    vatRate,
    priceExcludingVat,
    vatAmount,
    priceIncludingVat,
    timestamp: Date.now(),
  };
}

/**
 * Extracts VAT from a total price (Inclusive calculation)
 * Formula: Price Excluding VAT = Total / (1 + VAT Rate / 100)
 * Formula: VAT Amount = Total - Price Excluding VAT
 * 
 * @param total - Total price including VAT
 * @param vatRate - VAT rate as a percentage (e.g., 7.5 for 7.5%)
 * @returns Calculation result with all components
 */
export function extractVat(total: number, vatRate: number): CalculationResult {
  if (total < 0) {
    throw new Error('Total price cannot be negative');
  }
  if (vatRate < 0 || vatRate > 100) {
    throw new Error('VAT rate must be between 0 and 100');
  }

  const priceIncludingVat = roundToDecimal(total);
  const priceExcludingVat = roundToDecimal(total / (1 + vatRate / 100));
  const vatAmount = roundToDecimal(priceIncludingVat - priceExcludingVat);

  return {
    mode: 'extract',
    vatRate,
    priceExcludingVat,
    vatAmount,
    priceIncludingVat,
    timestamp: Date.now(),
  };
}

/**
 * Main calculation function that routes to the appropriate method
 * 
 * @param amount - The input amount (price or total depending on mode)
 * @param vatRate - VAT rate as a percentage
 * @param mode - Calculation mode ('add' or 'extract')
 * @returns Calculation result
 */
export function calculateVat(
  amount: number,
  vatRate: number,
  mode: CalculationMode
): CalculationResult {
  if (mode === 'add') {
    return addVat(amount, vatRate);
  } else {
    return extractVat(amount, vatRate);
  }
}

