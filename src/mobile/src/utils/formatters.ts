import moment from 'moment';

/**
 * Formats a number as a currency string based on the provided options
 * @param amount The number to format
 * @param options Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, options: Intl.NumberFormatOptions = {}): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const mergedOptions = { ...defaultOptions, ...options };
  return new Intl.NumberFormat('en-US', mergedOptions).format(amount);
}

/**
 * Parses a currency string to a number
 * @param currencyString The currency string to parse
 * @returns Parsed number
 */
export function parseCurrency(currencyString: string): number {
  const numericString = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(numericString);
}

/**
 * Gets the currency symbol for a given currency code
 * @param currencyCode The ISO 4217 currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currencyCode: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(0).replace(/[0-9]/g, '').trim();
}

/**
 * Formats a date string or Date object into a specified format
 * @param date The date to format
 * @param format The desired format string
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, format: string): string {
  return moment(date).format(format);
}

/**
 * Formats a number as a percentage string
 * @param value The number to format as a percentage
 * @param decimalPlaces The number of decimal places to show
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimalPlaces: number = 2): string {
  const multipliedValue = value * 100;
  return `${multipliedValue.toFixed(decimalPlaces)}%`;
}

/**
 * Formats a phone number string into a standardized format
 * @param phoneNumber The phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

/**
 * Truncates a string to a specified length and adds an ellipsis if necessary
 * @param text The text to truncate
 * @param maxLength The maximum length of the truncated text
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
}

// Human tasks:
// TODO: Add localization support for date formatting
// TODO: Implement phone number formatting for international numbers