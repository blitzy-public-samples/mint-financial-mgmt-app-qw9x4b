/**
 * This file contains constants for all API endpoints used in the Mint Replica application.
 * It provides a centralized location for managing and accessing API routes across the frontend and backend.
 */

// Base URL for the API
export const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mintreplica.com/v1';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
};

// User-related endpoints
export const USER_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
};

// Account-related endpoints
export const ACCOUNT_ENDPOINTS = {
  LIST: `${API_BASE_URL}/accounts`,
  CREATE: `${API_BASE_URL}/accounts`,
  DETAILS: (id: string) => `${API_BASE_URL}/accounts/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/accounts/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/accounts/${id}`,
  SYNC: (id: string) => `${API_BASE_URL}/accounts/${id}/sync`,
};

// Transaction-related endpoints
export const TRANSACTION_ENDPOINTS = {
  LIST: `${API_BASE_URL}/transactions`,
  CREATE: `${API_BASE_URL}/transactions`,
  DETAILS: (id: string) => `${API_BASE_URL}/transactions/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/transactions/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/transactions/${id}`,
};

// Budget-related endpoints
export const BUDGET_ENDPOINTS = {
  LIST: `${API_BASE_URL}/budgets`,
  CREATE: `${API_BASE_URL}/budgets`,
  DETAILS: (id: string) => `${API_BASE_URL}/budgets/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/budgets/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/budgets/${id}`,
};

// Goal-related endpoints
export const GOAL_ENDPOINTS = {
  LIST: `${API_BASE_URL}/goals`,
  CREATE: `${API_BASE_URL}/goals`,
  DETAILS: (id: string) => `${API_BASE_URL}/goals/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/goals/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/goals/${id}`,
};

// Investment-related endpoints
export const INVESTMENT_ENDPOINTS = {
  LIST: `${API_BASE_URL}/investments`,
  DETAILS: (id: string) => `${API_BASE_URL}/investments/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/investments/${id}`,
};

// Credit score-related endpoints
export const CREDIT_SCORE_ENDPOINTS = {
  OVERVIEW: `${API_BASE_URL}/credit-score`,
  HISTORY: `${API_BASE_URL}/credit-score/history`,
};

// Insight-related endpoints
export const INSIGHT_ENDPOINTS = {
  LIST: `${API_BASE_URL}/insights`,
  DETAILS: (id: string) => `${API_BASE_URL}/insights/${id}`,
};

// TODO: Verify and update the API_BASE_URL with the correct production URL
// TODO: Ensure all API endpoints are correctly mapped to the backend routes
// TODO: Add any additional endpoints that may be required for future features