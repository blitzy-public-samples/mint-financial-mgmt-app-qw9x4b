import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/apiEndpoints';
import { ErrorMessages } from '../constants/errorMessages';

// Create and configure an axios instance with default settings
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor for adding auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(handleApiError(error))
  );

  return instance;
};

// Handle API errors and return appropriate error messages
const handleApiError = (error: AxiosError): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const statusCode = error.response.status;
    const data = error.response.data as any;

    if (data && data.message) {
      return data.message;
    }

    switch (statusCode) {
      case 400:
        return ErrorMessages.BAD_REQUEST;
      case 401:
        return ErrorMessages.UNAUTHORIZED;
      case 403:
        return ErrorMessages.FORBIDDEN;
      case 404:
        return ErrorMessages.NOT_FOUND;
      case 500:
        return ErrorMessages.SERVER_ERROR;
      default:
        return ErrorMessages.UNKNOWN_ERROR;
    }
  } else if (error.request) {
    // The request was made but no response was received
    return ErrorMessages.NETWORK_ERROR;
  } else {
    // Something happened in setting up the request that triggered an Error
    return ErrorMessages.REQUEST_SETUP_ERROR;
  }
};

// Create an instance of the API
const api = createApiInstance();

// Utility functions for making HTTP requests
const get = async <T>(endpoint: string, params?: object): Promise<T> => {
  const response = await api.get<T>(endpoint, { params });
  return response.data;
};

const post = async <T>(endpoint: string, data: object): Promise<T> => {
  const response = await api.post<T>(endpoint, data);
  return response.data;
};

const put = async <T>(endpoint: string, data: object): Promise<T> => {
  const response = await api.put<T>(endpoint, data);
  return response.data;
};

const del = async <T>(endpoint: string): Promise<T> => {
  const response = await api.delete<T>(endpoint);
  return response.data;
};

export { get, post, put, del as delete };

// Commented list of human tasks
/*
Human tasks:
1. Implement proper error handling and logging mechanism (Required)
2. Add request timeout configuration (Optional)
3. Implement request retrying mechanism for failed requests (Optional)
*/