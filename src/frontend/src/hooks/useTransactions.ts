import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { transactionService } from '../services/transaction.service';
import {
  setTransactions,
  addTransaction,
  updateTransaction as updateTransactionInStore,
  deleteTransaction as deleteTransactionFromStore,
} from '../store/slices/transactionSlice';
import { Transaction, TransactionFilters } from '../types/transaction.types';
import { RootState } from '../store';

const TRANSACTIONS_PER_PAGE = 20;

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;
  fetchTransactions: () => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TransactionFilters>) => void;
}

export const useTransactions = (): UseTransactionsReturn => {
  const dispatch = useDispatch();
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({});

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTransactions = await transactionService.getTransactions(filters, TRANSACTIONS_PER_PAGE);
      dispatch(setTransactions(fetchedTransactions));
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, filters]);

  const createTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newTransaction = await transactionService.createTransaction(transaction);
      dispatch(addTransaction(newTransaction));
    } catch (err) {
      setError('Failed to create transaction. Please try again.');
      console.error('Error creating transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTransaction = await transactionService.updateTransaction(id, updates);
      dispatch(updateTransactionInStore(updatedTransaction));
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
      dispatch(deleteTransactionFromStore(id));
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
      console.error('Error deleting transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<TransactionFilters>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    filters,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters: updateFilters,
  };
};

export default useTransactions;

// TODO: Implement error handling and retry logic for API calls
// TODO: Add unit tests for the useTransactions hook
// TODO: Implement pagination logic for fetching transactions
// TODO: Add support for transaction categorization