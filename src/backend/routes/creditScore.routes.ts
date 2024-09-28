import express, { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as CreditScoreController from '../controllers/creditScore.controller';

const creditScoreRouter: Router = express.Router();

// Get the user's current credit score
creditScoreRouter.get('/', authenticate, CreditScoreController.getCurrentScore);

// Get the user's credit score history
creditScoreRouter.get('/history', authenticate, CreditScoreController.getScoreHistory);

// Refresh the user's credit score
creditScoreRouter.post('/refresh', authenticate, CreditScoreController.refreshScore);

// Get the factors affecting the user's credit score
creditScoreRouter.get('/factors', authenticate, CreditScoreController.getCreditFactors);

// Simulate credit score changes based on user actions
creditScoreRouter.post('/simulate', authenticate, CreditScoreController.simulateScoreChanges);

export default creditScoreRouter;

// TODO: Implement the following tasks:
// - Add rate limiting for credit score refresh and simulation endpoints
// - Add validation middleware for request bodies
// - Implement error handling middleware
// - Set up proper logging for each route
// - Consider adding caching for credit score data to improve performance