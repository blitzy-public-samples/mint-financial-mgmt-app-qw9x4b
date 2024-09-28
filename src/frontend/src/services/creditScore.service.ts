import { get } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export interface CreditScore {
  score: number;
  // Add other relevant properties
}

export interface CreditScoreHistory {
  date: string;
  score: number;
  // Add other relevant properties
}

export interface CreditFactor {
  name: string;
  impact: string;
  // Add other relevant properties
}

export interface CreditScoreSimulation {
  simulatedScore: number;
  // Add other relevant properties
}

export interface SimulationParams {
  // Add relevant simulation parameters
}

/**
 * Service for handling credit score related API calls
 */
export const creditScoreService = {
  /**
   * Fetches the user's current credit score
   * @returns Promise<CreditScore>
   */
  getCreditScore: async (): Promise<CreditScore> => {
    try {
      const response = await get(API_ENDPOINTS.CREDIT_SCORE);
      return response.data;
    } catch (error) {
      console.error('Error fetching credit score:', error);
      throw error;
    }
  },

  /**
   * Fetches the user's credit score history
   * @param params Optional parameters for filtering or pagination
   * @returns Promise<CreditScoreHistory[]>
   */
  getCreditScoreHistory: async (params?: Record<string, unknown>): Promise<CreditScoreHistory[]> => {
    try {
      const response = await get(API_ENDPOINTS.CREDIT_SCORE_HISTORY, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching credit score history:', error);
      throw error;
    }
  },

  /**
   * Fetches the factors affecting the user's credit score
   * @returns Promise<CreditFactor[]>
   */
  getCreditFactors: async (): Promise<CreditFactor[]> => {
    try {
      const response = await get(API_ENDPOINTS.CREDIT_FACTORS);
      return response.data;
    } catch (error) {
      console.error('Error fetching credit factors:', error);
      throw error;
    }
  },

  /**
   * Simulates credit score changes based on user actions
   * @param simulationParams Parameters for the credit score simulation
   * @returns Promise<CreditScoreSimulation>
   */
  simulateCreditScoreChange: async (simulationParams: SimulationParams): Promise<CreditScoreSimulation> => {
    try {
      const response = await get(API_ENDPOINTS.CREDIT_SCORE_SIMULATION, { params: simulationParams });
      return response.data;
    } catch (error) {
      console.error('Error simulating credit score change:', error);
      throw error;
    }
  },
};

// Human tasks:
// TODO: Implement error handling for API calls
// TODO: Add data validation for simulation parameters
// TODO: Implement caching mechanism for frequently accessed data