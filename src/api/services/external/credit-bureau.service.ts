import axios, { AxiosInstance } from 'axios';
import config from 'config';
import { CreditScore, CreditScoreRange, CreditScoreFactors, CreditScoreHistory, CreditScoreProvider } from '../../../shared/types/creditScore';

const CREDIT_BUREAU_API_URL = process.env.CREDIT_BUREAU_API_URL;
const CREDIT_BUREAU_API_KEY = process.env.CREDIT_BUREAU_API_KEY;

export class CreditBureauService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: CREDIT_BUREAU_API_URL,
      headers: {
        'Authorization': `Bearer ${CREDIT_BUREAU_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Set up request/response interceptors for error handling and logging
    this.apiClient.interceptors.request.use(
      (config) => {
        // Log the request
        console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    this.apiClient.interceptors.response.use(
      (response) => {
        // Log the response
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        console.error('Response error:', error);
        return Promise.reject(error);
      }
    );
  }

  async fetchCreditScore(userId: string, provider: CreditScoreProvider): Promise<CreditScore> {
    try {
      const response = await this.apiClient.get(`/credit-score/${userId}`, { params: { provider } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching credit score for user ${userId}:`, error);
      throw new Error('Failed to fetch credit score');
    }
  }

  async fetchCreditScoreHistory(userId: string, provider: CreditScoreProvider, startDate: Date, endDate: Date): Promise<CreditScoreHistory> {
    try {
      const response = await this.apiClient.get(`/credit-score-history/${userId}`, {
        params: { provider, startDate: startDate.toISOString(), endDate: endDate.toISOString() },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching credit score history for user ${userId}:`, error);
      throw new Error('Failed to fetch credit score history');
    }
  }

  async fetchCreditScoreFactors(userId: string, provider: CreditScoreProvider): Promise<CreditScoreFactors[]> {
    try {
      const response = await this.apiClient.get(`/credit-score-factors/${userId}`, { params: { provider } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching credit score factors for user ${userId}:`, error);
      throw new Error('Failed to fetch credit score factors');
    }
  }

  getCreditScoreRange(provider: CreditScoreProvider): CreditScoreRange {
    // This method returns predefined ranges for different providers
    // In a real-world scenario, these ranges might be fetched from a configuration or the API
    const ranges: { [key in CreditScoreProvider]: CreditScoreRange } = {
      'EQUIFAX': { min: 300, max: 850 },
      'EXPERIAN': { min: 300, max: 850 },
      'TRANSUNION': { min: 300, max: 850 },
      // Add other providers as needed
    };

    return ranges[provider] || { min: 300, max: 850 }; // Default range if provider is not found
  }
}

// Export functions for use in other parts of the application
export const fetchCreditScore = (userId: string, provider: CreditScoreProvider): Promise<CreditScore> => {
  const service = new CreditBureauService();
  return service.fetchCreditScore(userId, provider);
};

export const fetchCreditScoreHistory = (userId: string, provider: CreditScoreProvider, startDate: Date, endDate: Date): Promise<CreditScoreHistory> => {
  const service = new CreditBureauService();
  return service.fetchCreditScoreHistory(userId, provider, startDate, endDate);
};

export const fetchCreditScoreFactors = (userId: string, provider: CreditScoreProvider): Promise<CreditScoreFactors[]> => {
  const service = new CreditBureauService();
  return service.fetchCreditScoreFactors(userId, provider);
};

export const getCreditScoreRange = (provider: CreditScoreProvider): CreditScoreRange => {
  const service = new CreditBureauService();
  return service.getCreditScoreRange(provider);
};

// Human tasks (commented)
/*
TODO: Implement error handling and retry logic for API calls
TODO: Set up proper logging for API interactions and error cases
TODO: Implement rate limiting to comply with credit bureau API usage restrictions
TODO: Review and update the credit score range values for each provider
TODO: (Optional) Implement caching mechanism for credit score data to reduce API calls
*/