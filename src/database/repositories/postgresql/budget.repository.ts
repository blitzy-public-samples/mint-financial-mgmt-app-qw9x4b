import { Budget, BudgetPeriod } from '../../../shared/types/budget';
import { BudgetModel } from '../../models/postgresql/budget.model';
import { Repository } from '../../interfaces/repository.interface';
import { getConnection } from '../../utils/connection';
import { Transaction } from 'sequelize';

export class BudgetRepository implements Repository<Budget> {
  private model: typeof BudgetModel;

  constructor() {
    this.model = getConnection().models.Budget as typeof BudgetModel;
  }

  async create(budgetData: Budget): Promise<Budget> {
    // Validate the budgetData
    if (!this.isValidBudget(budgetData)) {
      throw new Error('Invalid budget data');
    }

    // Create a new budget entry in the database
    const createdBudget = await this.model.create(budgetData);

    return createdBudget.toJSON() as Budget;
  }

  async findById(id: string): Promise<Budget | null> {
    const budget = await this.model.findByPk(id);
    return budget ? budget.toJSON() as Budget : null;
  }

  async findAll(userId: string): Promise<Budget[]> {
    const budgets = await this.model.findAll({ where: { userId } });
    return budgets.map(budget => budget.toJSON() as Budget);
  }

  async update(id: string, budgetData: Partial<Budget>): Promise<Budget> {
    // Validate the budgetData
    if (!this.isValidPartialBudget(budgetData)) {
      throw new Error('Invalid budget data for update');
    }

    const [updatedRowsCount, updatedBudgets] = await this.model.update(budgetData, {
      where: { id },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      throw new Error('Budget not found');
    }

    return updatedBudgets[0].toJSON() as Budget;
  }

  async delete(id: string): Promise<boolean> {
    const deletedRowsCount = await this.model.destroy({ where: { id } });
    return deletedRowsCount > 0;
  }

  async findByPeriod(userId: string, period: BudgetPeriod, startDate: Date, endDate: Date): Promise<Budget[]> {
    const budgets = await this.model.findAll({
      where: {
        userId,
        period,
        startDate: {
          [Op.gte]: startDate,
        },
        endDate: {
          [Op.lte]: endDate,
        },
      },
    });

    return budgets.map(budget => budget.toJSON() as Budget);
  }

  async calculateBudgetProgress(budgetId: string): Promise<{ spent: number; remaining: number; progress: number }> {
    const budget = await this.findById(budgetId);

    if (!budget) {
      throw new Error('Budget not found');
    }

    // TODO: Implement logic to calculate spent amount based on associated transactions
    const spent = 0; // Placeholder value

    const remaining = budget.amount - spent;
    const progress = (spent / budget.amount) * 100;

    return { spent, remaining, progress };
  }

  private isValidBudget(budget: Budget): boolean {
    // TODO: Implement proper validation logic
    return !!budget.userId && !!budget.amount && !!budget.period;
  }

  private isValidPartialBudget(budget: Partial<Budget>): boolean {
    // TODO: Implement proper validation logic for partial updates
    return true;
  }
}

export const createBudgetRepository = (): BudgetRepository => {
  return new BudgetRepository();
};

// TODO: Implement proper error handling and logging for database operations
// TODO: Add input validation for all public methods
// TODO: Implement unit tests for all repository methods
// TODO: Optimize database queries for performance, especially for the calculateBudgetProgress method
// TODO: Implement a method to handle recurring budgets