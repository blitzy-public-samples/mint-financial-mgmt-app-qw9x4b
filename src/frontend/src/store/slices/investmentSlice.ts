import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  InvestmentState,
  Investment,
  InvestmentOverview,
  InvestmentDetails,
  InvestmentPerformance,
  InvestmentRecommendation
} from '../../types/investment.types';
import {
  getInvestmentOverview,
  getInvestmentDetails,
  addInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentPerformance,
  getInvestmentRecommendations
} from '../../services/investment.service';

// Initial state
const initialState: InvestmentState = {
  overview: null,
  investments: [],
  currentInvestment: null,
  performance: null,
  recommendations: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchInvestmentOverview = createAsyncThunk(
  'investment/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const overview = await getInvestmentOverview();
      return overview;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInvestmentDetails = createAsyncThunk(
  'investment/fetchDetails',
  async (investmentId: string, { rejectWithValue }) => {
    try {
      const details = await getInvestmentDetails(investmentId);
      return details;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createInvestment = createAsyncThunk(
  'investment/create',
  async (newInvestment: Partial<Investment>, { rejectWithValue }) => {
    try {
      const investment = await addInvestment(newInvestment);
      return investment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInvestmentData = createAsyncThunk(
  'investment/update',
  async ({ investmentId, updatedInvestment }: { investmentId: string, updatedInvestment: Partial<Investment> }, { rejectWithValue }) => {
    try {
      const investment = await updateInvestment(investmentId, updatedInvestment);
      return investment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeInvestment = createAsyncThunk(
  'investment/remove',
  async (investmentId: string, { rejectWithValue }) => {
    try {
      await deleteInvestment(investmentId);
      return investmentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInvestmentPerformance = createAsyncThunk(
  'investment/fetchPerformance',
  async ({ investmentId, timeFrame }: { investmentId: string, timeFrame: string }, { rejectWithValue }) => {
    try {
      const performance = await getInvestmentPerformance(investmentId, timeFrame);
      return performance;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInvestmentRecommendations = createAsyncThunk(
  'investment/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const recommendations = await getInvestmentRecommendations();
      return recommendations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestmentOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestmentOverview.fulfilled, (state, action: PayloadAction<InvestmentOverview>) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchInvestmentOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInvestmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestmentDetails.fulfilled, (state, action: PayloadAction<InvestmentDetails>) => {
        state.loading = false;
        state.currentInvestment = action.payload;
      })
      .addCase(fetchInvestmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createInvestment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvestment.fulfilled, (state, action: PayloadAction<Investment>) => {
        state.loading = false;
        state.investments.push(action.payload);
      })
      .addCase(createInvestment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateInvestmentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvestmentData.fulfilled, (state, action: PayloadAction<Investment>) => {
        state.loading = false;
        const index = state.investments.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.investments[index] = action.payload;
        }
      })
      .addCase(updateInvestmentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeInvestment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeInvestment.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.investments = state.investments.filter(inv => inv.id !== action.payload);
      })
      .addCase(removeInvestment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInvestmentPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestmentPerformance.fulfilled, (state, action: PayloadAction<InvestmentPerformance>) => {
        state.loading = false;
        state.performance = action.payload;
      })
      .addCase(fetchInvestmentPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInvestmentRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestmentRecommendations.fulfilled, (state, action: PayloadAction<InvestmentRecommendation[]>) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchInvestmentRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const investmentActions = investmentSlice.actions;
export const investmentReducer = investmentSlice.reducer;

// Selectors
export const selectInvestmentState = (state: { investment: InvestmentState }) => state.investment;
export const selectInvestmentOverview = (state: { investment: InvestmentState }) => state.investment.overview;
export const selectInvestments = (state: { investment: InvestmentState }) => state.investment.investments;
export const selectCurrentInvestment = (state: { investment: InvestmentState }) => state.investment.currentInvestment;
export const selectInvestmentPerformance = (state: { investment: InvestmentState }) => state.investment.performance;
export const selectInvestmentRecommendations = (state: { investment: InvestmentState }) => state.investment.recommendations;
export const selectInvestmentLoading = (state: { investment: InvestmentState }) => state.investment.loading;
export const selectInvestmentError = (state: { investment: InvestmentState }) => state.investment.error;

export default investmentSlice;

// Human tasks:
// TODO: Implement error handling for async thunks
// TODO: Add unit tests for reducers and async thunks
// TODO: Optimize state updates for better performance