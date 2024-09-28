import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import * as authSlice from '../store/slices/authSlice';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
}

interface AuthHook {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const useAuth = (): AuthHook => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth) as AuthState;

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(authSlice.login({ email, password }));
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(authSlice.logout());
    } catch (err) {
      setError(err.message || 'An error occurred during logout');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(authSlice.register({ email, password, name }));
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(authSlice.checkAuthStatus());
    } catch (err) {
      setError(err.message || 'An error occurred while checking auth status');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    loading,
    error,
    login,
    logout,
    register,
    checkAuthStatus,
  };
};

// Human tasks:
// 1. Implement actual API calls in auth.service.ts and integrate with this hook
// 2. Set up proper error handling and loading states
// 3. Implement token refresh mechanism
// 4. Add biometric authentication support