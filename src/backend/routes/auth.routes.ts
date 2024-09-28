import express, { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRegistration, validateLogin } from '../middleware/validation.middleware';

/**
 * Configures and returns the Express router with all authentication-related routes
 * @returns {Router} Configured Express router for authentication routes
 */
export const configureAuthRoutes = (): Router => {
  const router = express.Router();
  const authController = new AuthController();

  // POST route for user registration
  router.post('/register', validateRegistration, authController.register);

  // POST route for user login
  router.post('/login', validateLogin, authController.login);

  // POST route for user logout
  router.post('/logout', authController.logout);

  // POST route for refreshing authentication token
  router.post('/refresh-token', authController.refreshToken);

  // POST route for requesting password reset
  router.post('/forgot-password', authController.forgotPassword);

  // POST route for resetting password
  router.post('/reset-password', authController.resetPassword);

  return router;
};

// Export the router configuration function
export default configureAuthRoutes;

// TODO: Implement proper error handling and logging for authentication routes
// TODO: Add rate limiting to prevent brute force attacks on authentication endpoints
// TODO: Implement CAPTCHA or similar mechanism for registration and login routes to prevent automated attacks