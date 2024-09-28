import { api } from './api';
import { apiEndpoints } from '../constants/apiEndpoints';
import { Goal } from '../types/goal.types';

/**
 * Goal service for handling all goal-related operations and API calls.
 */
export const goalService = {
  /**
   * Fetches all goals for the authenticated user
   * @returns Promise resolving to an array of Goal objects
   */
  async getGoals(): Promise<Goal[]> {
    try {
      const response = await api.get(apiEndpoints.goals);
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  /**
   * Fetches a specific goal by its ID
   * @param goalId - The ID of the goal to fetch
   * @returns Promise resolving to a Goal object
   */
  async getGoalById(goalId: string): Promise<Goal> {
    try {
      const response = await api.get(`${apiEndpoints.goals}/${goalId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching goal with ID ${goalId}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new goal for the authenticated user
   * @param goalData - The data for the new goal
   * @returns Promise resolving to the created Goal object
   */
  async createGoal(goalData: Goal): Promise<Goal> {
    try {
      const response = await api.post(apiEndpoints.goals, goalData);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  /**
   * Updates an existing goal
   * @param goalId - The ID of the goal to update
   * @param goalData - The updated data for the goal
   * @returns Promise resolving to the updated Goal object
   */
  async updateGoal(goalId: string, goalData: Partial<Goal>): Promise<Goal> {
    try {
      const response = await api.put(`${apiEndpoints.goals}/${goalId}`, goalData);
      return response.data;
    } catch (error) {
      console.error(`Error updating goal with ID ${goalId}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a goal
   * @param goalId - The ID of the goal to delete
   * @returns Promise resolving to void on successful deletion
   */
  async deleteGoal(goalId: string): Promise<void> {
    try {
      await api.delete(`${apiEndpoints.goals}/${goalId}`);
    } catch (error) {
      console.error(`Error deleting goal with ID ${goalId}:`, error);
      throw error;
    }
  },

  /**
   * Updates the progress of a specific goal
   * @param goalId - The ID of the goal to update progress
   * @param progress - The new progress value
   * @returns Promise resolving to the updated Goal object
   */
  async updateGoalProgress(goalId: string, progress: number): Promise<Goal> {
    try {
      const response = await api.put(`${apiEndpoints.goals}/${goalId}/progress`, { progress });
      return response.data;
    } catch (error) {
      console.error(`Error updating progress for goal with ID ${goalId}:`, error);
      throw error;
    }
  },
};

// Human tasks:
// TODO: Implement caching mechanism for frequently accessed goals (Optional)
// TODO: Add input validation for goal data before making API calls (Required)
// TODO: Implement error handling for API call failures (Required)