// API configuration settings for the Mint Replica application

// Global API version
export const API_VERSION = 'v1';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token'
  },
  USER: {
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences'
  },
  ACCOUNTS: {
    BASE: '/accounts',
    SYNC: '/accounts/{accountId}/sync'
  },
  TRANSACTIONS: {
    BASE: '/transactions'
  },
  BUDGETS: {
    BASE: '/budgets'
  },
  GOALS: {
    BASE: '/goals'
  },
  INVESTMENTS: {
    BASE: '/investments'
  },
  CREDIT_SCORE: {
    BASE: '/credit-score',
    HISTORY: '/credit-score/history'
  },
  INSIGHTS: {
    BASE: '/insights'
  }
};

// Default API request timeout in milliseconds
export const API_TIMEOUT = 30000;

// Interface for API configuration object
export interface ApiConfig {
  baseUrl: string;
  version: string;
  timeout: number;
  endpoints: typeof API_ENDPOINTS;
}

/**
 * Returns the API configuration based on the current environment
 * @returns {ApiConfig} API configuration object
 */
export function getApiConfig(): ApiConfig {
  // TODO: Implement environment-specific configurations
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://api.mintreplica.com';

  return {
    baseUrl,
    version: API_VERSION,
    timeout: API_TIMEOUT,
    endpoints: API_ENDPOINTS
  };
}

// TODO: Review and update API endpoints to ensure they match the backend implementation
// TODO: Confirm the API timeout value is appropriate for all environments
// TODO: Implement environment-specific API configurations if needed