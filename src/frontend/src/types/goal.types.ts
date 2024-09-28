/**
 * This file contains TypeScript type definitions related to financial goals
 * in the Mint Replica application. It defines the structure of goal objects
 * and related types used throughout the frontend.
 */

/**
 * Enum representing the status of a goal
 */
export enum GoalStatus {
  NotStarted = 'NotStarted',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Abandoned = 'Abandoned'
}

/**
 * Enum representing different categories of financial goals
 */
export enum GoalCategory {
  Savings = 'Savings',
  Debt = 'Debt',
  Investment = 'Investment',
  Purchase = 'Purchase',
  Education = 'Education',
  Travel = 'Travel',
  Emergency = 'Emergency',
  Retirement = 'Retirement',
  Other = 'Other'
}

/**
 * Interface representing a financial goal set by the user
 */
export interface Goal {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: GoalCategory;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  targetDate: Date;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface representing the progress of a goal
 */
export interface GoalProgress {
  goalId: string;
  percentage: number;
  amountSaved: number;
  remainingAmount: number;
  daysRemaining: number;
}

/**
 * Interface for the input type when creating a new goal
 */
export interface CreateGoalInput {
  name: string;
  description: string;
  category: GoalCategory;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  targetDate: Date;
}

/**
 * Interface for the input type when updating an existing goal
 */
export interface UpdateGoalInput {
  id: string;
  name?: string;
  description?: string;
  category?: GoalCategory;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: Date;
  status?: GoalStatus;
}