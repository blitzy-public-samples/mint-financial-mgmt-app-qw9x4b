// API base URL
export const API_BASE_URL = process.env.MOBILE_API_BASE_URL || 'https://api.mintreplica.com/v1';

// Mobile-specific endpoints
export const MOBILE_SPECIFIC_ENDPOINTS = {
  PUSH_NOTIFICATION_REGISTER: '/mobile/push-notifications/register',
  PUSH_NOTIFICATION_UNREGISTER: '/mobile/push-notifications/unregister',
};

// TODO: Import and extend shared API endpoints once they are implemented
// import { SHARED_ENDPOINTS } from '../../../shared/constants/api-endpoints';

// Combine shared and mobile-specific endpoints
// export const API_ENDPOINTS = {
//   ...SHARED_ENDPOINTS,
//   ...MOBILE_SPECIFIC_ENDPOINTS,
// };

// Temporary API_ENDPOINTS object until shared endpoints are implemented
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // User
  GET_USER_PROFILE: '/user/profile',
  UPDATE_USER_PROFILE: '/user/profile',

  // Accounts
  GET_ACCOUNTS: '/accounts',
  ADD_ACCOUNT: '/accounts',
  GET_ACCOUNT_DETAILS: '/accounts/:id',
  UPDATE_ACCOUNT: '/accounts/:id',
  DELETE_ACCOUNT: '/accounts/:id',

  // Transactions
  GET_TRANSACTIONS: '/transactions',
  ADD_TRANSACTION: '/transactions',
  GET_TRANSACTION_DETAILS: '/transactions/:id',
  UPDATE_TRANSACTION: '/transactions/:id',
  DELETE_TRANSACTION: '/transactions/:id',

  // Budgets
  GET_BUDGETS: '/budgets',
  CREATE_BUDGET: '/budgets',
  GET_BUDGET_DETAILS: '/budgets/:id',
  UPDATE_BUDGET: '/budgets/:id',
  DELETE_BUDGET: '/budgets/:id',

  // Goals
  GET_GOALS: '/goals',
  CREATE_GOAL: '/goals',
  GET_GOAL_DETAILS: '/goals/:id',
  UPDATE_GOAL: '/goals/:id',
  DELETE_GOAL: '/goals/:id',

  // Investments
  GET_INVESTMENTS: '/investments',
  GET_INVESTMENT_DETAILS: '/investments/:id',

  // Credit Score
  GET_CREDIT_SCORE: '/credit-score',
  GET_CREDIT_SCORE_HISTORY: '/credit-score/history',

  // Mobile-specific endpoints
  ...MOBILE_SPECIFIC_ENDPOINTS,
};

// Export individual endpoints for easier access
export const {
  LOGIN,
  REGISTER,
  LOGOUT,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  GET_ACCOUNTS,
  ADD_ACCOUNT,
  GET_ACCOUNT_DETAILS,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  GET_TRANSACTIONS,
  ADD_TRANSACTION,
  GET_TRANSACTION_DETAILS,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
  GET_BUDGETS,
  CREATE_BUDGET,
  GET_BUDGET_DETAILS,
  UPDATE_BUDGET,
  DELETE_BUDGET,
  GET_GOALS,
  CREATE_GOAL,
  GET_GOAL_DETAILS,
  UPDATE_GOAL,
  DELETE_GOAL,
  GET_INVESTMENTS,
  GET_INVESTMENT_DETAILS,
  GET_CREDIT_SCORE,
  GET_CREDIT_SCORE_HISTORY,
  PUSH_NOTIFICATION_REGISTER,
  PUSH_NOTIFICATION_UNREGISTER,
} = API_ENDPOINTS;

// Human tasks:
// TODO: Verify and update the MOBILE_API_BASE_URL with the correct production URL for mobile API
// TODO: Ensure all mobile-specific API endpoints are correctly mapped to the backend routes
// TODO: Add any additional mobile-specific endpoints that may be required for future features