import { get, post, put, delete as httpDelete } from './api';
import { Budget, CreateBudgetDTO, UpdateBudgetDTO } from '../types/budget.types';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * BudgetService provides methods for interacting with the budget-related endpoints of the backend API.
 * It handles CRUD operations for budgets and other budget-related functionalities.
 */
export class BudgetService {
  /**
   * Fetches all budgets for the current user
   * @returns {Promise<Budget[]>} Array of user's budgets
   */
  static async getAllBudgets(): Promise<Budget[]> {
    try {
      const response = await get(API_ENDPOINTS.BUDGETS);
      return response.data;
    } catch (error) {
      console.error('Error fetching all budgets:', error);
      throw error;
    }
  }

  /**
   * Fetches a specific budget by its ID
   * @param {string} budgetId - The ID of the budget to fetch
   * @returns {Promise<Budget>} Budget details
   */
  static async getBudgetById(budgetId: string): Promise<Budget> {
    try {
      const response = await get(`${API_ENDPOINTS.BUDGETS}/${budgetId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching budget with ID ${budgetId}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new budget
   * @param {CreateBudgetDTO} budgetData - The data for creating a new budget
   * @returns {Promise<Budget>} Created budget
   */
  static async createBudget(budgetData: CreateBudgetDTO): Promise<Budget> {
    try {
      const response = await post(API_ENDPOINTS.BUDGETS, budgetData);
      return response.data;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  /**
   * Updates an existing budget
   * @param {string} budgetId - The ID of the budget to update
   * @param {UpdateBudgetDTO} budgetData - The updated budget data
   * @returns {Promise<Budget>} Updated budget
   */
  static async updateBudget(budgetId: string, budgetData: UpdateBudgetDTO): Promise<Budget> {
    try {
      const response = await put(`${API_ENDPOINTS.BUDGETS}/${budgetId}`, budgetData);
      return response.data;
    } catch (error) {
      console.error(`Error updating budget with ID ${budgetId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a budget
   * @param {string} budgetId - The ID of the budget to delete
   * @returns {Promise<void>}
   */
  static async deleteBudget(budgetId: string): Promise<void> {
    try {
      await httpDelete(`${API_ENDPOINTS.BUDGETS}/${budgetId}`);
    } catch (error) {
      console.error(`Error deleting budget with ID ${budgetId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches the progress of a specific budget
   * @param {string} budgetId - The ID of the budget to fetch progress for
   * @returns {Promise<{ current: number, target: number, percentage: number }>} Budget progress
   */
  static async getBudgetProgress(budgetId: string): Promise<{ current: number; target: number; percentage: number }> {
    try {
      const response = await get(`${API_ENDPOINTS.BUDGETS}/${budgetId}/progress`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for budget with ID ${budgetId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches analytics data for all budgets
   * @param {object} filters - Optional filters for the analytics data
   * @returns {Promise<any>} Budget analytics data
   */
  static async getBudgetAnalytics(filters?: object): Promise<any> {
    try {
      const response = await get(`${API_ENDPOINTS.BUDGETS}/analytics`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching budget analytics:', error);
      throw error;
    }
  }
}

// Human tasks:
// TODO: Implement error handling for API calls
// TODO: Add input validation for function parameters
// TODO: Implement caching mechanism for frequently accessed data