// Import shared account types
// Note: The import path might need to be adjusted based on the actual location of the shared types
import { AccountType } from '../../../shared/types/account';

/**
 * Interface extending the shared Account type with mobile-specific properties
 */
export interface MobileAccount {
  id: string;
  userId: string;
  institutionName: string;
  accountType: AccountType;
  accountName: string;
  balance: number;
  currency: string;
  lastSynced: Date;
  icon: string;
  color: string;
  isVisible: boolean;
}

/**
 * Type extending the shared AccountSummary type with mobile-specific properties
 */
export type MobileAccountSummary = {
  id: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
  icon: string;
  color: string;
};

/**
 * Data Transfer Object for creating a new account in the mobile app
 */
export interface MobileCreateAccountDTO {
  userId: string;
  institutionName: string;
  accountType: AccountType;
  accountName: string;
  balance: number;
  currency: string;
  icon: string;
  color: string;
}

/**
 * Data Transfer Object for updating an existing account in the mobile app
 */
export interface MobileUpdateAccountDTO {
  accountName?: string;
  balance?: number;
  lastSynced?: Date;
  icon?: string;
  color?: string;
  isVisible?: boolean;
}

/**
 * Type representing an account item in a list view for the mobile app
 */
export type AccountListItem = {
  id: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
  icon: string;
  color: string;
  isVisible: boolean;
};

// TODO: Review and validate the mobile-specific properties added to account types
// TODO: Confirm if any additional mobile-specific account types are needed
// TODO: Verify that the mobile account types align with the mobile app's UI/UX design