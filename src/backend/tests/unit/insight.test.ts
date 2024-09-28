import { InsightController } from '../../controllers/insight.controller';
import { InsightService } from '../../services/insight.service';
import { Request, Response } from 'express';

jest.mock('../../services/insight.service');

describe('InsightController', () => {
  let insightController: InsightController;
  let insightService: jest.Mocked<InsightService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    insightService = {
      getInsights: jest.fn(),
      getInsightById: jest.fn(),
      generateInsights: jest.fn(),
    } as any;

    insightController = new InsightController(insightService);

    mockRequest = {
      params: {},
      body: {},
      user: { id: 'user123' },
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getInsights', () => {
    it('should return insights for authenticated user', async () => {
      const mockInsights = [{ id: '1', title: 'Insight 1' }, { id: '2', title: 'Insight 2' }];
      insightService.getInsights.mockResolvedValue(mockInsights);

      await insightController.getInsights(mockRequest as Request, mockResponse as Response);

      expect(insightService.getInsights).toHaveBeenCalledWith('user123');
      expect(mockResponse.json).toHaveBeenCalledWith(mockInsights);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getInsightById', () => {
    it('should return a specific insight by ID', async () => {
      const mockInsight = { id: '1', title: 'Insight 1' };
      mockRequest.params = { id: '1' };
      insightService.getInsightById.mockResolvedValue(mockInsight);

      await insightController.getInsightById(mockRequest as Request, mockResponse as Response);

      expect(insightService.getInsightById).toHaveBeenCalledWith('1', 'user123');
      expect(mockResponse.json).toHaveBeenCalledWith(mockInsight);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('generateInsights', () => {
    it('should generate new insights for the user', async () => {
      const successMessage = 'Insights generated successfully';
      insightService.generateInsights.mockResolvedValue(successMessage);

      await insightController.generateInsights(mockRequest as Request, mockResponse as Response);

      expect(insightService.generateInsights).toHaveBeenCalledWith('user123');
      expect(mockResponse.json).toHaveBeenCalledWith({ message: successMessage });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('error handling', () => {
    it('should handle errors in getInsights', async () => {
      const errorMessage = 'Internal server error';
      insightService.getInsights.mockRejectedValue(new Error(errorMessage));

      await insightController.getInsights(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});

// Human tasks:
// TODO: Implement test cases for input validation scenarios
// TODO: Add test cases for unauthorized access attempts
// TODO: Create test cases for rate limiting functionality once implemented