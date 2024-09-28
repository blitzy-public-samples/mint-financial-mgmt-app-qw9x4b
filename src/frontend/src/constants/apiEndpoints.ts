// This file defines constants for all API endpoints used in the Mint Replica frontend application.
// These constants are used to make API requests to the backend server.

// Base URL for API requests
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
};

// User-related endpoints
export const USER_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  PREFERENCES: `${API_BASE_URL}/users/preferences`,
};

// Account-related endpoints
export const ACCOUNT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/accounts`,
  CREATE: `${API_BASE_URL}/accounts`,
  GET_BY_ID: `${API_BASE_URL}/accounts/:id`,
  UPDATE: `${API_BASE_URL}/accounts/:id`,
  DELETE: `${API_BASE_URL}/accounts/:id`,
  SYNC: `${API_BASE_URL}/accounts/:id/sync`,
};

// Transaction-related endpoints
export const TRANSACTION_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/transactions`,
  CREATE: `${API_BASE_URL}/transactions`,
  GET_BY_ID: `${API_BASE_URL}/transactions/:id`,
  UPDATE: `${API_BASE_URL}/transactions/:id`,
  DELETE: `${API_BASE_URL}/transactions/:id`,
};

// Budget-related endpoints
export const BUDGET_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/budgets`,
  CREATE: `${API_BASE_URL}/budgets`,
  GET_BY_ID: `${API_BASE_URL}/budgets/:id`,
  UPDATE: `${API_BASE_URL}/budgets/:id`,
  DELETE: `${API_BASE_URL}/budgets/:id`,
};

// Goal-related endpoints
export const GOAL_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/goals`,
  CREATE: `${API_BASE_URL}/goals`,
  GET_BY_ID: `${API_BASE_URL}/goals/:id`,
  UPDATE: `${API_BASE_URL}/goals/:id`,
  DELETE: `${API_BASE_URL}/goals/:id`,
};

// Investment-related endpoints
export const INVESTMENT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/investments`,
  GET_BY_ID: `${API_BASE_URL}/investments/:id`,
  UPDATE: `${API_BASE_URL}/investments/:id`,
};

// Credit score-related endpoints
export const CREDIT_SCORE_ENDPOINTS = {
  GET_CURRENT: `${API_BASE_URL}/credit-score`,
  GET_HISTORY: `${API_BASE_URL}/credit-score/history`,
};

// Insight-related endpoints
export const INSIGHT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/insights`,
  GET_BY_ID: `${API_BASE_URL}/insights/:id`,
};

// TODO: Confirm the correct API_BASE_URL for different environments (development, staging, production)
// TODO: Ensure that the REACT_APP_API_BASE_URL environment variable is properly set in the deployment process