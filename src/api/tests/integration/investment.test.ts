import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../app';
import { InvestmentModel } from '../../models/investment.model';
import { setupTestDB, teardownTestDB } from '../utils/testDb';
import { generateTestToken } from '../utils/auth';

describe('Investment API Integration Tests', () => {
  let testUser: any;
  let testToken: string;

  before(async () => {
    await setupTestDB();
    testUser = { id: 'test-user-id', email: 'test@example.com' };
    testToken = await generateTestToken(testUser);
  });

  after(async () => {
    await teardownTestDB();
  });

  describe('GET /api/investments', () => {
    it('should retrieve all investments successfully', async () => {
      const response = await request(app)
        .get('/api/investments')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/investments');

      expect(response.status).to.equal(401);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/investments?page=1&limit=10')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data').that.is.an('array');
      expect(response.body).to.have.property('totalCount');
      expect(response.body).to.have.property('currentPage');
    });
  });

  describe('GET /api/investments/:id', () => {
    let testInvestmentId: string;

    before(async () => {
      const testInvestment = await InvestmentModel.create({
        userId: testUser.id,
        name: 'Test Investment',
        amount: 1000,
        type: 'stock',
      });
      testInvestmentId = testInvestment.id;
    });

    it('should retrieve a specific investment successfully', async () => {
      const response = await request(app)
        .get(`/api/investments/${testInvestmentId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('id', testInvestmentId);
    });

    it('should return 404 for non-existent investment', async () => {
      const response = await request(app)
        .get('/api/investments/non-existent-id')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(404);
    });

    it('should require authentication', async () => {
      const response = await request(app).get(`/api/investments/${testInvestmentId}`);

      expect(response.status).to.equal(401);
    });
  });

  describe('POST /api/investments', () => {
    it('should create a new investment successfully', async () => {
      const newInvestment = {
        name: 'New Test Investment',
        amount: 2000,
        type: 'bond',
      };

      const response = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${testToken}`)
        .send(newInvestment);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body.name).to.equal(newInvestment.name);
    });

    it('should return validation errors for invalid input', async () => {
      const invalidInvestment = {
        name: '',
        amount: -100,
        type: 'invalid_type',
      };

      const response = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${testToken}`)
        .send(invalidInvestment);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/investments')
        .send({ name: 'Test', amount: 1000, type: 'stock' });

      expect(response.status).to.equal(401);
    });
  });

  describe('PUT /api/investments/:id', () => {
    let testInvestmentId: string;

    before(async () => {
      const testInvestment = await InvestmentModel.create({
        userId: testUser.id,
        name: 'Test Investment for Update',
        amount: 1500,
        type: 'stock',
      });
      testInvestmentId = testInvestment.id;
    });

    it('should update an existing investment successfully', async () => {
      const updatedInvestment = {
        name: 'Updated Test Investment',
        amount: 2500,
      };

      const response = await request(app)
        .put(`/api/investments/${testInvestmentId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(updatedInvestment);

      expect(response.status).to.equal(200);
      expect(response.body.name).to.equal(updatedInvestment.name);
      expect(response.body.amount).to.equal(updatedInvestment.amount);
    });

    it('should return 404 for non-existent investment', async () => {
      const response = await request(app)
        .put('/api/investments/non-existent-id')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).to.equal(404);
    });

    it('should return validation errors for invalid input', async () => {
      const invalidUpdate = {
        amount: -100,
      };

      const response = await request(app)
        .put(`/api/investments/${testInvestmentId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(invalidUpdate);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put(`/api/investments/${testInvestmentId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).to.equal(401);
    });
  });

  describe('DELETE /api/investments/:id', () => {
    let testInvestmentId: string;

    before(async () => {
      const testInvestment = await InvestmentModel.create({
        userId: testUser.id,
        name: 'Test Investment for Deletion',
        amount: 3000,
        type: 'stock',
      });
      testInvestmentId = testInvestment.id;
    });

    it('should delete an investment successfully', async () => {
      const response = await request(app)
        .delete(`/api/investments/${testInvestmentId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(204);

      // Verify the investment is deleted
      const checkResponse = await request(app)
        .get(`/api/investments/${testInvestmentId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(checkResponse.status).to.equal(404);
    });

    it('should return 404 for non-existent investment', async () => {
      const response = await request(app)
        .delete('/api/investments/non-existent-id')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(404);
    });

    it('should require authentication', async () => {
      const response = await request(app).delete(`/api/investments/${testInvestmentId}`);

      expect(response.status).to.equal(401);
    });
  });

  describe('GET /api/investments/:id/performance', () => {
    let testInvestmentId: string;

    before(async () => {
      const testInvestment = await InvestmentModel.create({
        userId: testUser.id,
        name: 'Test Investment for Performance',
        amount: 5000,
        type: 'stock',
      });
      testInvestmentId = testInvestment.id;
    });

    it('should retrieve investment performance successfully', async () => {
      const response = await request(app)
        .get(`/api/investments/${testInvestmentId}/performance`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('performance');
      expect(response.body.performance).to.be.an('object');
    });

    it('should return 404 for non-existent investment', async () => {
      const response = await request(app)
        .get('/api/investments/non-existent-id/performance')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(404);
    });

    it('should require authentication', async () => {
      const response = await request(app).get(`/api/investments/${testInvestmentId}/performance`);

      expect(response.status).to.equal(401);
    });
  });

  describe('POST /api/investments/:id/sync', () => {
    let testInvestmentId: string;

    before(async () => {
      const testInvestment = await InvestmentModel.create({
        userId: testUser.id,
        name: 'Test Investment for Sync',
        amount: 7000,
        type: 'stock',
      });
      testInvestmentId = testInvestment.id;
    });

    it('should sync investment data successfully', async () => {
      const response = await request(app)
        .post(`/api/investments/${testInvestmentId}/sync`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message', 'Investment data synced successfully');
    });

    it('should return 404 for non-existent investment', async () => {
      const response = await request(app)
        .post('/api/investments/non-existent-id/sync')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(404);
    });

    it('should require authentication', async () => {
      const response = await request(app).post(`/api/investments/${testInvestmentId}/sync`);

      expect(response.status).to.equal(401);
    });
  });

  describe('GET /api/investments/insights', () => {
    it('should retrieve investment insights successfully', async () => {
      const response = await request(app)
        .get('/api/investments/insights')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('insights');
      expect(response.body.insights).to.be.an('array');
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/investments/insights');

      expect(response.status).to.equal(401);
    });
  });
});

// Human tasks (commented)
/*
TODO: Implement mock for external investment data service to avoid real API calls during tests
TODO: Add more edge cases and error scenarios to each test suite
TODO: Implement test cases for rate limiting
TODO: Add performance tests for high-load scenarios
*/