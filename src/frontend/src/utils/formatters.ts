import { format } from 'date-fns';

/**
 * Formats a number as a currency string
 * @param amount - The amount to format
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

/**
 * Formats a date string or Date object into a specified format
 * @param date - The date to format (Date object or string)
 * @param formatString - The desired format string (e.g., 'yyyy-MM-dd')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, formatString: string): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  return format(dateObject, formatString);
};

/**
 * Formats a number as a percentage string
 * @param value - The value to format as a percentage
 * @param decimalPlaces - The number of decimal places to show
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimalPlaces: number): string => {
  const percentage = value * 100;
  return `${percentage.toFixed(decimalPlaces)}%`;
};

/**
 * Formats a phone number string into a standardized format
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  return phoneNumber; // Return original if not valid
};

/**
 * Formats an account number string by masking all but the last 4 digits
 * @param accountNumber - The account number to mask
 * @returns Masked account number string
 */
export const formatAccountNumber = (accountNumber: string): string => {
  if (accountNumber.length >= 4) {
    const visiblePart = accountNumber.slice(-4);
    const maskedPart = '*'.repeat(accountNumber.length - 4);
    return `${maskedPart}${visiblePart}`;
  }
  return accountNumber; // Return original if less than 4 characters
};