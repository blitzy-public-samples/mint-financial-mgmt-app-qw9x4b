import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Assuming the structure of the Account type based on the specification
interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  // Add other relevant fields as needed
}

interface AccountState {
  accounts: Account[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  status: 'idle',
  error: null,
};

// Async thunk for fetching user accounts
export const fetchAccounts = createAsyncThunk<Account[], void, { rejectValue: string }>(
  'account/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement API call to fetch user accounts
      const response = await fetch('/api/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to fetch accounts');
    }
  }
);

// Async thunk for adding a new account
export const addAccount = createAsyncThunk<Account, Account, { rejectValue: string }>(
  'account/addAccount',
  async (newAccount, { rejectWithValue }) => {
    try {
      // TODO: Implement API call to add a new account
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount),
      });
      if (!response.ok) {
        throw new Error('Failed to add account');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to add account');
    }
  }
);

// Async thunk for updating an existing account
export const updateAccount = createAsyncThunk<Account, Account, { rejectValue: string }>(
  'account/updateAccount',
  async (updatedAccount, { rejectWithValue }) => {
    try {
      // TODO: Implement API call to update the account
      const response = await fetch(`/api/accounts/${updatedAccount.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAccount),
      });
      if (!response.ok) {
        throw new Error('Failed to update account');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to update account');
    }
  }
);

// Async thunk for deleting an account
export const deleteAccount = createAsyncThunk<string, string, { rejectValue: string }>(
  'account/deleteAccount',
  async (accountId, { rejectWithValue }) => {
    try {
      // TODO: Implement API call to delete the account
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      return accountId;
    } catch (error) {
      return rejectWithValue('Failed to delete account');
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    addAccountToList: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
    updateAccountInList: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(account => account.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    removeAccountFromList: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(account => account.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch accounts';
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(account => account.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(account => account.id !== action.payload);
      });
  },
});

export const { setAccounts, addAccountToList, updateAccountInList, removeAccountFromList } = accountSlice.actions;

export const selectAccounts = (state: RootState) => state.account.accounts;
export const selectAccountStatus = (state: RootState) => state.account.status;
export const selectAccountError = (state: RootState) => state.account.error;

export default accountSlice.reducer;

// Human tasks:
// TODO: Implement error handling and logging for API calls in async thunks
// TODO: Add unit tests for reducers and async thunks
// TODO: Implement caching strategy for account data to reduce API calls