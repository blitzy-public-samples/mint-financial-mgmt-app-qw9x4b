// Import the GoalType from the types file
// Note: The actual import path may need to be adjusted based on the project structure
import { GoalType } from '../types/goal.types';

/**
 * Represents a financial goal in the Mint Replica application
 */
export class GoalModel {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: GoalType;
  targetAmount: number;
  targetDate: Date;
  currentAmount: number;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Creates a new GoalModel instance
   * @param goalData The data to initialize the goal with
   */
  constructor(goalData: GoalType) {
    this.id = goalData.id;
    this.userId = goalData.userId;
    this.name = goalData.name;
    this.description = goalData.description;
    this.type = goalData.type;
    this.targetAmount = goalData.targetAmount;
    this.targetDate = goalData.targetDate;
    this.currentAmount = goalData.currentAmount || 0;
    this.createdAt = goalData.createdAt || new Date();
    this.updatedAt = goalData.updatedAt || new Date();
  }

  /**
   * Calculates the progress towards the goal as a percentage
   * @returns Progress percentage
   */
  calculateProgress(): number {
    const progress = (this.currentAmount / this.targetAmount) * 100;
    return Math.min(progress, 100); // Ensure progress doesn't exceed 100%
  }

  /**
   * Updates the current amount towards the goal
   * @param amount The amount to add to the current amount
   */
  updateProgress(amount: number): void {
    this.currentAmount += amount;
    this.updatedAt = new Date();
  }

  /**
   * Checks if the goal has been completed
   * @returns True if the goal is completed, false otherwise
   */
  isCompleted(): boolean {
    return this.currentAmount >= this.targetAmount;
  }

  /**
   * Calculates the number of days remaining until the target date
   * @returns Number of days remaining
   */
  daysRemaining(): number {
    const today = new Date();
    const timeDiff = this.targetDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Converts the GoalModel instance to a plain JavaScript object
   * @returns Plain JavaScript object representation of the goal
   */
  toJSON(): object {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      type: this.type,
      targetAmount: this.targetAmount,
      targetDate: this.targetDate,
      currentAmount: this.currentAmount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// List of human tasks
/**
 * Human Tasks:
 * 1. Implement the GoalType interface in the goal.types.ts file (Required)
 * 2. Add validation logic for goal properties (e.g., ensure targetAmount is positive) (Required)
 * 3. Implement error handling for invalid input in the constructor and methods (Required)
 * 4. Consider adding methods for goal forecasting or recommendations (Optional)
 */