import { api } from './api';
import { apiEndpoints } from '../constants/apiEndpoints';
import { Transaction } from '../types/transaction.types';

/**
 * Transaction service for handling all transaction-related operations and API calls.
 */
class TransactionService {
  /**
   * Fetches all transactions for the authenticated user
   * @param filters - Object containing filter parameters
   * @returns Promise resolving to an array of transactions
   */
  async getTransactions(filters: object): Promise<Transaction[]> {
    try {
      const response = await api.get(apiEndpoints.transactions, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Fetches a single transaction by its ID
   * @param id - The ID of the transaction to fetch
   * @returns Promise resolving to a single transaction
   */
  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await api.get(`${apiEndpoints.transactions}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new transaction
   * @param transactionData - Object containing the new transaction data
   * @returns Promise resolving to the created transaction
   */
  async createTransaction(transactionData: object): Promise<Transaction> {
    try {
      const response = await api.post(apiEndpoints.transactions, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Updates an existing transaction
   * @param id - The ID of the transaction to update
   * @param transactionData - Object containing the updated transaction data
   * @returns Promise resolving to the updated transaction
   */
  async updateTransaction(id: string, transactionData: object): Promise<Transaction> {
    try {
      const response = await api.put(`${apiEndpoints.transactions}/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating transaction with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a transaction
   * @param id - The ID of the transaction to delete
   * @returns Promise resolving when the transaction is deleted
   */
  async deleteTransaction(id: string): Promise<void> {
    try {
      await api.delete(`${apiEndpoints.transactions}/${id}`);
    } catch (error) {
      console.error(`Error deleting transaction with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Categorizes a transaction using the ML-powered categorization service
   * @param transactionData - Object containing the transaction data to be categorized
   * @returns Promise resolving to the predicted category
   */
  async categorizeTransaction(transactionData: object): Promise<string> {
    try {
      const response = await api.post(apiEndpoints.transactionCategorization, transactionData);
      return response.data.category;
    } catch (error) {
      console.error('Error categorizing transaction:', error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();

// Human tasks:
// TODO: Implement caching for frequently accessed transactions (Optional)
// TODO: Add support for bulk transaction operations (Optional)
// TODO: Implement transaction sync with external financial institutions (Required)