/**
 * This file contains TypeScript type definitions related to credit scores for the Mint Replica application's frontend.
 * It defines the structure of credit score data and related entities used throughout the frontend codebase.
 */

/**
 * Represents a user's credit score at a specific point in time
 */
export interface CreditScore {
  score: number;
  date: Date;
  provider: CreditScoreProvider;
  range: CreditScoreRange;
  factors: CreditScoreFactor[];
}

/**
 * Represents a collection of credit scores over time
 */
export interface CreditScoreHistory {
  scores: CreditScore[];
}

/**
 * Represents a factor affecting the credit score
 */
export interface CreditScoreFactor {
  name: string;
  impact: string;
  description: string;
}

/**
 * Represents the range of a credit score
 */
export type CreditScoreRange = {
  min: number;
  max: number;
};

/**
 * Enum representing different credit score providers
 */
export enum CreditScoreProvider {
  EQUIFAX = "EQUIFAX",
  EXPERIAN = "EXPERIAN",
  TRANSUNION = "TRANSUNION"
}