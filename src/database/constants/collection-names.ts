/**
 * This file defines constants for MongoDB collection names used in the Mint Replica application.
 * These constants should be used throughout the application to ensure consistency
 * and make it easier to update collection names if needed in the future.
 */

/**
 * Collection name for user preferences
 */
export const USER_PREFERENCES = 'user_preferences';

/**
 * Collection name for financial insights
 */
export const FINANCIAL_INSIGHTS = 'financial_insights';

/**
 * Collection name for investment portfolios
 */
export const INVESTMENT_PORTFOLIOS = 'investment_portfolios';

/**
 * Collection name for credit scores
 */
export const CREDIT_SCORES = 'credit_scores';

/**
 * Object containing all collection names for easy import
 */
export const COLLECTIONS = {
  USER_PREFERENCES,
  FINANCIAL_INSIGHTS,
  INVESTMENT_PORTFOLIOS,
  CREDIT_SCORES,
};

/**
 * Type definition for collection names to ensure type safety when using these constants
 */
export type CollectionName = keyof typeof COLLECTIONS;