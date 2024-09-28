/**
 * This file contains constant error messages used throughout the Mint Replica application
 * for consistent error handling and display.
 */

export const ERROR_MESSAGES = {
  AUTHENTICATION: {
    INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
    ACCOUNT_LOCKED: "Your account has been locked due to multiple failed login attempts. Please reset your password or contact support.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    UNAUTHORIZED: "You are not authorized to perform this action."
  },
  REGISTRATION: {
    EMAIL_TAKEN: "This email address is already registered. Please use a different email or try logging in.",
    WEAK_PASSWORD: "Password is too weak. It must be at least 12 characters long and include uppercase, lowercase, numbers, and symbols.",
    INVALID_EMAIL: "Please enter a valid email address."
  },
  ACCOUNT: {
    NOT_FOUND: "Account not found. Please check the account details and try again.",
    SYNC_FAILED: "Failed to sync account. Please try again later or contact support if the problem persists.",
    INVALID_ACCOUNT_TYPE: "Invalid account type. Please select a valid account type."
  },
  TRANSACTION: {
    INVALID_AMOUNT: "Invalid transaction amount. Please enter a valid number.",
    INVALID_DATE: "Invalid transaction date. Please enter a valid date.",
    CATEGORY_NOT_FOUND: "Transaction category not found. Please select a valid category."
  },
  BUDGET: {
    INVALID_AMOUNT: "Invalid budget amount. Please enter a valid number.",
    INVALID_PERIOD: "Invalid budget period. Please select a valid period.",
    CATEGORY_NOT_FOUND: "Budget category not found. Please select a valid category."
  },
  GOAL: {
    INVALID_TARGET_AMOUNT: "Invalid goal target amount. Please enter a valid number.",
    INVALID_TARGET_DATE: "Invalid goal target date. Please enter a valid future date.",
    GOAL_NOT_FOUND: "Goal not found. Please check the goal details and try again."
  },
  INVESTMENT: {
    SYNC_FAILED: "Failed to sync investment data. Please try again later or contact support if the problem persists.",
    INVALID_PORTFOLIO: "Invalid investment portfolio. Please check the portfolio details and try again."
  },
  CREDIT_SCORE: {
    FETCH_FAILED: "Failed to fetch credit score. Please try again later or contact support if the problem persists.",
    UNAUTHORIZED_ACCESS: "You are not authorized to access this credit score information."
  },
  GENERAL: {
    INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again later or contact support if the problem persists.",
    NETWORK_ERROR: "Network error. Please check your internet connection and try again.",
    INVALID_INPUT: "Invalid input. Please check your entries and try again.",
    NOT_FOUND: "The requested resource was not found.",
    FORBIDDEN: "You do not have permission to access this resource."
  }
};

// Export individual error categories for more granular imports if needed
export const AUTHENTICATION_ERRORS = ERROR_MESSAGES.AUTHENTICATION;
export const REGISTRATION_ERRORS = ERROR_MESSAGES.REGISTRATION;
export const ACCOUNT_ERRORS = ERROR_MESSAGES.ACCOUNT;
export const TRANSACTION_ERRORS = ERROR_MESSAGES.TRANSACTION;
export const BUDGET_ERRORS = ERROR_MESSAGES.BUDGET;
export const GOAL_ERRORS = ERROR_MESSAGES.GOAL;
export const INVESTMENT_ERRORS = ERROR_MESSAGES.INVESTMENT;
export const CREDIT_SCORE_ERRORS = ERROR_MESSAGES.CREDIT_SCORE;
export const GENERAL_ERRORS = ERROR_MESSAGES.GENERAL;