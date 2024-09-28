/**
 * This file defines the types related to budgets in the Mint Replica application.
 * It includes interfaces and types for budget creation, retrieval, and management.
 */

/**
 * Enum representing the possible budget periods
 */
export enum BudgetPeriod {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly'
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
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data Transfer Object for creating a new budget
 */
export interface CreateBudgetDTO {
  userId: string;
  categoryId: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
}

/**
 * Data Transfer Object for updating an existing budget
 */
export interface UpdateBudgetDTO {
  name?: string;
  amount?: number;
  period?: BudgetPeriod;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Interface representing a summary of a budget
 */
export interface BudgetSummary {
  id: string;
  name: string;
  amount: number;
  spent: number;
  remaining: number;
  period: BudgetPeriod;
}

// Human tasks:
// TODO: Review and validate the defined types to ensure they meet all requirements for budget management in the Mint Replica application
// TODO: Consider adding more specific types or interfaces if needed for advanced budget features or reporting