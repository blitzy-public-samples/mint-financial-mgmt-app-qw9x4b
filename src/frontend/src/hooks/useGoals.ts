import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { goalActions } from '../store/slices/goalSlice';
import { GoalService } from '../services/goal.service';
import { Goal } from '../types/goal.types';

const goalService = new GoalService();

export const useGoals = () => {
  const dispatch = useDispatch();
  const goals = useSelector((state: RootState) => state.goals.goals);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedGoals = await goalService.getGoals();
      dispatch(goalActions.setGoals(fetchedGoals));
    } catch (err) {
      setError('Failed to fetch goals. Please try again.');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const createGoal = useCallback(async (goal: Omit<Goal, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newGoal = await goalService.createGoal(goal);
      dispatch(goalActions.addGoal(newGoal));
    } catch (err) {
      setError('Failed to create goal. Please try again.');
      console.error('Error creating goal:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const updateGoal = useCallback(async (goal: Goal) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGoal = await goalService.updateGoal(goal);
      dispatch(goalActions.updateGoal(updatedGoal));
    } catch (err) {
      setError('Failed to update goal. Please try again.');
      console.error('Error updating goal:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const deleteGoal = useCallback(async (goalId: string) => {
    setLoading(true);
    setError(null);
    try {
      await goalService.deleteGoal(goalId);
      dispatch(goalActions.deleteGoal(goalId));
    } catch (err) {
      setError('Failed to delete goal. Please try again.');
      console.error('Error deleting goal:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
};

export default useGoals;

// TODO: Implement error handling and retry logic for API calls
// TODO: Add unit tests for the useGoals hook
// TODO: Implement caching mechanism for goals data