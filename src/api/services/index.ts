// This file serves as the main entry point for all service modules in the API.
// It exports all service modules to be used throughout the application.

import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { TransactionService } from './transaction.service';
import { BudgetService } from './budget.service';
import { GoalService } from './goal.service';
import { InvestmentService } from './investment.service';
import { CreditScoreService } from './credit-score.service';
import { InsightService } from './insight.service';

export {
  AuthService,
  UserService,
  AccountService,
  TransactionService,
  BudgetService,
  GoalService,
  InvestmentService,
  CreditScoreService,
  InsightService
};

// TODO: Implement individual service modules (auth.service.ts, user.service.ts, etc.)
// TODO: Ensure all imported services are correctly implemented and follow the application's architecture
// TODO: Review and approve the overall service structure