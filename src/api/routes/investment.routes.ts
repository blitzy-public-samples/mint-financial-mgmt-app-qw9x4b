import { Router } from 'express';
import { InvestmentController } from '../controllers/investment.controller';
import { authMiddleware } from '../middleware/auth';

const investmentRouter = Router();
const investmentController = new InvestmentController();

/**
 * @route   GET /api/investments
 * @desc    Get all investments
 * @access  Private
 */
investmentRouter.get('/', authMiddleware, investmentController.getAllInvestments);

/**
 * @route   GET /api/investments/:id
 * @desc    Get a specific investment by ID
 * @access  Private
 */
investmentRouter.get('/:id', authMiddleware, investmentController.getInvestmentById);

/**
 * @route   POST /api/investments
 * @desc    Create a new investment
 * @access  Private
 */
investmentRouter.post('/', authMiddleware, investmentController.createInvestment);

/**
 * @route   PUT /api/investments/:id
 * @desc    Update an existing investment
 * @access  Private
 */
investmentRouter.put('/:id', authMiddleware, investmentController.updateInvestment);

/**
 * @route   DELETE /api/investments/:id
 * @desc    Delete an investment
 * @access  Private
 */
investmentRouter.delete('/:id', authMiddleware, investmentController.deleteInvestment);

export function setupInvestmentRoutes(): Router {
  return investmentRouter;
}

// TODO: Implement the following tasks:
// - Implement the InvestmentController with methods for CRUD operations
// - Add input validation middleware for POST and PUT routes
// - Implement error handling for investment routes
// - Add pagination support for GET all investments route