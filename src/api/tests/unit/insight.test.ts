import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { InsightController } from '../../controllers/insight.controller';
import { InsightService } from '../../services/insight.service';
import { Insight } from '../../../shared/types';

describe('InsightController', () => {
  let insightController: InsightController;
  let mockInsightService: jest.Mocked<InsightService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockInsightService = createMockInsightService();
    insightController = new InsightController(mockInsightService);
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
  });

  describe('getInsights', () => {
    it('should return insights for a user', async () => {
      const userId = '123';
      const mockInsights: Insight[] = [
        { id: '1', userId, type: 'spending', description: 'You spent more on dining out this month.' },
        { id: '2', userId, type: 'saving', description: 'You saved 10% more this month compared to last month.' },
      ];

      mockInsightService.getInsights.mockResolvedValue(mockInsights);
      mockRequest.params = { userId };

      await insightController.getInsights(mockRequest as Request, mockResponse as Response);

      expect(mockInsightService.getInsights).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ insights: mockInsights });
    });

    it('should handle errors when fetching insights', async () => {
      const userId = '123';
      const error = new Error('Failed to fetch insights');

      mockInsightService.getInsights.mockRejectedValue(error);
      mockRequest.params = { userId };

      await insightController.getInsights(mockRequest as Request, mockResponse as Response);

      expect(mockInsightService.getInsights).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching insights' });
    });
  });

  describe('getInsightById', () => {
    it('should return a specific insight', async () => {
      const userId = '123';
      const insightId = '1';
      const mockInsight: Insight = {
        id: insightId,
        userId,
        type: 'spending',
        description: 'You spent more on dining out this month.',
      };

      mockInsightService.getInsightById.mockResolvedValue(mockInsight);
      mockRequest.params = { userId, insightId };

      await insightController.getInsightById(mockRequest as Request, mockResponse as Response);

      expect(mockInsightService.getInsightById).toHaveBeenCalledWith(userId, insightId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ insight: mockInsight });
    });

    it('should handle not found errors', async () => {
      const userId = '123';
      const insightId = 'nonexistent';

      mockInsightService.getInsightById.mockResolvedValue(null);
      mockRequest.params = { userId, insightId };

      await insightController.getInsightById(mockRequest as Request, mockResponse as Response);

      expect(mockInsightService.getInsightById).toHaveBeenCalledWith(userId, insightId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Insight not found' });
    });

    it('should handle errors when fetching a specific insight', async () => {
      const userId = '123';
      const insightId = '1';
      const error = new Error('Failed to fetch insight');

      mockInsightService.getInsightById.mockRejectedValue(error);
      mockRequest.params = { userId, insightId };

      await insightController.getInsightById(mockRequest as Request, mockResponse as Response);

      expect(mockInsightService.getInsightById).toHaveBeenCalledWith(userId, insightId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching the insight' });
    });
  });
});

function createMockInsightService(): jest.Mocked<InsightService> {
  return {
    getInsights: jest.fn(),
    getInsightById: jest.fn(),
  } as jest.Mocked<InsightService>;
}

function createMockRequest(overrides: Partial<Request> = {}): Partial<Request> {
  return {
    params: {},
    ...overrides,
  };
}

function createMockResponse(): Partial<Response> {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
}

// Human tasks:
// 1. Implement additional test cases for error scenarios (Required)
// 2. Add integration tests for the InsightController with actual database interactions (Optional)