import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget
} from '../controllers/budget.controller';
import { createBudgetSchema, updateBudgetSchema } from '../utils/validation.util';

const router = Router();

/**
 * @route POST /api/budgets
 * @desc Create a new budget
 * @access Private
 */
router.post(
  '/',
  authenticate,
  authorize(['user', 'admin']),
  validationMiddleware(createBudgetSchema),
  createBudget
);

/**
 * @route GET /api/budgets
 * @desc Get all budgets for the authenticated user
 * @access Private
 */
router.get(
  '/',
  authenticate,
  authorize(['user', 'admin']),
  getBudgets
);

/**
 * @route GET /api/budgets/:id
 * @desc Get a specific budget by ID
 * @access Private
 */
router.get(
  '/:id',
  authenticate,
  authorize(['user', 'admin']),
  getBudgetById
);

/**
 * @route PUT /api/budgets/:id
 * @desc Update a specific budget
 * @access Private
 */
router.put(
  '/:id',
  authenticate,
  authorize(['user', 'admin']),
  validationMiddleware(updateBudgetSchema),
  updateBudget
);

/**
 * @route DELETE /api/budgets/:id
 * @desc Delete a specific budget
 * @access Private
 */
router.delete(
  '/:id',
  authenticate,
  authorize(['user', 'admin']),
  deleteBudget
);

export default router;

// TODO: Implement the following tasks:
// - Add rate limiting for budget-related routes to prevent abuse
// - Add pagination for the getBudgets route to handle large numbers of budgets efficiently
// - Implement proper error handling and logging for all routes
// - Consider adding a route for bulk operations on budgets (e.g., creating multiple budgets at once)