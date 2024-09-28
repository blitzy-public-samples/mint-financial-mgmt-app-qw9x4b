import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateSchema, validateRequestBody } from '../middleware/validation';
import { createGoal, getGoals, getGoalById, updateGoal, deleteGoal } from '../controllers/goal.controller';

const router = Router();

/**
 * @function setupGoalRoutes
 * @description Sets up and returns the router with all goal-related routes
 * @returns {Router} An Express router instance with goal routes configured
 */
const setupGoalRoutes = (): Router => {
  // POST /goals - Create a new goal
  router.post(
    '/',
    authMiddleware,
    validateSchema('createGoal'),
    validateRequestBody,
    createGoal
  );

  // GET /goals - Retrieve all goals for the authenticated user
  router.get('/', authMiddleware, getGoals);

  // GET /goals/:id - Retrieve a specific goal
  router.get('/:id', authMiddleware, getGoalById);

  // PUT /goals/:id - Update a specific goal
  router.put(
    '/:id',
    authMiddleware,
    validateSchema('updateGoal'),
    validateRequestBody,
    updateGoal
  );

  // DELETE /goals/:id - Delete a specific goal
  router.delete('/:id', authMiddleware, deleteGoal);

  return router;
};

export default setupGoalRoutes;

// TODO: Implement goal validation schemas for create and update operations
// TODO: Add pagination support for the GET /goals endpoint
// TODO: Implement error handling for goal-specific errors
// TODO: Add unit tests for goal routes