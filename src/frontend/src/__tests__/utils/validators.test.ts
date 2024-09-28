import { describe, it, expect } from '@jest/globals';
import * as validators from '../../utils/validators';

describe('isValidEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(validators.isValidEmail('user@example.com')).toBe(true);
    expect(validators.isValidEmail('user.name+tag@example.co.uk')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(validators.isValidEmail('invalid-email')).toBe(false);
    expect(validators.isValidEmail('user@')).toBe(false);
    expect(validators.isValidEmail('@example.com')).toBe(false);
  });

  it('should handle edge cases correctly', () => {
    expect(validators.isValidEmail('')).toBe(false);
    expect(validators.isValidEmail(null as any)).toBe(false);
    expect(validators.isValidEmail(undefined as any)).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('should return true for valid passwords meeting all criteria', () => {
    expect(validators.isValidPassword('StrongP@ssw0rd')).toBe(true);
    expect(validators.isValidPassword('C0mpl3x!Pass')).toBe(true);
  });

  it('should return false for passwords missing uppercase letters', () => {
    expect(validators.isValidPassword('weakp@ssw0rd')).toBe(false);
  });

  it('should return false for passwords missing lowercase letters', () => {
    expect(validators.isValidPassword('WEAKP@SSW0RD')).toBe(false);
  });

  it('should return false for passwords missing numbers', () => {
    expect(validators.isValidPassword('WeakP@ssword')).toBe(false);
  });

  it('should return false for passwords missing special characters', () => {
    expect(validators.isValidPassword('WeakPassword123')).toBe(false);
  });

  it('should return false for passwords shorter than 12 characters', () => {
    expect(validators.isValidPassword('Short@1')).toBe(false);
  });

  it('should handle edge cases correctly', () => {
    expect(validators.isValidPassword('')).toBe(false);
    expect(validators.isValidPassword(null as any)).toBe(false);
    expect(validators.isValidPassword(undefined as any)).toBe(false);
  });
});

describe('isValidAmount', () => {
  it('should return true for valid monetary amounts', () => {
    expect(validators.isValidAmount('100.00')).toBe(true);
    expect(validators.isValidAmount('1234.56')).toBe(true);
    expect(validators.isValidAmount('0.01')).toBe(true);
  });

  it('should return false for amounts having more than two decimal places', () => {
    expect(validators.isValidAmount('100.001')).toBe(false);
  });

  it('should return false for negative amounts', () => {
    expect(validators.isValidAmount('-100.00')).toBe(false);
  });

  it('should return false for non-numeric strings', () => {
    expect(validators.isValidAmount('abc')).toBe(false);
  });

  it('should handle edge cases correctly', () => {
    expect(validators.isValidAmount('')).toBe(false);
    expect(validators.isValidAmount(null as any)).toBe(false);
    expect(validators.isValidAmount(undefined as any)).toBe(false);
  });
});

describe('isValidDate', () => {
  it('should return true for valid date strings in various formats', () => {
    expect(validators.isValidDate('2023-05-15')).toBe(true);
    expect(validators.isValidDate('05/15/2023')).toBe(true);
    expect(validators.isValidDate('15.05.2023')).toBe(true);
  });

  it('should return false for invalid date strings', () => {
    expect(validators.isValidDate('2023-13-45')).toBe(false);
    expect(validators.isValidDate('05/32/2023')).toBe(false);
  });

  it('should return false for non-date strings', () => {
    expect(validators.isValidDate('not a date')).toBe(false);
  });

  it('should handle edge cases correctly', () => {
    expect(validators.isValidDate('')).toBe(false);
    expect(validators.isValidDate(null as any)).toBe(false);
    expect(validators.isValidDate(undefined as any)).toBe(false);
  });
});

describe('isValidAccountNumber', () => {
  it('should return true for valid account numbers of different lengths', () => {
    expect(validators.isValidAccountNumber('12345678')).toBe(true);
    expect(validators.isValidAccountNumber('123456789012345')).toBe(true);
  });

  it('should return false for account numbers shorter than 8 digits', () => {
    expect(validators.isValidAccountNumber('1234567')).toBe(false);
  });

  it('should return false for account numbers longer than 17 digits', () => {
    expect(validators.isValidAccountNumber('123456789012345678')).toBe(false);
  });

  it('should return false for non-numeric account numbers', () => {
    expect(validators.isValidAccountNumber('12345abc')).toBe(false);
  });

  it('should handle edge cases correctly', () => {
    expect(validators.isValidAccountNumber('')).toBe(false);
    expect(validators.isValidAccountNumber(null as any)).toBe(false);
    expect(validators.isValidAccountNumber(undefined as any)).toBe(false);
  });
});

describe('isValidRoutingNumber', () => {
  it('should return true for valid 9-digit routing numbers', () => {
    expect(validators.isValidRoutingNumber('123456789')).toBe(true);
  });

  it('should return false for routing numbers shorter than 9 digits', () => {
    expect(validators.isValidRoutingNumber('12345678')).toBe(false);
  });

  it('should return false for routing numbers longer than 9 digits', () => {
    expect(validators.isValidRoutingNumber('1234567890')).toBe(false);
  });

  it('should return false for non-numeric routing numbers', () => {
    expect(validators.isValidRoutingNumber('12345678a')).toBe(false);
  });

  it('should handle edge cases correctly', () => {
    expect(validators.isValidRoutingNumber('')).toBe(false);
    expect(validators.isValidRoutingNumber(null as any)).toBe(false);
    expect(validators.isValidRoutingNumber(undefined as any)).toBe(false);
  });
});

// Human tasks:
// TODO: Add more test cases for edge cases and specific scenarios relevant to the Mint Replica application
// TODO: Ensure test coverage is comprehensive for all validator functions
// TODO: Update tests if any new validation functions are added to the validators utility