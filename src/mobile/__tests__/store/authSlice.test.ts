import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach } from '@jest/globals';
import mockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import authReducer, {
  authActions,
  loginAsync,
  logoutAsync,
  registerAsync
} from '../../src/store/slices/authSlice';
import { User, LoginCredentials, RegisterData } from '../../src/types/auth.types';

const middlewares = [thunk];
const mockStoreCreator = mockStore(middlewares);

describe('Auth Reducer', () => {
  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: '' })).toEqual({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    });
  });

  it('should handle loginRequest', () => {
    const nextState = authReducer(undefined, authActions.loginRequest());
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('should handle loginSuccess', () => {
    const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User' };
    const nextState = authReducer(undefined, authActions.loginSuccess(mockUser));
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.user).toEqual(mockUser);
    expect(nextState.isLoading).toBe(false);
  });

  it('should handle loginFailure', () => {
    const errorMessage = 'Invalid credentials';
    const nextState = authReducer(undefined, authActions.loginFailure(errorMessage));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });

  it('should handle logoutSuccess', () => {
    const initialState = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      isLoading: false,
      error: null
    };
    const nextState = authReducer(initialState, authActions.logoutSuccess());
    expect(nextState).toEqual({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    });
  });

  it('should handle registerRequest', () => {
    const nextState = authReducer(undefined, authActions.registerRequest());
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('should handle registerSuccess', () => {
    const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User' };
    const nextState = authReducer(undefined, authActions.registerSuccess(mockUser));
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.user).toEqual(mockUser);
    expect(nextState.isLoading).toBe(false);
  });

  it('should handle registerFailure', () => {
    const errorMessage = 'Registration failed';
    const nextState = authReducer(undefined, authActions.registerFailure(errorMessage));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });
});

describe('Auth Actions', () => {
  let store: any;

  beforeEach(() => {
    store = mockStoreCreator({
      auth: {
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      }
    });
  });

  it('loginAsync should create login actions', async () => {
    const mockCredentials: LoginCredentials = { email: 'test@example.com', password: 'password123' };
    const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User' };

    // Mock API call
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ user: mockUser })
    } as any);

    await store.dispatch(loginAsync(mockCredentials));

    const actions = store.getActions();
    expect(actions[0].type).toBe(authActions.loginRequest.type);
    expect(actions[1].type).toBe(authActions.loginSuccess.type);
    expect(actions[1].payload).toEqual(mockUser);
  });

  it('loginAsync should handle login failure', async () => {
    const mockCredentials: LoginCredentials = { email: 'test@example.com', password: 'wrongpassword' };

    // Mock API call
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ message: 'Invalid credentials' })
    } as any);

    await store.dispatch(loginAsync(mockCredentials));

    const actions = store.getActions();
    expect(actions[0].type).toBe(authActions.loginRequest.type);
    expect(actions[1].type).toBe(authActions.loginFailure.type);
    expect(actions[1].payload).toBe('Invalid credentials');
  });

  it('logoutAsync should create logout action', async () => {
    await store.dispatch(logoutAsync());

    const actions = store.getActions();
    expect(actions[0].type).toBe(authActions.logoutSuccess.type);
  });

  it('registerAsync should create register actions', async () => {
    const mockRegisterData: RegisterData = { email: 'test@example.com', password: 'password123', name: 'Test User' };
    const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User' };

    // Mock API call
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ user: mockUser })
    } as any);

    await store.dispatch(registerAsync(mockRegisterData));

    const actions = store.getActions();
    expect(actions[0].type).toBe(authActions.registerRequest.type);
    expect(actions[1].type).toBe(authActions.registerSuccess.type);
    expect(actions[1].payload).toEqual(mockUser);
  });

  it('registerAsync should handle registration failure', async () => {
    const mockRegisterData: RegisterData = { email: 'test@example.com', password: 'password123', name: 'Test User' };

    // Mock API call
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ message: 'Email already exists' })
    } as any);

    await store.dispatch(registerAsync(mockRegisterData));

    const actions = store.getActions();
    expect(actions[0].type).toBe(authActions.registerRequest.type);
    expect(actions[1].type).toBe(authActions.registerFailure.type);
    expect(actions[1].payload).toBe('Email already exists');
  });
});

// Human tasks:
// 1. Implement actual API mocking for more realistic tests
// 2. Add tests for edge cases and error scenarios
// 3. Consider adding integration tests with the actual Redux store