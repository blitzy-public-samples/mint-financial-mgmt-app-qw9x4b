import express, { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';
import { validationMiddleware } from '../middleware/validation';

/**
 * Configures and returns the router with all user-related routes
 * @param {Router} router - Express router instance (optional)
 * @returns {Router} Configured router with user routes
 */
export const configureUserRoutes = (router: Router = express.Router()): Router => {
  const userController = new UserController();

  // GET /profile route to get user profile
  router.get(
    '/profile',
    authMiddleware,
    userController.getProfile
  );

  // PUT /profile route to update user profile
  router.put(
    '/profile',
    authMiddleware,
    validationMiddleware('updateProfile'),
    userController.updateProfile
  );

  // GET /preferences route to get user preferences
  router.get(
    '/preferences',
    authMiddleware,
    userController.getPreferences
  );

  // PUT /preferences route to update user preferences
  router.put(
    '/preferences',
    authMiddleware,
    validationMiddleware('updatePreferences'),
    userController.updatePreferences
  );

  return router;
};

// Export the configured router
export default configureUserRoutes();

// TODO: Implement proper input validation for user profile and preferences updates
// TODO: Ensure all routes are properly protected with authentication middleware