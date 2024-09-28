import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Sets up and returns the router with all account-related routes
 * @returns {Router} Express Router object with configured account routes
 */
export function setupAccountRoutes(): Router {
  // Retrieve all accounts for the authenticated user
  router.get('/accounts', authMiddleware, AccountController.getAccounts);

  // Retrieve a specific account by ID for the authenticated user
  router.get('/accounts/:accountId', authMiddleware, AccountController.getAccountById);

  // Create a new account for the authenticated user
  router.post('/accounts', authMiddleware, AccountController.createAccount);

  // Update an existing account for the authenticated user
  router.put('/accounts/:accountId', authMiddleware, AccountController.updateAccount);

  // Delete an account for the authenticated user
  router.delete('/accounts/:accountId', authMiddleware, AccountController.deleteAccount);

  // Sync account data with the linked financial institution
  router.post('/accounts/:accountId/sync', authMiddleware, AccountController.syncAccount);

  return router;
}

// Export the router setup function
export default setupAccountRoutes;

// TODO: Implement the following tasks:
// - Implement the AccountController with methods for each route handler
// - Ensure proper input validation and error handling for each route
// - Add rate limiting to prevent abuse of the API
// - Implement logging for each route for monitoring and debugging purposes