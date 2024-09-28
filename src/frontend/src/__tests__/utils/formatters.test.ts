import { describe, it, expect } from '@jest/globals';
import { formatCurrency, formatDate, formatPercentage, formatPhoneNumber, formatAccountNumber } from '../../utils/formatters';

describe('formatCurrency', () => {
  it('should format positive numbers', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format negative numbers', () => {
    expect(formatCurrency(-1000)).toBe('-$1,000.00');
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should format zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format with different currency codes', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
    expect(formatCurrency(1000, 'GBP')).toBe('£1,000.00');
  });

  it('should format large numbers', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    expect(formatCurrency(1234567890.12)).toBe('$1,234,567,890.12');
  });
});

describe('formatDate', () => {
  it('should format with default format', () => {
    const date = new Date('2023-05-15T12:00:00Z');
    expect(formatDate(date)).toBe('May 15, 2023');
  });

  it('should format with custom format', () => {
    const date = new Date('2023-05-15T12:00:00Z');
    expect(formatDate(date, 'MM/dd/yyyy')).toBe('05/15/2023');
  });

  it('should format with Date object input', () => {
    const date = new Date('2023-05-15T12:00:00Z');
    expect(formatDate(date)).toBe('May 15, 2023');
  });

  it('should format with string input', () => {
    expect(formatDate('2023-05-15')).toBe('May 15, 2023');
  });

  it('should handle invalid date input', () => {
    expect(formatDate('invalid-date')).toBe('Invalid Date');
  });
});

describe('formatPercentage', () => {
  it('should format with default decimal places', () => {
    expect(formatPercentage(0.1234)).toBe('12.34%');
  });

  it('should format with custom decimal places', () => {
    expect(formatPercentage(0.1234, 1)).toBe('12.3%');
    expect(formatPercentage(0.1234, 3)).toBe('12.340%');
  });

  it('should format values greater than 1', () => {
    expect(formatPercentage(1.5)).toBe('150.00%');
  });

  it('should format negative values', () => {
    expect(formatPercentage(-0.1234)).toBe('-12.34%');
  });

  it('should format zero', () => {
    expect(formatPercentage(0)).toBe('0.00%');
  });
});

describe('formatPhoneNumber', () => {
  it('should format valid 10-digit number', () => {
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });

  it('should format number with non-digit characters', () => {
    expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
    expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
  });

  it('should handle invalid number (less than 10 digits)', () => {
    expect(formatPhoneNumber('123456')).toBe('Invalid phone number');
  });

  it('should handle invalid number (more than 10 digits)', () => {
    expect(formatPhoneNumber('12345678901')).toBe('Invalid phone number');
  });
});

describe('formatAccountNumber', () => {
  it('should mask account number with more than 4 digits', () => {
    expect(formatAccountNumber('1234567890')).toBe('******7890');
  });

  it('should mask account number with exactly 4 digits', () => {
    expect(formatAccountNumber('1234')).toBe('1234');
  });

  it('should mask account number with less than 4 digits', () => {
    expect(formatAccountNumber('123')).toBe('123');
  });
});