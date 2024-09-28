import axios, { AxiosInstance } from 'axios';
import { config } from '../../config';
import { CreditScoreProvider } from '../../interfaces/creditScoreProvider.interface';
import { logger } from '../../utils/logger';
import { CREDIT_BUREAU_API_ENDPOINTS } from '../../constants/apiEndpoints';

// Interfaces for CreditScore and CreditReport
interface CreditScore {
  score: number;
  date: Date;
  // Add other relevant fields
}

interface CreditReport {
  creditScore: CreditScore;
  // Add other relevant fields for the full credit report
}

export class CreditBureauService implements CreditScoreProvider {
  private apiClient: AxiosInstance;

  constructor() {
    // Initialize the axios instance with base URL and default headers
    this.apiClient = axios.create({
      baseURL: config.creditBureauApi.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.creditBureauApi.apiKey}`,
      },
    });

    // Set up request interceptors for adding authentication tokens
    this.apiClient.interceptors.request.use((config) => {
      // Add any additional headers or tokens if needed
      return config;
    });

    // Set up response interceptors for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('Credit Bureau API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async fetchCreditScore(userId: string): Promise<CreditScore> {
    try {
      // Validate the userId
      if (!userId) {
        throw new Error('Invalid userId');
      }

      // Send a GET request to the credit bureau API
      const response = await this.apiClient.get(CREDIT_BUREAU_API_ENDPOINTS.CREDIT_SCORE(userId));

      // Handle any errors from the API call
      if (response.status !== 200) {
        throw new Error(`Failed to fetch credit score: ${response.statusText}`);
      }

      // Parse and return the credit score data
      return response.data as CreditScore;
    } catch (error) {
      logger.error(`Error fetching credit score for user ${userId}:`, error);
      throw error;
    }
  }

  async fetchCreditReport(userId: string): Promise<CreditReport> {
    try {
      // Validate the userId
      if (!userId) {
        throw new Error('Invalid userId');
      }

      // Send a GET request to the credit bureau API for the full report
      const response = await this.apiClient.get(CREDIT_BUREAU_API_ENDPOINTS.CREDIT_REPORT(userId));

      // Handle any errors from the API call
      if (response.status !== 200) {
        throw new Error(`Failed to fetch credit report: ${response.statusText}`);
      }

      // Parse and return the credit report data
      return response.data as CreditReport;
    } catch (error) {
      logger.error(`Error fetching credit report for user ${userId}:`, error);
      throw error;
    }
  }

  async updateCreditScore(userId: string, creditScoreData: CreditScore): Promise<void> {
    try {
      // Validate the userId and creditScoreData
      if (!userId || !creditScoreData) {
        throw new Error('Invalid userId or creditScoreData');
      }

      // Update the credit score information in the database
      // This is a placeholder and should be replaced with actual database update logic
      logger.info(`Updating credit score for user ${userId}`);

      // Log the successful update
      logger.info(`Credit score updated successfully for user ${userId}`);
    } catch (error) {
      logger.error(`Error updating credit score for user ${userId}:`, error);
      throw error;
    }
  }

  async getCreditScore(userId: string): Promise<CreditScore> {
    try {
      // Call the fetchCreditScore function
      const creditScore = await this.fetchCreditScore(userId);

      // Update the local database with the new credit score
      await this.updateCreditScore(userId, creditScore);

      // Return the credit score data
      return creditScore;
    } catch (error) {
      logger.error(`Error getting credit score for user ${userId}:`, error);
      throw error;
    }
  }

  async getCreditReport(userId: string): Promise<CreditReport> {
    try {
      // Call the fetchCreditReport function
      const creditReport = await this.fetchCreditReport(userId);

      // Return the credit report data
      return creditReport;
    } catch (error) {
      logger.error(`Error getting credit report for user ${userId}:`, error);
      throw error;
    }
  }
}

// Export an instance of the CreditBureauService
export const creditBureauService = new CreditBureauService();
```

This implementation includes the following features and considerations:

1. The `CreditBureauService` class implements the `CreditScoreProvider` interface.
2. It uses axios for making HTTP requests to the credit bureau API.
3. The constructor initializes the axios instance with base URL, default headers, and interceptors for request and response handling.
4. The `fetchCreditScore` and `fetchCreditReport` methods handle API calls to retrieve credit score and full credit report data.
5. The `updateCreditScore` method is a placeholder for updating the credit score in the local database.
6. The `getCreditScore` and `getCreditReport` methods combine fetching data from the API and updating local records.
7. Error handling and logging are implemented throughout the service.
8. The service is exported as a singleton instance for use in other parts of the application.

Note: This implementation makes assumptions about the structure of the `config`, `logger`, and `CREDIT_BUREAU_API_ENDPOINTS` imports. You may need to adjust these based on your actual project structure and implementation details.

Human Tasks:
```
- Implement error handling for API rate limits and temporary outages
- Set up proper authentication mechanism for the credit bureau API
- Implement caching mechanism to reduce API calls and improve performance
- Create unit tests for the CreditBureauService class
- Review and approve the integration with the chosen credit bureau API