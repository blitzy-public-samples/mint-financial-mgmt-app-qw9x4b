import * as goalController from '../../controllers/goal.controller';
import { GoalService } from '../../services/goal.service';
import { Request, Response } from 'express';
import { jest } from '@jest/globals';

describe('Goal Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockGoalService: jest.Mocked<GoalService>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockGoalService = {
      createGoal: jest.fn(),
      getGoals: jest.fn(),
      getGoalById: jest.fn(),
      updateGoal: jest.fn(),
      deleteGoal: jest.fn(),
    } as unknown as jest.Mocked<GoalService>;

    // Mock the GoalService in the controller
    (goalController as any).goalService = mockGoalService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGoal', () => {
    it('should create a new goal', async () => {
      const goalData = { name: 'Test Goal', targetAmount: 1000, targetDate: '2023-12-31' };
      mockRequest.body = goalData;
      mockRequest.user = { id: 'user123' };
      const createdGoal = { id: 'goal123', ...goalData, userId: 'user123' };
      mockGoalService.createGoal.mockResolvedValue(createdGoal);

      await goalController.createGoal(mockRequest as Request, mockResponse as Response);

      expect(mockGoalService.createGoal).toHaveBeenCalledWith(goalData, 'user123');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdGoal);
    });
  });

  describe('getGoals', () => {
    it('should return all goals for the user', async () => {
      mockRequest.user = { id: 'user123' };
      const goals = [{ id: 'goal1', name: 'Goal 1' }, { id: 'goal2', name: 'Goal 2' }];
      mockGoalService.getGoals.mockResolvedValue(goals);

      await goalController.getGoals(mockRequest as Request, mockResponse as Response);

      expect(mockGoalService.getGoals).toHaveBeenCalledWith('user123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(goals);
    });
  });

  describe('getGoalById', () => {
    it('should return a specific goal by ID', async () => {
      mockRequest.params = { id: 'goal123' };
      mockRequest.user = { id: 'user123' };
      const goal = { id: 'goal123', name: 'Test Goal', userId: 'user123' };
      mockGoalService.getGoalById.mockResolvedValue(goal);

      await goalController.getGoalById(mockRequest as Request, mockResponse as Response);

      expect(mockGoalService.getGoalById).toHaveBeenCalledWith('goal123', 'user123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(goal);
    });
  });

  describe('updateGoal', () => {
    it('should update an existing goal', async () => {
      const updatedGoalData = { name: 'Updated Goal', targetAmount: 1500 };
      mockRequest.params = { id: 'goal123' };
      mockRequest.body = updatedGoalData;
      mockRequest.user = { id: 'user123' };
      const updatedGoal = { id: 'goal123', ...updatedGoalData, userId: 'user123' };
      mockGoalService.updateGoal.mockResolvedValue(updatedGoal);

      await goalController.updateGoal(mockRequest as Request, mockResponse as Response);

      expect(mockGoalService.updateGoal).toHaveBeenCalledWith('goal123', 'user123', updatedGoalData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedGoal);
    });
  });

  describe('deleteGoal', () => {
    it('should delete a goal', async () => {
      mockRequest.params = { id: 'goal123' };
      mockRequest.user = { id: 'user123' };
      mockGoalService.deleteGoal.mockResolvedValue(undefined);

      await goalController.deleteGoal(mockRequest as Request, mockResponse as Response);

      expect(mockGoalService.deleteGoal).toHaveBeenCalledWith('goal123', 'user123');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.json).toHaveBeenCalledWith();
    });
  });
});

// TODO: Implement error handling tests for each controller function
// TODO: Add tests for input validation in createGoal and updateGoal functions
// TODO: Implement tests for pagination in getGoals function if implemented
// TODO: Add tests for authentication middleware