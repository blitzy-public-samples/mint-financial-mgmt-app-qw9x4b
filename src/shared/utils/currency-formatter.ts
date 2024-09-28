/**
 * This file contains utility functions for formatting and handling currency values
 * in the Mint Replica application. It provides consistent currency formatting across
 * the application, supporting various currencies and formatting options.
 */

/**
 * Formats a number as a currency string based on the provided options
 * @param amount The number to be formatted as currency
 * @param options An object containing formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, options: Intl.NumberFormatOptions = {}): string {
  // Check if the amount is a valid number
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount provided for currency formatting');
  }

  // Apply default options if not provided
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const formattingOptions = { ...defaultOptions, ...options };

  // Use Intl.NumberFormat to format the currency string
  const formatter = new Intl.NumberFormat('en-US', formattingOptions);
  return formatter.format(amount);
}

/**
 * Parses a currency string and returns a number
 * @param currencyString The currency string to be parsed
 * @param locale The locale to use for parsing (default: 'en-US')
 * @returns Parsed currency value as a number
 */
export function parseCurrency(currencyString: string, locale: string = 'en-US'): number {
  // Remove currency symbols and thousands separators
  const cleanedString = currencyString.replace(/[^\d.,\-]/g, '');

  // Replace decimal separator with a period if necessary
  const decimalSeparator = new Intl.NumberFormat(locale).format(1.1).charAt(1);
  const normalizedString = cleanedString.replace(decimalSeparator, '.');

  // Parse the resulting string to a float
  const parsedValue = parseFloat(normalizedString);

  if (isNaN(parsedValue)) {
    throw new Error('Invalid currency string provided for parsing');
  }

  return parsedValue;
}

/**
 * Returns the currency symbol for a given currency code
 * @param currencyCode The ISO 4217 currency code
 * @param locale The locale to use for formatting (default: 'en-US')
 * @returns Currency symbol as a string
 */
export function getCurrencySymbol(currencyCode: string, locale: string = 'en-US'): string {
  // Use Intl.NumberFormat to get the currency symbol
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Extract the symbol from the formatted string
  const parts = formatter.formatToParts(0);
  const symbolPart = parts.find(part => part.type === 'currency');

  if (!symbolPart) {
    throw new Error(`Currency symbol not found for currency code: ${currencyCode}`);
  }

  return symbolPart.value;
}

// Human tasks:
// TODO: Verify and potentially expand the list of supported currency codes
// TODO: Add unit tests for edge cases in currency formatting and parsing