import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';

const request = supertest(app);
let mongoServer: MongoMemoryServer;

describe('Authentication API', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 400 if email is already registered', async () => {
      await UserModel.create({
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe'
      });

      const response = await request
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Jane',
          lastName: 'Doe'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
      const user = await UserModel.create({
        email: 'test@example.com',
        password: await AuthService.hashPassword('Password123!'),
        firstName: 'John',
        lastName: 'Doe'
      });

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      await UserModel.create({
        email: 'test@example.com',
        password: await AuthService.hashPassword('Password123!'),
        firstName: 'John',
        lastName: 'Doe'
      });

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout a user', async () => {
      const token = await AuthService.generateToken({ userId: 'testUserId' });

      const response = await request
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });

    it('should return 401 for unauthorized logout attempt', async () => {
      const response = await request
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    it('should refresh the token for a valid user', async () => {
      const user = await UserModel.create({
        email: 'test@example.com',
        password: await AuthService.hashPassword('Password123!'),
        firstName: 'John',
        lastName: 'Doe'
      });

      const token = await AuthService.generateToken({ userId: user._id });

      const response = await request
        .post('/api/auth/refresh-token')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).not.toBe(token);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request
        .post('/api/auth/refresh-token')
        .set('Authorization', 'Bearer invalidToken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });
  });
});

// Human tasks:
// 1. Ensure test environment variables are properly set up
// 2. Implement mock for external services if any are used in the auth process