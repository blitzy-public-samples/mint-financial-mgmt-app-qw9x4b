import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Goal, GoalCreationData, GoalUpdateData, GoalProgress } from '../../types/goal.types';
import { GoalService } from '../../services/goal.service';

// Initialize the GoalService
const goalService = new GoalService();

// Define the state interface
interface GoalState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  currentGoal: Goal | null;
  goalProgress: GoalProgress | null;
}

// Define the initial state
const initialState: GoalState = {
  goals: [],
  loading: false,
  error: null,
  currentGoal: null,
  goalProgress: null,
};

// Async thunks
export const fetchGoals = createAsyncThunk<Goal[]>(
  'goals/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      return await goalService.getAllGoals();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchGoalById = createAsyncThunk<Goal, string>(
  'goals/fetchGoalById',
  async (goalId, { rejectWithValue }) => {
    try {
      return await goalService.getGoalById(goalId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createGoal = createAsyncThunk<Goal, GoalCreationData>(
  'goals/createGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      return await goalService.createGoal(goalData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateGoal = createAsyncThunk<Goal, { goalId: string; goalData: GoalUpdateData }>(
  'goals/updateGoal',
  async ({ goalId, goalData }, { rejectWithValue }) => {
    try {
      return await goalService.updateGoal(goalId, goalData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteGoal = createAsyncThunk<void, string>(
  'goals/deleteGoal',
  async (goalId, { rejectWithValue }) => {
    try {
      await goalService.deleteGoal(goalId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchGoalProgress = createAsyncThunk<GoalProgress, string>(
  'goals/fetchGoalProgress',
  async (goalId, { rejectWithValue }) => {
    try {
      return await goalService.getGoalProgress(goalId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create the goal slice
const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    // Add any additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // fetchGoals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchGoalById
      .addCase(fetchGoalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoalById.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.loading = false;
        state.currentGoal = action.payload;
      })
      .addCase(fetchGoalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createGoal
      .addCase(createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.loading = false;
        state.goals.push(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateGoal
      .addCase(updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.loading = false;
        const index = state.goals.findIndex((goal) => goal.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
        if (state.currentGoal && state.currentGoal.id === action.payload.id) {
          state.currentGoal = action.payload;
        }
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteGoal
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action: PayloadAction<void>) => {
        state.loading = false;
        state.goals = state.goals.filter((goal) => goal.id !== action.meta.arg);
        if (state.currentGoal && state.currentGoal.id === action.meta.arg) {
          state.currentGoal = null;
        }
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchGoalProgress
      .addCase(fetchGoalProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoalProgress.fulfilled, (state, action: PayloadAction<GoalProgress>) => {
        state.loading = false;
        state.goalProgress = action.payload;
      })
      .addCase(fetchGoalProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default goalSlice.reducer;

// Selectors
export const selectAllGoals = (state: { goals: GoalState }) => state.goals.goals;
export const selectCurrentGoal = (state: { goals: GoalState }) => state.goals.currentGoal;
export const selectGoalProgress = (state: { goals: GoalState }) => state.goals.goalProgress;
export const selectGoalsLoading = (state: { goals: GoalState }) => state.goals.loading;
export const selectGoalsError = (state: { goals: GoalState }) => state.goals.error;

// Human tasks
/*
TODO: Implement error handling for async thunks (Required)
TODO: Add input validation for goal creation and update actions (Required)
TODO: Implement optimistic updates for better user experience (Optional)
TODO: Add unit tests for reducers and async thunks (Required)
*/