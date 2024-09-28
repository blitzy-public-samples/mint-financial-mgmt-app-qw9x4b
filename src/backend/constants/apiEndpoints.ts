/**
 * API Endpoints for the Mint Replica application
 * This file contains all the API endpoints used in the backend.
 * It provides a centralized location for managing and accessing API routes.
 */

// Base API version
export const API_VERSION = '/api/v1';

// Authentication endpoints
export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
};

// User-related endpoints
export const USER = {
  PROFILE: '/users/profile',
  PREFERENCES: '/users/preferences',
};

// Account-related endpoints
export const ACCOUNTS = {
  BASE: '/accounts',
  SYNC: '/accounts/sync',
};

// Transaction-related endpoints
export const TRANSACTIONS = {
  BASE: '/transactions',
};

// Budget-related endpoints
export const BUDGETS = {
  BASE: '/budgets',
};

// Goal-related endpoints
export const GOALS = {
  BASE: '/goals',
};

// Investment-related endpoints
export const INVESTMENTS = {
  BASE: '/investments',
};

// Credit score-related endpoints
export const CREDIT_SCORE = {
  BASE: '/credit-score',
  HISTORY: '/credit-score/history',
};

// Insights-related endpoints
export const INSIGHTS = {
  BASE: '/insights',
};

// Helper function to generate full API paths
export const getFullPath = (endpoint: string): string => `${API_VERSION}${endpoint}`;

// Export an object with all endpoints for easy access
export const API_ENDPOINTS = {
  AUTH,
  USER,
  ACCOUNTS,
  TRANSACTIONS,
  BUDGETS,
  GOALS,
  INVESTMENTS,
  CREDIT_SCORE,
  INSIGHTS,
};