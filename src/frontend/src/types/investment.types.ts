/**
 * This file contains TypeScript type definitions related to investments in the Mint Replica application.
 * It defines the structure of investment data used throughout the frontend, ensuring type safety and
 * consistency in handling investment-related information.
 */

/**
 * Enum representing different types of investments
 */
export enum InvestmentType {
  STOCK = 'STOCK',
  BOND = 'BOND',
  MUTUAL_FUND = 'MUTUAL_FUND',
  ETF = 'ETF',
  REAL_ESTATE = 'REAL_ESTATE',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  OTHER = 'OTHER'
}

/**
 * Represents an individual investment
 */
export interface Investment {
  id: string;
  userId: string;
  type: InvestmentType;
  name: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  lastUpdated: Date;
}

/**
 * Represents the performance metrics of an investment
 */
export interface InvestmentPerformance {
  investmentId: string;
  totalReturn: number;
  percentageReturn: number;
  annualizedReturn: number;
}

/**
 * Represents a user's entire investment portfolio
 */
export interface InvestmentPortfolio {
  userId: string;
  investments: Investment[];
  totalValue: number;
  performanceSummary: InvestmentPerformance;
}

/**
 * Represents a transaction related to an investment
 */
export interface InvestmentTransaction {
  id: string;
  investmentId: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  date: Date;
  quantity: number;
  price: number;
  fees: number;
  total: number;
}