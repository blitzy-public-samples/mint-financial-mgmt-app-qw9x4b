import { v4 as uuidv4 } from 'uuid';
import { Budget } from '../models/budget.model';
import { validateBudgetData } from '../utils/validation';

export class BudgetService {
  private budgetModel: Budget;

  constructor(budgetModel: Budget) {
    this.budgetModel = budgetModel;
  }

  /**
   * Creates a new budget for a user
   * @param budgetData Object containing budget information
   * @returns Promise<object> Newly created budget object
   */
  async createBudget(budgetData: object): Promise<object> {
    try {
      // Validate the incoming budgetData
      const validatedData = validateBudgetData(budgetData);

      // Generate a new UUID for the budget
      const budgetId = uuidv4();

      // Create a new budget object with the validated data and generated UUID
      const newBudget = {
        id: budgetId,
        ...validatedData,
      };

      // Save the new budget object using the budgetModel
      const createdBudget = await this.budgetModel.create(newBudget);

      return createdBudget;
    } catch (error) {
      // Handle and log the error
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  /**
   * Retrieves a budget by its ID
   * @param budgetId String representing the budget ID
   * @returns Promise<object | null> Budget object if found, null otherwise
   */
  async getBudgetById(budgetId: string): Promise<object | null> {
    try {
      // Use the budgetModel to find a budget by the provided budgetId
      const budget = await this.budgetModel.findById(budgetId);
      return budget;
    } catch (error) {
      // Handle and log the error
      console.error('Error retrieving budget:', error);
      throw error;
    }
  }

  /**
   * Retrieves all budgets for a specific user
   * @param userId String representing the user ID
   * @returns Promise<object[]> Array of budget objects
   */
  async getUserBudgets(userId: string): Promise<object[]> {
    try {
      // Use the budgetModel to find all budgets associated with the provided userId
      const budgets = await this.budgetModel.findByUserId(userId);
      return budgets;
    } catch (error) {
      // Handle and log the error
      console.error('Error retrieving user budgets:', error);
      throw error;
    }
  }

  /**
   * Updates an existing budget
   * @param budgetId String representing the budget ID
   * @param updateData Object containing the data to update
   * @returns Promise<object | null> Updated budget object if found and updated, null otherwise
   */
  async updateBudget(budgetId: string, updateData: object): Promise<object | null> {
    try {
      // Validate the incoming updateData
      const validatedData = validateBudgetData(updateData);

      // Use the budgetModel to find and update the budget with the provided budgetId
      const updatedBudget = await this.budgetModel.findByIdAndUpdate(budgetId, validatedData, { new: true });

      return updatedBudget;
    } catch (error) {
      // Handle and log the error
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  /**
   * Deletes a budget by its ID
   * @param budgetId String representing the budget ID
   * @returns Promise<boolean> True if the budget was deleted, false otherwise
   */
  async deleteBudget(budgetId: string): Promise<boolean> {
    try {
      // Use the budgetModel to find and delete the budget with the provided budgetId
      const result = await this.budgetModel.findByIdAndDelete(budgetId);
      return result !== null;
    } catch (error) {
      // Handle and log the error
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  /**
   * Calculates the progress of a budget based on current spending
   * @param budgetId String representing the budget ID
   * @returns Promise<object> Object containing budget details and progress information
   */
  async calculateBudgetProgress(budgetId: string): Promise<object> {
    try {
      // Retrieve the budget using getBudgetById
      const budget = await this.getBudgetById(budgetId);

      if (!budget) {
        throw new Error('Budget not found');
      }

      // Calculate the total spent amount for the budget's category and time period
      // This is a placeholder and should be implemented based on your specific data model
      const totalSpent = await this.calculateTotalSpent(budget);

      // Calculate the percentage of the budget used
      const budgetAmount = (budget as any).amount;
      const percentageUsed = (totalSpent / budgetAmount) * 100;

      return {
        budget,
        totalSpent,
        percentageUsed,
      };
    } catch (error) {
      // Handle and log the error
      console.error('Error calculating budget progress:', error);
      throw error;
    }
  }

  // Helper method to calculate total spent (placeholder)
  private async calculateTotalSpent(budget: object): Promise<number> {
    // This method should be implemented based on your specific data model and requirements
    // For now, we'll return a random number as a placeholder
    return Math.random() * (budget as any).amount;
  }
}

// Human tasks:
// TODO: Implement proper error handling and logging throughout the service
// TODO: Add input sanitization to prevent potential security vulnerabilities
// TODO: Implement caching mechanism for frequently accessed budgets to improve performance