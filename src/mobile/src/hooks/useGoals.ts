import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Goal } from '../types/goal.types';
import { RootState } from '../store';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../store/slices/goalSlice';
import { goalService } from '../services/goal.service';

export const useGoals = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const goals = useSelector((state: RootState) => state.goals.goals);

  const fetchGoalsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(fetchGoals());
    } catch (err) {
      setError('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const createNewGoal = useCallback(async (goalData: Partial<Goal>) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(createGoal(goalData));
    } catch (err) {
      setError('Failed to create goal');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const updateExistingGoal = useCallback(async (goalId: string, goalData: Partial<Goal>) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(updateGoal({ id: goalId, ...goalData }));
    } catch (err) {
      setError('Failed to update goal');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const deleteExistingGoal = useCallback(async (goalId: string) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(deleteGoal(goalId));
    } catch (err) {
      setError('Failed to delete goal');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const calculateGoalProgress = useCallback((goal: Goal) => {
    return goalService.calculateProgress(goal);
  }, []);

  useEffect(() => {
    fetchGoalsData();
  }, [fetchGoalsData]);

  return {
    goals,
    loading,
    error,
    fetchGoals: fetchGoalsData,
    createGoal: createNewGoal,
    updateGoal: updateExistingGoal,
    deleteGoal: deleteExistingGoal,
    calculateGoalProgress,
  };
};

// Human tasks:
// TODO: Implement error handling and retry logic for API calls
// TODO: Add unit tests for the useGoals hook
// TODO: Implement caching mechanism for goals data to improve performance