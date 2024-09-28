import { describe, it, expect } from '@jest/globals';
import * as validators from '../../src/utils/validators';

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
    expect(validators.isValidPassword('StrongP@ss1')).toBe(true);
    expect(validators.isValidPassword('C0mpl3x!Pass')).toBe(true);
  });

  it('should return false for passwords missing uppercase letters', () => {
    expect(validators.isValidPassword('weakpass1!')).toBe(false);
  });

  it('should return false for passwords missing lowercase letters', () => {
    expect(validators.isValidPassword('STRONGPASS1!')).toBe(false);
  });

  it('should return false for passwords missing numbers', () => {
    expect(validators.isValidPassword('StrongPass!')).toBe(false);
  });

  it('should return false for passwords missing special characters', () => {
    expect(validators.isValidPassword('StrongPass1')).toBe(false);
  });

  it('should return false for passwords shorter than the minimum length', () => {
    expect(validators.isValidPassword('Short1!')).toBe(false);
  });

  it('should handle edge cases correctly', () => {
    expect(validators.isValidPassword('')).toBe(false);
    expect(validators.isValidPassword(null as any)).toBe(false);
    expect(validators.isValidPassword(undefined as any)).toBe(false);
  });
});

describe('isValidAmount', () => {
  it('should return true for valid monetary amounts', () => {
    expect(validators.isValidAmount('100')).toBe(true);
    expect(validators.isValidAmount('100.00')).toBe(true);
    expect(validators.isValidAmount('0.01')).toBe(true);
  });

  it('should return false for invalid monetary amounts', () => {
    expect(validators.isValidAmount('-100')).toBe(false);
    expect(validators.isValidAmount('100.000')).toBe(false);
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
    expect(validators.isValidDate('2023-13-01')).toBe(false);
    expect(validators.isValidDate('02/30/2023')).toBe(false);
    expect(validators.isValidDate('not a date')).toBe(false);
  });

  it('should return false for dates out of reasonable range', () => {
    expect(validators.isValidDate('1800-01-01')).toBe(false);
    expect(validators.isValidDate('2200-01-01')).toBe(false);
  });

  it('should handle edge cases correctly', () => {
    expect(validators.isValidDate('')).toBe(false);
    expect(validators.isValidDate(null as any)).toBe(false);
    expect(validators.isValidDate(undefined as any)).toBe(false);
  });
});

describe('isValidPhoneNumber', () => {
  it('should return true for valid phone numbers in various formats', () => {
    expect(validators.isValidPhoneNumber('+1 (123) 456-7890')).toBe(true);
    expect(validators.isValidPhoneNumber('123-456-7890')).toBe(true);
    expect(validators.isValidPhoneNumber('1234567890')).toBe(true);
  });

  it('should return false for invalid phone numbers', () => {
    expect(validators.isValidPhoneNumber('123-456-789')).toBe(false);
    expect(validators.isValidPhoneNumber('12345')).toBe(false);
    expect(validators.isValidPhoneNumber('abc-def-ghij')).toBe(false);
  });

  it('should handle phone numbers with and without country codes', () => {
    expect(validators.isValidPhoneNumber('+44 20 7123 4567')).toBe(true);
    expect(validators.isValidPhoneNumber('020 7123 4567')).toBe(true);
  });

  it('should handle edge cases correctly', () => {
    expect(validators.isValidPhoneNumber('')).toBe(false);
    expect(validators.isValidPhoneNumber(null as any)).toBe(false);
    expect(validators.isValidPhoneNumber(undefined as any)).toBe(false);
  });
});

describe('isValidCreditCardNumber', () => {
  it('should return true for valid credit card numbers for different card types', () => {
    expect(validators.isValidCreditCardNumber('4111111111111111')).toBe(true); // Visa
    expect(validators.isValidCreditCardNumber('5555555555554444')).toBe(true); // Mastercard
    expect(validators.isValidCreditCardNumber('378282246310005')).toBe(true); // American Express
  });

  it('should return false for invalid credit card numbers', () => {
    expect(validators.isValidCreditCardNumber('1111111111111111')).toBe(false);
    expect(validators.isValidCreditCardNumber('411111111111111')).toBe(false); // Too short
    expect(validators.isValidCreditCardNumber('4111111111111112')).toBe(false); // Invalid checksum
  });

  it('should handle credit card numbers with spaces or dashes', () => {
    expect(validators.isValidCreditCardNumber('4111 1111 1111 1111')).toBe(true);
    expect(validators.isValidCreditCardNumber('4111-1111-1111-1111')).toBe(true);
  });

  it('should handle edge cases correctly', () => {
    expect(validators.isValidCreditCardNumber('')).toBe(false);
    expect(validators.isValidCreditCardNumber(null as any)).toBe(false);
    expect(validators.isValidCreditCardNumber(undefined as any)).toBe(false);
  });
});

// Add more test cases for custom validation rules if needed