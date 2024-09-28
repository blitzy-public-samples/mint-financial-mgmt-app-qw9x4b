import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CreditScore, CreditScoreHistory, CreditFactor, CreditScoreSimulation } from '../../types/creditScore.types';
import { getCreditScore, getCreditScoreHistory, getCreditFactors, simulateCreditScoreChange } from '../../services/creditScore.service';

// Define the state type
interface CreditScoreState {
  currentScore: CreditScore | null;
  history: CreditScoreHistory[];
  factors: CreditFactor[];
  simulation: CreditScoreSimulation | null;
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: CreditScoreState = {
  currentScore: null,
  history: [],
  factors: [],
  simulation: null,
  loading: false,
  error: null,
};

// Create async thunks
export const fetchCreditScore = createAsyncThunk(
  'creditScore/fetchCreditScore',
  async () => {
    const response = await getCreditScore();
    return response;
  }
);

export const fetchCreditScoreHistory = createAsyncThunk(
  'creditScore/fetchCreditScoreHistory',
  async (params?: object) => {
    const response = await getCreditScoreHistory(params);
    return response;
  }
);

export const fetchCreditFactors = createAsyncThunk(
  'creditScore/fetchCreditFactors',
  async () => {
    const response = await getCreditFactors();
    return response;
  }
);

export const simulateCreditScore = createAsyncThunk(
  'creditScore/simulateCreditScore',
  async (simulationParams: object) => {
    const response = await simulateCreditScoreChange(simulationParams);
    return response;
  }
);

// Create the slice
const creditScoreSlice = createSlice({
  name: 'creditScore',
  initialState,
  reducers: {
    resetCreditScoreState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreditScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditScore.fulfilled, (state, action: PayloadAction<CreditScore>) => {
        state.loading = false;
        state.currentScore = action.payload;
      })
      .addCase(fetchCreditScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch credit score';
      })
      .addCase(fetchCreditScoreHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditScoreHistory.fulfilled, (state, action: PayloadAction<CreditScoreHistory[]>) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchCreditScoreHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch credit score history';
      })
      .addCase(fetchCreditFactors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditFactors.fulfilled, (state, action: PayloadAction<CreditFactor[]>) => {
        state.loading = false;
        state.factors = action.payload;
      })
      .addCase(fetchCreditFactors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch credit factors';
      })
      .addCase(simulateCreditScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(simulateCreditScore.fulfilled, (state, action: PayloadAction<CreditScoreSimulation>) => {
        state.loading = false;
        state.simulation = action.payload;
      })
      .addCase(simulateCreditScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to simulate credit score';
      });
  },
});

// Export actions
export const { resetCreditScoreState } = creditScoreSlice.actions;

// Export reducer
export const creditScoreReducer = creditScoreSlice.reducer;

// Export selector
export const selectCreditScore = (state: { creditScore: CreditScoreState }) => state.creditScore;

// Export all actions
export const creditScoreActions = {
  fetchCreditScore,
  fetchCreditScoreHistory,
  fetchCreditFactors,
  simulateCreditScore,
  resetCreditScoreState,
};

// Human tasks
/*
TODO: Implement proper error handling and error messages for failed API calls (Required)
TODO: Add data validation for simulation parameters in the simulateCreditScore thunk (Required)
TODO: Optimize state updates to prevent unnecessary re-renders (Optional)
*/