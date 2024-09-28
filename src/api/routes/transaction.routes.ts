import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { TransactionController } from '../controllers/transaction.controller';

const router = Router();
const transactionController = new TransactionController();

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private
 */
router.post('/', authMiddleware, transactionController.createTransaction);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions for the authenticated user
 * @access  Private
 */
router.get('/', authMiddleware, transactionController.getTransactions);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get a specific transaction by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, transactionController.getTransactionById);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update a specific transaction
 * @access  Private
 */
router.put('/:id', authMiddleware, transactionController.updateTransaction);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a specific transaction
 * @access  Private
 */
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);

/**
 * @route   GET /api/transactions/account/:accountId
 * @desc    Get all transactions for a specific account
 * @access  Private
 */
router.get('/account/:accountId', authMiddleware, transactionController.getTransactionsByAccount);

/**
 * @route   GET /api/transactions/category/:categoryId
 * @desc    Get all transactions for a specific category
 * @access  Private
 */
router.get('/category/:categoryId', authMiddleware, transactionController.getTransactionsByCategory);

/**
 * @route   GET /api/transactions/date-range
 * @desc    Get transactions within a specific date range
 * @access  Private
 */
router.get('/date-range', authMiddleware, transactionController.getTransactionsByDateRange);

export function transactionRoutes(): Router {
  return router;
}

// TODO: Implement the TransactionController with all necessary methods
// TODO: Ensure proper input validation and error handling for each route
// TODO: Add pagination support for routes that return multiple transactions
// TODO: Implement rate limiting to prevent abuse of the API