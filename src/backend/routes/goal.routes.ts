import express, { Router } from 'express';
import * as GoalController from '../controllers/goal.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';

/**
 * Configures and returns an Express router with all goal-related routes
 * @returns {Router} Configured Express router with goal routes
 */
export function configureGoalRoutes(): Router {
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Define routes for CRUD operations on goals
  router.get('/', GoalController.getAllGoals);
  router.get('/:id', GoalController.getGoalById);
  router.post('/', validationMiddleware('createGoal'), GoalController.createGoal);
  router.put('/:id', validationMiddleware('updateGoal'), GoalController.updateGoal);
  router.delete('/:id', GoalController.deleteGoal);

  return router;
}

// List of human tasks
/**
 * TODO: Implement proper input validation schemas for goal creation and updates
 * Severity: Required
 * 
 * TODO: Ensure that the authentication middleware is correctly implemented and applied
 * Severity: Critical
 */