/**
 * @file index.ts
 * @description This file serves as the main entry point for all controllers in the backend application.
 * It imports and re-exports all controller modules to provide a centralized access point for the application's route handlers.
 */

// Import all controller modules
import * as AuthController from './auth.controller';
import * as UserController from './user.controller';
import * as AccountController from './account.controller';
import * as TransactionController from './transaction.controller';
import * as BudgetController from './budget.controller';
import * as GoalController from './goal.controller';
import * as InvestmentController from './investment.controller';
import * as CreditScoreController from './creditScore.controller';
import * as InsightController from './insight.controller';

// Re-export all controller modules
export {
  AuthController,
  UserController,
  AccountController,
  TransactionController,
  BudgetController,
  GoalController,
  InvestmentController,
  CreditScoreController,
  InsightController,
};

/**
 * @description This file allows other parts of the application to import controllers like this:
 * import { AuthController, UserController } from './controllers';
 * 
 * This approach provides a clean and organized way to manage and use controllers throughout the application.
 */