import express, { Router } from 'express';
import * as investmentController from '../controllers/investment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';

/**
 * Configures and returns an Express router with all investment-related routes
 * @param {Router} router - Express router instance
 * @returns {Router} Configured Express router with investment routes
 */
export const configureInvestmentRoutes = (router: Router): Router => {
  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // GET /investments - Retrieve all investments for the authenticated user
  router.get(
    '/',
    validationMiddleware.validateGetInvestments,
    investmentController.getInvestments
  );

  // GET /investments/:id - Retrieve a specific investment by ID
  router.get(
    '/:id',
    validationMiddleware.validateGetInvestment,
    investmentController.getInvestment
  );

  // POST /investments - Create a new investment
  router.post(
    '/',
    validationMiddleware.validateCreateInvestment,
    investmentController.createInvestment
  );

  // PUT /investments/:id - Update an existing investment
  router.put(
    '/:id',
    validationMiddleware.validateUpdateInvestment,
    investmentController.updateInvestment
  );

  // DELETE /investments/:id - Delete an investment
  router.delete(
    '/:id',
    validationMiddleware.validateDeleteInvestment,
    investmentController.deleteInvestment
  );

  // GET /investments/portfolio - Retrieve the user's investment portfolio summary
  router.get(
    '/portfolio',
    validationMiddleware.validateGetPortfolio,
    investmentController.getPortfolio
  );

  // POST /investments/sync - Sync investments with external providers
  router.post(
    '/sync',
    validationMiddleware.validateSyncInvestments,
    investmentController.syncInvestments
  );

  return router;
};

export default configureInvestmentRoutes;