/**
 * This file contains TypeScript type definitions related to financial accounts
 * in the Mint Replica application. It defines the structure of account objects
 * and related types used throughout the frontend.
 */

/**
 * Enum representing different types of financial accounts
 */
export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
  LOAN = 'LOAN',
  MORTGAGE = 'MORTGAGE'
}

/**
 * Interface representing a financial account
 */
export interface Account {
  id: string;
  userId: string;
  institutionName: string;
  accountType: AccountType;
  accountName: string;
  balance: number;
  currency: string;
  lastSynced: Date;
}

/**
 * Type representing a summary of an account, used for displaying in lists or overviews
 */
export type AccountSummary = {
  id: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
  currency: string;
}

/**
 * Type representing the data structure for creating or updating an account
 */
export type AccountFormData = {
  institutionName: string;
  accountType: AccountType;
  accountName: string;
  balance: number;
  currency: string;
}