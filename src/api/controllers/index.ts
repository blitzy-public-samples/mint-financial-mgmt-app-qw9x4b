// This file serves as the main entry point for all API controllers,
// exporting them for use in other parts of the application.

// Import all controllers
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { AccountController } from './account.controller';
import { TransactionController } from './transaction.controller';
import { BudgetController } from './budget.controller';
import { GoalController } from './goal.controller';
import { InvestmentController } from './investment.controller';
import { CreditScoreController } from './credit-score.controller';
import { InsightController } from './insight.controller';

// Export all controllers
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

// Export default object containing all controllers for convenience
export default {
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
 * Human Tasks:
 * 1. Implement individual controller files (auth.controller.ts, user.controller.ts, etc.) if they haven't been created yet
 * 2. Ensure that all controller files follow a consistent naming convention and structure
 * 3. Review and confirm that all necessary controllers for the Mint Replica application are included in this index file
 */