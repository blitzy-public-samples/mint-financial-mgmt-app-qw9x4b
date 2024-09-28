import request from 'supertest';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { app } from '../../app';
import { InsightService } from '../../services/insight.service';
import { Insight } from '../../../shared/types';
import { setupTestDatabase } from '../utils/test-database';
import { generateTestToken } from '../utils/auth-helper';

describe('Insight API Integration Tests', () => {
  let testToken: string;

  before(async () => {
    // Set up the test database
    await setupTestDatabase();
    
    // Generate a test token for authentication
    testToken = await generateTestToken();
  });

  after(async () => {
    // Clean up the test database
    // This is assumed to be handled by setupTestDatabase
  });

  describe('GET /api/insights', () => {
    it('should return a list of insights for the authenticated user', async () => {
      const response = await request(app)
        .get('/api/insights')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(StatusCodes.OK);

      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('id');
      expect(response.body[0]).to.have.property('type');
      expect(response.body[0]).to.have.property('description');
    });

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/api/insights')
        .expect(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('GET /api/insights/:id', () => {
    it('should return a specific insight for the authenticated user', async () => {
      // Assume we have an insight with ID 1
      const insightId = '1';

      const response = await request(app)
        .get(`/api/insights/${insightId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(StatusCodes.OK);

      expect(response.body).to.have.property('id', insightId);
      expect(response.body).to.have.property('type');
      expect(response.body).to.have.property('description');
    });

    it('should return 404 if insight is not found', async () => {
      const nonExistentId = '999999';

      await request(app)
        .get(`/api/insights/${nonExistentId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(StatusCodes.NOT_FOUND);
    });
  });

  // Add more test cases here for different scenarios
});

// Commented list of human tasks
/**
 * TODO: Implement mock data generation for insights
 * TODO: Add more comprehensive test cases covering different scenarios
 * TODO: Implement test cases for error handling and edge cases
 * TODO: Add performance testing for insight generation and retrieval
 */