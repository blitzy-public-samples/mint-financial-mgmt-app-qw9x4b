import supertest from 'supertest';
import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { app } from '../../app';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

const request = supertest(app);

// Mock user data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
};

let authToken: string;

beforeAll(async () => {
  // Set up the test environment before running tests
  // Note: These are placeholder implementations. Adjust based on actual service methods.
  await UserService.connect();
  await UserService.clearUsers();
  const user = await UserService.createUser(testUser);
  authToken = await AuthService.generateToken(user);
});

afterAll(async () => {
  // Clean up the test environment after running tests
  await UserService.clearUsers();
  await UserService.disconnect();
});

describe('GET /api/users/profile', () => {
  test('should retrieve user profile with valid authentication', async () => {
    const response = await request
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', testUser.email);
    expect(response.body).toHaveProperty('firstName', testUser.firstName);
    expect(response.body).toHaveProperty('lastName', testUser.lastName);
  });

  test('should return 401 with invalid authentication', async () => {
    const response = await request
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(401);
  });

  test('should return 404 for non-existent user profile', async () => {
    // Assuming the AuthService can generate a token for a non-existent user
    const nonExistentToken = await AuthService.generateToken({ id: 'non_existent_id' } as User);
    const response = await request
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${nonExistentToken}`);

    expect(response.status).toBe(404);
  });
});

describe('PUT /api/users/profile', () => {
  test('should update user profile with valid data', async () => {
    const updatedData = {
      firstName: 'Updated',
      lastName: 'Name'
    };

    const response = await request
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('firstName', updatedData.firstName);
    expect(response.body).toHaveProperty('lastName', updatedData.lastName);
  });

  test('should return 400 with invalid data', async () => {
    const invalidData = {
      firstName: '',  // Assuming empty string is invalid
      lastName: 'Name'
    };

    const response = await request
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidData);

    expect(response.status).toBe(400);
  });

  test('should return 401 with invalid authentication', async () => {
    const response = await request
      .put('/api/users/profile')
      .set('Authorization', 'Bearer invalid_token')
      .send({ firstName: 'Test', lastName: 'User' });

    expect(response.status).toBe(401);
  });
});

describe('GET /api/users/preferences', () => {
  test('should retrieve user preferences with valid authentication', async () => {
    const response = await request
      .get('/api/users/preferences')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('preferences');
  });

  test('should return 401 with invalid authentication', async () => {
    const response = await request
      .get('/api/users/preferences')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(401);
  });

  test('should return 404 for non-existent user preferences', async () => {
    const nonExistentToken = await AuthService.generateToken({ id: 'non_existent_id' } as User);
    const response = await request
      .get('/api/users/preferences')
      .set('Authorization', `Bearer ${nonExistentToken}`);

    expect(response.status).toBe(404);
  });
});

describe('PUT /api/users/preferences', () => {
  test('should update user preferences with valid data', async () => {
    const updatedPreferences = {
      theme: 'dark',
      notifications: {
        email: true,
        push: false
      }
    };

    const response = await request
      .put('/api/users/preferences')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedPreferences);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('preferences');
    expect(response.body.preferences).toEqual(updatedPreferences);
  });

  test('should return 400 with invalid data', async () => {
    const invalidPreferences = {
      theme: 'invalid_theme',
      notifications: 'not_an_object'
    };

    const response = await request
      .put('/api/users/preferences')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidPreferences);

    expect(response.status).toBe(400);
  });

  test('should return 401 with invalid authentication', async () => {
    const response = await request
      .put('/api/users/preferences')
      .set('Authorization', 'Bearer invalid_token')
      .send({ theme: 'light' });

    expect(response.status).toBe(401);
  });
});

// Commented list of human tasks
/*
Human tasks:
1. Implement test cases for edge cases and error scenarios (Required)
2. Add tests for rate limiting and security features (Required)
3. Ensure test data is properly isolated and cleaned up after each test (Required)
4. Add performance tests for user-related endpoints (Optional)
*/