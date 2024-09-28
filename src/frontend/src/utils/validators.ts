/**
 * Utility functions for validating user input and data in the Mint Replica frontend application
 */

/**
 * Validates if the given string is a valid email address
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if the given password meets the required criteria
 * @param password - The password to validate
 * @returns True if the password is valid, false otherwise
 */
export const isValidPassword = (password: string): boolean => {
  // Check if the password is at least 12 characters long
  if (password.length < 12) {
    return false;
  }

  // Verify that it contains at least one uppercase letter, one lowercase letter, one number, and one special character
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

/**
 * Validates if the given string represents a valid monetary amount
 * @param amount - The amount to validate
 * @returns True if the amount is valid, false otherwise
 */
export const isValidAmount = (amount: string): boolean => {
  // Check if the amount is a valid number
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    return false;
  }

  // Ensure it has a maximum of two decimal places
  const decimalPlaces = (amount.split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return false;
  }

  // Verify that it's a positive number
  return numericAmount > 0;
};

/**
 * Checks if the given string is a valid date
 * @param date - The date string to validate
 * @returns True if the date is valid, false otherwise
 */
export const isValidDate = (date: string): boolean => {
  // Parse the date string into a Date object
  const parsedDate = new Date(date);

  // Check if the resulting Date is valid and not NaN
  return !isNaN(parsedDate.getTime());
};

/**
 * Validates if the given string is a valid account number
 * @param accountNumber - The account number to validate
 * @returns True if the account number is valid, false otherwise
 */
export const isValidAccountNumber = (accountNumber: string): boolean => {
  // Check if the account number consists of only digits
  const isNumeric = /^\d+$/.test(accountNumber);

  // Verify that it's between 8 and 17 characters long
  const isValidLength = accountNumber.length >= 8 && accountNumber.length <= 17;

  return isNumeric && isValidLength;
};

/**
 * Checks if the given string is a valid 9-digit routing number
 * @param routingNumber - The routing number to validate
 * @returns True if the routing number is valid, false otherwise
 */
export const isValidRoutingNumber = (routingNumber: string): boolean => {
  // Check if the routing number is exactly 9 digits long
  const isValidLength = routingNumber.length === 9;

  // Verify that it consists of only numeric characters
  const isNumeric = /^\d+$/.test(routingNumber);

  return isValidLength && isNumeric;
};

// Human tasks (commented as requested):
// TODO: Implement additional validation functions as needed for specific features
// TODO: Consider adding more complex validation rules for financial data if required