import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accountService } from '../services/account.service';
import { useAuth } from './useAuth';
import { RootState } from '../store';
import { Account } from '../types/account.types';

interface UseAccountsReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  addAccount: (accountData: Partial<Account>) => Promise<void>;
  updateAccount: (accountId: string, accountData: Partial<Account>) => Promise<void>;
  deleteAccount: (accountId: string) => Promise<void>;
}

export const useAccounts = (): UseAccountsReturn => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedAccounts = await accountService.getAccounts(token);
      dispatch({ type: 'accounts/setAccounts', payload: fetchedAccounts });
    } catch (err) {
      setError('Failed to fetch accounts. Please try again.');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, token]);

  const addAccount = async (accountData: Partial<Account>) => {
    setLoading(true);
    setError(null);
    try {
      const newAccount = await accountService.addAccount(token, accountData);
      dispatch({ type: 'accounts/addAccount', payload: newAccount });
    } catch (err) {
      setError('Failed to add account. Please try again.');
      console.error('Error adding account:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (accountId: string, accountData: Partial<Account>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAccount = await accountService.updateAccount(token, accountId, accountData);
      dispatch({ type: 'accounts/updateAccount', payload: updatedAccount });
    } catch (err) {
      setError('Failed to update account. Please try again.');
      console.error('Error updating account:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (accountId: string) => {
    setLoading(true);
    setError(null);
    try {
      await accountService.deleteAccount(token, accountId);
      dispatch({ type: 'accounts/deleteAccount', payload: accountId });
    } catch (err) {
      setError('Failed to delete account. Please try again.');
      console.error('Error deleting account:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
};

// TODO: Implement error handling and retry logic for API calls
// TODO: Add unit tests for the useAccounts hook
// TODO: Implement caching mechanism for account data