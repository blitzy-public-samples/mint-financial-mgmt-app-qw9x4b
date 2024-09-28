import { v4 as uuidv4 } from 'uuid';
import { GoalModel } from '../models/goal.model';
import { ResponseInterface } from '../interfaces/response.interface';
import { validateGoalData } from '../utils/validation.util';

export class GoalService {
  private goalModel: GoalModel;

  constructor(goalModel: GoalModel) {
    this.goalModel = goalModel;
  }

  async createGoal(goalData: any): Promise<ResponseInterface> {
    try {
      // Validate the input goalData
      const validatedData = validateGoalData(goalData);

      // Generate a new UUID for the goal
      const goalId = uuidv4();

      // Create a new goal object with the validated data and generated UUID
      const newGoal = {
        id: goalId,
        ...validatedData,
      };

      // Save the new goal using the goalModel
      const createdGoal = await this.goalModel.create(newGoal);

      // Return a success response with the created goal
      return {
        success: true,
        data: createdGoal,
        message: 'Goal created successfully',
      };
    } catch (error) {
      // Return an error response
      return {
        success: false,
        error: error.message,
        message: 'Failed to create goal',
      };
    }
  }

  async getGoal(goalId: string, userId: string): Promise<ResponseInterface> {
    try {
      // Validate the goalId and userId
      if (!goalId || !userId) {
        throw new Error('Invalid goalId or userId');
      }

      // Retrieve the goal from the goalModel using the goalId and userId
      const goal = await this.goalModel.findOne({ id: goalId, userId });

      // If the goal is not found, return an error response
      if (!goal) {
        return {
          success: false,
          error: 'Goal not found',
          message: 'The requested goal does not exist',
        };
      }

      // Return a success response with the goal data
      return {
        success: true,
        data: goal,
        message: 'Goal retrieved successfully',
      };
    } catch (error) {
      // Return an error response
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve goal',
      };
    }
  }

  async updateGoal(goalId: string, userId: string, updatedGoalData: any): Promise<ResponseInterface> {
    try {
      // Validate the goalId, userId, and updatedGoalData
      if (!goalId || !userId) {
        throw new Error('Invalid goalId or userId');
      }

      // Retrieve the existing goal from the goalModel
      const existingGoal = await this.goalModel.findOne({ id: goalId, userId });

      // If the goal is not found, return an error response
      if (!existingGoal) {
        return {
          success: false,
          error: 'Goal not found',
          message: 'The goal to be updated does not exist',
        };
      }

      // Merge the existing goal data with the updatedGoalData
      const mergedGoalData = { ...existingGoal, ...updatedGoalData };

      // Validate the merged data
      const validatedData = validateGoalData(mergedGoalData);

      // Update the goal using the goalModel
      const updatedGoal = await this.goalModel.update(goalId, validatedData);

      // Return a success response with the updated goal
      return {
        success: true,
        data: updatedGoal,
        message: 'Goal updated successfully',
      };
    } catch (error) {
      // Return an error response
      return {
        success: false,
        error: error.message,
        message: 'Failed to update goal',
      };
    }
  }

  async deleteGoal(goalId: string, userId: string): Promise<ResponseInterface> {
    try {
      // Validate the goalId and userId
      if (!goalId || !userId) {
        throw new Error('Invalid goalId or userId');
      }

      // Attempt to delete the goal using the goalModel
      const deletedGoal = await this.goalModel.delete(goalId, userId);

      // If the goal is not found or deletion fails, return an error response
      if (!deletedGoal) {
        return {
          success: false,
          error: 'Goal not found or deletion failed',
          message: 'Failed to delete the goal',
        };
      }

      // Return a success response
      return {
        success: true,
        message: 'Goal deleted successfully',
      };
    } catch (error) {
      // Return an error response
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete goal',
      };
    }
  }

  async getAllGoals(userId: string): Promise<ResponseInterface> {
    try {
      // Validate the userId
      if (!userId) {
        throw new Error('Invalid userId');
      }

      // Retrieve all goals for the user from the goalModel
      const goals = await this.goalModel.findAll({ userId });

      // Return a success response with the array of goals
      return {
        success: true,
        data: goals,
        message: 'Goals retrieved successfully',
      };
    } catch (error) {
      // Return an error response
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve goals',
      };
    }
  }

  async updateGoalProgress(goalId: string, userId: string, currentAmount: number): Promise<ResponseInterface> {
    try {
      // Validate the goalId, userId, and currentAmount
      if (!goalId || !userId || typeof currentAmount !== 'number') {
        throw new Error('Invalid goalId, userId, or currentAmount');
      }

      // Retrieve the existing goal from the goalModel
      const existingGoal = await this.goalModel.findOne({ id: goalId, userId });

      // If the goal is not found, return an error response
      if (!existingGoal) {
        return {
          success: false,
          error: 'Goal not found',
          message: 'The goal to be updated does not exist',
        };
      }

      // Update the goal's current amount and calculate the progress percentage
      const updatedGoal = {
        ...existingGoal,
        currentAmount,
        progressPercentage: (currentAmount / existingGoal.targetAmount) * 100,
      };

      // Save the updated goal using the goalModel
      const savedGoal = await this.goalModel.update(goalId, updatedGoal);

      // Return a success response with the updated goal progress
      return {
        success: true,
        data: savedGoal,
        message: 'Goal progress updated successfully',
      };
    } catch (error) {
      // Return an error response
      return {
        success: false,
        error: error.message,
        message: 'Failed to update goal progress',
      };
    }
  }
}

// Human tasks:
// TODO: Implement proper error handling and logging mechanisms
// TODO: Add input sanitization to prevent potential security vulnerabilities
// TODO: Implement rate limiting to prevent abuse of the goal service
// TODO: Add unit tests for all methods in the GoalService class
// TODO: Implement caching mechanism for frequently accessed goals to improve performance