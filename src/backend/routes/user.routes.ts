import express, { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';

/**
 * Configures and returns the router with all user-related routes
 * @param {Router} router - Express router instance (optional)
 * @returns {Router} Configured router with user routes
 */
export const configureUserRoutes = (router: Router = express.Router()): Router => {
  const userController = new UserController();

  // Get user profile
  router.get(
    '/profile',
    authMiddleware,
    userController.getProfile
  );

  // Update user profile
  router.put(
    '/profile',
    authMiddleware,
    validationMiddleware.validateUpdateProfile,
    userController.updateProfile
  );

  // Get user preferences
  router.get(
    '/preferences',
    authMiddleware,
    userController.getPreferences
  );

  // Update user preferences
  router.put(
    '/preferences',
    authMiddleware,
    validationMiddleware.validateUpdatePreferences,
    userController.updatePreferences
  );

  // Additional user-related routes can be added here

  return router;
};

// Export the router configuration function
export default configureUserRoutes;