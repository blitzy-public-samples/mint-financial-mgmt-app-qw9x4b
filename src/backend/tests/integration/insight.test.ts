import request from 'supertest';
import { expect } from 'chai';
import app from '../../app';
import { InsightService } from '../../services/insight.service';
import { AuthService } from '../../services/auth.service';

describe('Insight API', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Create a test user
    const testUser = await AuthService.createUser({
      email: 'test@example.com',
      password: 'testPassword123!',
      firstName: 'Test',
      lastName: 'User'
    });
    testUserId = testUser.id;

    // Generate an authentication token for the test user
    authToken = await AuthService.generateToken(testUser);
  });

  afterAll(async () => {
    // Remove the test user
    await AuthService.deleteUser(testUserId);

    // Clear any generated insights for the test user
    await InsightService.clearInsights(testUserId);
  });

  it('should return all insights for the authenticated user', async () => {
    const response = await request(app)
      .get('/api/insights')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.data).to.be.an('array');
  });

  it('should return a specific insight by ID', async () => {
    // First, create a test insight
    const testInsight = await InsightService.createInsight(testUserId, {
      type: 'spending',
      description: 'Your spending in the food category has increased by 20% this month.'
    });

    const response = await request(app)
      .get(`/api/insights/${testInsight.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.data).to.be.an('object');
    expect(response.body.data.id).to.equal(testInsight.id);
  });

  it('should return 404 for non-existent insight ID', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app)
      .get(`/api/insights/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).to.equal(404);
    expect(response.body.success).to.be.false;
    expect(response.body.error).to.equal('Insight not found');
  });

  it('should generate new insights for the user', async () => {
    const response = await request(app)
      .post('/api/insights/generate')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.message).to.equal('Insights generated successfully');
  });

  it('should return 401 for unauthenticated requests', async () => {
    const response = await request(app)
      .get('/api/insights');

    expect(response.status).to.equal(401);
    expect(response.body.success).to.be.false;
    expect(response.body.error).to.equal('Unauthorized');
  });
});

// Human tasks:
// TODO: Implement mock for InsightService to avoid actual data generation during tests
// TODO: Add test cases for error scenarios and edge cases
// TODO: Implement test database seeding for consistent test data