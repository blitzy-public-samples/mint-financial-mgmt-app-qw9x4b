import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accountService } from '../services/account.service';
import { useAuth } from './useAuth';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface UseAccountsReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  createAccount: (accountData: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (id: string, accountData: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

export const useAccounts = (): UseAccountsReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { token } = useAuth();

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedAccounts = await accountService.getAccounts(token);
      setAccounts(fetchedAccounts);
      dispatch({ type: 'SET_ACCOUNTS', payload: fetchedAccounts });
    } catch (err) {
      setError('Failed to fetch accounts. Please try again.');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, token]);

  const createAccount = async (accountData: Omit<Account, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newAccount = await accountService.createAccount(token, accountData);
      setAccounts(prevAccounts => [...prevAccounts, newAccount]);
      dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error('Error creating account:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (id: string, accountData: Partial<Account>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAccount = await accountService.updateAccount(token, id, accountData);
      setAccounts(prevAccounts =>
        prevAccounts.map(account => (account.id === id ? updatedAccount : account))
      );
      dispatch({ type: 'UPDATE_ACCOUNT', payload: updatedAccount });
    } catch (err) {
      setError('Failed to update account. Please try again.');
      console.error('Error updating account:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await accountService.deleteAccount(token, id);
      setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id));
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    } catch (err) {
      setError('Failed to delete account. Please try again.');
      console.error('Error deleting account:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAccounts();
    }
  }, [fetchAccounts, token]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
};

// Human tasks:
// TODO: Implement error handling and retry logic for network requests
// TODO: Add pagination support for fetching accounts if the list becomes large
// TODO: Implement caching mechanism to improve performance and reduce API calls