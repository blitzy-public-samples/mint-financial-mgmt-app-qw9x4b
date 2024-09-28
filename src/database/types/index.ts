import { UserInterface } from '../../shared/interfaces/user.interface';
import { AccountInterface } from '../../shared/interfaces/account.interface';
import { TransactionInterface } from '../../shared/interfaces/transaction.interface';
import { BudgetInterface } from '../../shared/interfaces/budget.interface';
import { GoalInterface } from '../../shared/interfaces/goal.interface';

// User attributes
export interface UserAttributes {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  created_at: Date;
  updated_at: Date;
}

// Account attributes
export interface AccountAttributes {
  id: string;
  user_id: string;
  institution_name: string;
  account_type: string;
  account_name: string;
  balance: number;
  currency: string;
  last_synced: Date;
}

// Transaction attributes
export interface TransactionAttributes {
  id: string;
  account_id: string;
  category_id: string;
  transaction_date: Date;
  amount: number;
  description: string;
  is_pending: boolean;
}

// Budget attributes
export interface BudgetAttributes {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: string;
  start_date: Date;
  end_date: Date;
}

// Goal attributes
export interface GoalAttributes {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  target_date: Date;
  current_amount: number;
}

// Union type of all database model interfaces
export type DatabaseModels = UserInterface | AccountInterface | TransactionInterface | BudgetInterface | GoalInterface;

// Generic type for query parameters
export type QueryParams = Record<string, string | number | boolean | Date>;

// Type for specifying sort order in queries
export type SortOrder = 'ASC' | 'DESC';

// Type for pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
}

// TODO: Review and validate the type definitions against the actual database schema
// TODO: Ensure all necessary types for the database layer are included
// TODO: Add any missing type definitions for MongoDB models (e.g., UserPreference, FinancialInsight)