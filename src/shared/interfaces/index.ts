// This file serves as the main entry point for exporting all shared interfaces
// used across the Mint Replica application. It centralizes the imports and exports
// of various interface definitions, making it easier to manage and import
// interfaces throughout the project.

// TODO: Implement the FinancialDataProvider interface
export { FinancialDataProvider } from './financial-data-provider';

// TODO: Implement the CreditScoreProvider interface
export { CreditScoreProvider } from './credit-score-provider';

// TODO: Implement the InvestmentDataProvider interface
export { InvestmentDataProvider } from './investment-data-provider';

// NOTE: The above exports assume that the respective files and interfaces
// will be implemented in the future. Currently, these files do not exist,
// and their implementations are pending.

/**
 * FinancialDataProvider: Interface for financial data aggregation services like Plaid or Yodlee
 * CreditScoreProvider: Interface for credit score services
 * InvestmentDataProvider: Interface for investment data providers
 */

// Human tasks:
// 1. Implement the FinancialDataProvider interface in financial-data-provider.ts
// 2. Implement the CreditScoreProvider interface in credit-score-provider.ts
// 3. Implement the InvestmentDataProvider interface in investment-data-provider.ts