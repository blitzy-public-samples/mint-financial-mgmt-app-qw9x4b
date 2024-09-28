// This file serves as the central export point for all shared models in the Mint Replica application.
// It aggregates and re-exports the models to provide a single import source for other parts of the application.

// User Model
export { UserModel } from './user-model';

// Account Model
export { AccountModel } from './account-model';

// Transaction Model
export { TransactionModel } from './transaction-model';

// Budget Model
export { BudgetModel } from './budget-model';

// Goal Model
export { GoalModel } from './goal-model';

// Investment Model
export { InvestmentModel } from './investment-model';

// Credit Score Model
export { CreditScoreModel } from './credit-score-model';

// TODO: Implement individual model files (user-model.ts, account-model.ts, etc.) with their respective interfaces or types
// TODO: Review and ensure all necessary models are included in this index file
// TODO: Verify that the naming conventions for models are consistent across the application