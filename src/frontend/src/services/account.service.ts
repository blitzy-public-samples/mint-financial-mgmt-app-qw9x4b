import { get, post, put, delete as httpDelete } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { Account } from '../types/account.types';

/**
 * Service for handling account-related API calls
 */
export const AccountService = {
  /**
   * Fetches all accounts for the authenticated user
   * @returns {Promise<Account[]>} Array of user accounts
   */
  getAccounts: async (): Promise<Account[]> => {
    try {
      const response = await get(API_ENDPOINTS.ACCOUNTS);
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },

  /**
   * Fetches a specific account by its ID
   * @param {string} accountId - The ID of the account to fetch
   * @returns {Promise<Account>} Account details
   */
  getAccountById: async (accountId: string): Promise<Account> => {
    try {
      const response = await get(`${API_ENDPOINTS.ACCOUNTS}/${accountId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching account with ID ${accountId}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new account
   * @param {object} accountData - The data for the new account
   * @returns {Promise<Account>} Created account details
   */
  createAccount: async (accountData: object): Promise<Account> => {
    try {
      const response = await post(API_ENDPOINTS.ACCOUNTS, accountData);
      return response.data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  /**
   * Updates an existing account
   * @param {string} accountId - The ID of the account to update
   * @param {object} accountData - The updated account data
   * @returns {Promise<Account>} Updated account details
   */
  updateAccount: async (accountId: string, accountData: object): Promise<Account> => {
    try {
      const response = await put(`${API_ENDPOINTS.ACCOUNTS}/${accountId}`, accountData);
      return response.data;
    } catch (error) {
      console.error(`Error updating account with ID ${accountId}:`, error);
      throw error;
    }
  },

  /**
   * Deletes an account
   * @param {string} accountId - The ID of the account to delete
   * @returns {Promise<void>}
   */
  deleteAccount: async (accountId: string): Promise<void> => {
    try {
      await httpDelete(`${API_ENDPOINTS.ACCOUNTS}/${accountId}`);
    } catch (error) {
      console.error(`Error deleting account with ID ${accountId}:`, error);
      throw error;
    }
  },

  /**
   * Initiates a sync for a specific account
   * @param {string} accountId - The ID of the account to sync
   * @returns {Promise<Account>} Synced account details
   */
  syncAccount: async (accountId: string): Promise<Account> => {
    try {
      const response = await post(`${API_ENDPOINTS.ACCOUNTS}/${accountId}/sync`);
      return response.data;
    } catch (error) {
      console.error(`Error syncing account with ID ${accountId}:`, error);
      throw error;
    }
  },
};

// TODO: Implement error handling for specific account-related errors
// TODO: Add data validation before sending requests to the server
// TODO: Implement caching mechanism for frequently accessed account data