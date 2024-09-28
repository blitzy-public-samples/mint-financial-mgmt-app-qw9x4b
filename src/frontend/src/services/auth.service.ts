import { get, post } from './api';
import { AUTH_ENDPOINTS } from '../constants/apiEndpoints';
import { User } from '../types/auth.types';

/**
 * Authentication service for the frontend application.
 * Provides methods for user authentication, registration, and token management.
 */
class AuthService {
  /**
   * Authenticates a user with their email and password
   * @param email User's email
   * @param password User's password
   * @returns Promise resolving to user object and authentication token
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await post(AUTH_ENDPOINTS.LOGIN, { email, password });
    this.storeToken(response.token);
    return response;
  }

  /**
   * Registers a new user
   * @param email User's email
   * @param password User's password
   * @param firstName User's first name
   * @param lastName User's last name
   * @returns Promise resolving to the newly created user object
   */
  async register(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const response = await post(AUTH_ENDPOINTS.REGISTER, { email, password, firstName, lastName });
    return response;
  }

  /**
   * Logs out the current user
   * @returns Promise resolving to void
   */
  async logout(): Promise<void> {
    await post(AUTH_ENDPOINTS.LOGOUT);
    this.removeToken();
  }

  /**
   * Retrieves the current authenticated user's information
   * @returns Promise resolving to the current user object
   */
  async getCurrentUser(): Promise<User> {
    const response = await get(AUTH_ENDPOINTS.CURRENT_USER);
    return response;
  }

  /**
   * Refreshes the authentication token
   * @returns Promise resolving to the new authentication token
   */
  async refreshToken(): Promise<string> {
    const response = await post(AUTH_ENDPOINTS.REFRESH_TOKEN);
    this.storeToken(response.token);
    return response.token;
  }

  /**
   * Initiates the password reset process
   * @param email User's email
   * @returns Promise resolving to void
   */
  async forgotPassword(email: string): Promise<void> {
    await post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  }

  /**
   * Resets the user's password using a reset token
   * @param token Reset token
   * @param newPassword New password
   * @returns Promise resolving to void
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  }

  /**
   * Checks if the user is currently authenticated
   * @returns boolean indicating if the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Stores the authentication token in local storage
   * @param token Authentication token
   */
  private storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Retrieves the authentication token from local storage
   * @returns Authentication token or null if not found
   */
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Removes the authentication token from local storage
   */
  private removeToken(): void {
    localStorage.removeItem('authToken');
  }
}

export const authService = new AuthService();

// Human tasks:
// TODO: Implement secure token storage mechanism (e.g., HttpOnly cookies)
// TODO: Add token expiration check and auto-refresh mechanism
// TODO: Implement proper error handling for authentication failures
// TODO: Add multi-factor authentication support