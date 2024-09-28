/**
 * This file serves as the main entry point for all shared enums in the Mint Replica application.
 * It exports all enum types from individual enum files to provide a centralized import location
 * for other parts of the application.
 */

// Import enums from their respective files
import { AccountTypes } from './account-types';
import { TransactionCategories } from './transaction-categories';
import { BudgetPeriods } from './budget-periods';

// Export all enums
export {
  AccountTypes,
  TransactionCategories,
  BudgetPeriods
};

// TODO: Implement the following enums in their respective files:
// - AccountTypes in src/shared/enums/account-types.ts
// - TransactionCategories in src/shared/enums/transaction-categories.ts
// - BudgetPeriods in src/shared/enums/budget-periods.ts

/**
 * AccountTypes: Enum for different types of financial accounts
 * @enum {string}
 */

/**
 * TransactionCategories: Enum for categorizing financial transactions
 * @enum {string}
 */

/**
 * BudgetPeriods: Enum for different budget period options
 * @enum {string}
 */