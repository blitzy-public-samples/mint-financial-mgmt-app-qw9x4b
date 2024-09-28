import { AccountType } from '../types/account.types';

/**
 * Enum representing different budget periods
 */
export enum BudgetPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

/**
 * Interface representing a budget
 */
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  currentSpending: number;
  associatedAccounts: AccountType[];
}

/**
 * Type representing a summary of a budget, used for displaying in lists or overviews
 */
export type BudgetSummary = {
  id: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  currentSpending: number;
};

/**
 * Type representing the data structure for creating or updating a budget
 */
export type BudgetFormData = {
  categoryId: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  associatedAccounts: AccountType[];
};

/**
 * Type representing the progress of a budget
 */
export type BudgetProgress = {
  budgetId: string;
  currentSpending: number;
  remainingAmount: number;
  percentageUsed: number;
};