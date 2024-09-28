/**
 * This file contains TypeScript type definitions related to authentication and user management
 * for the Mint Replica frontend application.
 */

/**
 * Represents a user in the system
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the authentication state in the Redux store
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Represents the credentials required for user login
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
}

/**
 * Represents the response from authentication-related API calls
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Represents a JSON Web Token
 */
export type JWTToken = string;