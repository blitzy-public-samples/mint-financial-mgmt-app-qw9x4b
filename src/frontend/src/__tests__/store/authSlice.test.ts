import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach } from '@jest/globals';
import authReducer, { clearError, login, logout, register } from '../../store/slices/authSlice';

describe('authSlice', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    store = setupStore();
  });

  const setupStore = () => {
    return configureStore({
      reducer: { auth: authReducer },
    });
  };

  it('should handle initial state', () => {
    const state = store.getState().auth;
    expect(state).toEqual({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  });

  it('should handle clearError', () => {
    store.dispatch(clearError());
    const state = store.getState().auth;
    expect(state.error).toBeNull();
  });

  it('should handle login.pending', () => {
    store.dispatch(login.pending(''));
    const state = store.getState().auth;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle login.fulfilled', () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    store.dispatch(login.fulfilled(mockUser, '', { email: 'test@example.com', password: 'password' }));
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle login.rejected', () => {
    const mockError = 'Invalid credentials';
    store.dispatch(login.rejected(new Error(mockError), '', { email: 'test@example.com', password: 'password' }));
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockError);
  });

  it('should handle logout.pending', () => {
    store.dispatch(logout.pending(''));
    const state = store.getState().auth;
    expect(state.loading).toBe(true);
  });

  it('should handle logout.fulfilled', () => {
    store.dispatch(logout.fulfilled(undefined, ''));
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle logout.rejected', () => {
    const mockError = 'Logout failed';
    store.dispatch(logout.rejected(new Error(mockError), ''));
    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockError);
  });

  it('should handle register.pending', () => {
    store.dispatch(register.pending(''));
    const state = store.getState().auth;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle register.fulfilled', () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    store.dispatch(register.fulfilled(mockUser, '', { email: 'test@example.com', password: 'password' }));
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle register.rejected', () => {
    const mockError = 'Registration failed';
    store.dispatch(register.rejected(new Error(mockError), '', { email: 'test@example.com', password: 'password' }));
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockError);
  });
});

// Human tasks:
// TODO: Implement actual API mocking for async thunks
// TODO: Add more edge case tests if necessary
// TODO: Ensure test coverage is adequate for all slice functionality