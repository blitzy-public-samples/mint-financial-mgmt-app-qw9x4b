/**
 * This file contains constant error messages used throughout the API.
 * These messages are used to provide consistent and meaningful error responses to clients.
 */

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access. Please log in.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again later.",
  INVALID_INPUT: "Invalid input. Please check your data and try again.",
  DUPLICATE_ENTRY: "A resource with this identifier already exists.",
  ACCOUNT_NOT_FOUND: "The specified account was not found.",
  INSUFFICIENT_FUNDS: "Insufficient funds to complete this transaction.",
  INVALID_TRANSACTION: "The transaction is invalid or cannot be processed.",
  BUDGET_LIMIT_EXCEEDED: "This transaction would exceed the budget limit.",
  GOAL_NOT_FOUND: "The specified financial goal was not found.",
  INVESTMENT_NOT_FOUND: "The specified investment was not found.",
  CREDIT_SCORE_UNAVAILABLE: "Unable to retrieve credit score at this time.",
  EXTERNAL_SERVICE_ERROR: "An error occurred while communicating with an external service.",
  RATE_LIMIT_EXCEEDED: "You have exceeded the rate limit. Please try again later.",
  INVALID_CREDENTIALS: "Invalid username or password.",
  ACCOUNT_LOCKED: "Your account has been locked. Please contact support.",
  PASSWORD_RESET_REQUIRED: "You must reset your password before continuing.",
  INVALID_TOKEN: "The provided token is invalid or has expired.",
  MISSING_REQUIRED_FIELDS: "One or more required fields are missing.",
  INVALID_DATE_RANGE: "The specified date range is invalid.",
  CATEGORY_NOT_FOUND: "The specified category was not found.",
  INVALID_CURRENCY: "The specified currency is not supported.",
  SYNC_FAILED: "Failed to synchronize data with the financial institution.",
  INVALID_FILE_FORMAT: "The uploaded file format is not supported.",
  FILE_TOO_LARGE: "The uploaded file exceeds the maximum allowed size.",
  INVALID_ACCOUNT_TYPE: "The specified account type is not valid.",
  INVALID_GOAL_TYPE: "The specified goal type is not valid.",
  INVALID_INVESTMENT_TYPE: "The specified investment type is not valid.",
  INVALID_BUDGET_PERIOD: "The specified budget period is not valid.",
  DUPLICATE_TRANSACTION: "This transaction appears to be a duplicate.",
  INVALID_CREDIT_SCORE_RANGE: "The credit score must be between 300 and 850.",
  INVALID_PERCENTAGE: "The percentage value must be between 0 and 100.",
  INVALID_PHONE_NUMBER: "The provided phone number is not valid.",
  INVALID_EMAIL: "The provided email address is not valid.",
  PASSWORD_TOO_WEAK: "The password does not meet the minimum strength requirements.",
  ACCOUNT_ALREADY_CONNECTED: "This financial account is already connected to your profile.",
  INVALID_MFA_CODE: "The provided multi-factor authentication code is invalid.",
  MFA_REQUIRED: "Multi-factor authentication is required to complete this action.",
  INVALID_API_KEY: "The provided API key is invalid or has been revoked.",
  SUBSCRIPTION_REQUIRED: "This feature requires an active subscription.",
  TRIAL_EXPIRED: "Your trial period has expired. Please upgrade your account.",
  INVALID_PROMO_CODE: "The entered promotional code is invalid or has expired.",
  SERVICE_UNAVAILABLE: "This service is temporarily unavailable. Please try again later."
};

// Human tasks:
// TODO: Review and update error messages to ensure they are clear, concise, and user-friendly
// TODO: Ensure all error messages are properly internationalized if the application supports multiple languages
// TODO: Verify that all possible error scenarios in the application are covered by these error messages