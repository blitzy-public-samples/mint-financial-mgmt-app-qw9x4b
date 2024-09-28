import { Account } from '../types/account.types';
import { Transaction } from '../types/transaction.types';

/**
 * Interface for financial data aggregation services like Plaid or Yodlee.
 * This interface defines the contract for integrating external financial data
 * into the Mint Replica application.
 */
export interface FinancialDataProvider {
  /**
   * Establishes a connection with a financial institution.
   * @param institutionId - The unique identifier of the financial institution.
   * @param credentials - The user's credentials for the financial institution.
   * @returns A promise that resolves to true if the connection is successful, false otherwise.
   */
  connect(institutionId: string, credentials: object): Promise<boolean>;

  /**
   * Retrieves all accounts for a connected institution.
   * @param institutionId - The unique identifier of the financial institution.
   * @returns A promise that resolves to an array of Account objects.
   */
  getAccounts(institutionId: string): Promise<Account[]>;

  /**
   * Fetches transactions for a specific account within a date range.
   * @param accountId - The unique identifier of the account.
   * @param startDate - The start date of the date range.
   * @param endDate - The end date of the date range.
   * @returns A promise that resolves to an array of Transaction objects.
   */
  getTransactions(accountId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;

  /**
   * Triggers a refresh of account data from the financial institution.
   * @param accountId - The unique identifier of the account to refresh.
   * @returns A promise that resolves when the refresh is complete.
   */
  refreshAccountData(accountId: string): Promise<void>;

  /**
   * Removes the connection to a financial institution.
   * @param institutionId - The unique identifier of the financial institution.
   * @returns A promise that resolves to true if disconnection is successful, false otherwise.
   */
  disconnect(institutionId: string): Promise<boolean>;
}

// Human tasks:
// TODO: Implement concrete classes that adhere to the FinancialDataProvider interface for specific services (e.g., PlaidProvider, YodleeProvider)
// TODO: Ensure proper error handling and rate limiting are implemented in the concrete provider classes
// TODO: Set up necessary API keys and credentials for the chosen financial data aggregation service