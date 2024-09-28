import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import authReducer from './slices/authSlice';
import accountReducer from './slices/accountSlice';
import transactionReducer from './slices/transactionSlice';
import budgetReducer from './slices/budgetSlice';
import goalReducer from './slices/goalSlice';
import investmentReducer from './slices/investmentSlice';
import creditScoreReducer from './slices/creditScoreSlice';

// Configure the Redux store
const configureAppStore = () => {
  // Combine all reducers into a root reducer
  const rootReducer = {
    auth: authReducer,
    account: accountReducer,
    transaction: transactionReducer,
    budget: budgetReducer,
    goal: goalReducer,
    investment: investmentReducer,
    creditScore: creditScoreReducer,
  };

  // Set up middleware array with redux-thunk
  const middleware = [thunk];

  // Create and configure the store using configureStore from @reduxjs/toolkit
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

// Create the store
export const store = configureAppStore();

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Human tasks:
// TODO: Implement individual slice files (authSlice.ts, accountSlice.ts, etc.) with their respective reducers and actions
// TODO: Review and adjust middleware configuration based on specific application needs