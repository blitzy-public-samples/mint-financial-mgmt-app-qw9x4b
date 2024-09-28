import express, { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';

const accountRoutes = (): Router => {
  const router = express.Router();
  const accountController = new AccountController();

  // GET /api/accounts - Get all accounts for the authenticated user
  router.get(
    '/',
    authMiddleware,
    accountController.getAllAccounts
  );

  // GET /api/accounts/:id - Get a specific account by ID
  router.get(
    '/:id',
    authMiddleware,
    accountController.getAccountById
  );

  // POST /api/accounts - Create a new account
  router.post(
    '/',
    authMiddleware,
    validationMiddleware('createAccount'),
    accountController.createAccount
  );

  // PUT /api/accounts/:id - Update an existing account
  router.put(
    '/:id',
    authMiddleware,
    validationMiddleware('updateAccount'),
    accountController.updateAccount
  );

  // DELETE /api/accounts/:id - Delete an account
  router.delete(
    '/:id',
    authMiddleware,
    accountController.deleteAccount
  );

  // POST /api/accounts/:id/sync - Sync account transactions
  router.post(
    '/:id/sync',
    authMiddleware,
    accountController.syncAccount
  );

  return router;
};

export default accountRoutes;

// TODO: Implement proper input validation schemas for account-related requests
// TODO: Ensure all necessary account management endpoints are covered
// TODO: Review and adjust authentication middleware for each route as needed