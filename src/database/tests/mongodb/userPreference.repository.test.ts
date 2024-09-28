import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserPreferenceRepository } from '../../repositories/mongodb/userPreference.repository';
import { IUserPreference } from '../../models/mongodb/userPreference.model';

describe('UserPreferenceRepository', () => {
  let mongoServer: MongoMemoryServer;
  let userPreferenceRepository: UserPreferenceRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    userPreferenceRepository = new UserPreferenceRepository();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  describe('create', () => {
    it('should create a new user preference', async () => {
      const mockUserPreference: IUserPreference = {
        userId: 'user123',
        theme: 'dark',
        language: 'en',
        notifications: {
          email: true,
          push: false
        }
      };

      const createdPreference = await userPreferenceRepository.create(mockUserPreference);

      expect(createdPreference).toBeDefined();
      expect(createdPreference.userId).toBe(mockUserPreference.userId);
      expect(createdPreference.theme).toBe(mockUserPreference.theme);
      expect(createdPreference.language).toBe(mockUserPreference.language);
      expect(createdPreference.notifications).toEqual(mockUserPreference.notifications);
    });
  });

  describe('findByUserId', () => {
    it('should find a user preference by user ID', async () => {
      const mockUserPreference: IUserPreference = {
        userId: 'user123',
        theme: 'light',
        language: 'es',
        notifications: {
          email: false,
          push: true
        }
      };

      await userPreferenceRepository.create(mockUserPreference);

      const foundPreference = await userPreferenceRepository.findByUserId(mockUserPreference.userId);

      expect(foundPreference).toBeDefined();
      expect(foundPreference?.userId).toBe(mockUserPreference.userId);
      expect(foundPreference?.theme).toBe(mockUserPreference.theme);
      expect(foundPreference?.language).toBe(mockUserPreference.language);
      expect(foundPreference?.notifications).toEqual(mockUserPreference.notifications);
    });

    it('should return null if user preference is not found', async () => {
      const nonExistentUserId = 'nonexistent123';

      const foundPreference = await userPreferenceRepository.findByUserId(nonExistentUserId);

      expect(foundPreference).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user preference', async () => {
      const mockUserPreference: IUserPreference = {
        userId: 'user123',
        theme: 'dark',
        language: 'en',
        notifications: {
          email: true,
          push: false
        }
      };

      const createdPreference = await userPreferenceRepository.create(mockUserPreference);

      const updatedData = {
        theme: 'light',
        language: 'fr',
        notifications: {
          email: false,
          push: true
        }
      };

      const updatedPreference = await userPreferenceRepository.update(createdPreference._id, updatedData);

      expect(updatedPreference).toBeDefined();
      expect(updatedPreference?.userId).toBe(mockUserPreference.userId);
      expect(updatedPreference?.theme).toBe(updatedData.theme);
      expect(updatedPreference?.language).toBe(updatedData.language);
      expect(updatedPreference?.notifications).toEqual(updatedData.notifications);
    });

    it('should return null if user preference is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedData = { theme: 'light' };

      const updatedPreference = await userPreferenceRepository.update(nonExistentId, updatedData);

      expect(updatedPreference).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a user preference', async () => {
      const mockUserPreference: IUserPreference = {
        userId: 'user123',
        theme: 'dark',
        language: 'en',
        notifications: {
          email: true,
          push: false
        }
      };

      const createdPreference = await userPreferenceRepository.create(mockUserPreference);

      const deleteResult = await userPreferenceRepository.delete(createdPreference._id);

      expect(deleteResult).toBe(true);

      const foundPreference = await userPreferenceRepository.findByUserId(mockUserPreference.userId);
      expect(foundPreference).toBeNull();
    });

    it('should return false if user preference is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const deleteResult = await userPreferenceRepository.delete(nonExistentId);

      expect(deleteResult).toBe(false);
    });
  });
});