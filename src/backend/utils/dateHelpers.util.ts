import * as sharedDateHelpers from '../../shared/utils/date-helpers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = 'UTC';

/**
 * Formats a date to UTC string
 * @param date - The date to format
 * @returns UTC formatted date string
 */
export function formatDateToUTC(date: string | Date): string {
  return dayjs(date).utc().format();
}

/**
 * Parses a UTC date string to a Date object
 * @param utcString - The UTC date string to parse
 * @returns Parsed Date object
 */
export function parseUTCDate(utcString: string): Date {
  return dayjs.utc(utcString).toDate();
}

/**
 * Returns the start and end dates for a given financial period
 * @param period - The financial period ('week', 'month', 'quarter', 'year')
 * @param date - The reference date
 * @returns An object with startDate and endDate
 */
export function getDateRangeForFinancialPeriod(period: string, date: string | Date): { startDate: Date; endDate: Date } {
  const referenceDate = dayjs(date);
  let startDate: dayjs.Dayjs;
  let endDate: dayjs.Dayjs;

  switch (period.toLowerCase()) {
    case 'week':
      startDate = referenceDate.startOf('week');
      endDate = referenceDate.endOf('week');
      break;
    case 'month':
      startDate = referenceDate.startOf('month');
      endDate = referenceDate.endOf('month');
      break;
    case 'quarter':
      startDate = referenceDate.startOf('quarter');
      endDate = referenceDate.endOf('quarter');
      break;
    case 'year':
      startDate = referenceDate.startOf('year');
      endDate = referenceDate.endOf('year');
      break;
    default:
      throw new Error('Invalid period specified');
  }

  return {
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  };
}

/**
 * Checks if a given string is in a valid date format
 * @param dateString - The date string to check
 * @param format - The expected date format
 * @returns True if the date string matches the specified format, false otherwise
 */
export function isValidDateFormat(dateString: string, format: string): boolean {
  return dayjs(dateString, format, true).isValid();
}

/**
 * Returns the first day of the year for a given date
 * @param date - The reference date
 * @returns Date object representing the first day of the year
 */
export function getFirstDayOfYear(date: string | Date): Date {
  return dayjs(date).startOf('year').toDate();
}

/**
 * Returns the last day of the year for a given date
 * @param date - The reference date
 * @returns Date object representing the last day of the year
 */
export function getLastDayOfYear(date: string | Date): Date {
  return dayjs(date).endOf('year').toDate();
}

// Re-export shared date helper functions
export { sharedDateHelpers };

// Human tasks (commented)
/*
TODO: Implement unit tests for all date helper functions (Required)
TODO: Review and optimize the performance of date operations for large datasets (Optional)
TODO: Consider adding more specific financial date utility functions as needed during backend development (Optional)
*/