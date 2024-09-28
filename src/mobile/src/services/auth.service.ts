import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api'; // Assuming this will be implemented
import { apiEndpoints } from '../constants/apiEndpoints'; // Assuming this will be implemented
import { AuthResponse, User } from '../types/auth.types'; // Assuming these types will be defined

// Placeholder for API and apiEndpoints (to be implemented)
const API_BASE_URL = 'https://api.mintreplicaapp.com'; // Example base URL

class AuthService {
  private async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem('authToken', token);
  }

  private async clearAuthToken(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post(`${API_BASE_URL}/auth/login`, { email, password });
      if (response.data.token) {
        await this.setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
    try {
      const response = await api.post(`${API_BASE_URL}/auth/register`, { email, password, firstName, lastName });
      if (response.data.token) {
        await this.setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(`${API_BASE_URL}/auth/logout`);
      await this.clearAuthToken();
      await AsyncStorage.clear(); // Clear all user-related data
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get(`${API_BASE_URL}/auth/user`);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await api.post(`${API_BASE_URL}/auth/refresh-token`);
      const newToken = response.data.token;
      await this.setAuthToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return false;
      
      // Optionally, validate the token with the server
      // const response = await api.post(`${API_BASE_URL}/auth/validate-token`, { token });
      // return response.data.isValid;

      return true; // If we don't validate with the server, assume the presence of a token means the user is authenticated
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();

// Human tasks (commented as requested):
// TODO: Implement biometric authentication for enhanced security
// TODO: Add support for social media login (e.g., Google, Facebook)
// TODO: Implement multi-factor authentication