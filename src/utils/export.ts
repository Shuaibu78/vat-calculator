/**
 * CSV Export utilities for history data
 */

import type { CalculationResult } from './math';
import { formatDateTime } from './format';

/**
 * Converts calculation history to CSV format
 * 
 * @param history - Array of calculation results
 * @returns CSV string
 */
export function convertToCSV(history: CalculationResult[]): string {
  // CSV Headers
  const headers = [
    'Date & Time',
    'Mode',
    'VAT Rate (%)',
    'Price Excl. VAT',
    'VAT Amount',
    'Price Incl. VAT',
  ];

  // CSV Rows
  const rows = history.map((item) => [
    formatDateTime(item.timestamp),
    item.mode === 'add' ? 'Add VAT' : 'Extract VAT',
    item.vatRate.toFixed(2),
    item.priceExcludingVat.toFixed(2),
    item.vatAmount.toFixed(2),
    item.priceIncludingVat.toFixed(2),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Downloads a CSV file with the given content
 * 
 * @param csvContent - The CSV string content
 * @param filename - The name of the file to download
 */
export function downloadCSV(csvContent: string, filename: string = 'vat-calculations.csv'): void {
  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  // Append to document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Exports calculation history as a CSV file
 * 
 * @param history - Array of calculation results
 * @param filename - Optional custom filename
 */
export function exportHistoryAsCSV(
  history: CalculationResult[],
  filename?: string
): void {
  if (history.length === 0) {
    console.warn('No history to export');
    return;
  }

  const csvContent = convertToCSV(history);
  const defaultFilename = `vat-calculations-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename || defaultFilename);
}

