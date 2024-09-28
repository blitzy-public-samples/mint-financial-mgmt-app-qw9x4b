/**
 * CreditScoreModel: Represents a user's credit score and related information
 * in the Mint Replica application.
 */
export class CreditScoreModel {
  userId: number;
  score: number;
  provider: string;
  lastUpdated: Date;
  factors: object;
  history: any[];

  /**
   * Creates a new CreditScoreModel instance
   * @param data Object containing the credit score data
   */
  constructor(data: {
    userId: number;
    score: number;
    provider: string;
    lastUpdated?: Date;
    factors?: object;
    history?: any[];
  }) {
    this.userId = data.userId;
    this.score = data.score;
    this.provider = data.provider;
    this.lastUpdated = data.lastUpdated || new Date();
    this.factors = data.factors || {};
    this.history = data.history || [];
  }

  /**
   * Updates the credit score and related information
   * @param newData Object containing the updated credit score data
   */
  updateScore(newData: {
    score: number;
    factors?: object;
    provider?: string;
  }): void {
    this.score = newData.score;
    this.lastUpdated = new Date();
    
    if (newData.factors) {
      this.factors = { ...this.factors, ...newData.factors };
    }
    
    if (newData.provider) {
      this.provider = newData.provider;
    }
    
    this.history.push({
      date: this.lastUpdated,
      score: this.score,
      factors: this.factors
    });
  }

  /**
   * Returns the credit score range based on the current score
   * @returns A string representing the credit score range
   */
  getScoreRange(): string {
    if (this.score >= 800) return 'Excellent';
    if (this.score >= 740) return 'Very Good';
    if (this.score >= 670) return 'Good';
    if (this.score >= 580) return 'Fair';
    return 'Poor';
  }

  /**
   * Returns the credit score history
   * @param limit Optional number of entries to return
   * @returns An array of historical credit score entries
   */
  getScoreHistory(limit?: number): any[] {
    if (limit && limit > 0) {
      return this.history.slice(-limit);
    }
    return this.history;
  }
}

// Human tasks:
// TODO: Implement error handling for invalid input in the constructor and updateScore method
// TODO: Add validation for credit score range (typically 300-850 for FICO scores)
// TODO: Consider adding methods for analyzing score trends over time
// TODO: Implement unit tests for the CreditScoreModel class