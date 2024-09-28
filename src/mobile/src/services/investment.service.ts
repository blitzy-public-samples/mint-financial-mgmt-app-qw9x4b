import { api } from './api';
import { apiEndpoints } from '../constants/apiEndpoints';
import { Investment, InvestmentPortfolio, InvestmentTransaction } from '../types/investment.types';

/**
 * Investment service for handling all investment-related API calls and data processing.
 */
class InvestmentService {
  /**
   * Fetches the user's investment portfolio.
   * @returns {Promise<InvestmentPortfolio>} Promise resolving to the user's investment portfolio
   */
  async getInvestmentPortfolio(): Promise<InvestmentPortfolio> {
    try {
      const response = await api.get(apiEndpoints.investmentPortfolio);
      return response.data;
    } catch (error) {
      console.error('Error fetching investment portfolio:', error);
      throw error;
    }
  }

  /**
   * Fetches details for a specific investment.
   * @param {string} investmentId - The ID of the investment
   * @returns {Promise<Investment>} Promise resolving to the investment details
   */
  async getInvestmentDetails(investmentId: string): Promise<Investment> {
    try {
      const response = await api.get(`${apiEndpoints.investmentDetails}/${investmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching investment details for ID ${investmentId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches transactions for a specific investment.
   * @param {string} investmentId - The ID of the investment
   * @param {object} params - Additional parameters for filtering transactions
   * @returns {Promise<InvestmentTransaction[]>} Promise resolving to an array of investment transactions
   */
  async getInvestmentTransactions(investmentId: string, params: object): Promise<InvestmentTransaction[]> {
    try {
      const response = await api.get(`${apiEndpoints.investmentTransactions}/${investmentId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching investment transactions for ID ${investmentId}:`, error);
      throw error;
    }
  }

  /**
   * Adds a new investment to the user's portfolio.
   * @param {object} investmentData - The data for the new investment
   * @returns {Promise<Investment>} Promise resolving to the newly added investment
   */
  async addInvestment(investmentData: object): Promise<Investment> {
    try {
      const response = await api.post(apiEndpoints.addInvestment, investmentData);
      return response.data;
    } catch (error) {
      console.error('Error adding new investment:', error);
      throw error;
    }
  }

  /**
   * Updates an existing investment in the user's portfolio.
   * @param {string} investmentId - The ID of the investment to update
   * @param {object} investmentData - The updated data for the investment
   * @returns {Promise<Investment>} Promise resolving to the updated investment
   */
  async updateInvestment(investmentId: string, investmentData: object): Promise<Investment> {
    try {
      const response = await api.put(`${apiEndpoints.updateInvestment}/${investmentId}`, investmentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating investment with ID ${investmentId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes an investment from the user's portfolio.
   * @param {string} investmentId - The ID of the investment to delete
   * @returns {Promise<void>} Promise resolving when the investment is successfully deleted
   */
  async deleteInvestment(investmentId: string): Promise<void> {
    try {
      await api.delete(`${apiEndpoints.deleteInvestment}/${investmentId}`);
    } catch (error) {
      console.error(`Error deleting investment with ID ${investmentId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches performance data for the user's investment portfolio.
   * @param {object} params - Parameters for filtering performance data
   * @returns {Promise<object>} Promise resolving to the investment performance data
   */
  async getInvestmentPerformance(params: object): Promise<object> {
    try {
      const response = await api.get(apiEndpoints.investmentPerformance, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching investment performance data:', error);
      throw error;
    }
  }
}

export const investmentService = new InvestmentService();