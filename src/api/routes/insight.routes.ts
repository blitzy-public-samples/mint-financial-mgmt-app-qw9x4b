import { Router } from 'express';
import { InsightController } from '../controllers/insight.controller';
import { authMiddleware } from '../middleware/auth';

/**
 * Sets up and configures the insight routes for the application
 * @returns An Express router instance with insight routes configured
 */
export const setupInsightRoutes = (): Router => {
  const router = Router();
  const insightController = new InsightController();

  // Apply authMiddleware to all routes to ensure they are protected
  router.use(authMiddleware);

  /**
   * @route GET /insights
   * @description Retrieve all insights
   * @access Private
   */
  router.get('/', insightController.getAllInsights);

  /**
   * @route GET /insights/:insightId
   * @description Retrieve a specific insight
   * @access Private
   */
  router.get('/:insightId', insightController.getInsightById);

  return router;
};

// List of human tasks
/**
 * @todo Implement the InsightController with methods for retrieving insights
 * @todo Add input validation middleware for route parameters and query strings
 * @todo Implement error handling for insight-specific errors
 * @todo Add documentation comments for each route to generate API documentation
 */