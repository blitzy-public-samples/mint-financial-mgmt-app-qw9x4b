import { Sequelize } from 'sequelize';
import { expect, describe, it, beforeAll, afterAll, beforeEach, afterEach } from 'jest';
import { GoalRepository } from '../../repositories/postgresql/goal.repository';
import { Goal } from '../../../shared/types/goal';
import { initGoalModel } from '../../models/postgresql/goal.model';

describe('GoalRepository', () => {
  let sequelize: Sequelize;
  let goalRepository: GoalRepository;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await goalRepository.deleteAll();
  });

  describe('create', () => {
    it('should create a new goal', async () => {
      const goal = createSampleGoal();
      const createdGoal = await goalRepository.create(goal);
      expect(createdGoal).toHaveProperty('id');
      expect(createdGoal.name).toBe(goal.name);
      expect(createdGoal.targetAmount).toBe(goal.targetAmount);
      expect(createdGoal.currentAmount).toBe(goal.currentAmount);
      expect(createdGoal.targetDate).toEqual(goal.targetDate);
    });
  });

  describe('findById', () => {
    it('should find a goal by id', async () => {
      const goal = createSampleGoal();
      const createdGoal = await goalRepository.create(goal);
      const foundGoal = await goalRepository.findById(createdGoal.id);
      expect(foundGoal).toEqual(createdGoal);
    });

    it('should return null for non-existent id', async () => {
      const foundGoal = await goalRepository.findById('non-existent-id');
      expect(foundGoal).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all goals', async () => {
      const goal1 = createSampleGoal();
      const goal2 = createSampleGoal();
      await goalRepository.create(goal1);
      await goalRepository.create(goal2);
      const goals = await goalRepository.findAll();
      expect(goals).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update an existing goal', async () => {
      const goal = createSampleGoal();
      const createdGoal = await goalRepository.create(goal);
      const updatedGoal = { ...createdGoal, name: 'Updated Goal' };
      const result = await goalRepository.update(createdGoal.id, updatedGoal);
      expect(result).toBe(true);
      const foundGoal = await goalRepository.findById(createdGoal.id);
      expect(foundGoal?.name).toBe('Updated Goal');
    });

    it('should return false for non-existent id', async () => {
      const result = await goalRepository.update('non-existent-id', createSampleGoal());
      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete an existing goal', async () => {
      const goal = createSampleGoal();
      const createdGoal = await goalRepository.create(goal);
      const result = await goalRepository.delete(createdGoal.id);
      expect(result).toBe(true);
      const foundGoal = await goalRepository.findById(createdGoal.id);
      expect(foundGoal).toBeNull();
    });

    it('should return false for non-existent id', async () => {
      const result = await goalRepository.delete('non-existent-id');
      expect(result).toBe(false);
    });
  });
});

async function setupTestDatabase(): Promise<void> {
  // Create a new Sequelize instance with test database configuration
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });

  // Initialize the GoalModel using initGoalModel
  const GoalModel = initGoalModel(sequelize);

  // Create a new GoalRepository instance
  goalRepository = new GoalRepository(GoalModel);

  // Sync the database to create tables
  await sequelize.sync({ force: true });
}

async function teardownTestDatabase(): Promise<void> {
  // Close the Sequelize connection
  await sequelize.close();
}

function createSampleGoal(): Goal {
  return {
    name: 'Sample Goal',
    targetAmount: 10000,
    currentAmount: 2000,
    targetDate: new Date('2023-12-31'),
    userId: 'user-123',
  };
}