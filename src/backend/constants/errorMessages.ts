/**
 * This file contains all error messages used throughout the Mint Replica application's backend.
 * It provides a centralized location for managing error messages, ensuring consistency and easy maintenance.
 */

export const ErrorMessages = {
  INTERNAL_SERVER_ERROR: "An internal server error occurred. Please try again later.",
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  USER_NOT_FOUND: "User not found.",
  EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  INVALID_TOKEN: "Invalid or expired token. Please log in again.",
  MISSING_REQUIRED_FIELDS: "Please provide all required fields.",
  INVALID_EMAIL_FORMAT: "Please provide a valid email address.",
  INVALID_PASSWORD_FORMAT: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  ACCOUNT_NOT_FOUND: "Account not found.",
  TRANSACTION_NOT_FOUND: "Transaction not found.",
  BUDGET_NOT_FOUND: "Budget not found.",
  GOAL_NOT_FOUND: "Goal not found.",
  INVESTMENT_NOT_FOUND: "Investment not found.",
  CREDIT_SCORE_NOT_FOUND: "Credit score information not found.",
  INVALID_DATE_FORMAT: "Invalid date format. Please use YYYY-MM-DD.",
  INVALID_AMOUNT: "Invalid amount. Please provide a valid number.",
  INSUFFICIENT_FUNDS: "Insufficient funds to complete this transaction.",
  CATEGORY_NOT_FOUND: "Category not found.",
  INVALID_CATEGORY: "Invalid category. Please choose from the available options.",
  PLAID_CONNECTION_ERROR: "Unable to connect to your financial institution. Please try again later.",
  CREDIT_BUREAU_CONNECTION_ERROR: "Unable to fetch credit score information. Please try again later.",
  INVESTMENT_DATA_ERROR: "Unable to fetch investment data. Please try again later.",
  INVALID_GOAL_TARGET: "Invalid goal target. Please provide a positive number.",
  INVALID_BUDGET_AMOUNT: "Invalid budget amount. Please provide a positive number.",
  INVALID_TRANSACTION_TYPE: "Invalid transaction type. Please choose either 'income' or 'expense'.",
  DUPLICATE_TRANSACTION: "This transaction appears to be a duplicate. Please check and try again.",
  INVALID_ACCOUNT_TYPE: "Invalid account type. Please choose from the available options.",
  INVALID_CURRENCY: "Invalid currency. Please provide a valid currency code.",
  INVALID_CREDIT_SCORE: "Invalid credit score. Please provide a number between 300 and 850.",
  INVALID_INVESTMENT_TYPE: "Invalid investment type. Please choose from the available options.",
  INVALID_GOAL_DATE: "Invalid goal date. The date must be in the future.",
  INVALID_BUDGET_PERIOD: "Invalid budget period. Please choose either 'monthly' or 'yearly'.",
  ACCOUNT_SYNC_ERROR: "Unable to sync account. Please try again later.",
  INVALID_FILE_FORMAT: "Invalid file format. Please upload a CSV or OFX file.",
  FILE_UPLOAD_ERROR: "Error uploading file. Please try again.",
  INVALID_REPORT_TYPE: "Invalid report type. Please choose from the available options.",
  REPORT_GENERATION_ERROR: "Error generating report. Please try again later.",
  INVALID_NOTIFICATION_SETTINGS: "Invalid notification settings. Please check your preferences and try again.",
  NOTIFICATION_SEND_ERROR: "Error sending notification. Please check your notification settings.",
  INVALID_SEARCH_QUERY: "Invalid search query. Please try a different search term.",
  NO_RESULTS_FOUND: "No results found for your search query.",
  INVALID_SORT_OPTION: "Invalid sort option. Please choose from the available sorting options.",
  INVALID_FILTER_OPTION: "Invalid filter option. Please choose from the available filtering options.",
  INVALID_DATE_RANGE: "Invalid date range. Please ensure the start date is before the end date.",
  EXPORT_ERROR: "Error exporting data. Please try again later.",
  IMPORT_ERROR: "Error importing data. Please check your file and try again.",
  INVALID_MFA_CODE: "Invalid multi-factor authentication code. Please try again.",
  MFA_REQUIRED: "Multi-factor authentication is required. Please check your email or phone for the code.",
  PASSWORD_RESET_ERROR: "Error resetting password. Please try again or contact support.",
  INVALID_RESET_TOKEN: "Invalid or expired password reset token. Please request a new password reset.",
  ACCOUNT_LOCKED: "Your account has been locked due to multiple failed login attempts. Please contact support.",
  RATE_LIMIT_EXCEEDED: "You have exceeded the rate limit. Please try again later."
} as const;

// Type for the ErrorMessages object
export type ErrorMessageKey = keyof typeof ErrorMessages;

// Function to get an error message by key
export function getErrorMessage(key: ErrorMessageKey): string {
  return ErrorMessages[key];
}