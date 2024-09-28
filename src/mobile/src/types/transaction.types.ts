import { TransactionType, Transaction, TransactionSummary, CreateTransactionDTO, UpdateTransactionDTO } from '../../../shared/types/transaction';
import { AccountType } from '../../../shared/types/account';

/**
 * Interface extending the shared Transaction type with mobile-specific properties
 */
export interface MobileTransaction extends Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  transactionType: TransactionType;
  amount: number;
  description: string;
  date: Date;
  isPending: boolean;
  icon: string;
  color: string;
  location: string | null;
  tags: string[];
}

/**
 * Type extending the shared TransactionSummary type with mobile-specific properties
 */
export type MobileTransactionSummary = TransactionSummary & {
  id: string;
  amount: number;
  description: string;
  date: Date;
  categoryName: string;
  icon: string;
  color: string;
};

/**
 * Data Transfer Object for creating a new transaction in the mobile app
 */
export interface MobileCreateTransactionDTO extends CreateTransactionDTO {
  userId: string;
  accountId: string;
  categoryId: string;
  transactionType: TransactionType;
  amount: number;
  description: string;
  date: Date;
  isPending: boolean;
  location: string | null;
  tags: string[];
}

/**
 * Data Transfer Object for updating an existing transaction in the mobile app
 */
export interface MobileUpdateTransactionDTO extends UpdateTransactionDTO {
  categoryId?: string;
  amount?: number;
  description?: string;
  date?: Date;
  isPending?: boolean;
  location?: string | null;
  tags?: string[];
}

/**
 * Type representing a transaction item in a list view for the mobile app
 */
export type TransactionListItem = {
  id: string;
  amount: number;
  description: string;
  date: Date;
  categoryName: string;
  icon: string;
  color: string;
  accountName: string;
  accountType: AccountType;
};

// Human tasks:
// TODO: Review and validate the mobile-specific properties added to transaction types
// TODO: Verify that the mobile transaction types align with the mobile app's UI/UX design
// TODO: Ensure that the transaction types are compatible with the mobile app's offline functionality requirements