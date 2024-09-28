import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import supertest from 'supertest';
import { GoalService } from '../../services/goal.service';
import { GoalController } from '../../controllers/goal.controller';
import { GoalModel } from '../../models/goal.model';
import app from '../../app';

const request = supertest(app);

describe('Goal API Endpoints', () => {
  let testGoalId: string;

  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase();
  });

  afterAll(async () => {
    // Teardown test database
    await teardownTestDatabase();
  });

  it('POST /api/goals - should create a new goal', async () => {
    const newGoal = {
      name: 'Test Goal',
      targetAmount: 1000,
      targetDate: '2023-12-31',
      currentAmount: 0
    };

    const response = await request
      .post('/api/goals')
      .send(newGoal)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newGoal.name);
    expect(response.body.targetAmount).toBe(newGoal.targetAmount);
    expect(response.body.targetDate).toBe(newGoal.targetDate);
    expect(response.body.currentAmount).toBe(newGoal.currentAmount);

    testGoalId = response.body.id;

    // Verify the goal is saved in the database
    const savedGoal = await GoalModel.findById(testGoalId);
    expect(savedGoal).toBeTruthy();
    expect(savedGoal?.name).toBe(newGoal.name);
  });

  it('GET /api/goals - should retrieve all goals for a user', async () => {
    const response = await request
      .get('/api/goals')
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('targetAmount');
    expect(response.body[0]).toHaveProperty('targetDate');
    expect(response.body[0]).toHaveProperty('currentAmount');
  });

  it('GET /api/goals/:id - should retrieve a specific goal', async () => {
    const response = await request
      .get(`/api/goals/${testGoalId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', testGoalId);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('targetAmount');
    expect(response.body).toHaveProperty('targetDate');
    expect(response.body).toHaveProperty('currentAmount');

    // Verify the goal details match the database record
    const dbGoal = await GoalModel.findById(testGoalId);
    expect(response.body).toMatchObject({
      id: dbGoal?.id,
      name: dbGoal?.name,
      targetAmount: dbGoal?.targetAmount,
      targetDate: dbGoal?.targetDate.toISOString().split('T')[0],
      currentAmount: dbGoal?.currentAmount
    });
  });

  it('PUT /api/goals/:id - should update an existing goal', async () => {
    const updatedGoal = {
      name: 'Updated Test Goal',
      targetAmount: 1500,
      targetDate: '2024-06-30',
      currentAmount: 100
    };

    const response = await request
      .put(`/api/goals/${testGoalId}`)
      .send(updatedGoal)
      .expect(200);

    expect(response.body).toHaveProperty('id', testGoalId);
    expect(response.body.name).toBe(updatedGoal.name);
    expect(response.body.targetAmount).toBe(updatedGoal.targetAmount);
    expect(response.body.targetDate).toBe(updatedGoal.targetDate);
    expect(response.body.currentAmount).toBe(updatedGoal.currentAmount);

    // Verify the goal is updated in the database
    const updatedDbGoal = await GoalModel.findById(testGoalId);
    expect(updatedDbGoal?.name).toBe(updatedGoal.name);
    expect(updatedDbGoal?.targetAmount).toBe(updatedGoal.targetAmount);
  });

  it('PUT /api/goals/:id/progress - should update goal progress', async () => {
    const progressUpdate = {
      currentAmount: 200
    };

    const response = await request
      .put(`/api/goals/${testGoalId}/progress`)
      .send(progressUpdate)
      .expect(200);

    expect(response.body).toHaveProperty('id', testGoalId);
    expect(response.body.currentAmount).toBe(progressUpdate.currentAmount);

    // Verify the goal progress is updated in the database
    const updatedDbGoal = await GoalModel.findById(testGoalId);
    expect(updatedDbGoal?.currentAmount).toBe(progressUpdate.currentAmount);
  });

  it('DELETE /api/goals/:id - should delete a goal', async () => {
    await request
      .delete(`/api/goals/${testGoalId}`)
      .expect(204);

    // Verify the goal is removed from the database
    const deletedGoal = await GoalModel.findById(testGoalId);
    expect(deletedGoal).toBeNull();
  });
});

describe('Goal Service Integration', () => {
  let goalService: GoalService;
  let testGoalId: string;

  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase();
    goalService = new GoalService();
  });

  afterAll(async () => {
    // Teardown test database
    await teardownTestDatabase();
  });

  it('createGoal should interact correctly with the database', async () => {
    const newGoal = {
      name: 'Service Test Goal',
      targetAmount: 2000,
      targetDate: '2023-12-31',
      currentAmount: 0
    };

    const createdGoal = await goalService.createGoal(newGoal);
    expect(createdGoal).toHaveProperty('id');
    expect(createdGoal.name).toBe(newGoal.name);
    expect(createdGoal.targetAmount).toBe(newGoal.targetAmount);

    testGoalId = createdGoal.id;

    // Verify the goal is saved in the database with correct attributes
    const savedGoal = await GoalModel.findById(testGoalId);
    expect(savedGoal).toBeTruthy();
    expect(savedGoal?.name).toBe(newGoal.name);
    expect(savedGoal?.targetAmount).toBe(newGoal.targetAmount);
  });

  it('getGoal should retrieve the correct goal from the database', async () => {
    const retrievedGoal = await goalService.getGoal(testGoalId);
    expect(retrievedGoal).toBeTruthy();
    expect(retrievedGoal?.id).toBe(testGoalId);

    // Verify the retrieved goal matches the database record
    const dbGoal = await GoalModel.findById(testGoalId);
    expect(retrievedGoal).toMatchObject({
      id: dbGoal?.id,
      name: dbGoal?.name,
      targetAmount: dbGoal?.targetAmount,
      targetDate: dbGoal?.targetDate,
      currentAmount: dbGoal?.currentAmount
    });
  });

  it('updateGoal should modify the goal in the database', async () => {
    const updateData = {
      name: 'Updated Service Test Goal',
      targetAmount: 2500
    };

    const updatedGoal = await goalService.updateGoal(testGoalId, updateData);
    expect(updatedGoal).toBeTruthy();
    expect(updatedGoal.name).toBe(updateData.name);
    expect(updatedGoal.targetAmount).toBe(updateData.targetAmount);

    // Verify the goal is updated in the database with the new attributes
    const dbGoal = await GoalModel.findById(testGoalId);
    expect(dbGoal?.name).toBe(updateData.name);
    expect(dbGoal?.targetAmount).toBe(updateData.targetAmount);
  });

  it('deleteGoal should remove the goal from the database', async () => {
    await goalService.deleteGoal(testGoalId);

    // Verify the goal is no longer present in the database
    const deletedGoal = await GoalModel.findById(testGoalId);
    expect(deletedGoal).toBeNull();
  });

  it('getAllGoals should retrieve all goals for a user from the database', async () => {
    // Create a few goals for testing
    const goals = [
      { name: 'Goal 1', targetAmount: 1000, targetDate: '2023-12-31', currentAmount: 0 },
      { name: 'Goal 2', targetAmount: 2000, targetDate: '2024-06-30', currentAmount: 500 },
      { name: 'Goal 3', targetAmount: 3000, targetDate: '2024-12-31', currentAmount: 1000 }
    ];

    for (const goal of goals) {
      await goalService.createGoal(goal);
    }

    const retrievedGoals = await goalService.getAllGoals();
    expect(Array.isArray(retrievedGoals)).toBeTruthy();
    expect(retrievedGoals.length).toBeGreaterThanOrEqual(goals.length);

    // Verify the retrieved goals match the user's goals in the database
    const dbGoals = await GoalModel.find();
    expect(retrievedGoals.length).toBe(dbGoals.length);
    retrievedGoals.forEach(goal => {
      const matchingDbGoal = dbGoals.find(dbGoal => dbGoal.id === goal.id);
      expect(matchingDbGoal).toBeTruthy();
      expect(goal).toMatchObject({
        id: matchingDbGoal?.id,
        name: matchingDbGoal?.name,
        targetAmount: matchingDbGoal?.targetAmount,
        targetDate: matchingDbGoal?.targetDate,
        currentAmount: matchingDbGoal?.currentAmount
      });
    });
  });

  it('updateGoalProgress should modify the goal progress in the database', async () => {
    // Create a new goal for this test
    const newGoal = await goalService.createGoal({
      name: 'Progress Test Goal',
      targetAmount: 5000,
      targetDate: '2025-12-31',
      currentAmount: 1000
    });

    const progressUpdate = {
      currentAmount: 2000
    };

    const updatedGoal = await goalService.updateGoalProgress(newGoal.id, progressUpdate);
    expect(updatedGoal).toBeTruthy();
    expect(updatedGoal.currentAmount).toBe(progressUpdate.currentAmount);

    // Verify the goal progress is updated in the database
    const dbGoal = await GoalModel.findById(newGoal.id);
    expect(dbGoal?.currentAmount).toBe(progressUpdate.currentAmount);
  });
});

// Helper functions for database setup and teardown
async function setupTestDatabase() {
  // Implementation depends on your test database setup
  // This could involve creating a test database connection, running migrations, and seeding test data
}

async function teardownTestDatabase() {
  // Implementation depends on your test database teardown process
  // This could involve closing the database connection and dropping the test database
}
```

This integration test file covers all the required test cases for the Goal API endpoints and the Goal Service integration. It includes tests for creating, retrieving, updating, and deleting goals, as well as updating goal progress.

The file uses Jest as the testing framework and Supertest for making HTTP requests to the API endpoints. It also interacts directly with the GoalService and GoalModel to verify database operations.

Note that the `setupTestDatabase` and `teardownTestDatabase` functions are placeholders and should be implemented according to your specific test database setup and teardown process.

Here are the pending human tasks that need to be addressed:

```typescript
// TODO: Implement proper authentication and authorization mocking for protected routes
// TODO: Add tests for error cases and edge scenarios (e.g., invalid input, non-existent goals)
// TODO: Implement database transaction handling to ensure test isolation
// TODO: Add performance tests for goal-related operations (Optional)