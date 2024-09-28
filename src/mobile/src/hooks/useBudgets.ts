import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Budget } from '../types/budget.types';
import * as budgetSlice from '../store/slices/budgetSlice';

interface UseBudgetsResult {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  createBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (budgetId: string) => Promise<void>;
}

export const useBudgets = (): UseBudgetsResult => {
  const dispatch = useDispatch();
  const budgets = useSelector((state: RootState) => state.budget.budgets);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(budgetSlice.fetchBudgets());
    } catch (err) {
      setError('Failed to fetch budgets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const createBudget = useCallback(async (budget: Omit<Budget, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(budgetSlice.createBudget(budget));
    } catch (err) {
      setError('Failed to create budget. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const updateBudget = useCallback(async (budget: Budget) => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(budgetSlice.updateBudget(budget));
    } catch (err) {
      setError('Failed to update budget. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const deleteBudget = useCallback(async (budgetId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(budgetSlice.deleteBudget(budgetId));
    } catch (err) {
      setError('Failed to delete budget. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return {
    budgets,
    isLoading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
};

// Human tasks:
// TODO: Implement error handling and loading states in the useBudgets hook
// TODO: Add proper type annotations for all functions and variables
// TODO: Implement caching mechanism to optimize budget data fetching