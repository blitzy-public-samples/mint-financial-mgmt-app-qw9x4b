import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { InsightService } from '../services/insight.service';
import { authMiddleware } from '../middleware/auth';
import { Insight } from '../../shared/types';

export class InsightController {
  private insightService: InsightService;

  constructor(insightService: InsightService) {
    this.insightService = insightService;
  }

  public getInsights = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract the user ID from the authenticated request
      const userId = (req as any).user.id;

      // Call the insight service to get insights for the user
      const insights: Insight[] = await this.insightService.getInsights(userId);

      // If successful, return the insights with a 200 OK status
      res.status(StatusCodes.OK).json(insights);
    } catch (error) {
      // If an error occurs, return an appropriate error response
      console.error('Error in getInsights:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while fetching insights' });
    }
  };

  public getInsightById = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract the user ID from the authenticated request
      const userId = (req as any).user.id;

      // Extract the insight ID from the request parameters
      const insightId = req.params.id;

      // Call the insight service to get the specific insight for the user
      const insight: Insight | null = await this.insightService.getInsightById(userId, insightId);

      // If the insight is found, return it with a 200 OK status
      if (insight) {
        res.status(StatusCodes.OK).json(insight);
      } else {
        // If the insight is not found, return a 404 Not Found status
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Insight not found' });
      }
    } catch (error) {
      // If an error occurs, return an appropriate error response
      console.error('Error in getInsightById:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while fetching the insight' });
    }
  };
}

// Export functions for use in routes
export const getInsights = authMiddleware(async (req: Request, res: Response) => {
  const controller = new InsightController(new InsightService());
  await controller.getInsights(req, res);
});

export const getInsightById = authMiddleware(async (req: Request, res: Response) => {
  const controller = new InsightController(new InsightService());
  await controller.getInsightById(req, res);
});

// List of human tasks
/*
TODO: Implement error handling and logging for the controller methods
TODO: Add input validation for request parameters and body
TODO: Implement pagination for the getInsights method if dealing with large amounts of data
TODO: Add unit tests for the InsightController class and its methods
*/