import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState } from '../store';
import { Budget } from '../types/budget.types';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '../store/slices/budgetSlice';

/**
 * A custom hook that provides budget-related functionality and state management.
 * @returns An object containing budget state and functions for managing budgets
 */
export const useBudgets = () => {
  const dispatch = useDispatch();
  const { budgets, loading, error } = useSelector((state: RootState) => state.budget);

  const fetchBudgetsCallback = useCallback(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  const createBudgetCallback = useCallback((budget: Omit<Budget, 'id'>) => {
    dispatch(createBudget(budget));
  }, [dispatch]);

  const updateBudgetCallback = useCallback((budget: Budget) => {
    dispatch(updateBudget(budget));
  }, [dispatch]);

  const deleteBudgetCallback = useCallback((budgetId: string) => {
    dispatch(deleteBudget(budgetId));
  }, [dispatch]);

  return {
    budgets,
    loading,
    error,
    fetchBudgets: fetchBudgetsCallback,
    createBudget: createBudgetCallback,
    updateBudget: updateBudgetCallback,
    deleteBudget: deleteBudgetCallback,
  };
};

// Human tasks:
// 1. Implement the budget.service.ts file for API calls related to budgets
// 2. Create and define the Budget type in the budget.types.ts file
// 3. Implement the budgetSlice in the Redux store