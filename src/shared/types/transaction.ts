/**
 * This file defines the types related to financial transactions in the Mint Replica application.
 */

/**
 * Enum representing different categories of transactions
 */
export enum TransactionCategory {
  INCOME = 'INCOME',
  HOUSING = 'HOUSING',
  TRANSPORTATION = 'TRANSPORTATION',
  FOOD = 'FOOD',
  UTILITIES = 'UTILITIES',
  INSURANCE = 'INSURANCE',
  HEALTHCARE = 'HEALTHCARE',
  SAVINGS_INVESTMENTS = 'SAVINGS_INVESTMENTS',
  PERSONAL = 'PERSONAL',
  ENTERTAINMENT = 'ENTERTAINMENT',
  MISCELLANEOUS = 'MISCELLANEOUS'
}

/**
 * Enum representing different types of transactions
 */
export enum TransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  TRANSFER = 'TRANSFER'
}

/**
 * Interface representing a financial transaction
 */
export interface Transaction {
  id: string;
  accountId: string;
  date: Date;
  amount: number;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  isRecurring: boolean;
  isPending: boolean;
  merchantName: string | null;
  locationCity: string | null;
  locationState: string | null;
  notes: string | null;
  tags: string[];
}

/**
 * Interface representing filters that can be applied to transactions
 */
export interface TransactionFilter {
  startDate: Date | null;
  endDate: Date | null;
  minAmount: number | null;
  maxAmount: number | null;
  categories: TransactionCategory[];
  types: TransactionType[];
  searchTerm: string | null;
}

/**
 * Human tasks:
 * 1. Review and validate the transaction categories to ensure they cover all necessary types for the Mint Replica application
 * 2. Confirm if additional transaction-related types are needed based on specific feature requirements
 */