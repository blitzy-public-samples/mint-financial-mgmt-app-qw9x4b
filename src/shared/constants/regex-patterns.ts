/**
 * This file contains regular expression patterns used for validation and data parsing
 * throughout the Mint Replica application.
 */

// Email validation regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password validation regex (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Username validation regex (3-20 characters, alphanumeric and underscore)
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

// Phone number validation regex (10-14 digits, optional '+' at the beginning)
export const PHONE_REGEX = /^\+?\d{10,14}$/;

// Currency validation regex (optional '$', up to 3 digits before comma, optional comma-separated thousands, optional cents)
export const CURRENCY_REGEX = /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/;

// Date validation regex (YYYY-MM-DD format)
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Credit card number validation regex (major card types: Visa, MasterCard, American Express, Discover)
export const CREDIT_CARD_REGEX = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9][0-9])[0-9]{12})$/;

// ZIP code validation regex (5 digits, optional 4 digit extension)
export const ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;

// URL validation regex (http/https, optional www, domain, optional path)
export const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

// Account number validation regex (10-12 digits)
export const ACCOUNT_NUMBER_REGEX = /^\d{10,12}$/;

/**
 * TODO: Review and validate regex patterns for correctness and coverage
 * TODO: Consider adding more specific regex patterns for financial data validation
 */