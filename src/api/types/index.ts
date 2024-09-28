// This file serves as the main entry point for all shared types used in the API layer of the Mint Replica application.
// It exports type definitions and interfaces that are used across various API modules.

// User interface representing a user in the system
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Account interface representing a financial account
export interface Account {
  id: string;
  userId: string;
  institutionName: string;
  accountType: AccountType;
  accountName: string;
  balance: number;
  currency: string;
  lastSynced: Date;
}

// Transaction interface representing a financial transaction
export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  transactionDate: Date;
  amount: number;
  description: string;
  isPending: boolean;
  type: TransactionType;
}

// Budget interface representing a user's budget
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
}

// Goal interface representing a financial goal
export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  targetDate: Date;
  currentAmount: number;
}

// Investment interface representing an investment
export interface Investment {
  id: string;
  userId: string;
  accountId: string;
  type: InvestmentType;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
}

// CreditScore interface representing a user's credit score
export interface CreditScore {
  id: string;
  userId: string;
  score: number;
  date: Date;
  provider: string;
}

// ApiResponse interface representing a standardized API response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// PaginatedResponse interface representing a paginated API response
export interface PaginatedResponse<T = any> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

// ErrorResponse interface representing an error response from the API
export interface ErrorResponse {
  message: string;
  statusCode: number;
  error: string;
}

// AccountType enum for different types of financial accounts
export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
  LOAN = 'LOAN',
  MORTGAGE = 'MORTGAGE'
}

// TransactionType enum for different types of transactions
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER'
}

// BudgetPeriod enum for budget periods
export enum BudgetPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

// InvestmentType enum for different types of investments
export enum InvestmentType {
  STOCK = 'STOCK',
  BOND = 'BOND',
  MUTUAL_FUND = 'MUTUAL_FUND',
  ETF = 'ETF',
  REAL_ESTATE = 'REAL_ESTATE',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY'
}