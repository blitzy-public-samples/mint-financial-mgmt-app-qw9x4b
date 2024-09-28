import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { FinancialDataProvider } from '../../../shared/interfaces/financial-data-provider';
import { Account } from '../../../shared/types/account.types';
import { Transaction } from '../../../shared/types/transaction.types';
import { logger } from '../../utils/logger';
import { config } from '../../config';

export class PlaidService implements FinancialDataProvider {
  private plaidClient: PlaidApi;

  constructor() {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[config.plaid.environment],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': config.plaid.clientId,
          'PLAID-SECRET': config.plaid.secret,
        },
      },
    });

    this.plaidClient = new PlaidApi(configuration);
  }

  async connect(institutionId: string, credentials: object): Promise<boolean> {
    try {
      const response = await this.plaidClient.itemCreate({
        institution_id: institutionId,
        initial_products: ['transactions'],
        credentials: credentials,
      });

      // TODO: Store the access token securely
      const accessToken = response.data.access_token;

      logger.info(`Successfully connected to institution: ${institutionId}`);
      return true;
    } catch (error) {
      logger.error(`Error connecting to institution: ${institutionId}`, error);
      return false;
    }
  }

  async getAccounts(institutionId: string): Promise<Account[]> {
    try {
      // TODO: Retrieve access token for the institution
      const accessToken = 'placeholder_access_token';

      const response = await this.plaidClient.accountsGet({
        access_token: accessToken,
      });

      return response.data.accounts.map((account) => ({
        id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        balance: account.balances.current,
        currency: account.balances.iso_currency_code || 'USD',
      }));
    } catch (error) {
      logger.error(`Error fetching accounts for institution: ${institutionId}`, error);
      throw error;
    }
  }

  async getTransactions(accountId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    try {
      // TODO: Retrieve access token for the account
      const accessToken = 'placeholder_access_token';

      const response = await this.plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        options: {
          account_ids: [accountId],
        },
      });

      return response.data.transactions.map((transaction) => ({
        id: transaction.transaction_id,
        accountId: transaction.account_id,
        amount: transaction.amount,
        date: new Date(transaction.date),
        description: transaction.name,
        category: transaction.category ? transaction.category[0] : 'Uncategorized',
        merchantName: transaction.merchant_name || '',
      }));
    } catch (error) {
      logger.error(`Error fetching transactions for account: ${accountId}`, error);
      throw error;
    }
  }

  async refreshAccountData(accountId: string): Promise<void> {
    try {
      // TODO: Retrieve access token for the account
      const accessToken = 'placeholder_access_token';

      await this.plaidClient.accountsBalanceGet({
        access_token: accessToken,
        options: {
          account_ids: [accountId],
        },
      });

      logger.info(`Successfully refreshed account data for account: ${accountId}`);
    } catch (error) {
      logger.error(`Error refreshing account data for account: ${accountId}`, error);
      throw error;
    }
  }

  async disconnect(institutionId: string): Promise<boolean> {
    try {
      // TODO: Retrieve access token for the institution
      const accessToken = 'placeholder_access_token';

      await this.plaidClient.itemRemove({
        access_token: accessToken,
      });

      // TODO: Remove stored access token

      logger.info(`Successfully disconnected from institution: ${institutionId}`);
      return true;
    } catch (error) {
      logger.error(`Error disconnecting from institution: ${institutionId}`, error);
      return false;
    }
  }
}

// TODO: Implement secure storage and retrieval of Plaid access tokens
// TODO: Implement rate limiting and request throttling for Plaid API calls
// TODO: Create unit tests for the PlaidService class
// TODO: Review and approve the PlaidService implementation