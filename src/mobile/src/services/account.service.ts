import { api } from './api';
import { apiEndpoints } from '../constants/apiEndpoints';
import { Account } from '../types/account.types';

export class AccountService {
  /**
   * Creates an instance of AccountService
   */
  constructor() {
    // No initialization needed
  }

  /**
   * Fetches all accounts for the authenticated user
   * @returns Promise resolving to an array of Account objects
   */
  async getAccounts(): Promise<Account[]> {
    try {
      const response = await api.get(apiEndpoints.accounts);
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  /**
   * Fetches a specific account by its ID
   * @param accountId - The ID of the account to fetch
   * @returns Promise resolving to an Account object
   */
  async getAccountById(accountId: string): Promise<Account> {
    try {
      const response = await api.get(`${apiEndpoints.accounts}/${accountId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching account with ID ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new account
   * @param accountData - The data for the new account
   * @returns Promise resolving to the created Account object
   */
  async createAccount(accountData: Partial<Account>): Promise<Account> {
    try {
      const response = await api.post(apiEndpoints.accounts, accountData);
      return response.data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  /**
   * Updates an existing account
   * @param accountId - The ID of the account to update
   * @param accountData - The updated account data
   * @returns Promise resolving to the updated Account object
   */
  async updateAccount(accountId: string, accountData: Partial<Account>): Promise<Account> {
    try {
      const response = await api.put(`${apiEndpoints.accounts}/${accountId}`, accountData);
      return response.data;
    } catch (error) {
      console.error(`Error updating account with ID ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes an account
   * @param accountId - The ID of the account to delete
   * @returns Promise resolving when the account is successfully deleted
   */
  async deleteAccount(accountId: string): Promise<void> {
    try {
      await api.delete(`${apiEndpoints.accounts}/${accountId}`);
    } catch (error) {
      console.error(`Error deleting account with ID ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Initiates a sync operation for a specific account
   * @param accountId - The ID of the account to sync
   * @returns Promise resolving to the synced Account object
   */
  async syncAccount(accountId: string): Promise<Account> {
    try {
      const response = await api.post(`${apiEndpoints.accounts}/${accountId}/sync`);
      return response.data;
    } catch (error) {
      console.error(`Error syncing account with ID ${accountId}:`, error);
      throw error;
    }
  }
}

// Human tasks:
// TODO: Implement error handling for API request failures
// TODO: Add input validation for account data before sending requests
// TODO: Implement caching mechanism for frequently accessed account data