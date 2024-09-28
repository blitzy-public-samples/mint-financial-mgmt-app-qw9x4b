/**
 * This file defines the CreditScoreProvider interface, which outlines the structure and methods
 * required for credit score services integration in the Mint Replica application.
 */

/**
 * Interface defining the contract for credit score service providers
 */
export interface CreditScoreProvider {
  /**
   * Get the name of the credit score provider
   * @returns The name of the credit score provider
   */
  getName(): string;

  /**
   * Retrieve the user's credit score
   * @param userId - The unique identifier of the user
   * @returns A promise that resolves to the user's credit score
   */
  getCreditScore(userId: string): Promise<number>;

  /**
   * Retrieve the user's credit score history
   * @param userId - The unique identifier of the user
   * @param startDate - The start date of the history period
   * @param endDate - The end date of the history period
   * @returns A promise that resolves to an array of credit score entries with dates
   */
  getCreditScoreHistory(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Array<{ date: Date; score: number }>>;

  /**
   * Retrieve the factors affecting the user's credit score
   * @param userId - The unique identifier of the user
   * @returns A promise that resolves to an array of credit factors and their impacts
   */
  getCreditFactors(
    userId: string
  ): Promise<Array<{ factor: string; impact: 'positive' | 'negative' | 'neutral' }>>;

  /**
   * Simulate credit score changes based on hypothetical scenarios
   * @param userId - The unique identifier of the user
   * @param scenarios - An array of hypothetical scenarios to simulate
   * @returns A promise that resolves to the simulated credit score changes
   */
  getScoreSimulation(
    userId: string,
    scenarios: Array<{ action: string; amount?: number }>
  ): Promise<{
    currentScore: number;
    simulatedScore: number;
    changes: Array<{ action: string; impact: number }>;
  }>;
}

/**
 * Human tasks:
 * 1. Implement concrete classes that adhere to the CreditScoreProvider interface for specific credit score services (e.g., TransUnion, Equifax, Experian)
 * 2. Ensure proper error handling and rate limiting when interacting with external credit score APIs
 * 3. Implement caching mechanisms to reduce API calls and improve performance (Optional)
 */