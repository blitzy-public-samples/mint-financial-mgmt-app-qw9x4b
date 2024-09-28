import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { CreditScoreController } from '../controllers/credit-score.controller';

const router = Router();
const creditScoreController = new CreditScoreController();

/**
 * Sets up all the credit score related routes
 * @returns {Router} Express Router object with credit score routes
 */
export function setupCreditScoreRoutes(): Router {
  // Define GET route for retrieving current credit score
  router.get(
    '/current',
    authMiddleware,
    creditScoreController.getCurrentCreditScore
  );

  // Define GET route for retrieving credit score history
  router.get(
    '/history',
    authMiddleware,
    creditScoreController.getCreditScoreHistory
  );

  // Define GET route for retrieving credit score factors
  router.get(
    '/factors',
    authMiddleware,
    creditScoreController.getCreditScoreFactors
  );

  // Define POST route for refreshing credit score
  router.post(
    '/refresh',
    authMiddleware,
    creditScoreController.refreshCreditScore
  );

  return router;
}

export default setupCreditScoreRoutes();

// TODO: Implement the following tasks:
// - Implement the CreditScoreController with methods for each route
// - Ensure that the credit score data provider (e.g., TransUnion, Equifax, or Experian) API is properly integrated
// - Implement proper error handling for each route
// - Add input validation middleware for POST requests
// - Implement rate limiting for credit score refresh requests