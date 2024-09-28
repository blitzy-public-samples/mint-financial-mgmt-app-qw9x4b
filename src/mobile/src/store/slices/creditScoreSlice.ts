import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Assuming the structure of CreditScore based on the slice specification
interface CreditScore {
  score: number;
  date: string;
}

interface CreditScoreState {
  currentScore: number | null;
  history: CreditScore[];
  loading: boolean;
  error: string | null;
}

const initialState: CreditScoreState = {
  currentScore: null,
  history: [],
  loading: false,
  error: null,
};

const creditScoreSlice = createSlice({
  name: 'creditScore',
  initialState,
  reducers: {
    setCurrentScore: (state, action: PayloadAction<number>) => {
      state.currentScore = action.payload;
    },
    setHistory: (state, action: PayloadAction<CreditScore[]>) => {
      state.history = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCurrentScore, setHistory, setLoading, setError } = creditScoreSlice.actions;

export const creditScoreReducer = creditScoreSlice.reducer;

export const creditScoreActions = creditScoreSlice.actions;

// Commented list of human tasks
/*
Human tasks:
1. Implement the CreditScore type in src/mobile/src/types/creditScore.types.ts (Required)
2. Ensure that the credit score API integration is properly set up to work with this slice (Required)
*/