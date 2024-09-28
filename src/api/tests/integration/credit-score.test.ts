import supertest from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import app from '../../app';
import { CreditScoreService } from '../../services/credit-score.service';
import { CreditScore, CreditScoreHistory, CreditScoreFactors } from '../../../shared/types/creditScore';
import { generateTestToken } from '../utils/auth-helper';

const request = supertest(app);

describe('Credit Score API Integration Tests', () => {
  let testToken: string;

  beforeAll(async () => {
    // Create a mock user and generate a test token
    testToken = await generateTestToken();
  });

  afterAll(async () => {
    // Clean up any test data or connections
  });

  describe('GET /api/credit-score', () => {
    it('should return the user\'s credit score', async () => {
      const response = await request
        .get('/api/credit-score')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('date');
      expect(response.body.score).toBeGreaterThanOrEqual(300);
      expect(response.body.score).toBeLessThanOrEqual(850);
    });
  });

  describe('GET /api/credit-score/history', () => {
    it('should return the user\'s credit score history', async () => {
      const response = await request
        .get('/api/credit-score/history')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('score');
      expect(response.body[0]).toHaveProperty('date');
    });
  });

  describe('GET /api/credit-score/factors', () => {
    it('should return the user\'s credit score factors', async () => {
      const response = await request
        .get('/api/credit-score/factors')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('positiveFactors');
      expect(response.body).toHaveProperty('negativeFactors');
      expect(Array.isArray(response.body.positiveFactors)).toBe(true);
      expect(Array.isArray(response.body.negativeFactors)).toBe(true);
    });
  });

  describe('POST /api/credit-score/refresh', () => {
    it('should refresh the user\'s credit score', async () => {
      const response = await request
        .post('/api/credit-score/refresh')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(StatusCodes.ACCEPTED);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Credit score refresh initiated');
    });
  });
});

// Mock CreditScoreService
jest.mock('../../services/credit-score.service', () => {
  return {
    CreditScoreService: {
      getCreditScore: jest.fn().mockResolvedValue({ score: 750, date: new Date() }),
      getCreditScoreHistory: jest.fn().mockResolvedValue([
        { score: 750, date: new Date() },
        { score: 745, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      ]),
      getCreditScoreFactors: jest.fn().mockResolvedValue({
        positiveFactors: ['On-time payments', 'Low credit utilization'],
        negativeFactors: ['High number of credit inquiries'],
      }),
      refreshCreditScore: jest.fn().mockResolvedValue({ message: 'Credit score refresh initiated' }),
    },
  };
});
```

This implementation includes the following:

1. Import necessary dependencies and types.
2. Set up the test suite using Jest's `describe` and `it` functions.
3. Create a `beforeAll` hook to generate a test token for authentication.
4. Implement test cases for each credit score-related API endpoint:
   - GET /api/credit-score
   - GET /api/credit-score/history
   - GET /api/credit-score/factors
   - POST /api/credit-score/refresh
5. Mock the `CreditScoreService` to provide test data for the API calls.

Note that this implementation makes some assumptions about the structure of the `app` object and the `CreditScoreService`. You may need to adjust the imports and mocks based on the actual implementation of these dependencies.

Here are the pending human tasks related to this file:

```
// Pending human tasks:
// 1. Implement mock CreditScoreService for testing purposes (Required)
// 2. Set up test database with sample credit score data (Required)
// 3. Implement test cleanup to reset the database after each test (Required)
// 4. Add tests for error scenarios (e.g., unauthorized access, service unavailable) (Required)
// 5. Implement test for rate limiting on the refresh credit score endpoint (Optional)