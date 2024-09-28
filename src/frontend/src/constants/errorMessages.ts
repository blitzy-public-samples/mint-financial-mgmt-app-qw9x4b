// This file defines constants for error messages used throughout the Mint Replica frontend application.
// These constants provide consistent error messaging for various scenarios.

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  REGISTRATION_FAILED: "Registration failed. Please check your information and try again.",
  LOGIN_FAILED: "Login failed. Please try again later.",
  LOGOUT_FAILED: "Logout failed. Please try again.",
  TOKEN_EXPIRED: "Your session has expired. Please log in again.",
  UNAUTHORIZED: "You are not authorized to perform this action."
};

export const USER_ERRORS = {
  PROFILE_UPDATE_FAILED: "Failed to update profile. Please try again.",
  PREFERENCES_UPDATE_FAILED: "Failed to update preferences. Please try again."
};

export const ACCOUNT_ERRORS = {
  FETCH_FAILED: "Failed to fetch accounts. Please try again.",
  CREATE_FAILED: "Failed to create account. Please check your information and try again.",
  UPDATE_FAILED: "Failed to update account. Please try again.",
  DELETE_FAILED: "Failed to delete account. Please try again.",
  SYNC_FAILED: "Failed to sync account. Please try again later."
};

export const TRANSACTION_ERRORS = {
  FETCH_FAILED: "Failed to fetch transactions. Please try again.",
  CREATE_FAILED: "Failed to create transaction. Please check your information and try again.",
  UPDATE_FAILED: "Failed to update transaction. Please try again.",
  DELETE_FAILED: "Failed to delete transaction. Please try again."
};

export const BUDGET_ERRORS = {
  FETCH_FAILED: "Failed to fetch budgets. Please try again.",
  CREATE_FAILED: "Failed to create budget. Please check your information and try again.",
  UPDATE_FAILED: "Failed to update budget. Please try again.",
  DELETE_FAILED: "Failed to delete budget. Please try again."
};

export const GOAL_ERRORS = {
  FETCH_FAILED: "Failed to fetch goals. Please try again.",
  CREATE_FAILED: "Failed to create goal. Please check your information and try again.",
  UPDATE_FAILED: "Failed to update goal. Please try again.",
  DELETE_FAILED: "Failed to delete goal. Please try again."
};

export const INVESTMENT_ERRORS = {
  FETCH_FAILED: "Failed to fetch investments. Please try again.",
  UPDATE_FAILED: "Failed to update investment information. Please try again."
};

export const CREDIT_SCORE_ERRORS = {
  FETCH_FAILED: "Failed to fetch credit score. Please try again.",
  HISTORY_FETCH_FAILED: "Failed to fetch credit score history. Please try again."
};

export const INSIGHT_ERRORS = {
  FETCH_FAILED: "Failed to fetch financial insights. Please try again."
};

export const NETWORK_ERRORS = {
  CONNECTION_ERROR: "Unable to connect to the server. Please check your internet connection and try again.",
  TIMEOUT_ERROR: "The request timed out. Please try again later.",
  SERVER_ERROR: "An unexpected server error occurred. Please try again later."
};

export const VALIDATION_ERRORS = {
  REQUIRED_FIELD: "This field is required.",
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_PASSWORD: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match.",
  INVALID_DATE: "Please enter a valid date.",
  INVALID_AMOUNT: "Please enter a valid amount.",
  INVALID_CATEGORY: "Please select a valid category."
};

// Human tasks:
// TODO: Review and confirm all error messages for clarity and consistency
// TODO: (Optional) Ensure error messages are properly internationalized if multi-language support is required