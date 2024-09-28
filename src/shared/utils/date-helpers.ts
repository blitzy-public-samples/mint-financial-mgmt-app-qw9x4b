import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with UTC and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Define global constants
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * Formats a date string or Date object to a specified format
 * @param date - The date to format (string or Date object)
 * @param format - The desired output format (default: DEFAULT_DATE_FORMAT)
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, format: string = DEFAULT_DATE_FORMAT): string {
  return dayjs(date).format(format);
}

/**
 * Returns the current date in the specified format
 * @param format - The desired output format (default: DEFAULT_DATE_FORMAT)
 * @returns Current date string
 */
export function getCurrentDate(format: string = DEFAULT_DATE_FORMAT): string {
  return dayjs().format(format);
}

/**
 * Adds a specified number of days to a given date
 * @param date - The starting date (string or Date object)
 * @param days - The number of days to add
 * @returns New Date object
 */
export function addDays(date: string | Date, days: number): Date {
  return dayjs(date).add(days, 'day').toDate();
}

/**
 * Subtracts a specified number of days from a given date
 * @param date - The starting date (string or Date object)
 * @param days - The number of days to subtract
 * @returns New Date object
 */
export function subtractDays(date: string | Date, days: number): Date {
  return dayjs(date).subtract(days, 'day').toDate();
}

/**
 * Calculates the difference between two dates in days
 * @param date1 - The first date (string or Date object)
 * @param date2 - The second date (string or Date object)
 * @returns Number of days between the two dates
 */
export function getDateDifference(date1: string | Date, date2: string | Date): number {
  return Math.abs(dayjs(date1).diff(dayjs(date2), 'day'));
}

/**
 * Checks if a date is between two other dates
 * @param date - The date to check (string or Date object)
 * @param startDate - The start date of the range (string or Date object)
 * @param endDate - The end date of the range (string or Date object)
 * @returns True if the date is between startDate and endDate, inclusive
 */
export function isDateBetween(date: string | Date, startDate: string | Date, endDate: string | Date): boolean {
  const checkDate = dayjs(date);
  return checkDate.isSameOrAfter(startDate) && checkDate.isSameOrBefore(endDate);
}

/**
 * Returns the start date of the month for a given date
 * @param date - The date to get the start of the month for (string or Date object)
 * @returns Date object representing the start of the month
 */
export function getStartOfMonth(date: string | Date): Date {
  return dayjs(date).startOf('month').toDate();
}

/**
 * Returns the end date of the month for a given date
 * @param date - The date to get the end of the month for (string or Date object)
 * @returns Date object representing the end of the month
 */
export function getEndOfMonth(date: string | Date): Date {
  return dayjs(date).endOf('month').toDate();
}

// Human tasks (commented as requested)
/*
Human tasks:
1. Verify the timezone handling for users in different geographical locations (Required)
2. Add more specific financial date utility functions as needed during development (Optional)
*/