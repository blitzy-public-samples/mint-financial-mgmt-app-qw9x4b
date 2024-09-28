import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import accountRoutes from './account.routes';
import transactionRoutes from './transaction.routes';
import budgetRoutes from './budget.routes';
import goalRoutes from './goal.routes';
import investmentRoutes from './investment.routes';
import creditScoreRoutes from './creditScore.routes';
import insightRoutes from './insight.routes';

/**
 * Creates and configures the main router for the application by combining all route modules
 * @returns {Router} Configured Express router with all application routes
 */
function createRouter(): Router {
  const router = Router();

  // Attach all route modules to the main router
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

export default createRouter;