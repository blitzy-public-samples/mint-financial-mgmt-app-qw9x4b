import { v4 as uuidv4 } from 'uuid';
import { Goal } from '../models/goal.model';
import { GoalRepository } from '../../database/repositories/postgresql/goal.repository';
import { logger } from '../utils/logger';
import { ValidationError } from '../utils/errors';

export class GoalService {
  private goalRepository: GoalRepository;

  constructor(goalRepository: GoalRepository) {
    this.goalRepository = goalRepository;
  }

  async createGoal(userId: string, goalData: Partial<Goal>): Promise<Goal> {
    try {
      // Validate the input data
      this.validateGoalData(goalData);

      // Generate a new UUID for the goal
      const goalId = uuidv4();

      // Create a new Goal object with the provided data
      const newGoal: Goal = {
        id: goalId,
        userId,
        ...goalData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save the goal using the goalRepository
      const createdGoal = await this.goalRepository.create(newGoal);

      // Log the creation of the new goal
      logger.info(`New goal created: ${createdGoal.id} for user: ${userId}`);

      return createdGoal;
    } catch (error) {
      logger.error(`Error creating goal for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async getGoalById(goalId: string): Promise<Goal | null> {
    try {
      // Validate the goalId
      if (!goalId) {
        throw new ValidationError('Goal ID is required');
      }

      // Retrieve the goal from the goalRepository
      const goal = await this.goalRepository.findById(goalId);

      // If the goal is not found, log a warning
      if (!goal) {
        logger.warn(`Goal not found: ${goalId}`);
      }

      return goal;
    } catch (error) {
      logger.error(`Error retrieving goal ${goalId}: ${error.message}`);
      throw error;
    }
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    try {
      // Validate the userId
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      // Retrieve all goals for the user from the goalRepository
      const goals = await this.goalRepository.findByUserId(userId);

      // Log the number of goals retrieved
      logger.info(`Retrieved ${goals.length} goals for user: ${userId}`);

      return goals;
    } catch (error) {
      logger.error(`Error retrieving goals for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async updateGoal(goalId: string, updateData: Partial<Goal>): Promise<Goal> {
    try {
      // Validate the goalId and updateData
      if (!goalId) {
        throw new ValidationError('Goal ID is required');
      }
      this.validateGoalData(updateData);

      // Retrieve the existing goal from the goalRepository
      const existingGoal = await this.goalRepository.findById(goalId);

      // If the goal is not found, throw a ValidationError
      if (!existingGoal) {
        throw new ValidationError(`Goal not found: ${goalId}`);
      }

      // Update the goal properties with the provided updateData
      const updatedGoal: Goal = {
        ...existingGoal,
        ...updateData,
        updatedAt: new Date(),
      };

      // Save the updated goal using the goalRepository
      const savedGoal = await this.goalRepository.update(updatedGoal);

      // Log the goal update
      logger.info(`Goal updated: ${savedGoal.id}`);

      return savedGoal;
    } catch (error) {
      logger.error(`Error updating goal ${goalId}: ${error.message}`);
      throw error;
    }
  }

  async deleteGoal(goalId: string): Promise<void> {
    try {
      // Validate the goalId
      if (!goalId) {
        throw new ValidationError('Goal ID is required');
      }

      // Delete the goal using the goalRepository
      const deleted = await this.goalRepository.delete(goalId);

      // If the goal is not found, throw a ValidationError
      if (!deleted) {
        throw new ValidationError(`Goal not found: ${goalId}`);
      }

      // Log the deletion of the goal
      logger.info(`Goal deleted: ${goalId}`);
    } catch (error) {
      logger.error(`Error deleting goal ${goalId}: ${error.message}`);
      throw error;
    }
  }

  async calculateGoalProgress(goalId: string): Promise<number> {
    try {
      // Retrieve the goal using getGoalById
      const goal = await this.getGoalById(goalId);

      // If the goal is not found, throw a ValidationError
      if (!goal) {
        throw new ValidationError(`Goal not found: ${goalId}`);
      }

      // Calculate the progress percentage based on current amount and target amount
      const progress = (goal.currentAmount / goal.targetAmount) * 100;

      return Math.min(Math.max(progress, 0), 100); // Ensure progress is between 0 and 100
    } catch (error) {
      logger.error(`Error calculating progress for goal ${goalId}: ${error.message}`);
      throw error;
    }
  }

  private validateGoalData(goalData: Partial<Goal>): void {
    if (!goalData.name) {
      throw new ValidationError('Goal name is required');
    }
    if (!goalData.targetAmount || goalData.targetAmount <= 0) {
      throw new ValidationError('Target amount must be a positive number');
    }
    if (goalData.currentAmount && goalData.currentAmount < 0) {
      throw new ValidationError('Current amount cannot be negative');
    }
    if (goalData.targetDate && new Date(goalData.targetDate) < new Date()) {
      throw new ValidationError('Target date must be in the future');
    }
  }
}

// Human tasks:
// 1. Implement proper error handling and logging throughout the service
// 2. Add input validation for all methods to ensure data integrity
// 3. Implement unit tests for all methods in the GoalService class
// 4. Add documentation comments for each method to improve code readability