// This file defines the interface for an investment data provider, which will be used to fetch and manage investment-related data in the Mint Replica application.

// TODO: Import the actual InvestmentTypes once they are defined
// import { InvestmentTypes } from '../types/investment.types';

// Placeholder for InvestmentTypes until the actual types are defined
namespace InvestmentTypes {
  export interface Portfolio {}
  export interface PerformanceData {}
  export interface TimeRange {}
  export interface MarketData {}
  export interface HoldingUpdate {}
  export interface Recommendation {}
}

/**
 * Interface defining the methods that an investment data provider must implement to interact with external investment data sources.
 */
export interface InvestmentDataProvider {
  /**
   * Retrieves the user's investment portfolio
   * @param userId The ID of the user
   * @returns A promise that resolves to the user's investment portfolio
   */
  getInvestmentPortfolio(userId: string): Promise<InvestmentTypes.Portfolio>;

  /**
   * Retrieves the performance data for a specific investment
   * @param userId The ID of the user
   * @param investmentId The ID of the investment
   * @param timeRange The time range for which to retrieve performance data
   * @returns A promise that resolves to the investment's performance data
   */
  getInvestmentPerformance(
    userId: string,
    investmentId: string,
    timeRange: InvestmentTypes.TimeRange
  ): Promise<InvestmentTypes.PerformanceData>;

  /**
   * Retrieves market data for a specific security or index
   * @param symbol The symbol of the security or index
   * @param timeRange The time range for which to retrieve market data
   * @returns A promise that resolves to the requested market data
   */
  getMarketData(
    symbol: string,
    timeRange: InvestmentTypes.TimeRange
  ): Promise<InvestmentTypes.MarketData>;

  /**
   * Updates the user's investment holdings
   * @param userId The ID of the user
   * @param updates An array of holding updates to be applied
   * @returns A promise that resolves to true if the update was successful, false otherwise
   */
  updateInvestmentHoldings(
    userId: string,
    updates: InvestmentTypes.HoldingUpdate[]
  ): Promise<boolean>;

  /**
   * Retrieves investment recommendations based on the user's profile and current portfolio
   * @param userId The ID of the user
   * @returns A promise that resolves to an array of investment recommendations
   */
  getInvestmentRecommendations(userId: string): Promise<InvestmentTypes.Recommendation[]>;
}

// Human tasks:
// TODO: Implement the actual investment data provider service that adheres to this interface
// TODO: Integrate with a real-time market data API for fetching up-to-date investment information
// TODO: Implement security measures to protect sensitive investment data