/**
 * This file defines the InvestmentDataProviderInterface, which outlines the structure and methods
 * required for investment data providers in the Mint Replica application.
 */

/**
 * Type representing the structure of investment data
 */
export type InvestmentData = {
  userId: string;
  investments: any[]; // This could be further defined based on the specific investment structure
  totalValue: number;
  lastUpdated: Date;
};

/**
 * Type representing the performance data of an investment
 */
export type InvestmentPerformance = {
  investmentId: string;
  currentValue: number;
  percentageChange: number;
  historicalData: any[]; // This could be further defined based on the specific historical data structure
};

/**
 * Type representing general market data
 */
export type MarketData = {
  indices: Record<string, any>; // This could be further defined based on the specific indices structure
  topPerformers: any[]; // This could be further defined based on the specific top performers structure
  topLosers: any[]; // This could be further defined based on the specific top losers structure
  lastUpdated: Date;
};

/**
 * Interface defining the contract for investment data providers.
 */
export interface InvestmentDataProviderInterface {
  /**
   * Unique identifier for the investment data provider
   */
  providerId: string;

  /**
   * Name of the investment data provider
   */
  providerName: string;

  /**
   * Retrieves investment data for a given user
   * @param userId - The unique identifier of the user
   * @returns A promise that resolves to the user's investment data
   */
  getInvestmentData(userId: string): Promise<InvestmentData>;

  /**
   * Retrieves performance data for a specific investment
   * @param userId - The unique identifier of the user
   * @param investmentId - The unique identifier of the investment
   * @returns A promise that resolves to the investment's performance data
   */
  getInvestmentPerformance(userId: string, investmentId: string): Promise<InvestmentPerformance>;

  /**
   * Retrieves general market data
   * @returns A promise that resolves to current market data
   */
  getMarketData(): Promise<MarketData>;
}

/**
 * Human tasks:
 * 1. Review and refine the InvestmentDataProviderInterface to ensure it covers all necessary methods for investment data integration.
 * 2. Implement concrete classes that adhere to this interface for different investment data providers (e.g., specific APIs or services).
 * 3. Ensure that the types (InvestmentData, InvestmentPerformance, MarketData) are properly defined and cover all necessary properties.
 */