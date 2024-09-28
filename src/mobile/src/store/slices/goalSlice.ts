import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Assuming the structure of the Goal type
interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

interface GoalState {
  goals: Goal[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GoalState = {
  goals: [],
  status: 'idle',
  error: null,
};

export const fetchGoals = createAsyncThunk<Goal[]>(
  'goals/fetchGoals',
  async () => {
    // TODO: Implement API call to fetch user's goals
    const response = await fetch('/api/goals');
    if (!response.ok) {
      throw new Error('Failed to fetch goals');
    }
    return response.json();
  }
);

export const addGoal = createAsyncThunk<Goal, Omit<Goal, 'id'>>(
  'goals/addGoal',
  async (newGoal) => {
    // TODO: Implement API call to add a new goal
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGoal),
    });
    if (!response.ok) {
      throw new Error('Failed to add goal');
    }
    return response.json();
  }
);

export const updateGoal = createAsyncThunk<Goal, Goal>(
  'goals/updateGoal',
  async (updatedGoal) => {
    // TODO: Implement API call to update the goal
    const response = await fetch(`/api/goals/${updatedGoal.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGoal),
    });
    if (!response.ok) {
      throw new Error('Failed to update goal');
    }
    return response.json();
  }
);

export const deleteGoal = createAsyncThunk<string, string>(
  'goals/deleteGoal',
  async (goalId) => {
    // TODO: Implement API call to delete the goal
    const response = await fetch(`/api/goals/${goalId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete goal');
    }
    return goalId;
  }
);

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch goals';
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex((goal) => goal.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((goal) => goal.id !== action.payload);
      });
  },
});

export const selectGoals = (state: RootState) => state.goals.goals;
export const selectGoalsStatus = (state: RootState) => state.goals.status;
export const selectGoalsError = (state: RootState) => state.goals.error;

export default goalSlice.reducer;

// Human tasks:
// TODO: Implement error handling for API calls in async thunks
// TODO: Add unit tests for the goalSlice reducers and async thunks