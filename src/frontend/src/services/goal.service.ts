import { get, post, put, delete as httpDelete } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  // Add other relevant properties
}

export interface GoalCreationData {
  name: string;
  targetAmount: number;
  deadline: Date;
  // Add other relevant properties
}

export interface GoalUpdateData {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: Date;
  // Add other relevant properties
}

export interface GoalProgress {
  currentAmount: number;
  percentage: number;
  // Add other relevant properties
}

export class GoalService {
  /**
   * Fetches all goals for the authenticated user
   * @returns {Promise<Goal[]>} Array of Goal objects
   */
  static async getAllGoals(): Promise<Goal[]> {
    try {
      const response = await get(API_ENDPOINTS.GOALS);
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  /**
   * Fetches a specific goal by its ID
   * @param {string} goalId - The ID of the goal to fetch
   * @returns {Promise<Goal>} Goal object
   */
  static async getGoalById(goalId: string): Promise<Goal> {
    try {
      const response = await get(`${API_ENDPOINTS.GOALS}/${goalId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching goal with ID ${goalId}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new goal
   * @param {GoalCreationData} goalData - The data for creating a new goal
   * @returns {Promise<Goal>} Created Goal object
   */
  static async createGoal(goalData: GoalCreationData): Promise<Goal> {
    try {
      const response = await post(API_ENDPOINTS.GOALS, goalData);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  /**
   * Updates an existing goal
   * @param {string} goalId - The ID of the goal to update
   * @param {GoalUpdateData} goalData - The data for updating the goal
   * @returns {Promise<Goal>} Updated Goal object
   */
  static async updateGoal(goalId: string, goalData: GoalUpdateData): Promise<Goal> {
    try {
      const response = await put(`${API_ENDPOINTS.GOALS}/${goalId}`, goalData);
      return response.data;
    } catch (error) {
      console.error(`Error updating goal with ID ${goalId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a goal
   * @param {string} goalId - The ID of the goal to delete
   * @returns {Promise<void>} Void promise indicating successful deletion
   */
  static async deleteGoal(goalId: string): Promise<void> {
    try {
      await httpDelete(`${API_ENDPOINTS.GOALS}/${goalId}`);
    } catch (error) {
      console.error(`Error deleting goal with ID ${goalId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches the progress of a specific goal
   * @param {string} goalId - The ID of the goal to fetch progress for
   * @returns {Promise<GoalProgress>} Goal progress object
   */
  static async getGoalProgress(goalId: string): Promise<GoalProgress> {
    try {
      const response = await get(`${API_ENDPOINTS.GOALS}/${goalId}/progress`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for goal with ID ${goalId}:`, error);
      throw error;
    }
  }
}

// Human tasks:
// TODO: Implement error handling for API calls
// TODO: Add input validation for goal creation and update methods
// TODO: Implement caching mechanism for frequently accessed goals