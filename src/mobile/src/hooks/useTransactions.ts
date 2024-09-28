import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { transactionService } from '../services/transaction.service';
import { Transaction } from '../types/transaction.types';

interface UseTransactionsResult {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactions = (): UseTransactionsResult => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const transactions = useSelector((state: any) => state.transactions.transactions);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTransactions = await transactionService.getTransactions();
      dispatch({ type: 'SET_TRANSACTIONS', payload: fetchedTransactions });
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const createTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newTransaction = await transactionService.createTransaction(transaction);
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    } catch (err) {
      setError('Failed to create transaction. Please try again.');
      console.error('Error creating transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTransaction = await transactionService.updateTransaction(id, transaction);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
    } catch (err) {
      setError('Failed to update transaction. Please try again.');
      console.error('Error updating transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await transactionService.deleteTransaction(id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
      console.error('Error deleting transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

// Human tasks:
// TODO: Implement error handling and retry logic for API calls
// TODO: Add pagination support for fetching transactions
// TODO: Implement caching mechanism for better performance