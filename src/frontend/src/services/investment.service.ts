import { get, post, put, delete as httpDelete } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export interface InvestmentOverview {
  // Define the structure of the investment overview
}

export interface InvestmentDetails {
  // Define the structure of the investment details
}

export interface Investment {
  // Define the structure of an investment
}

export interface InvestmentData {
  // Define the structure of the investment data for creating/updating
}

export interface InvestmentPerformance {
  // Define the structure of the investment performance
}

export interface InvestmentRecommendation {
  // Define the structure of an investment recommendation
}

export const investmentService = {
  /**
   * Fetches the investment overview for the current user
   * @returns Promise<InvestmentOverview>
   */
  getInvestmentOverview: async (): Promise<InvestmentOverview> => {
    try {
      const response = await get(API_ENDPOINTS.INVESTMENT_OVERVIEW);
      return response.data;
    } catch (error) {
      console.error('Error fetching investment overview:', error);
      throw error;
    }
  },

  /**
   * Fetches the details of a specific investment
   * @param investmentId - The ID of the investment
   * @returns Promise<InvestmentDetails>
   */
  getInvestmentDetails: async (investmentId: string): Promise<InvestmentDetails> => {
    try {
      const response = await get(`${API_ENDPOINTS.INVESTMENT_DETAILS}/${investmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching investment details:', error);
      throw error;
    }
  },

  /**
   * Adds a new investment for the current user
   * @param newInvestment - The data for the new investment
   * @returns Promise<Investment>
   */
  addInvestment: async (newInvestment: InvestmentData): Promise<Investment> => {
    try {
      const response = await post(API_ENDPOINTS.ADD_INVESTMENT, newInvestment);
      return response.data;
    } catch (error) {
      console.error('Error adding new investment:', error);
      throw error;
    }
  },

  /**
   * Updates an existing investment
   * @param investmentId - The ID of the investment to update
   * @param updatedInvestment - The updated investment data
   * @returns Promise<Investment>
   */
  updateInvestment: async (investmentId: string, updatedInvestment: InvestmentData): Promise<Investment> => {
    try {
      const response = await put(`${API_ENDPOINTS.UPDATE_INVESTMENT}/${investmentId}`, updatedInvestment);
      return response.data;
    } catch (error) {
      console.error('Error updating investment:', error);
      throw error;
    }
  },

  /**
   * Deletes an existing investment
   * @param investmentId - The ID of the investment to delete
   * @returns Promise<void>
   */
  deleteInvestment: async (investmentId: string): Promise<void> => {
    try {
      await httpDelete(`${API_ENDPOINTS.DELETE_INVESTMENT}/${investmentId}`);
    } catch (error) {
      console.error('Error deleting investment:', error);
      throw error;
    }
  },

  /**
   * Fetches the performance data for a specific investment
   * @param investmentId - The ID of the investment
   * @param timeFrame - The time frame for the performance data
   * @returns Promise<InvestmentPerformance>
   */
  getInvestmentPerformance: async (investmentId: string, timeFrame: string): Promise<InvestmentPerformance> => {
    try {
      const response = await get(`${API_ENDPOINTS.INVESTMENT_PERFORMANCE}/${investmentId}`, { params: { timeFrame } });
      return response.data;
    } catch (error) {
      console.error('Error fetching investment performance:', error);
      throw error;
    }
  },

  /**
   * Fetches investment recommendations for the current user
   * @returns Promise<InvestmentRecommendation[]>
   */
  getInvestmentRecommendations: async (): Promise<InvestmentRecommendation[]> => {
    try {
      const response = await get(API_ENDPOINTS.INVESTMENT_RECOMMENDATIONS);
      return response.data;
    } catch (error) {
      console.error('Error fetching investment recommendations:', error);
      throw error;
    }
  },
};

// Human tasks:
// TODO: Implement error handling for API calls
// TODO: Add input validation for function parameters
// TODO: Implement caching mechanism for frequently accessed data
// TODO: Add unit tests for all functions