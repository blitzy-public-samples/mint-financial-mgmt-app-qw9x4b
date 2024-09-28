import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

const request = supertest(app);

describe('User Profile', () => {
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.TEST_MONGODB_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear all collections in the test database
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany({}))
    );

    // Create a test user for authentication
    testUser = await User.create({
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });

    // Authenticate the test user
    const loginResponse = await request
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.disconnect();
  });

  test('should get user profile successfully', async () => {
    const response = await request
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'testuser@example.com');
    expect(response.body).toHaveProperty('firstName', 'Test');
    expect(response.body).toHaveProperty('lastName', 'User');
  });

  test('should update user profile successfully', async () => {
    const updatedProfile = {
      firstName: 'Updated',
      lastName: 'Name',
    };

    const response = await request
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedProfile);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('firstName', 'Updated');
    expect(response.body).toHaveProperty('lastName', 'Name');

    // Verify that the user profile is updated in the database
    const updatedUser = await User.findById(testUser._id);
    expect(updatedUser?.firstName).toBe('Updated');
    expect(updatedUser?.lastName).toBe('Name');
  });
});

describe('User Account', () => {
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    // Create a new test user for account operations
    testUser = await User.create({
      email: 'accountuser@example.com',
      password: 'password123',
      firstName: 'Account',
      lastName: 'User',
    });

    // Authenticate the test user
    const loginResponse = await request
      .post('/api/auth/login')
      .send({ email: 'accountuser@example.com', password: 'password123' });

    authToken = loginResponse.body.token;
  });

  test('should delete user account successfully', async () => {
    const response = await request
      .delete('/api/users/account')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);

    // Verify that the user account is removed from the database
    const deletedUser = await User.findById(testUser._id);
    expect(deletedUser).toBeNull();
  });

  test('should change user password successfully', async () => {
    const changePasswordData = {
      currentPassword: 'password123',
      newPassword: 'newpassword123',
    };

    const response = await request
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${authToken}`)
      .send(changePasswordData);

    expect(response.status).toBe(200);

    // Verify that the user can log in with the new password
    const newLoginResponse = await request
      .post('/api/auth/login')
      .send({ email: 'accountuser@example.com', password: 'newpassword123' });

    expect(newLoginResponse.status).toBe(200);
    expect(newLoginResponse.body).toHaveProperty('token');

    // Verify that the user cannot log in with the old password
    const oldLoginResponse = await request
      .post('/api/auth/login')
      .send({ email: 'accountuser@example.com', password: 'password123' });

    expect(oldLoginResponse.status).toBe(401);
  });
});

describe('User Preferences', () => {
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    // Create a new test user for preference operations
    testUser = await User.create({
      email: 'prefuser@example.com',
      password: 'password123',
      firstName: 'Preference',
      lastName: 'User',
    });

    // Authenticate the test user
    const loginResponse = await request
      .post('/api/auth/login')
      .send({ email: 'prefuser@example.com', password: 'password123' });

    authToken = loginResponse.body.token;
  });

  test('should get user preferences successfully', async () => {
    const response = await request
      .get('/api/users/preferences')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('preferences');
  });

  test('should update user preferences successfully', async () => {
    const updatedPreferences = {
      theme: 'dark',
      currency: 'EUR',
      language: 'es',
    };

    const response = await request
      .put('/api/users/preferences')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedPreferences);

    expect(response.status).toBe(200);
    expect(response.body.preferences).toMatchObject(updatedPreferences);

    // Verify that the user preferences are updated in the database
    const updatedUser = await User.findById(testUser._id);
    expect(updatedUser?.preferences).toMatchObject(updatedPreferences);
  });
});

// Implement error case scenarios for each endpoint (e.g., invalid input, unauthorized access)
// Add tests for rate limiting on sensitive operations like password changes
// Implement tests for edge cases and boundary conditions
// Add performance tests for user operations under load
// Implement tests for user data consistency across different parts of the system