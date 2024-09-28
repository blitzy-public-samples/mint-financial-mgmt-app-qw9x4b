import axios, { AxiosInstance } from 'axios';
import { InvestmentDataProvider } from '../../../shared/interfaces/investment-data-provider';
import { InvestmentTypes } from '../../../shared/types/investment.types';
import { config } from '../../config';

export class InvestmentDataService implements InvestmentDataProvider {
  private apiKey: string;
  private apiBaseUrl: string;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.apiKey = config.investmentDataApi.apiKey;
    this.apiBaseUrl = config.investmentDataApi.baseUrl;
    this.axiosInstance = axios.create({
      baseURL: this.apiBaseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getInvestmentPortfolio(userId: string): Promise<InvestmentTypes.Portfolio> {
    try {
      const response = await this.axiosInstance.get(`/portfolio/${userId}`);
      return this.transformPortfolioData(response.data);
    } catch (error) {
      console.error('Error fetching investment portfolio:', error);
      throw new Error('Failed to fetch investment portfolio');
    }
  }

  async getInvestmentPerformance(userId: string, investmentId: string, timeRange: InvestmentTypes.TimeRange): Promise<InvestmentTypes.PerformanceData> {
    try {
      const response = await this.axiosInstance.get(`/performance/${userId}/${investmentId}`, {
        params: { timeRange },
      });
      return this.transformPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching investment performance:', error);
      throw new Error('Failed to fetch investment performance');
    }
  }

  async getMarketData(symbol: string, timeRange: InvestmentTypes.TimeRange): Promise<InvestmentTypes.MarketData> {
    try {
      const response = await this.axiosInstance.get(`/market-data/${symbol}`, {
        params: { timeRange },
      });
      return this.transformMarketData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw new Error('Failed to fetch market data');
    }
  }

  async updateInvestmentHoldings(userId: string, updates: InvestmentTypes.HoldingUpdate[]): Promise<boolean> {
    try {
      const response = await this.axiosInstance.put(`/holdings/${userId}`, updates);
      return response.data.success;
    } catch (error) {
      console.error('Error updating investment holdings:', error);
      throw new Error('Failed to update investment holdings');
    }
  }

  async getInvestmentRecommendations(userId: string): Promise<InvestmentTypes.Recommendation[]> {
    try {
      const response = await this.axiosInstance.get(`/recommendations/${userId}`);
      return this.transformRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching investment recommendations:', error);
      throw new Error('Failed to fetch investment recommendations');
    }
  }

  private transformPortfolioData(data: any): InvestmentTypes.Portfolio {
    // Transform the raw data into the expected Portfolio structure
    // This is a placeholder and should be implemented based on the actual data structure
    return data as InvestmentTypes.Portfolio;
  }

  private transformPerformanceData(data: any): InvestmentTypes.PerformanceData {
    // Transform the raw data into the expected PerformanceData structure
    // This is a placeholder and should be implemented based on the actual data structure
    return data as InvestmentTypes.PerformanceData;
  }

  private transformMarketData(data: any): InvestmentTypes.MarketData {
    // Transform the raw data into the expected MarketData structure
    // This is a placeholder and should be implemented based on the actual data structure
    return data as InvestmentTypes.MarketData;
  }

  private transformRecommendations(data: any): InvestmentTypes.Recommendation[] {
    // Transform the raw data into the expected Recommendation structure
    // This is a placeholder and should be implemented based on the actual data structure
    return data as InvestmentTypes.Recommendation[];
  }
}

// TODO: Implement error handling and retry logic for API calls
// TODO: Add caching mechanism for frequently accessed data to reduce API calls
// TODO: Implement rate limiting to comply with external API usage limits
// TODO: Set up monitoring and logging for API calls and performance
// TODO: Implement unit tests for the InvestmentDataService class
// TODO: Review and approve the integration with the chosen external investment data provider