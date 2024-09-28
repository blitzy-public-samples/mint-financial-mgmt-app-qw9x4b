import { Router } from 'express';
import { BudgetController } from '../controllers/budget.controller';
import { authMiddleware } from '../middleware/auth';
import { validateSchema } from '../middleware/validation';

const router = Router();
const budgetController = new BudgetController();

/**
 * @function setupBudgetRoutes
 * @description Sets up and configures the budget routes for the Mint Replica API
 * @returns {Router} An Express router instance with budget routes configured
 */
export function setupBudgetRoutes(): Router {
  // POST route for creating a new budget
  router.post(
    '/',
    authMiddleware,
    validateSchema('createBudget'),
    budgetController.createBudget
  );

  // GET route for retrieving all budgets for a user
  router.get('/', authMiddleware, budgetController.getAllBudgets);

  // GET route for retrieving a specific budget by ID
  router.get('/:id', authMiddleware, budgetController.getBudgetById);

  // PUT route for updating a budget
  router.put(
    '/:id',
    authMiddleware,
    validateSchema('updateBudget'),
    budgetController.updateBudget
  );

  // DELETE route for deleting a budget
  router.delete('/:id', authMiddleware, budgetController.deleteBudget);

  // GET route for retrieving budget reports
  router.get('/reports', authMiddleware, budgetController.getBudgetReports);

  // GET route for retrieving budget summaries
  router.get('/summaries', authMiddleware, budgetController.getBudgetSummaries);

  return router;
}

// Export the router setup function
export default setupBudgetRoutes;

// List of human tasks
/**
 * @todo Implement the BudgetController with all the necessary methods
 * @todo Create validation schemas for budget creation and update operations
 * @todo Implement error handling for budget routes
 * @todo Add pagination support for retrieving all budgets
 * @todo Implement filtering and sorting options for budget retrieval
 */