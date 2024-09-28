import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types/transaction.types';
import * as transactionService from '../../services/transaction.service';

// Define the state interface
interface TransactionState {
  transactions: Transaction[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state
const initialState: TransactionState = {
  transactions: [],
  loading: 'idle',
  error: null,
};

// Define async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: any) => {
    const response = await transactionService.getTransactions(params);
    return response;
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (newTransaction: Transaction) => {
    const response = await transactionService.addTransaction(newTransaction);
    return response;
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (updatedTransaction: Transaction) => {
    const response = await transactionService.updateTransaction(updatedTransaction);
    return response;
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transactionId: string) => {
    await transactionService.deleteTransaction(transactionId);
    return transactionId;
  }
);

// Create the slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transactions.push(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      });
  },
});

// Export the reducer
export const transactionReducer = transactionSlice.reducer;

// Export action creators
export const transactionActions = transactionSlice.actions;

// Define and export selectors
export const selectTransactions = (state: { transactions: TransactionState }) => state.transactions.transactions;
export const selectTransactionById = (state: { transactions: TransactionState }, id: string) =>
  state.transactions.transactions.find(t => t.id === id);
export const selectTransactionLoadingStatus = (state: { transactions: TransactionState }) => state.transactions.loading;
export const selectTransactionError = (state: { transactions: TransactionState }) => state.transactions.error;

// Export the slice
export default transactionSlice;

// Human tasks:
// TODO: Implement error handling and logging for failed API calls in async thunks
// TODO: Add unit tests for reducers and selectors
// TODO: Implement caching strategy for fetched transactions to improve performance