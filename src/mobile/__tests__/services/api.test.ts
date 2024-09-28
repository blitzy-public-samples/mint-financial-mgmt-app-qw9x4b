import { jest } from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';
import * as apiService from '../../src/services/api';
import { apiEndpoints } from '../../src/constants/apiEndpoints';
import { ApiResponse } from '../../src/types';

describe('API Service', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(apiService.axiosInstance);
    apiService.clearAuthToken();
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  test('createApiInstance should create a valid Axios instance', () => {
    const instance = apiService.createApiInstance();
    expect(instance.defaults.baseURL).toBe(apiEndpoints.BASE_URL);
    expect(instance.defaults.headers.common['Content-Type']).toBe('application/json');
  });

  test('setAuthToken should set the authorization header', async () => {
    const token = 'test-token';
    await apiService.setAuthToken(token);
    expect(apiService.axiosInstance.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`);
    // Assert that the token is stored in AsyncStorage
    // This part depends on how you've implemented the storage
    // For example: expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', token);
  });

  test('clearAuthToken should remove the authorization header', async () => {
    await apiService.setAuthToken('test-token');
    await apiService.clearAuthToken();
    expect(apiService.axiosInstance.defaults.headers.common['Authorization']).toBeUndefined();
    // Assert that the token is removed from AsyncStorage
    // For example: expect(AsyncStorage.removeItem).toHaveBeenCalledWith('authToken');
  });

  test('get should make a GET request and return data', async () => {
    const mockData: ApiResponse<string> = { data: 'test data', message: 'Success' };
    mockAxios.onGet('/test').reply(200, mockData);

    const result = await apiService.get('/test');
    expect(result).toEqual(mockData);
  });

  test('post should make a POST request and return data', async () => {
    const mockData: ApiResponse<string> = { data: 'test data', message: 'Success' };
    const postData = { key: 'value' };
    mockAxios.onPost('/test', postData).reply(200, mockData);

    const result = await apiService.post('/test', postData);
    expect(result).toEqual(mockData);
  });

  test('put should make a PUT request and return data', async () => {
    const mockData: ApiResponse<string> = { data: 'test data', message: 'Success' };
    const putData = { key: 'value' };
    mockAxios.onPut('/test', putData).reply(200, mockData);

    const result = await apiService.put('/test', putData);
    expect(result).toEqual(mockData);
  });

  test('delete should make a DELETE request and return data', async () => {
    const mockData: ApiResponse<string> = { data: 'test data', message: 'Success' };
    mockAxios.onDelete('/test').reply(200, mockData);

    const result = await apiService.delete('/test');
    expect(result).toEqual(mockData);
  });

  test('should handle network errors', async () => {
    mockAxios.onGet('/test').networkError();

    await expect(apiService.get('/test')).rejects.toThrow('Network Error');
  });

  test('should handle API errors', async () => {
    const errorResponse = { message: 'API Error' };
    mockAxios.onGet('/test').reply(400, errorResponse);

    await expect(apiService.get('/test')).rejects.toEqual(errorResponse);
  });
});

// Human tasks:
// TODO: Implement tests for request throttling once it's added to the API service
// TODO: Add tests for offline support and request queueing when implemented
// TODO: Ensure all API endpoints defined in apiEndpoints.ts are covered by tests