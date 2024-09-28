/**
 * This file defines the types related to financial goals in the Mint Replica application.
 * It includes interfaces and types for goal creation, retrieval, and management.
 */

/**
 * Enum representing different types of financial goals
 */
export enum GoalType {
  SAVINGS = 'SAVINGS',
  DEBT_REPAYMENT = 'DEBT_REPAYMENT',
  INVESTMENT = 'INVESTMENT',
  MAJOR_PURCHASE = 'MAJOR_PURCHASE',
  EMERGENCY_FUND = 'EMERGENCY_FUND',
  RETIREMENT = 'RETIREMENT',
  EDUCATION = 'EDUCATION',
  OTHER = 'OTHER'
}

/**
 * Enum representing the status of a financial goal
 */
export enum GoalStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

/**
 * Interface representing a financial goal
 */
export interface Goal {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  targetDate: Date;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data Transfer Object for creating a new goal
 */
export interface CreateGoalDTO {
  name: string;
  description: string;
  type: GoalType;
  targetAmount: number;
  startDate: Date;
  targetDate: Date;
}

/**
 * Data Transfer Object for updating an existing goal
 */
export interface UpdateGoalDTO {
  name?: string;
  description?: string;
  type?: GoalType;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: Date;
  status?: GoalStatus;
}

/**
 * Interface representing the progress of a goal
 */
export interface GoalProgress {
  goalId: string;
  percentageCompleted: number;
  remainingAmount: number;
  estimatedCompletionDate: Date | null;
}

// Human tasks:
// TODO: Review and validate the defined types to ensure they cover all necessary aspects of goal management in the Mint Replica application
// TODO: Ensure that the GoalType enum covers all possible goal types that users might want to create
// TODO: Consider adding more specific goal-related types or interfaces if needed based on the application's requirements