/**
 * This file contains type definitions related to authentication and user management
 * for the Mint Replica mobile application. It defines interfaces and types used
 * throughout the authentication process, user data structures, and related functionality.
 */

/**
 * Represents a user in the application
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the authentication state in the application
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Represents the login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Represents the data required for user registration
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
}

/**
 * Represents the possible authentication actions
 */
export type AuthAction = 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'UPDATE_PROFILE' | 'RESET_PASSWORD';

/**
 * Represents the possible authentication error types
 */
export type AuthErrorType = 'INVALID_CREDENTIALS' | 'EMAIL_ALREADY_EXISTS' | 'WEAK_PASSWORD' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR';