import { Account } from '../../shared/types/account';
import { Transaction } from '../../shared/types/transaction';

/**
 * Represents a financial institution
 */
export interface Institution {
  id: string;
  name: string;
  logo: string;
  supportedAccountTypes: string[];
}

/**
 * Interface for financial data providers to implement, ensuring consistent methods for account and transaction data retrieval and management.
 */
export interface FinancialDataProviderInterface {
  /**
   * Retrieves all accounts for a given user
   * @param userId The ID of the user
   * @returns A promise that resolves to an array of Account objects
   */
  getAccounts(userId: string): Promise<Account[]>;

  /**
   * Retrieves detailed information for a specific account
   * @param accountId The ID of the account
   * @returns A promise that resolves to an Account object
   */
  getAccountDetails(accountId: string): Promise<Account>;

  /**
   * Retrieves transactions for a specific account within a date range
   * @param accountId The ID of the account
   * @param startDate The start date of the date range
   * @param endDate The end date of the date range
   * @returns A promise that resolves to an array of Transaction objects
   */
  getTransactions(accountId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;

  /**
   * Syncs the latest data for a specific account
   * @param accountId The ID of the account
   * @returns A promise that resolves when the sync is complete
   */
  syncAccount(accountId: string): Promise<void>;

  /**
   * Adds a new account for a user
   * @param userId The ID of the user
   * @param institutionId The ID of the financial institution
   * @param credentials The credentials object for authentication
   * @returns A promise that resolves to the newly added Account object
   */
  addAccount(userId: string, institutionId: string, credentials: object): Promise<Account>;

  /**
   * Removes an account for a user
   * @param accountId The ID of the account to be removed
   * @returns A promise that resolves when the account is successfully removed
   */
  removeAccount(accountId: string): Promise<void>;

  /**
   * Retrieves a list of supported financial institutions
   * @returns A promise that resolves to an array of Institution objects
   */
  getInstitutions(): Promise<Institution[]>;
}
```

This implementation defines the `FinancialDataProviderInterface` and `Institution` interfaces based on the provided JSON specification. The `Account` and `Transaction` types are imported from their respective files, which will need to be created separately.

Note that since we couldn't fetch the implementations or specifications for the `Account` and `Transaction` types, you may need to create these types in their respective files (src/shared/types/account.ts and src/shared/types/transaction.ts) to ensure the interface works correctly.

Here are the pending human tasks as comments:

```typescript
/**
 * TODO: Human Tasks
 * 1. Review and validate the methods in the FinancialDataProviderInterface to ensure they cover all necessary operations for the Mint Replica application (Required)
 * 2. Confirm if additional methods or properties are needed in the FinancialDataProviderInterface based on specific feature requirements (Optional)
 * 3. Verify if the Institution interface needs any additional properties (Optional)
 */