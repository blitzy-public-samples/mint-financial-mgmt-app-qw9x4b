import request from 'supertest';
import { expect } from 'jest';
import { app } from '../../app';
import { BudgetService } from '../../services/budget.service';
import { authMiddleware } from '../../middleware/auth';

// Mock the auth middleware
jest.mock('../../middleware/auth', () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

describe('Budget API Integration Tests', () => {
  let testBudgetId: string;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('POST /api/budgets', () => {
    it('should create a new budget', async () => {
      const newBudget = {
        category: 'Food',
        amount: 500,
        period: 'monthly',
      };

      const response = await request(app)
        .post('/api/budgets')
        .send(newBudget)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.category).toBe(newBudget.category);
      expect(response.body.amount).toBe(newBudget.amount);
      expect(response.body.period).toBe(newBudget.period);

      testBudgetId = response.body.id;
    });

    it('should return 400 for invalid budget data', async () => {
      const invalidBudget = {
        category: 'Food',
        amount: -100, // Invalid negative amount
        period: 'invalid_period',
      };

      await request(app)
        .post('/api/budgets')
        .send(invalidBudget)
        .expect(400);
    });
  });

  describe('GET /api/budgets', () => {
    it('should retrieve all budgets', async () => {
      const response = await request(app)
        .get('/api/budgets')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/budgets/:id', () => {
    it('should retrieve a specific budget', async () => {
      const response = await request(app)
        .get(`/api/budgets/${testBudgetId}`)
        .expect(200);

      expect(response.body.id).toBe(testBudgetId);
    });

    it('should return 404 for non-existent budget', async () => {
      await request(app)
        .get('/api/budgets/non-existent-id')
        .expect(404);
    });
  });

  describe('PUT /api/budgets/:id', () => {
    it('should update an existing budget', async () => {
      const updatedBudget = {
        category: 'Food',
        amount: 600,
        period: 'monthly',
      };

      const response = await request(app)
        .put(`/api/budgets/${testBudgetId}`)
        .send(updatedBudget)
        .expect(200);

      expect(response.body.id).toBe(testBudgetId);
      expect(response.body.amount).toBe(updatedBudget.amount);
    });

    it('should return 404 for updating non-existent budget', async () => {
      await request(app)
        .put('/api/budgets/non-existent-id')
        .send({ amount: 100 })
        .expect(404);
    });
  });

  describe('DELETE /api/budgets/:id', () => {
    it('should delete an existing budget', async () => {
      await request(app)
        .delete(`/api/budgets/${testBudgetId}`)
        .expect(204);
    });

    it('should return 404 for deleting non-existent budget', async () => {
      await request(app)
        .delete('/api/budgets/non-existent-id')
        .expect(404);
    });
  });
});

async function setupTestDatabase(): Promise<void> {
  // Implementation for setting up test database
  // This would typically involve:
  // 1. Connecting to a test database
  // 2. Clearing existing data
  // 3. Creating a test user
  // 4. Generating and storing an authentication token for the test user
}

async function teardownTestDatabase(): Promise<void> {
  // Implementation for cleaning up the test database
  // This would typically involve:
  // 1. Removing all test data from the database
  // 2. Closing the database connection
}

// Human tasks:
// TODO: Implement mock BudgetService for isolated testing
// TODO: Add tests for budget report and summary endpoints
// TODO: Implement tests for pagination and filtering in getBudgets