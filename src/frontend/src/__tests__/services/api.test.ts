import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createApiInstance, handleApiError, get, post, put, delete as deleteRequest } from '../../services/api';
import { API_BASE_URL } from '../../constants/apiEndpoints';
import { ErrorMessages } from '../../constants/errorMessages';

describe('API Service', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('createApiInstance', () => {
    it('should create an API instance with the correct base URL', () => {
      const instance = createApiInstance();
      expect(instance.defaults.baseURL).toBe(API_BASE_URL);
    });

    it('should set default headers correctly', () => {
      const instance = createApiInstance();
      expect(instance.defaults.headers.common['Content-Type']).toBe('application/json');
      expect(instance.defaults.headers.common['Accept']).toBe('application/json');
    });
  });

  describe('handleApiError', () => {
    it('should handle network errors', () => {
      const networkError = new Error('Network Error');
      const result = handleApiError(networkError);
      expect(result).toBe(ErrorMessages.NETWORK_ERROR);
    });

    it('should handle server errors', () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      };
      const result = handleApiError(serverError);
      expect(result).toBe('Internal Server Error');
    });

    it('should handle client errors', () => {
      const clientError = {
        response: {
          status: 400,
          data: { message: 'Bad Request' }
        }
      };
      const result = handleApiError(clientError);
      expect(result).toBe('Bad Request');
    });

    it('should handle unknown errors', () => {
      const unknownError = new Error('Unknown Error');
      const result = handleApiError(unknownError);
      expect(result).toBe(ErrorMessages.UNKNOWN_ERROR);
    });
  });

  describe('get', () => {
    it('should make a successful GET request', async () => {
      const testData = { id: 1, name: 'Test' };
      mockAxios.onGet('/test').reply(200, testData);

      const result = await get('/test');
      expect(result).toEqual(testData);
    });

    it('should handle errors in GET request', async () => {
      mockAxios.onGet('/test').reply(500, { message: 'Server Error' });

      await expect(get('/test')).rejects.toThrow('Server Error');
    });
  });

  describe('post', () => {
    it('should make a successful POST request', async () => {
      const testData = { id: 1, name: 'Test' };
      mockAxios.onPost('/test', { name: 'Test' }).reply(201, testData);

      const result = await post('/test', { name: 'Test' });
      expect(result).toEqual(testData);
    });

    it('should handle errors in POST request', async () => {
      mockAxios.onPost('/test').reply(400, { message: 'Bad Request' });

      await expect(post('/test', {})).rejects.toThrow('Bad Request');
    });
  });

  describe('put', () => {
    it('should make a successful PUT request', async () => {
      const testData = { id: 1, name: 'Updated Test' };
      mockAxios.onPut('/test/1', { name: 'Updated Test' }).reply(200, testData);

      const result = await put('/test/1', { name: 'Updated Test' });
      expect(result).toEqual(testData);
    });

    it('should handle errors in PUT request', async () => {
      mockAxios.onPut('/test/1').reply(404, { message: 'Not Found' });

      await expect(put('/test/1', {})).rejects.toThrow('Not Found');
    });
  });

  describe('delete', () => {
    it('should make a successful DELETE request', async () => {
      mockAxios.onDelete('/test/1').reply(204);

      const result = await deleteRequest('/test/1');
      expect(result).toBeUndefined();
    });

    it('should handle errors in DELETE request', async () => {
      mockAxios.onDelete('/test/1').reply(403, { message: 'Forbidden' });

      await expect(deleteRequest('/test/1')).rejects.toThrow('Forbidden');
    });
  });
});

// Human tasks:
// 1. Add more comprehensive tests for edge cases and different response types (Optional)
// 2. Implement tests for request interceptors and response interceptors (Required)
// 3. Add tests for request timeout scenarios (Optional)