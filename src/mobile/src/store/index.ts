import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Import reducers
import authReducer from './slices/authSlice';
import accountReducer from './slices/accountSlice';
import transactionReducer from './slices/transactionSlice';
import budgetReducer from './slices/budgetSlice';
import goalReducer from './slices/goalSlice';
import investmentReducer from './slices/investmentSlice';
import creditScoreReducer from './slices/creditScoreSlice';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  account: accountReducer,
  transaction: transactionReducer,
  budget: budgetReducer,
  goal: goalReducer,
  investment: investmentReducer,
  creditScore: creditScoreReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Commented list of human tasks
/**
 * Human Tasks:
 * 1. Implement and export individual slice reducers (authSlice, accountSlice, etc.) [Critical]
 * 2. Decide on any additional middleware to be used in the store configuration [Required]
 * 3. Determine if any store enhancers or dev tools should be added for development environments [Optional]
 */