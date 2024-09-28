import { describe, it, expect } from '@jest/globals';
import { formatCurrency, formatDate, formatPercentage, formatPhoneNumber, truncateText } from '../../src/utils/formatters';

describe('Formatter Utilities', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000.00');
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format with different currency options', () => {
      expect(formatCurrency(1000, { currency: 'EUR' })).toBe('€1,000.00');
      expect(formatCurrency(1000, { currency: 'GBP' })).toBe('£1,000.00');
    });
  });

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      expect(formatDate('2023-05-15')).toBe('May 15, 2023');
    });

    it('should format Date objects correctly', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      expect(formatDate(date)).toBe('May 15, 2023');
    });

    it('should format with different format strings', () => {
      expect(formatDate('2023-05-15', 'MM/dd/yyyy')).toBe('05/15/2023');
      expect(formatDate('2023-05-15', 'yyyy-MM-dd')).toBe('2023-05-15');
    });

    it('should handle invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
  });

  describe('formatPercentage', () => {
    it('should format decimal numbers correctly', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%');
      expect(formatPercentage(0.5678)).toBe('56.78%');
    });

    it('should format whole numbers correctly', () => {
      expect(formatPercentage(1)).toBe('100.00%');
      expect(formatPercentage(0)).toBe('0.00%');
    });

    it('should format with different decimal places', () => {
      expect(formatPercentage(0.1234, 1)).toBe('12.3%');
      expect(formatPercentage(0.5678, 3)).toBe('56.780%');
    });

    it('should format zero and negative numbers', () => {
      expect(formatPercentage(0)).toBe('0.00%');
      expect(formatPercentage(-0.1234)).toBe('-12.34%');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format valid phone numbers', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('9876543210')).toBe('(987) 654-3210');
    });

    it('should format phone numbers with different formats', () => {
      expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
    });

    it('should handle invalid phone numbers', () => {
      expect(formatPhoneNumber('invalid')).toBe('Invalid phone number');
      expect(formatPhoneNumber('12345')).toBe('Invalid phone number');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than maxLength', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a...');
      expect(truncateText('Short', 10)).toBe('Short');
    });

    it('should handle text shorter than maxLength', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
    });

    it('should truncate with different maxLength values', () => {
      expect(truncateText('This is a test', 5)).toBe('This...');
      expect(truncateText('This is a test', 15)).toBe('This is a test');
    });

    it('should handle empty strings', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });
});

// TODO: Add tests for localized date formatting once implemented
// TODO: Add tests for international phone number formatting once implemented