/**
 * Currency and number formatting utilities
 * Uses Intl.NumberFormat for locale-aware formatting
 */

/**
 * Formats a number as Nigerian Naira currency
 * 
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₦1,234.56")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number as a percentage
 * 
 * @param value - The percentage value (e.g., 7.5 for 7.5%)
 * @returns Formatted percentage string (e.g., "7.5%")
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * Formats a timestamp as a readable date and time
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string (e.g., "Jan 11, 2026, 3:45 PM")
 */
export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
}

/**
 * Formats a timestamp as a short date
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string (e.g., "11/01/2026")
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(timestamp));
}

