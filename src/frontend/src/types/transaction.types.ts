import { AccountType } from './account.types';

/**
 * Enum representing different types of financial transactions
 */
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER'
}

/**
 * Enum representing different categories of transactions
 */
export enum TransactionCategory {
  FOOD_AND_DINING = 'FOOD_AND_DINING',
  SHOPPING = 'SHOPPING',
  HOUSING = 'HOUSING',
  TRANSPORTATION = 'TRANSPORTATION',
  UTILITIES = 'UTILITIES',
  HEALTHCARE = 'HEALTHCARE',
  ENTERTAINMENT = 'ENTERTAINMENT',
  PERSONAL = 'PERSONAL',
  EDUCATION = 'EDUCATION',
  INVESTMENTS = 'INVESTMENTS',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
  OTHER = 'OTHER'
}

/**
 * Interface representing a financial transaction
 */
export interface Transaction {
  id: string;
  accountId: string;
  accountType: AccountType;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  isPending: boolean;
  tags?: string[];
}

/**
 * Type representing a summary of a transaction, used for displaying in lists or overviews
 */
export type TransactionSummary = {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  date: Date;
  description: string;
}

/**
 * Type representing the data structure for creating or updating a transaction
 */
export type TransactionFormData = {
  accountId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  tags?: string[];
}