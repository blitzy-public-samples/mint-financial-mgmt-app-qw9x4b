import { RegexPatterns } from '../constants/regex-patterns';

/**
 * Validates if the given string is a valid email address
 * @param email The email string to validate
 * @returns True if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  return RegexPatterns.EMAIL.test(email);
}

/**
 * Checks if the given password meets the required criteria
 * @param password The password string to validate
 * @returns True if the password is valid, false otherwise
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 12 && RegexPatterns.PASSWORD.test(password);
}

/**
 * Validates if the given string represents a valid currency amount
 * @param amount The amount string to validate
 * @returns True if the amount is a valid currency format, false otherwise
 */
export function isValidCurrencyAmount(amount: string): boolean {
  return RegexPatterns.CURRENCY_AMOUNT.test(amount);
}

/**
 * Checks if the given string is a valid date in the format YYYY-MM-DD
 * @param date The date string to validate
 * @returns True if the date is valid, false otherwise
 */
export function isValidDate(date: string): boolean {
  if (!RegexPatterns.DATE.test(date)) {
    return false;
  }

  const [year, month, day] = date.split('-').map(Number);
  const dateObject = new Date(year, month - 1, day);

  return (
    dateObject.getFullYear() === year &&
    dateObject.getMonth() === month - 1 &&
    dateObject.getDate() === day
  );
}

/**
 * Validates if the given string is a valid phone number
 * @param phoneNumber The phone number string to validate
 * @returns True if the phone number is valid, false otherwise
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  return RegexPatterns.PHONE_NUMBER.test(phoneNumber);
}

// TODO: Implement additional validation functions as needed for specific features of the Mint Replica application

/**
 * Human tasks:
 * 1. Create the src/shared/constants/regex-patterns.ts file with the necessary regex patterns (Required)
 * 2. Implement additional validation functions as needed for specific features of the Mint Replica application (Optional)
 * 3. Add unit tests for each validation function to ensure accuracy (Required)
 */