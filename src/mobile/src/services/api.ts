import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define ApiResponse type
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
}

// Create a base URL for the API
const BASE_URL = 'https://api.mintreplicaapp.com'; // Replace with your actual API base URL

// Create and configure Axios instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Handle unauthorized access (e.g., clear token and redirect to login)
        await AsyncStorage.removeItem('authToken');
        // You might want to use a navigation service to redirect to the login screen
        // navigationService.navigate('Login');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiInstance();

// Set authentication token
export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('authToken', token);
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
};

// Clear authentication token
export const clearAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('authToken');
  delete api.defaults.headers['Authorization'];
};

// Generic GET request
export const get = async <T>(url: string, params?: object): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await api.get(url, { params });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Generic POST request
export const post = async <T>(url: string, data?: object): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await api.post(url, data);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Generic PUT request
export const put = async <T>(url: string, data?: object): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await api.put(url, data);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Generic DELETE request
export const del = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await api.delete(url);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Error handling function
const handleApiError = (error: any): Error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error:', error.response.data);
    return new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    return new Error('No response received from the server');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error setting up request:', error.message);
    return new Error('An error occurred while setting up the request');
  }
};

export default api;

// Human tasks:
// TODO: Implement error handling and retry logic for API requests
// TODO: Add request throttling to prevent API abuse
// TODO: Implement offline support and request queueing (Optional)