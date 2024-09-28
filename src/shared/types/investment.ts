/**
 * This file defines the types related to investments in the Mint Replica application.
 * It includes types for investment accounts, portfolios, assets, and related operations.
 */

/**
 * Represents an investment account in the Mint Replica application
 */
export interface InvestmentAccount {
  id: string;
  userId: string;
  accountName: string;
  accountType: InvestmentAccountType;
  balance: number;
  currency: string;
  institution: string;
  lastUpdated: Date;
}

/**
 * Enum representing different types of investment accounts
 */
export enum InvestmentAccountType {
  INDIVIDUAL = 'INDIVIDUAL',
  JOINT = 'JOINT',
  RETIREMENT = 'RETIREMENT',
  EDUCATION = 'EDUCATION',
  BROKERAGE = 'BROKERAGE'
}

/**
 * Represents an individual investment asset
 */
export interface InvestmentAsset {
  id: string;
  accountId: string;
  symbol: string;
  name: string;
  assetType: InvestmentAssetType;
  quantity: number;
  currentPrice: number;
  value: number;
  costBasis: number;
  lastUpdated: Date;
}

/**
 * Enum representing different types of investment assets
 */
export enum InvestmentAssetType {
  STOCK = 'STOCK',
  BOND = 'BOND',
  MUTUAL_FUND = 'MUTUAL_FUND',
  ETF = 'ETF',
  OPTION = 'OPTION',
  CRYPTO = 'CRYPTO',
  REAL_ESTATE = 'REAL_ESTATE',
  OTHER = 'OTHER'
}

/**
 * Represents a transaction in an investment account
 */
export interface InvestmentTransaction {
  id: string;
  accountId: string;
  assetId: string;
  transactionType: InvestmentTransactionType;
  quantity: number;
  price: number;
  amount: number;
  fees: number;
  date: Date;
}

/**
 * Enum representing different types of investment transactions
 */
export enum InvestmentTransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  DIVIDEND = 'DIVIDEND',
  INTEREST = 'INTEREST',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  FEE = 'FEE'
}

/**
 * Represents the performance metrics of an investment
 */
export interface InvestmentPerformance {
  assetId: string;
  totalReturn: number;
  percentageReturn: number;
  annualizedReturn: number;
  dividendYield: number;
  lastUpdated: Date;
}

/**
 * Human tasks:
 * 1. Review and validate the investment types to ensure they cover all necessary aspects of investment tracking in the Mint Replica application
 * 2. Confirm that the InvestmentAccountType and InvestmentAssetType enums include all relevant types for the application
 * 3. Consider adding more specific types or interfaces for different asset classes if needed (e.g., StockAsset, BondAsset)
 */