/**
 * This file contains TypeScript type definitions related to investments for the mobile application.
 * It defines various interfaces and types used throughout the investment-related components and services.
 */

/**
 * Represents an investment held by the user
 */
export interface Investment {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  initialValue: number;
  purchaseDate: Date;
  quantity: number;
  currentPrice: number;
}

/**
 * Enum representing different types of investments
 */
export enum InvestmentType {
  STOCK = 'STOCK',
  BOND = 'BOND',
  MUTUAL_FUND = 'MUTUAL_FUND',
  ETF = 'ETF',
  REAL_ESTATE = 'REAL_ESTATE',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY'
}

/**
 * Represents the performance metrics of an investment
 */
export interface InvestmentPerformance {
  investmentId: string;
  totalReturn: number;
  annualizedReturn: number;
  dividendYield: number;
}

/**
 * Represents a transaction related to an investment
 */
export interface InvestmentTransaction {
  id: string;
  investmentId: string;
  type: InvestmentTransactionType;
  amount: number;
  quantity: number;
  price: number;
  date: Date;
}

/**
 * Enum representing different types of investment transactions
 */
export enum InvestmentTransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  DIVIDEND = 'DIVIDEND',
  SPLIT = 'SPLIT'
}

/**
 * Represents the user's entire investment portfolio
 */
export interface InvestmentPortfolio {
  userId: string;
  investments: Investment[];
  totalValue: number;
  totalGainLoss: number;
}