import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../types'; // Assuming this type exists
import { api } from '../services/api'; // Assuming this service exists

/**
 * Handles API errors and returns a user-friendly error message
 * @param error The error object
 * @returns A user-friendly error message
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    if (axiosError.response) {
      const { data, status } = axiosError.response;
      if (data && typeof data.message === 'string') {
        return data.message;
      }
      return getGenericErrorMessage(status);
    }
  }
  console.error('Unexpected error:', error);
  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Logs errors to the console and potentially to a remote error tracking service
 * @param error The error object
 * @param context Additional context information
 */
export const logError = (error: Error, context: string): void => {
  console.error(`Error in ${context}:`, error.message);
  console.error('Stack trace:', error.stack);

  // TODO: Implement remote error tracking service integration
  // Example: sendToErrorTrackingService(error, context);
};

/**
 * Displays an error message to the user in a user-friendly format
 * @param message The error message to display
 */
export const displayErrorToUser = (message: string): void => {
  // TODO: Implement actual UI component for displaying errors
  console.log('Error Message:', message);
  // Example: showToast(message) or showAlert(message)
};

/**
 * Handles network-related errors and provides appropriate feedback
 * @param error The error object
 * @returns A user-friendly network error message
 */
export const handleNetworkError = (error: Error): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. Please try again.';
    }
  }
  logError(error, 'Network Error');
  return 'A network error occurred. Please check your connection and try again.';
};

/**
 * Handles authentication-related errors and triggers appropriate actions
 * @param error The error object
 * @returns A Promise that resolves after handling the error
 */
export const handleAuthenticationError = async (error: Error): Promise<void> => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    try {
      // Attempt to refresh the token
      await api.refreshToken();
    } catch (refreshError) {
      // If token refresh fails, log out the user
      await api.clearAuthToken();
      // TODO: Implement actual navigation to login screen
      console.log('Redirecting to login screen...');
      displayErrorToUser('Your session has expired. Please log in again.');
    }
  } else {
    logError(error, 'Authentication Error');
    displayErrorToUser('An authentication error occurred. Please try logging in again.');
  }
};

/**
 * Returns a generic error message based on the HTTP status code
 * @param status The HTTP status code
 * @returns A generic error message
 */
const getGenericErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Unauthorized. Please log in and try again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return 'An internal server error occurred. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Human tasks:
// TODO: Integrate with a remote error tracking service (e.g., Sentry, Bugsnag) for production error monitoring
// TODO: Review and customize error messages to ensure they are user-friendly and aligned with the app's tone
// TODO: Implement a mechanism to collect user feedback on errors for improving error handling