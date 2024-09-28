import { Router } from 'express';
import { InsightController } from '../controllers/insight.controller';
import { authenticate } from '../middleware/auth.middleware';

/**
 * Creates and configures the router for insight-related endpoints
 * @returns {Router} Configured Express router with insight routes
 */
export const createInsightRouter = (): Router => {
  const router = Router();
  const insightController = new InsightController();

  // GET route for retrieving all insights
  router.get('/', authenticate, insightController.getAllInsights);

  // GET route for retrieving a specific insight
  router.get('/:id', authenticate, insightController.getInsight);

  // POST route for creating a new insight
  router.post('/', authenticate, insightController.createInsight);

  // PUT route for updating an existing insight
  router.put('/:id', authenticate, insightController.updateInsight);

  // DELETE route for removing an insight
  router.delete('/:id', authenticate, insightController.deleteInsight);

  return router;
};

// List of human tasks
/**
 * Human Tasks:
 * 1. Implement rate limiting for insight API endpoints (Required)
 * 2. Add input validation middleware for POST and PUT routes (Required)
 * 3. Implement caching mechanism for frequently accessed insights (Optional)
 */