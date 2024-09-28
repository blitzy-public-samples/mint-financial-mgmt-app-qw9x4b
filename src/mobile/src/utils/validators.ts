/**
 * This file contains utility functions for validating user input and data in the mobile application.
 * It provides reusable validation functions to ensure data integrity and improve user experience.
 */

/**
 * Validates if the given string is a valid email address
 * @param email The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  // Use a regular expression to check if the email matches the standard email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if the given password meets the required criteria
 * @param password The password to validate
 * @returns True if the password is valid, false otherwise
 */
export const isValidPassword = (password: string): boolean => {
  // Check if the password length is at least 12 characters
  if (password.length < 12) {
    return false;
  }

  // Verify that the password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Verify that the password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Verify that the password contains at least one number
  if (!/\d/.test(password)) {
    return false;
  }

  // Verify that the password contains at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return false;
  }

  // All criteria are met
  return true;
};

/**
 * Validates if the given string represents a valid monetary amount
 * @param amount The amount to validate
 * @returns True if the amount is valid, false otherwise
 */
export const isValidAmount = (amount: string): boolean => {
  // Convert the string to a number
  const numericAmount = parseFloat(amount);

  // Check if the conversion resulted in a valid number
  if (isNaN(numericAmount)) {
    return false;
  }

  // Verify that the number is not negative
  if (numericAmount < 0) {
    return false;
  }

  // Verify that the number has at most two decimal places
  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    return false;
  }

  return true;
};

/**
 * Checks if the given string represents a valid date
 * @param dateString The date string to validate
 * @returns True if the date is valid, false otherwise
 */
export const isValidDate = (dateString: string): boolean => {
  // Create a Date object from the input string
  const date = new Date(dateString);

  // Check if the Date object is valid and not NaN
  if (isNaN(date.getTime())) {
    return false;
  }

  // Optionally, check if the date is within a reasonable range (e.g., not in the far future or past)
  const now = new Date();
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(now.getFullYear() - 100);
  const tenYearsFromNow = new Date();
  tenYearsFromNow.setFullYear(now.getFullYear() + 10);

  if (date < hundredYearsAgo || date > tenYearsFromNow) {
    return false;
  }

  return true;
};

/**
 * Validates if the given string is a valid phone number
 * @param phoneNumber The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Use a regular expression to check if the phone number matches a standard format
  // This regex allows for various formats including country codes
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Checks if the given string is a valid credit card number using the Luhn algorithm
 * @param creditCardNumber The credit card number to validate
 * @returns True if the credit card number is valid, false otherwise
 */
export const isValidCreditCardNumber = (creditCardNumber: string): boolean => {
  // Remove any non-digit characters from the input
  const digits = creditCardNumber.replace(/\D/g, '');

  // Implement the Luhn algorithm to check the validity of the credit card number
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Human tasks:
/**
 * TODO: Review and adjust regular expressions for email and phone number validation to ensure they meet specific project requirements
 * TODO: Confirm the exact password complexity requirements with the security team
 * TODO: Determine if any additional validation functions are needed for the mobile app's specific features
 */