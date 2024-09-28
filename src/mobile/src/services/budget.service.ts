import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiEndpoints } from '../constants/apiEndpoints';
import { Budget, CreateBudgetDTO, UpdateBudgetDTO } from '../types/budget.types';

// Create a base axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://api.mintreplicaapp.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post(apiEndpoints.auth.refreshToken, { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        // Refresh token is invalid, logout the user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Redirect to login page or dispatch a logout action
      }
    }
    return Promise.reject(error);
  }
);

// Export the api instance to be used in other services
export default api;

// Budget service functions
export const budgetService = {
  getBudgets: async (): Promise<Budget[]> => {
    const response = await api.get(apiEndpoints.budgets.getAll);
    return response.data;
  },

  getBudgetById: async (budgetId: string): Promise<Budget> => {
    const response = await api.get(apiEndpoints.budgets.getById(budgetId));
    return response.data;
  },

  createBudget: async (budgetData: CreateBudgetDTO): Promise<Budget> => {
    const response = await api.post(apiEndpoints.budgets.create, budgetData);
    return response.data;
  },

  updateBudget: async (budgetId: string, budgetData: UpdateBudgetDTO): Promise<Budget> => {
    const response = await api.put(apiEndpoints.budgets.update(budgetId), budgetData);
    return response.data;
  },

  deleteBudget: async (budgetId: string): Promise<void> => {
    await api.delete(apiEndpoints.budgets.delete(budgetId));
  },

  getBudgetProgress: async (budgetId: string): Promise<{ current: number; target: number; percentage: number }> => {
    const response = await api.get(apiEndpoints.budgets.getProgress(budgetId));
    return response.data;
  },
};

// Human tasks (commented)
/*
TODO: Implement caching mechanism for frequently accessed budget data
TODO: Add input validation for budget creation and update operations
TODO: Implement error handling specific to budget-related operations
*/