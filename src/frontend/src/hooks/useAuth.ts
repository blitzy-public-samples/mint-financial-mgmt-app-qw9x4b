import { useDispatch, useSelector } from 'react-redux';
import { useState, useCallback } from 'react';
import { RootState } from '../store';
import { login, logout, register } from '../store/slices/authSlice';

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth as AuthState);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      setError(null);
      await dispatch(login(credentials) as any);
    } catch (err) {
      setError((err as Error).message || 'An error occurred during login');
    }
  }, [dispatch]);

  const handleLogout = useCallback(async () => {
    try {
      setError(null);
      await dispatch(logout() as any);
    } catch (err) {
      setError((err as Error).message || 'An error occurred during logout');
    }
  }, [dispatch]);

  const handleRegister = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setError(null);
      await dispatch(register(credentials) as any);
    } catch (err) {
      setError((err as Error).message || 'An error occurred during registration');
    }
  }, [dispatch]);

  return {
    user,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };
};

export default useAuth;

// Human tasks:
// TODO: Implement proper error handling and user feedback mechanisms
// TODO (Optional): Add multi-factor authentication support