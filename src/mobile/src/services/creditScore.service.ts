import { api } from './api';
import { apiEndpoints } from '../constants/apiEndpoints';
import { CreditScore } from '../types/creditScore.types';

export const creditScoreService = {
  /**
   * Fetches the user's current credit score
   * @returns Promise resolving to the user's credit score
   */
  async getCreditScore(): Promise<CreditScore> {
    try {
      const response = await api.get(apiEndpoints.creditScore);
      return response.data;
    } catch (error) {
      console.error('Error fetching credit score:', error);
      throw error;
    }
  },

  /**
   * Fetches the user's credit score history
   * @param params - Parameters for fetching credit score history
   * @returns Promise resolving to an array of historical credit scores
   */
  async getCreditScoreHistory(params: object): Promise<CreditScore[]> {
    try {
      const response = await api.get(apiEndpoints.creditScoreHistory, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching credit score history:', error);
      throw error;
    }
  },

  /**
   * Fetches the factors affecting the user's credit score
   * @returns Promise resolving to an object containing credit factors
   */
  async getCreditFactors(): Promise<object> {
    try {
      const response = await api.get(apiEndpoints.creditFactors);
      return response.data;
    } catch (error) {
      console.error('Error fetching credit factors:', error);
      throw error;
    }
  },

  /**
   * Simulates how specific actions might affect the user's credit score
   * @param simulationParams - Parameters for the credit score simulation
   * @returns Promise resolving to an object containing simulated credit score changes
   */
  async simulateCreditScoreChange(simulationParams: object): Promise<object> {
    try {
      const response = await api.post(apiEndpoints.creditScoreSimulation, simulationParams);
      return response.data;
    } catch (error) {
      console.error('Error simulating credit score change:', error);
      throw error;
    }
  },
};

// TODO: Implement caching mechanism for credit score data to reduce API calls
// TODO: Add error handling specific to credit score API responses
// TODO: Implement retry logic for failed credit score API requests