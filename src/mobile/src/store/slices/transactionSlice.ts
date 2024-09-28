import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types/transaction.types';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  categorizeTransaction
} from '../../services/transaction.service';

// Define the state type for the transaction slice
interface TransactionState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: TransactionState = {
  transactions: [],
  currentTransaction: null,
  loading: false,
  error: null,
};

// Async thunk for fetching all transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (filters: object, { rejectWithValue }) => {
    try {
      const response = await getTransactions(filters);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch transactions');
    }
  }
);

// Async thunk for fetching a single transaction by ID
export const fetchTransactionById = createAsyncThunk(
  'transactions/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getTransactionById(id);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch transaction');
    }
  }
);

// Async thunk for creating a new transaction
export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (transactionData: Partial<Transaction>, { rejectWithValue }) => {
    try {
      const response = await createTransaction(transactionData);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to create transaction');
    }
  }
);

// Async thunk for updating an existing transaction
export const updateTransactionById = createAsyncThunk(
  'transactions/update',
  async ({ id, transactionData }: { id: string; transactionData: Partial<Transaction> }, { rejectWithValue }) => {
    try {
      const response = await updateTransaction(id, transactionData);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to update transaction');
    }
  }
);

// Async thunk for deleting a transaction
export const deleteTransactionById = createAsyncThunk(
  'transactions/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTransaction(id);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete transaction');
    }
  }
);

// Async thunk for categorizing a transaction
export const categorizeTransactionData = createAsyncThunk(
  'transactions/categorize',
  async (transactionData: Partial<Transaction>, { rejectWithValue }) => {
    try {
      const response = await categorizeTransaction(transactionData);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to categorize transaction');
    }
  }
);

// Create the transaction slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch transaction by ID
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add new transaction
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.transactions.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update transaction
      .addCase(updateTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransactionById.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete transaction
      .addCase(deleteTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransactionById.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Categorize transaction
      .addCase(categorizeTransactionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(categorizeTransactionData.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Assuming the action.payload is the predicted category
        // You might want to update the current transaction or do something else with the category
      })
      .addCase(categorizeTransactionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;

// Selector functions
export const selectAllTransactions = (state: { transactions: TransactionState }) => state.transactions.transactions;
export const selectCurrentTransaction = (state: { transactions: TransactionState }) => state.transactions.currentTransaction;
export const selectTransactionLoading = (state: { transactions: TransactionState }) => state.transactions.loading;
export const selectTransactionError = (state: { transactions: TransactionState }) => state.transactions.error;

// Human tasks:
// TODO: Implement error handling for async thunks
// TODO: Add unit tests for the transaction slice
// TODO: Implement optimistic updates for better user experience