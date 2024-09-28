/**
 * This file contains type definitions related to credit scores for the Mint Replica mobile application.
 * It defines interfaces and types for credit score data, history, and related information.
 */

/**
 * Represents a user's credit score at a specific point in time
 */
export interface CreditScore {
  score: number;
  date: Date;
  provider: string;
  factors: CreditScoreFactors;
}

/**
 * Represents factors affecting the credit score
 */
export interface CreditScoreFactors {
  positiveFactors: string[];
  negativeFactors: string[];
}

/**
 * Represents the user's credit score history
 */
export interface CreditScoreHistory {
  scores: CreditScore[];
}

/**
 * Represents the range of possible credit scores
 */
export interface CreditScoreRange {
  min: number;
  max: number;
}

/**
 * Represents a credit score provider
 */
export interface CreditScoreProvider {
  name: string;
  description: string;
  scoreRange: CreditScoreRange;
}

/**
 * Represents the status of a user's credit score
 */
export type CreditScoreStatus = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'VeryPoor';

/**
 * Represents the names of supported credit score providers
 */
export type CreditScoreProviderName = 'Equifax' | 'Experian' | 'TransUnion';