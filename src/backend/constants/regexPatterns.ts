/**
 * This file contains regular expression patterns used for validation throughout
 * the Mint Replica application's backend. These patterns ensure data integrity
 * and security by validating user inputs and data formats.
 */

// Regular expression for validating email addresses
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regular expression for validating password strength (minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Regular expression for validating usernames (alphanumeric, 3-20 characters)
export const USERNAME_REGEX = /^[a-zA-Z0-9]{3,20}$/;

// Regular expression for validating names (letters, spaces, hyphens, and apostrophes)
export const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

// Regular expression for validating phone numbers (various formats)
export const PHONE_REGEX = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

// Regular expression for validating currency amounts (positive numbers with up to two decimal places)
export const CURRENCY_REGEX = /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$/;

// Regular expression for validating dates in YYYY-MM-DD format
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Regular expression for validating account numbers (alphanumeric, 5-20 characters)
export const ACCOUNT_NUMBER_REGEX = /^[a-zA-Z0-9]{5,20}$/;

// Regular expression for validating bank routing numbers (9 digits)
export const ROUTING_NUMBER_REGEX = /^\d{9}$/;

// Regular expression for validating credit card numbers (various formats)
export const CREDIT_CARD_REGEX = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9][0-9])[0-9]{12})$/;

// Regular expression for validating ZIP codes (5 digits or 5+4 format)
export const ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;

/**
 * TODO: Human Tasks
 * 1. Review and validate all regex patterns for accuracy and security (Required)
 * 2. Consider adding additional regex patterns for specific financial data formats if needed (Optional)
 */