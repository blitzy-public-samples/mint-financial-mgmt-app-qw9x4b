import { Request, Response } from 'express';
import { InsightService } from '../services/insight.service';
import { ApiResponse } from '../interfaces/response.interface';

class InsightController {
  private insightService: InsightService;

  constructor(insightService: InsightService) {
    this.insightService = insightService;
  }

  /**
   * Retrieves financial insights for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public async getInsights(req: Request, res: Response): Promise<void> {
    try {
      // Extract user ID from the authenticated request
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' } as ApiResponse);
        return;
      }

      // Call InsightService to get insights for the user
      const insights = await this.insightService.getInsightsForUser(userId);

      // Send a success response with the insights
      res.status(200).json({ data: insights, message: 'Insights retrieved successfully' } as ApiResponse);
    } catch (error) {
      // Handle any errors and send an appropriate error response
      console.error('Error in getInsights:', error);
      res.status(500).json({ message: 'An error occurred while retrieving insights' } as ApiResponse);
    }
  }

  /**
   * Retrieves a specific financial insight by its ID
   * @param req Express Request object
   * @param res Express Response object
   */
  public async getInsightById(req: Request, res: Response): Promise<void> {
    try {
      // Extract insight ID from request parameters
      const insightId = req.params.id;

      // Extract user ID from the authenticated request
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' } as ApiResponse);
        return;
      }

      // Call InsightService to get the specific insight
      const insight = await this.insightService.getInsightById(insightId, userId);

      if (!insight) {
        res.status(404).json({ message: 'Insight not found' } as ApiResponse);
        return;
      }

      // Verify that the insight belongs to the authenticated user
      if (insight.userId !== userId) {
        res.status(403).json({ message: 'Forbidden' } as ApiResponse);
        return;
      }

      // Send a success response with the insight
      res.status(200).json({ data: insight, message: 'Insight retrieved successfully' } as ApiResponse);
    } catch (error) {
      // Handle any errors and send an appropriate error response
      console.error('Error in getInsightById:', error);
      res.status(500).json({ message: 'An error occurred while retrieving the insight' } as ApiResponse);
    }
  }

  /**
   * Triggers the generation of new financial insights for the user
   * @param req Express Request object
   * @param res Express Response object
   */
  public async generateInsights(req: Request, res: Response): Promise<void> {
    try {
      // Extract user ID from the authenticated request
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' } as ApiResponse);
        return;
      }

      // Call InsightService to generate new insights for the user
      await this.insightService.generateInsightsForUser(userId);

      // Send a success response indicating insights were generated
      res.status(200).json({ message: 'Insights generated successfully' } as ApiResponse);
    } catch (error) {
      // Handle any errors and send an appropriate error response
      console.error('Error in generateInsights:', error);
      res.status(500).json({ message: 'An error occurred while generating insights' } as ApiResponse);
    }
  }
}

export default InsightController;

// TODO: Implement error handling middleware for consistent error responses
// TODO: Add input validation for request parameters and body
// TODO: Implement rate limiting for insight generation to prevent abuse