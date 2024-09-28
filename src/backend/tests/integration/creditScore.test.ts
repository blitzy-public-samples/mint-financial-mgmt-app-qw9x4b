import request from 'supertest';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { app } from '../../app';
import { CreditScore } from '../../models/creditScore.model';
import { User } from '../../models/user.model';
import { CreditScoreService } from '../../services/creditScore.service';

describe('Credit Score Integration Tests', () => {
  let testUser: any = null;
  let testCreditScore: any = null;

  before(async () => {
    await setupTestData();
  });

  after(async () => {
    await cleanupTestData();
  });

  async function setupTestData(): Promise<void> {
    // Create a test user
    testUser = await User.create({
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    // Create a test credit score entry for the user
    testCreditScore = await CreditScore.create({
      userId: testUser.id,
      score: 750,
      date: new Date()
    });
  }

  async function cleanupTestData(): Promise<void> {
    // Delete the test credit score entry
    await CreditScore.destroy({ where: { id: testCreditScore.id } });

    // Delete the test user
    await User.destroy({ where: { id: testUser.id } });
  }

  describe('GET /api/credit-score', () => {
    it('should return the user\'s credit score', async () => {
      const response = await request(app)
        .get('/api/credit-score')
        .set('Authorization', `Bearer ${testUser.generateAuthToken()}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('score');
      expect(response.body.score).to.equal(750);
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/credit-score');

      expect(response.status).to.equal(401);
    });
  });

  describe('GET /api/credit-score/history', () => {
    it('should return the user\'s credit score history', async () => {
      const response = await request(app)
        .get('/api/credit-score/history')
        .set('Authorization', `Bearer ${testUser.generateAuthToken()}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(1);
      expect(response.body[0]).to.have.property('score', 750);
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/credit-score/history');

      expect(response.status).to.equal(401);
    });
  });

  describe('POST /api/credit-score/update', () => {
    it('should update the user\'s credit score', async () => {
      const newScore = 780;
      const response = await request(app)
        .post('/api/credit-score/update')
        .set('Authorization', `Bearer ${testUser.generateAuthToken()}`)
        .send({ score: newScore });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message', 'Credit score updated successfully');

      const updatedCreditScore = await CreditScore.findOne({ where: { userId: testUser.id }, order: [['date', 'DESC']] });
      expect(updatedCreditScore?.score).to.equal(newScore);
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .post('/api/credit-score/update')
        .send({ score: 780 });

      expect(response.status).to.equal(401);
    });

    it('should return 400 if score is invalid', async () => {
      const response = await request(app)
        .post('/api/credit-score/update')
        .set('Authorization', `Bearer ${testUser.generateAuthToken()}`)
        .send({ score: 1000 }); // Invalid score

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error', 'Invalid credit score');
    });
  });
});

// Human tasks:
// TODO: Implement authentication mechanism for integration tests
// TODO: Set up a separate test database for integration tests