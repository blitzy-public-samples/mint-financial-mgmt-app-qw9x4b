import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Investment, InvestmentPortfolio, InvestmentTransaction } from '../../types/investment.types';
import investmentService from '../../services/investment.service';

interface InvestmentState {
  portfolio: InvestmentPortfolio | null;
  investments: Investment[];
  transactions: InvestmentTransaction[];
  selectedInvestment: Investment | null;
  loading: {
    portfolio: boolean;
    investments: boolean;
    transactions: boolean;
    addInvestment: boolean;
    updateInvestment: boolean;
    deleteInvestment: boolean;
    performance: boolean;
  };
  error: string | null;
}

const initialState: InvestmentState = {
  portfolio: null,
  investments: [],
  transactions: [],
  selectedInvestment: null,
  loading: {
    portfolio: false,
    investments: false,
    transactions: false,
    addInvestment: false,
    updateInvestment: false,
    deleteInvestment: false,
    performance: false,
  },
  error: null,
};

export const fetchInvestmentPortfolio = createAsyncThunk(
  'investment/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const portfolio = await investmentService.getInvestmentPortfolio();
      return portfolio;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchInvestmentDetails = createAsyncThunk(
  'investment/fetchDetails',
  async (investmentId: string, { rejectWithValue }) => {
    try {
      const investment = await investmentService.getInvestmentDetails(investmentId);
      return investment;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchInvestmentTransactions = createAsyncThunk(
  'investment/fetchTransactions',
  async ({ investmentId, params }: { investmentId: string; params: object }, { rejectWithValue }) => {
    try {
      const transactions = await investmentService.getInvestmentTransactions(investmentId, params);
      return transactions;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addInvestment = createAsyncThunk(
  'investment/addInvestment',
  async (investmentData: object, { rejectWithValue }) => {
    try {
      const newInvestment = await investmentService.addInvestment(investmentData);
      return newInvestment;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateInvestment = createAsyncThunk(
  'investment/updateInvestment',
  async ({ investmentId, investmentData }: { investmentId: string; investmentData: object }, { rejectWithValue }) => {
    try {
      const updatedInvestment = await investmentService.updateInvestment(investmentId, investmentData);
      return updatedInvestment;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteInvestment = createAsyncThunk(
  'investment/deleteInvestment',
  async (investmentId: string, { rejectWithValue }) => {
    try {
      await investmentService.deleteInvestment(investmentId);
      return investmentId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchInvestmentPerformance = createAsyncThunk(
  'investment/fetchPerformance',
  async (params: object, { rejectWithValue }) => {
    try {
      const performanceData = await investmentService.getInvestmentPerformance(params);
      return performanceData;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestmentPortfolio.pending, (state) => {
        state.loading.portfolio = true;
        state.error = null;
      })
      .addCase(fetchInvestmentPortfolio.fulfilled, (state, action: PayloadAction<InvestmentPortfolio>) => {
        state.loading.portfolio = false;
        state.portfolio = action.payload;
      })
      .addCase(fetchInvestmentPortfolio.rejected, (state, action) => {
        state.loading.portfolio = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInvestmentDetails.pending, (state) => {
        state.loading.investments = true;
        state.error = null;
      })
      .addCase(fetchInvestmentDetails.fulfilled, (state, action: PayloadAction<Investment>) => {
        state.loading.investments = false;
        state.selectedInvestment = action.payload;
      })
      .addCase(fetchInvestmentDetails.rejected, (state, action) => {
        state.loading.investments = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInvestmentTransactions.pending, (state) => {
        state.loading.transactions = true;
        state.error = null;
      })
      .addCase(fetchInvestmentTransactions.fulfilled, (state, action: PayloadAction<InvestmentTransaction[]>) => {
        state.loading.transactions = false;
        state.transactions = action.payload;
      })
      .addCase(fetchInvestmentTransactions.rejected, (state, action) => {
        state.loading.transactions = false;
        state.error = action.payload as string;
      })
      .addCase(addInvestment.pending, (state) => {
        state.loading.addInvestment = true;
        state.error = null;
      })
      .addCase(addInvestment.fulfilled, (state, action: PayloadAction<Investment>) => {
        state.loading.addInvestment = false;
        state.investments.push(action.payload);
      })
      .addCase(addInvestment.rejected, (state, action) => {
        state.loading.addInvestment = false;
        state.error = action.payload as string;
      })
      .addCase(updateInvestment.pending, (state) => {
        state.loading.updateInvestment = true;
        state.error = null;
      })
      .addCase(updateInvestment.fulfilled, (state, action: PayloadAction<Investment>) => {
        state.loading.updateInvestment = false;
        const index = state.investments.findIndex((inv) => inv.id === action.payload.id);
        if (index !== -1) {
          state.investments[index] = action.payload;
        }
      })
      .addCase(updateInvestment.rejected, (state, action) => {
        state.loading.updateInvestment = false;
        state.error = action.payload as string;
      })
      .addCase(deleteInvestment.pending, (state) => {
        state.loading.deleteInvestment = true;
        state.error = null;
      })
      .addCase(deleteInvestment.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading.deleteInvestment = false;
        state.investments = state.investments.filter((inv) => inv.id !== action.payload);
      })
      .addCase(deleteInvestment.rejected, (state, action) => {
        state.loading.deleteInvestment = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInvestmentPerformance.pending, (state) => {
        state.loading.performance = true;
        state.error = null;
      })
      .addCase(fetchInvestmentPerformance.fulfilled, (state, action: PayloadAction<object>) => {
        state.loading.performance = false;
        // Handle performance data as needed
      })
      .addCase(fetchInvestmentPerformance.rejected, (state, action) => {
        state.loading.performance = false;
        state.error = action.payload as string;
      });
  },
});

export const investmentActions = investmentSlice.actions;
export const investmentReducer = investmentSlice.reducer;

// Selectors
export const selectInvestmentPortfolio = (state: { investment: InvestmentState }) => state.investment.portfolio;
export const selectInvestments = (state: { investment: InvestmentState }) => state.investment.investments;
export const selectSelectedInvestment = (state: { investment: InvestmentState }) => state.investment.selectedInvestment;
export const selectInvestmentTransactions = (state: { investment: InvestmentState }) => state.investment.transactions;
export const selectInvestmentLoading = (state: { investment: InvestmentState }) => state.investment.loading;
export const selectInvestmentError = (state: { investment: InvestmentState }) => state.investment.error;

export default investmentSlice;
```

This implementation creates a Redux slice for managing investment-related state in the Mint Replica mobile application. It includes async thunks for fetching investment portfolio, details, transactions, adding, updating, and deleting investments, as well as fetching investment performance.

The slice handles loading states for each async operation and includes error handling. Selectors are implemented for efficiently accessing investment state.

Note that this implementation assumes the existence of types and the investment service. You may need to adjust the imports and type definitions once those files are created.

Human Tasks:
```
- Implement error handling for async thunks (Required)
- Add loading states for each async operation in the slice state (Required)
- Implement selectors for efficiently accessing investment state (Optional)