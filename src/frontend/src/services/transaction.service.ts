import { get, post, put, delete as httpDelete } from './api';
import { Transaction } from '../types/transaction.types';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export class TransactionService {
  /**
   * Fetches all transactions for the authenticated user
   * @returns {Promise<Transaction[]>} Array of Transaction objects
   */
  static async getAllTransactions(): Promise<Transaction[]> {
    try {
      const response = await get(API_ENDPOINTS.transactions);
      return response.data;
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      throw error;
    }
  }

  /**
   * Fetches a specific transaction by its ID
   * @param {string} id - The ID of the transaction to fetch
   * @returns {Promise<Transaction>} Transaction object
   */
  static async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await get(`${API_ENDPOINTS.transactions}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new transaction
   * @param {Transaction} transactionData - The transaction data to create
   * @returns {Promise<Transaction>} Created Transaction object
   */
  static async createTransaction(transactionData: Transaction): Promise<Transaction> {
    try {
      const response = await post(API_ENDPOINTS.transactions, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Updates an existing transaction
   * @param {string} id - The ID of the transaction to update
   * @param {Partial<Transaction>} transactionData - The transaction data to update
   * @returns {Promise<Transaction>} Updated Transaction object
   */
  static async updateTransaction(id: string, transactionData: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await put(`${API_ENDPOINTS.transactions}/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating transaction with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a transaction
   * @param {string} id - The ID of the transaction to delete
   * @returns {Promise<void>}
   */
  static async deleteTransaction(id: string): Promise<void> {
    try {
      await httpDelete(`${API_ENDPOINTS.transactions}/${id}`);
    } catch (error) {
      console.error(`Error deleting transaction with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Fetches all transactions for a specific account
   * @param {string} accountId - The ID of the account
   * @returns {Promise<Transaction[]>} Array of Transaction objects
   */
  static async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    try {
      const response = await get(`${API_ENDPOINTS.transactions}/account/${accountId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transactions for account ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches transactions within a specific date range
   * @param {Date} startDate - The start date of the range
   * @param {Date} endDate - The end date of the range
   * @returns {Promise<Transaction[]>} Array of Transaction objects
   */
  static async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    try {
      const response = await get(`${API_ENDPOINTS.transactions}/date-range`, {
        params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
  }
}

// TODO: Implement error handling for API calls
// TODO: Add pagination support for getAllTransactions and getTransactionsByAccount methods
// TODO: Implement caching mechanism for frequently accessed transactions