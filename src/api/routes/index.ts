import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import accountRoutes from './account.routes';
import transactionRoutes from './transaction.routes';
import budgetRoutes from './budget.routes';
import goalRoutes from './goal.routes';
import investmentRoutes from './investment.routes';
import creditScoreRoutes from './credit-score.routes';
import insightRoutes from './insight.routes';

/**
 * Sets up and combines all route modules for the application
 * @returns {Router} An Express router instance with all routes configured
 */
function setupRoutes(): Router {
  const router = Router();

  // Mount all route modules
  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/accounts', accountRoutes);
  router.use('/transactions', transactionRoutes);
  router.use('/budgets', budgetRoutes);
  router.use('/goals', goalRoutes);
  router.use('/investments', investmentRoutes);
  router.use('/credit-score', creditScoreRoutes);
  router.use('/insights', insightRoutes);

  return router;
}

export default setupRoutes;

// TODO: Implement error handling middleware for the routes
// TODO: Set up authentication middleware for protected routes
// TODO: Configure rate limiting for API endpoints