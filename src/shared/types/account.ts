/**
 * This file defines the types related to financial accounts in the Mint Replica application.
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
 * Type representing a summary of an account
 */
export type AccountSummary = {
  id: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
}

/**
 * Data Transfer Object for creating a new account
 */
export interface CreateAccountDTO {
  userId: string;
  institutionName: string;
  accountType: AccountType;
  accountName: string;
  balance: number;
  currency: string;
}

/**
 * Data Transfer Object for updating an existing account
 */
export interface UpdateAccountDTO {
  accountName?: string;
  balance?: number;
  lastSynced?: Date;
}

/**
 * Human tasks:
 * TODO: Review and validate the account types in the AccountType enum
 * TODO: Confirm if additional properties are needed for the Account interface
 * TODO: Verify if any additional account-related types are required for the application
 */