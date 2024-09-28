import request from 'supertest';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { app } from '../../app';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../models/goal.model';
import { authMiddleware } from '../../middleware/auth';

// Mock the authMiddleware
jest.mock('../../middleware/auth', () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

describe('Goal API Endpoints', () => {
  const testUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const testGoal = {
    id: 'test-goal-id',
    name: 'Test Goal',
    targetAmount: 1000,
    currentAmount: 0,
    deadline: '2023-12-31',
  };

  let authToken: string;

  beforeEach(() => {
    // Generate a valid JWT token for the test user
    authToken = jwt.sign(testUser, 'your-secret-key', { expiresIn: '1h' });

    // Clear the goal database or create a clean test database
    // This step depends on your actual database setup
    // For example, if using MongoDB:
    // await Goal.deleteMany({});

    // Mock the GoalService methods
    jest.spyOn(GoalService, 'createGoal').mockResolvedValue(testGoal);
    jest.spyOn(GoalService, 'getGoals').mockResolvedValue([testGoal]);
    jest.spyOn(GoalService, 'getGoalById').mockResolvedValue(testGoal);
    jest.spyOn(GoalService, 'updateGoal').mockResolvedValue(testGoal);
    jest.spyOn(GoalService, 'deleteGoal').mockResolvedValue(true);
  });

  afterEach(() => {
    // Clean up mocks
    jest.restoreAllMocks();
  });

  describe('POST /api/goals', () => {
    it('should create a new goal', async () => {
      const response = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Goal',
          targetAmount: 1000,
          deadline: '2023-12-31',
        });

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(testGoal);
    });
  });

  describe('GET /api/goals', () => {
    it('should retrieve all goals for a user', async () => {
      const response = await request(app)
        .get('/api/goals')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.deep.equal([testGoal]);
    });
  });

  describe('GET /api/goals/:id', () => {
    it('should retrieve a specific goal by ID', async () => {
      const response = await request(app)
        .get(`/api/goals/${testGoal.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(testGoal);
    });
  });

  describe('PUT /api/goals/:id', () => {
    it('should update an existing goal', async () => {
      const updatedGoal = { ...testGoal, name: 'Updated Test Goal' };
      const response = await request(app)
        .put(`/api/goals/${testGoal.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedGoal);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(updatedGoal);
    });
  });

  describe('DELETE /api/goals/:id', () => {
    it('should delete a goal', async () => {
      const response = await request(app)
        .delete(`/api/goals/${testGoal.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(204);
    });
  });

  describe('GET /api/goals/:id/progress', () => {
    it('should calculate goal progress', async () => {
      jest.spyOn(GoalService, 'calculateGoalProgress').mockResolvedValue(50);

      const response = await request(app)
        .get(`/api/goals/${testGoal.id}/progress`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ progress: 50 });
    });
  });
});

// Human tasks:
// TODO: Implement mock for GoalService to isolate API tests from database operations
// TODO: Add test cases for error scenarios (e.g., invalid input, unauthorized access)
// TODO: Implement test database setup and teardown scripts for integration tests
// TODO: Add test cases for pagination in goal retrieval endpoint