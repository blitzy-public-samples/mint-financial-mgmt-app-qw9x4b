import { describe, expect, beforeAll, afterAll, it } from '@jest/globals';
import supertest from 'supertest';
import { BudgetService } from '../../services/budget.service';
import { BudgetController } from '../../controllers/budget.controller';
import { Budget } from '../../models/budget.model';
import { testDatabase } from '../utils/test-database';
import { testServer } from '../utils/test-server';

let budgetService: BudgetService;
let budgetController: BudgetController;
let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  // Initialize test database connection
  await testDatabase.connect();

  // Create test server
  const app = await testServer.create();

  // Initialize BudgetService with test database
  budgetService = new BudgetService(testDatabase.getConnection());

  // Initialize BudgetController with BudgetService
  budgetController = new BudgetController(budgetService);

  // Create supertest instance with test server
  request = supertest(app);
});

afterAll(async () => {
  // Close test database connection
  await testDatabase.close();

  // Close test server
  await testServer.close();
});

describe('Budget API integration tests', () => {
  it('POST /api/budgets - Create a new budget', async () => {
    const newBudget = {
      userId: 'test-user-id',
      category: 'Food',
      amount: 500,
      period: 'monthly',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const response = await request
      .post('/api/budgets')
      .send(newBudget)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.category).toBe(newBudget.category);
    expect(response.body.amount).toBe(newBudget.amount);

    // Verify budget is saved in the database
    const savedBudget = await budgetService.getBudgetById(response.body.id);
    expect(savedBudget).toBeDefined();
    expect(savedBudget?.category).toBe(newBudget.category);
  });

  it('GET /api/budgets - Retrieve all budgets for a user', async () => {
    // Create test budgets in the database
    const testUserId = 'test-user-id';
    const testBudgets = [
      { userId: testUserId, category: 'Food', amount: 500, period: 'monthly' },
      { userId: testUserId, category: 'Transportation', amount: 200, period: 'monthly' },
    ];

    for (const budget of testBudgets) {
      await budgetService.createBudget(budget);
    }

    const response = await request
      .get('/api/budgets')
      .query({ userId: testUserId })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(testBudgets.length);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('category');
    expect(response.body[0]).toHaveProperty('amount');
  });

  it('GET /api/budgets/:id - Retrieve a specific budget', async () => {
    // Create a test budget in the database
    const testBudget = await budgetService.createBudget({
      userId: 'test-user-id',
      category: 'Entertainment',
      amount: 100,
      period: 'monthly',
    });

    const response = await request
      .get(`/api/budgets/${testBudget.id}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', testBudget.id);
    expect(response.body).toHaveProperty('category', testBudget.category);
    expect(response.body).toHaveProperty('amount', testBudget.amount);
  });

  it('PUT /api/budgets/:id - Update an existing budget', async () => {
    // Create a test budget in the database
    const testBudget = await budgetService.createBudget({
      userId: 'test-user-id',
      category: 'Shopping',
      amount: 300,
      period: 'monthly',
    });

    const updatedBudgetData = {
      amount: 350,
      period: 'weekly',
    };

    const response = await request
      .put(`/api/budgets/${testBudget.id}`)
      .send(updatedBudgetData)
      .expect(200);

    expect(response.body).toHaveProperty('id', testBudget.id);
    expect(response.body).toHaveProperty('amount', updatedBudgetData.amount);
    expect(response.body).toHaveProperty('period', updatedBudgetData.period);

    // Verify budget is updated in the database
    const updatedBudget = await budgetService.getBudgetById(testBudget.id);
    expect(updatedBudget).toBeDefined();
    expect(updatedBudget?.amount).toBe(updatedBudgetData.amount);
    expect(updatedBudget?.period).toBe(updatedBudgetData.period);
  });

  it('DELETE /api/budgets/:id - Delete a budget', async () => {
    // Create a test budget in the database
    const testBudget = await budgetService.createBudget({
      userId: 'test-user-id',
      category: 'Utilities',
      amount: 150,
      period: 'monthly',
    });

    await request
      .delete(`/api/budgets/${testBudget.id}`)
      .expect(204);

    // Verify budget is removed from the database
    const deletedBudget = await budgetService.getBudgetById(testBudget.id);
    expect(deletedBudget).toBeNull();
  });

  it('GET /api/budgets/:id/progress - Retrieve budget progress', async () => {
    // Create a test budget in the database
    const testBudget = await budgetService.createBudget({
      userId: 'test-user-id',
      category: 'Groceries',
      amount: 400,
      period: 'monthly',
    });

    // Create test transactions associated with the budget
    const testTransactions = [
      { amount: 50, category: 'Groceries', date: new Date() },
      { amount: 75, category: 'Groceries', date: new Date() },
    ];

    // Assuming there's a method to add transactions
    await budgetService.addTransactionsToBudget(testBudget.id, testTransactions);

    const response = await request
      .get(`/api/budgets/${testBudget.id}/progress`)
      .expect(200);

    expect(response.body).toHaveProperty('budgetId', testBudget.id);
    expect(response.body).toHaveProperty('totalBudget', testBudget.amount);
    expect(response.body).toHaveProperty('spentAmount', 125);
    expect(response.body).toHaveProperty('remainingAmount', 275);
    expect(response.body).toHaveProperty('progressPercentage', 31.25);
  });
});

// Human tasks (commented):
/*
TODO: Implement authentication middleware for protected routes in the test environment
TODO: Add tests for error scenarios (e.g., invalid input, non-existent budgets)
TODO: Implement test data seeding and cleanup for consistent test environment
TODO (Optional): Add performance tests for budget-related operations
*/