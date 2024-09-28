import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Budget, CreateBudgetDTO, UpdateBudgetDTO } from '../../types/budget.types';
import * as budgetService from '../../services/budget.service';

interface BudgetState {
  budgets: Budget[];
  currentBudget: Budget | null;
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  currentBudget: null,
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk<Budget[]>(
  'budget/fetchBudgets',
  async () => {
    const budgets = await budgetService.getBudgets();
    return budgets;
  }
);

export const fetchBudgetById = createAsyncThunk<Budget, string>(
  'budget/fetchBudgetById',
  async (budgetId) => {
    const budget = await budgetService.getBudgetById(budgetId);
    return budget;
  }
);

export const createBudget = createAsyncThunk<Budget, CreateBudgetDTO>(
  'budget/createBudget',
  async (budgetData) => {
    const newBudget = await budgetService.createBudget(budgetData);
    return newBudget;
  }
);

export const updateBudget = createAsyncThunk<Budget, { budgetId: string; budgetData: UpdateBudgetDTO }>(
  'budget/updateBudget',
  async ({ budgetId, budgetData }) => {
    const updatedBudget = await budgetService.updateBudget(budgetId, budgetData);
    return updatedBudget;
  }
);

export const deleteBudget = createAsyncThunk<void, string>(
  'budget/deleteBudget',
  async (budgetId) => {
    await budgetService.deleteBudget(budgetId);
  }
);

export const fetchBudgetProgress = createAsyncThunk<{ current: number; target: number; percentage: number }, string>(
  'budget/fetchBudgetProgress',
  async (budgetId) => {
    const progress = await budgetService.getBudgetProgress(budgetId);
    return progress;
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action: PayloadAction<Budget[]>) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch budgets';
      })
      .addCase(fetchBudgetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetById.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.loading = false;
        state.currentBudget = action.payload;
      })
      .addCase(fetchBudgetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch budget';
      })
      .addCase(createBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.loading = false;
        state.budgets.push(action.payload);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create budget';
      })
      .addCase(updateBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.loading = false;
        const index = state.budgets.findIndex(budget => budget.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
        if (state.currentBudget && state.currentBudget.id === action.payload.id) {
          state.currentBudget = action.payload;
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update budget';
      })
      .addCase(deleteBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action: PayloadAction<void, string, { arg: string }>) => {
        state.loading = false;
        state.budgets = state.budgets.filter(budget => budget.id !== action.meta.arg);
        if (state.currentBudget && state.currentBudget.id === action.meta.arg) {
          state.currentBudget = null;
        }
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete budget';
      })
      .addCase(fetchBudgetProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetProgress.fulfilled, (state, action: PayloadAction<{ current: number; target: number; percentage: number }>) => {
        state.loading = false;
        if (state.currentBudget) {
          state.currentBudget.progress = action.payload;
        }
      })
      .addCase(fetchBudgetProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch budget progress';
      });
  },
});

export const budgetActions = budgetSlice.actions;
export const budgetReducer = budgetSlice.reducer;

// Selector functions for efficient state access
export const selectAllBudgets = (state: { budget: BudgetState }) => state.budget.budgets;
export const selectCurrentBudget = (state: { budget: BudgetState }) => state.budget.currentBudget;
export const selectBudgetLoading = (state: { budget: BudgetState }) => state.budget.loading;
export const selectBudgetError = (state: { budget: BudgetState }) => state.budget.error;

export default budgetSlice;