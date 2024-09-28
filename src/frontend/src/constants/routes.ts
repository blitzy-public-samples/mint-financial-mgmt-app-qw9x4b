/**
 * This file contains constants for all the routes used in the frontend application.
 * It provides a centralized location for managing route paths, making it easier
 * to maintain and update routes across the application.
 */

export const HOME = '/';
export const LOGIN = '/login';
export const REGISTER = '/register';
export const FORGOT_PASSWORD = '/forgot-password';
export const DASHBOARD = '/dashboard';
export const ACCOUNTS = '/accounts';
export const ACCOUNT_DETAILS = '/accounts/:accountId';
export const ADD_ACCOUNT = '/accounts/add';
export const TRANSACTIONS = '/transactions';
export const TRANSACTION_DETAILS = '/transactions/:transactionId';
export const ADD_TRANSACTION = '/transactions/add';
export const BUDGETS = '/budgets';
export const BUDGET_DETAILS = '/budgets/:budgetId';
export const CREATE_BUDGET = '/budgets/create';
export const GOALS = '/goals';
export const GOAL_DETAILS = '/goals/:goalId';
export const CREATE_GOAL = '/goals/create';
export const INVESTMENTS = '/investments';
export const INVESTMENT_DETAILS = '/investments/:investmentId';
export const CREDIT_SCORE = '/credit-score';
export const CREDIT_SCORE_HISTORY = '/credit-score/history';
export const PROFILE = '/profile';
export const EDIT_PROFILE = '/profile/edit';
export const SETTINGS = '/settings';

/**
 * Object containing all route constants for easy import and use in other files.
 */
export const ROUTES = {
  HOME,
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD,
  DASHBOARD,
  ACCOUNTS,
  ACCOUNT_DETAILS,
  ADD_ACCOUNT,
  TRANSACTIONS,
  TRANSACTION_DETAILS,
  ADD_TRANSACTION,
  BUDGETS,
  BUDGET_DETAILS,
  CREATE_BUDGET,
  GOALS,
  GOAL_DETAILS,
  CREATE_GOAL,
  INVESTMENTS,
  INVESTMENT_DETAILS,
  CREDIT_SCORE,
  CREDIT_SCORE_HISTORY,
  PROFILE,
  EDIT_PROFILE,
  SETTINGS,
};

export default ROUTES;
```

This implementation includes all the routes specified in the JSON representation. Here's a breakdown of the file:

1. We start with a comment explaining the purpose of the file.
2. Each route is exported as a constant, using the exact paths provided in the JSON specification.
3. We've added an additional `ROUTES` object that contains all the route constants. This allows for easy importing of all routes at once in other files if needed.
4. The `ROUTES` object is also exported as the default export for convenience.

This structure allows for flexible usage of the routes in the application. Developers can either import individual routes or the entire `ROUTES` object, depending on their needs. For example:

```typescript
import { HOME, LOGIN } from './constants/routes';
// or
import ROUTES from './constants/routes';

// Usage
navigate(HOME);
// or
navigate(ROUTES.HOME);