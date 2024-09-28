import * as ApiTypes from '../types';
import * as ApiConstants from '../constants';

/**
 * Validates user input for registration or profile update
 * @param userInput The user input to validate
 * @returns True if all user input is valid, false otherwise
 */
export function validateUserInput(userInput: ApiTypes.UserInput): boolean {
  // Check if all required fields are present
  if (!userInput.email || !userInput.password || !userInput.firstName || !userInput.lastName || !userInput.dateOfBirth) {
    return false;
  }

  // Validate email
  if (!isValidEmail(userInput.email)) {
    return false;
  }

  // Validate password
  if (!isValidPassword(userInput.password)) {
    return false;
  }

  // Validate firstName and lastName for non-empty strings
  if (userInput.firstName.trim() === '' || userInput.lastName.trim() === '') {
    return false;
  }

  // Validate dateOfBirth
  if (!isValidDate(userInput.dateOfBirth)) {
    return false;
  }

  return true;
}

/**
 * Validates account input for creation or update
 * @param accountInput The account input to validate
 * @returns True if all account input is valid, false otherwise
 */
export function validateAccountInput(accountInput: ApiTypes.AccountInput): boolean {
  // Check if all required fields are present
  if (!accountInput.institutionName || !accountInput.accountType || !accountInput.accountName || !accountInput.balance || !accountInput.currency) {
    return false;
  }

  // Validate institutionName for non-empty string
  if (accountInput.institutionName.trim() === '') {
    return false;
  }

  // Validate accountType against ApiConstants.ACCOUNT_TYPES
  if (!ApiConstants.ACCOUNT_TYPES.includes(accountInput.accountType)) {
    return false;
  }

  // Validate accountName for non-empty string
  if (accountInput.accountName.trim() === '') {
    return false;
  }

  // Validate balance
  if (!isValidCurrencyAmount(accountInput.balance)) {
    return false;
  }

  // Validate currency against ApiConstants.SUPPORTED_CURRENCIES
  if (!ApiConstants.SUPPORTED_CURRENCIES.includes(accountInput.currency)) {
    return false;
  }

  return true;
}

/**
 * Validates transaction input for creation or update
 * @param transactionInput The transaction input to validate
 * @returns True if all transaction input is valid, false otherwise
 */
export function validateTransactionInput(transactionInput: ApiTypes.TransactionInput): boolean {
  // Check if all required fields are present
  if (!transactionInput.accountId || !transactionInput.categoryId || !transactionInput.transactionDate || !transactionInput.amount || !transactionInput.description) {
    return false;
  }

  // Validate accountId for non-empty string
  if (transactionInput.accountId.trim() === '') {
    return false;
  }

  // Validate categoryId for non-empty string
  if (transactionInput.categoryId.trim() === '') {
    return false;
  }

  // Validate transactionDate
  if (!isValidDate(transactionInput.transactionDate)) {
    return false;
  }

  // Validate amount
  if (!isValidCurrencyAmount(transactionInput.amount)) {
    return false;
  }

  // Validate description for non-empty string
  if (transactionInput.description.trim() === '') {
    return false;
  }

  // Validate isPending as a boolean
  if (typeof transactionInput.isPending !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Validates budget input for creation or update
 * @param budgetInput The budget input to validate
 * @returns True if all budget input is valid, false otherwise
 */
export function validateBudgetInput(budgetInput: ApiTypes.BudgetInput): boolean {
  // Check if all required fields are present
  if (!budgetInput.categoryId || !budgetInput.amount || !budgetInput.period || !budgetInput.startDate || !budgetInput.endDate) {
    return false;
  }

  // Validate categoryId for non-empty string
  if (budgetInput.categoryId.trim() === '') {
    return false;
  }

  // Validate amount
  if (!isValidCurrencyAmount(budgetInput.amount)) {
    return false;
  }

  // Validate period against ApiConstants.BUDGET_PERIODS
  if (!ApiConstants.BUDGET_PERIODS.includes(budgetInput.period)) {
    return false;
  }

  // Validate startDate and endDate
  if (!isValidDate(budgetInput.startDate) || !isValidDate(budgetInput.endDate)) {
    return false;
  }

  // Ensure startDate is before endDate
  if (new Date(budgetInput.startDate) >= new Date(budgetInput.endDate)) {
    return false;
  }

  return true;
}

/**
 * Validates financial goal input for creation or update
 * @param goalInput The goal input to validate
 * @returns True if all goal input is valid, false otherwise
 */
export function validateGoalInput(goalInput: ApiTypes.GoalInput): boolean {
  // Check if all required fields are present
  if (!goalInput.name || !goalInput.targetAmount || !goalInput.targetDate || !goalInput.currentAmount) {
    return false;
  }

  // Validate name for non-empty string
  if (goalInput.name.trim() === '') {
    return false;
  }

  // Validate targetAmount
  if (!isValidCurrencyAmount(goalInput.targetAmount)) {
    return false;
  }

  // Validate targetDate
  if (!isValidDate(goalInput.targetDate)) {
    return false;
  }

  // Ensure targetDate is in the future
  if (new Date(goalInput.targetDate) <= new Date()) {
    return false;
  }

  // Validate currentAmount
  if (!isValidCurrencyAmount(goalInput.currentAmount)) {
    return false;
  }

  // Ensure currentAmount is less than or equal to targetAmount
  if (goalInput.currentAmount > goalInput.targetAmount) {
    return false;
  }

  return true;
}

// Helper functions

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
  // Implement password strength requirements here
  return password.length >= 8;
}

function isValidDate(date: string): boolean {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
}

function isValidCurrencyAmount(amount: number): boolean {
  return !isNaN(amount) && amount >= 0;
}

// List of human tasks
/**
 * Human tasks:
 * 1. Implement the ApiTypes interface in the src/api/types/index.ts file
 * 2. Define the ApiConstants (ACCOUNT_TYPES, SUPPORTED_CURRENCIES, BUDGET_PERIODS) in the src/api/constants/index.ts file
 * 3. Add unit tests for each validation function to ensure accuracy and edge cases are handled
 * 4. Review and update validation functions as new features are added to the Mint Replica application
 */