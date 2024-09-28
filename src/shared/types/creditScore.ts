/**
 * This file defines the types related to credit scores in the Mint Replica application.
 * It includes interfaces and types for credit score data, history, and related information.
 */

/**
 * Represents a user's credit score at a specific point in time
 */
export interface CreditScore {
  score: number;
  date: Date;
  provider: string;
}

/**
 * Defines the range of possible credit scores
 */
export interface CreditScoreRange {
  min: number;
  max: number;
}

/**
 * Represents factors affecting the credit score
 */
export interface CreditScoreFactors {
  factor: string;
  impact: string;
}

/**
 * Represents a user's credit score history
 */
export interface CreditScoreHistory {
  scores: CreditScore[];
}

/**
 * Enum of supported credit score providers
 */
export enum CreditScoreProvider {
  TransUnion = "TransUnion",
  Equifax = "Equifax",
  Experian = "Experian"
}

// Human tasks:
// TODO: Verify if additional credit score-related types are needed based on the specific requirements of the credit score monitoring feature
// TODO: Ensure that the credit score types align with the data provided by the chosen credit score service integration