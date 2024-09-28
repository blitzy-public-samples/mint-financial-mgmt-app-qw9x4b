// TODO: Implement the following interface files:
// - request.interface.ts
// - response.interface.ts
// - financialDataProvider.interface.ts
// - creditScoreProvider.interface.ts
// - investmentDataProvider.interface.ts

// Import interfaces
import { RequestInterface } from './request.interface';
import { ResponseInterface } from './response.interface';
import { FinancialDataProviderInterface } from './financialDataProvider.interface';
import { CreditScoreProviderInterface } from './creditScoreProvider.interface';
import { InvestmentDataProviderInterface } from './investmentDataProvider.interface';

// Export interfaces
export {
  RequestInterface,
  ResponseInterface,
  FinancialDataProviderInterface,
  CreditScoreProviderInterface,
  InvestmentDataProviderInterface,
};

// TODO: Review and ensure that all necessary interfaces for the backend are included in this index file.

/**
 * This file serves as the main entry point for all interfaces used in the backend of the Mint Replica application.
 * It imports and re-exports interfaces from other files in the interfaces directory,
 * providing a centralized location for interface imports throughout the backend.
 */