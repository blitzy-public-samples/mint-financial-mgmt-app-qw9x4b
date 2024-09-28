import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Assuming the structure of the Budget type
interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: string;
  startDate: string;
  endDate: string;
}

interface BudgetState {
  budgets: Budget[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  status: 'idle',
  error: null,
};

export const fetchBudgets = createAsyncThunk<Budget[]>(
  'budgets/fetchBudgets',
  async () => {
    // TODO: Implement API call to fetch budgets
    const response = await fetch('/api/budgets');
    return response.json();
  }
);

export const createBudget = createAsyncThunk<Budget, Omit<Budget, 'id'>>(
  'budgets/createBudget',
  async (newBudget) => {
    // TODO: Implement API call to create a new budget
    const response = await fetch('/api/budgets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBudget),
    });
    return response.json();
  }
);

export const updateBudget = createAsyncThunk<Budget, Budget>(
  'budgets/updateBudget',
  async (updatedBudget) => {
    // TODO: Implement API call to update the budget
    const response = await fetch(`/api/budgets/${updatedBudget.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBudget),
    });
    return response.json();
  }
);

export const deleteBudget = createAsyncThunk<string, string>(
  'budgets/deleteBudget',
  async (budgetId) => {
    // TODO: Implement API call to delete the budget
    await fetch(`/api/budgets/${budgetId}`, {
      method: 'DELETE',
    });
    return budgetId;
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBudgets.fulfilled, (state, action: PayloadAction<Budget[]>) => {
        state.status = 'succeeded';
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch budgets';
      })
      .addCase(createBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.budgets.push(action.payload);
      })
      .addCase(updateBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        const index = state.budgets.findIndex((budget) => budget.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(deleteBudget.fulfilled, (state, action: PayloadAction<string>) => {
        state.budgets = state.budgets.filter((budget) => budget.id !== action.payload);
      });
  },
});

export const budgetReducer = budgetSlice.reducer;

export const selectBudgets = (state: RootState) => state.budgets.budgets;
export const selectBudgetById = (state: RootState, budgetId: string) =>
  state.budgets.budgets.find((budget) => budget.id === budgetId);
export const selectBudgetStatus = (state: RootState) => state.budgets.status;
export const selectBudgetError = (state: RootState) => state.budgets.error;

export const budgetActions = {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};

export default budgetSlice;
```

This implementation creates a Redux slice for managing budget-related state in the Mint Replica frontend application. It includes reducers and actions for CRUD operations on budgets, as specified in the JSON representation.

Here's a breakdown of the implemented features:

1. We've defined the `Budget` interface based on assumptions from the context.
2. The `BudgetState` interface represents the structure of the budget slice state.
3. Async thunks are implemented for fetching, creating, updating, and deleting budgets.
4. The `budgetSlice` is created using `createSlice`, with extra reducers to handle the async thunk actions.
5. Selector functions are exported to easily access budget data from the state.
6. The `budgetActions` object is exported, containing all the action creators for the budget slice.

Note that the API calls in the async thunks are placeholder implementations and should be replaced with actual API calls to your backend service.

Human tasks mentioned in the specification have been added as comments:

```typescript
// TODO: Implement error handling and logging for API calls in async thunks
// TODO: Add unit tests for reducers, selectors, and async thunks
// TODO: Implement optimistic updates for better user experience