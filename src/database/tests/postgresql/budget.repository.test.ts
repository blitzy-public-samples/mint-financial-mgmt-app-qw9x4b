import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { BudgetRepository } from '../../repositories/postgresql/budget.repository';
import { BudgetModel } from '../../models/postgresql/budget.model';
import { Budget, BudgetPeriod } from '../../../shared/types/budget';
import { getConnection } from '../../utils/connection';

describe('BudgetRepository', () => {
  let sequelize: Sequelize;
  let budgetRepository: BudgetRepository;
  let mockBudget: Budget;

  beforeAll(async () => {
    // Initialize the database connection
    sequelize = await getConnection();

    // Create an instance of BudgetRepository
    budgetRepository = new BudgetRepository(sequelize);

    // Create a mock budget for testing
    mockBudget = {
      id: uuidv4(),
      userId: uuidv4(),
      categoryId: uuidv4(),
      amount: 1000,
      period: BudgetPeriod.MONTHLY,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    };
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  test('should create a new budget', async () => {
    const createdBudget = await budgetRepository.create(mockBudget);
    expect(createdBudget).toBeDefined();
    expect(createdBudget.id).toBe(mockBudget.id);
    expect(createdBudget.amount).toBe(mockBudget.amount);
  });

  test('should find a budget by id', async () => {
    const foundBudget = await budgetRepository.findById(mockBudget.id);
    expect(foundBudget).toBeDefined();
    expect(foundBudget?.id).toBe(mockBudget.id);
  });

  test('should update a budget', async () => {
    const updatedAmount = 1500;
    const updatedBudget = await budgetRepository.update(mockBudget.id, { amount: updatedAmount });
    expect(updatedBudget).toBeDefined();
    expect(updatedBudget?.amount).toBe(updatedAmount);
  });

  test('should delete a budget', async () => {
    await budgetRepository.delete(mockBudget.id);
    const deletedBudget = await budgetRepository.findById(mockBudget.id);
    expect(deletedBudget).toBeNull();
  });

  test('should find all budgets for a user', async () => {
    // Create a few more budgets for the user
    await budgetRepository.create({ ...mockBudget, id: uuidv4() });
    await budgetRepository.create({ ...mockBudget, id: uuidv4() });

    const userBudgets = await budgetRepository.findByUserId(mockBudget.userId);
    expect(userBudgets).toBeDefined();
    expect(userBudgets.length).toBeGreaterThanOrEqual(3);
  });

  test('should handle errors when creating an invalid budget', async () => {
    const invalidBudget = { ...mockBudget, amount: -100 };
    await expect(budgetRepository.create(invalidBudget)).rejects.toThrow();
  });
});