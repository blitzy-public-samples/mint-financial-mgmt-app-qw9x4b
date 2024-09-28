import { GoalService } from '../../services/goal.service';
import { GoalModel } from '../../models/goal.model';
import { ResponseInterface } from '../../interfaces/response.interface';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../models/goal.model');
jest.mock('uuid');

describe('GoalService', () => {
  let goalService: GoalService;
  let mockGoalModel: jest.Mocked<typeof GoalModel>;

  beforeEach(() => {
    mockGoalModel = GoalModel as jest.Mocked<typeof GoalModel>;
    goalService = new GoalService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockGoalModel = () => {
    return {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    };
  };

  describe('createGoal', () => {
    it('should create a new goal successfully', async () => {
      const mockGoal = {
        id: uuidv4(),
        name: 'Test Goal',
        targetAmount: 1000,
        currentAmount: 0,
        userId: uuidv4(),
      };

      mockGoalModel.create.mockResolvedValue(mockGoal);

      const result = await goalService.createGoal(mockGoal);

      expect(mockGoalModel.create).toHaveBeenCalledWith(mockGoal);
      expect(result).toEqual({
        success: true,
        data: mockGoal,
        message: 'Goal created successfully',
      });
    });

    // Add more test cases for error scenarios
  });

  describe('getGoal', () => {
    it('should retrieve a goal by ID', async () => {
      const mockGoal = {
        id: uuidv4(),
        name: 'Test Goal',
        targetAmount: 1000,
        currentAmount: 0,
        userId: uuidv4(),
      };

      mockGoalModel.findOne.mockResolvedValue(mockGoal);

      const result = await goalService.getGoal(mockGoal.id, mockGoal.userId);

      expect(mockGoalModel.findOne).toHaveBeenCalledWith({ id: mockGoal.id, userId: mockGoal.userId });
      expect(result).toEqual({
        success: true,
        data: mockGoal,
        message: 'Goal retrieved successfully',
      });
    });

    // Add more test cases for error scenarios
  });

  describe('updateGoal', () => {
    it('should update an existing goal', async () => {
      const mockGoal = {
        id: uuidv4(),
        name: 'Updated Goal',
        targetAmount: 1500,
        currentAmount: 500,
        userId: uuidv4(),
      };

      mockGoalModel.findOne.mockResolvedValue(mockGoal);
      mockGoalModel.update.mockResolvedValue(mockGoal);

      const result = await goalService.updateGoal(mockGoal.id, mockGoal.userId, mockGoal);

      expect(mockGoalModel.findOne).toHaveBeenCalledWith({ id: mockGoal.id, userId: mockGoal.userId });
      expect(mockGoalModel.update).toHaveBeenCalledWith({ id: mockGoal.id, userId: mockGoal.userId }, mockGoal);
      expect(result).toEqual({
        success: true,
        data: mockGoal,
        message: 'Goal updated successfully',
      });
    });

    // Add more test cases for error scenarios
  });

  describe('deleteGoal', () => {
    it('should delete a goal', async () => {
      const mockGoalId = uuidv4();
      const mockUserId = uuidv4();

      mockGoalModel.delete.mockResolvedValue({ affected: 1 });

      const result = await goalService.deleteGoal(mockGoalId, mockUserId);

      expect(mockGoalModel.delete).toHaveBeenCalledWith({ id: mockGoalId, userId: mockUserId });
      expect(result).toEqual({
        success: true,
        message: 'Goal deleted successfully',
      });
    });

    // Add more test cases for error scenarios
  });

  describe('getAllGoals', () => {
    it('should retrieve all goals for a user', async () => {
      const mockUserId = uuidv4();
      const mockGoals = [
        { id: uuidv4(), name: 'Goal 1', targetAmount: 1000, currentAmount: 0, userId: mockUserId },
        { id: uuidv4(), name: 'Goal 2', targetAmount: 2000, currentAmount: 500, userId: mockUserId },
      ];

      mockGoalModel.find.mockResolvedValue(mockGoals);

      const result = await goalService.getAllGoals(mockUserId);

      expect(mockGoalModel.find).toHaveBeenCalledWith({ userId: mockUserId });
      expect(result).toEqual({
        success: true,
        data: mockGoals,
        message: 'Goals retrieved successfully',
      });
    });

    // Add more test cases for error scenarios
  });

  describe('updateGoalProgress', () => {
    it('should update the progress of a goal', async () => {
      const mockGoal = {
        id: uuidv4(),
        name: 'Test Goal',
        targetAmount: 1000,
        currentAmount: 500,
        userId: uuidv4(),
      };

      mockGoalModel.findOne.mockResolvedValue(mockGoal);
      mockGoalModel.update.mockResolvedValue({ ...mockGoal, currentAmount: 750 });

      const result = await goalService.updateGoalProgress(mockGoal.id, mockGoal.userId, 750);

      expect(mockGoalModel.findOne).toHaveBeenCalledWith({ id: mockGoal.id, userId: mockGoal.userId });
      expect(mockGoalModel.update).toHaveBeenCalledWith(
        { id: mockGoal.id, userId: mockGoal.userId },
        { currentAmount: 750 }
      );
      expect(result).toEqual({
        success: true,
        data: { ...mockGoal, currentAmount: 750 },
        message: 'Goal progress updated successfully',
      });
    });

    // Add more test cases for error scenarios
  });
});

// Human tasks:
// 1. Implement comprehensive test cases for all GoalService methods
// 2. Add edge case testing for potential error scenarios
// 3. Implement mock for external dependencies like uuid