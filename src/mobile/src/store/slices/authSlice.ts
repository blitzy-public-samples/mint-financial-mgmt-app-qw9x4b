import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../index';
import { AuthState, Credentials, UserData } from '../../types/auth.types';
import { authService } from '../../services/auth.service';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<UserData>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    registerRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<UserData>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  registerRequest,
  registerSuccess,
  registerFailure,
} = authSlice.actions;

export const loginAsync = (credentials: Credentials): AppThunk => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const userData = await authService.login(credentials);
    dispatch(loginSuccess(userData));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logoutAsync = (): AppThunk => async (dispatch) => {
  try {
    await authService.logout();
    dispatch(logoutSuccess());
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const registerAsync = (userData: UserData): AppThunk => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const registeredUser = await authService.register(userData);
    dispatch(registerSuccess(registeredUser));
  } catch (error) {
    dispatch(registerFailure(error.message));
  }
};

export const authReducer = authSlice.reducer;

// Commented list of human tasks
/*
Human tasks:
1. Implement the authentication service with actual API calls (Critical)
2. Add error handling and validation for user inputs (Required)
3. Implement token refresh mechanism if using JWT for authentication (Required)
4. Consider adding additional actions for password reset functionality (Optional)
*/