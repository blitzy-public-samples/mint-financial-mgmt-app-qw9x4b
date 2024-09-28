import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Budget } from '../models/budget.model';
import { validateBudgetData } from '../utils/validation.util';
import { CreateBudgetDto, UpdateBudgetDto, BudgetProgress } from '../types/budget.types';
import { NotFoundError } from '../utils/errors';

export class BudgetService {
  private budgetRepository: Repository<Budget>;

  constructor(budgetRepository: Repository<Budget>) {
    this.budgetRepository = budgetRepository;
  }

  async createBudget(userId: string, budgetData: CreateBudgetDto): Promise<Budget> {
    // Validate the budgetData
    validateBudgetData(budgetData);

    // Generate a new UUID for the budget
    const budgetId = uuidv4();

    // Create a new Budget object with the provided data and generated ID
    const newBudget = this.budgetRepository.create({
      id: budgetId,
      userId,
      ...budgetData,
    });

    // Save the new budget to the database
    return await this.budgetRepository.save(newBudget);
  }

  async getBudget(budgetId: string, userId: string): Promise<Budget | null> {
    // Query the budgetRepository for a budget with the given budgetId and userId
    return await this.budgetRepository.findOne({ where: { id: budgetId, userId } });
  }

  async getUserBudgets(userId: string): Promise<Budget[]> {
    // Query the budgetRepository for all budgets associated with the given userId
    return await this.budgetRepository.find({ where: { userId } });
  }

  async updateBudget(budgetId: string, userId: string, updateData: UpdateBudgetDto): Promise<Budget> {
    // Validate the updateData
    validateBudgetData(updateData);

    // Query the budgetRepository for the existing budget with the given budgetId and userId
    const existingBudget = await this.budgetRepository.findOne({ where: { id: budgetId, userId } });

    if (!existingBudget) {
      throw new NotFoundError('Budget not found');
    }

    // Update the budget with the new data
    Object.assign(existingBudget, updateData);

    // Save the updated budget to the database
    return await this.budgetRepository.save(existingBudget);
  }

  async deleteBudget(budgetId: string, userId: string): Promise<void> {
    // Query the budgetRepository for the existing budget with the given budgetId and userId
    const existingBudget = await this.budgetRepository.findOne({ where: { id: budgetId, userId } });

    if (!existingBudget) {
      throw new NotFoundError('Budget not found');
    }

    // Delete the budget from the database
    await this.budgetRepository.remove(existingBudget);
  }

  async calculateBudgetProgress(budgetId: string, userId: string): Promise<BudgetProgress> {
    // Retrieve the budget using the getBudget method
    const budget = await this.getBudget(budgetId, userId);

    if (!budget) {
      throw new NotFoundError('Budget not found');
    }

    // TODO: Implement logic to query the transaction repository for transactions
    // associated with the budget's category and date range

    // For now, we'll use mock data
    const totalSpent = 500; // Mock value
    const budgetAmount = budget.amount;

    // Calculate the progress percentage
    const progressPercentage = (totalSpent / budgetAmount) * 100;

    return {
      budget,
      totalSpent,
      progressPercentage,
    };
  }
}

// Human tasks:
// TODO: Implement proper error handling and logging throughout the service
// TODO: Add input sanitization to prevent potential security vulnerabilities
// TODO: Implement caching mechanism for frequently accessed budgets to improve performance