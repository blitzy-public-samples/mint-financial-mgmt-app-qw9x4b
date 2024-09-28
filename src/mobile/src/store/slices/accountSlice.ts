import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AccountState, Account } from '../types/account.types';
import { accountService } from '../../services/account.service';

// Define initial state
const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAccounts = createAsyncThunk<Account[], void>(
  'accounts/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const accounts = await accountService.fetchAccounts();
      return accounts;
    } catch (error) {
      return rejectWithValue('Failed to fetch accounts');
    }
  }
);

export const addAccount = createAsyncThunk<Account, Account>(
  'accounts/addAccount',
  async (newAccount, { rejectWithValue }) => {
    try {
      const account = await accountService.addAccount(newAccount);
      return account;
    } catch (error) {
      return rejectWithValue('Failed to add account');
    }
  }
);

export const updateAccount = createAsyncThunk<Account, Account>(
  'accounts/updateAccount',
  async (updatedAccount, { rejectWithValue }) => {
    try {
      const account = await accountService.updateAccount(updatedAccount);
      return account;
    } catch (error) {
      return rejectWithValue('Failed to update account');
    }
  }
);

export const deleteAccount = createAsyncThunk<string, string>(
  'accounts/deleteAccount',
  async (accountId, { rejectWithValue }) => {
    try {
      await accountService.deleteAccount(accountId);
      return accountId;
    } catch (error) {
      return rejectWithValue('Failed to delete account');
    }
  }
);

// Create the account slice
const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<Account[]>) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAccount.fulfilled, (state, action: PayloadAction<Account>) => {
        state.accounts.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action: PayloadAction<Account>) => {
        const index = state.accounts.findIndex(account => account.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action: PayloadAction<string>) => {
        state.accounts = state.accounts.filter(account => account.id !== action.payload);
      });
  },
});

export default accountSlice.reducer;

// Selectors
export const selectAccounts = (state: { accounts: AccountState }) => state.accounts.accounts;
export const selectAccountsLoading = (state: { accounts: AccountState }) => state.accounts.loading;
export const selectAccountsError = (state: { accounts: AccountState }) => state.accounts.error;

// Human tasks:
// TODO: Implement error handling for async thunks
// TODO: Add unit tests for the account slice