import express, { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';

/**
 * Configures and returns the router with all transaction-related routes
 * @param {Router} router - Express router instance (optional)
 * @returns {Router} Configured router with transaction routes
 */
export const configureTransactionRoutes = (router: Router = express.Router()): Router => {
  const transactionController = new TransactionController();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // GET /transactions - Retrieve all transactions for the authenticated user
  router.get(
    '/',
    validationMiddleware.validateGetTransactions,
    transactionController.getTransactions
  );

  // GET /transactions/:id - Retrieve a specific transaction
  router.get(
    '/:id',
    validationMiddleware.validateGetTransaction,
    transactionController.getTransaction
  );

  // POST /transactions - Create a new transaction
  router.post(
    '/',
    validationMiddleware.validateCreateTransaction,
    transactionController.createTransaction
  );

  // PUT /transactions/:id - Update an existing transaction
  router.put(
    '/:id',
    validationMiddleware.validateUpdateTransaction,
    transactionController.updateTransaction
  );

  // DELETE /transactions/:id - Delete a transaction
  router.delete(
    '/:id',
    validationMiddleware.validateDeleteTransaction,
    transactionController.deleteTransaction
  );

  return router;
};

// Export the configured router
export default configureTransactionRoutes();

// TODO: Implement input validation schemas for transaction-related requests
// TODO: Review and adjust authentication requirements for each route if necessary