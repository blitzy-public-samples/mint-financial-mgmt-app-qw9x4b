import { UserRepository } from '../../repositories/postgresql/user.repository';
import { UserModel } from '../../models/postgresql/user.model';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { Sequelize } from 'sequelize';
import SequelizeMock from 'sequelize-mock';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockSequelize: Sequelize;
  let mockUserModel: any;

  beforeEach(async () => {
    // Setup mock database
    mockSequelize = new SequelizeMock();
    mockUserModel = mockSequelize.define('User', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    userRepository = new UserRepository(mockUserModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData: UserInterface = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const createdUser = await userRepository.create(userData);

      expect(createdUser).toBeDefined();
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.firstName).toBe(userData.firstName);
      expect(createdUser.lastName).toBe(userData.lastName);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const userData: UserInterface = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const createdUser = await userRepository.create(userData);
      const foundUser = await userRepository.findById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser!.id).toBe(createdUser.id);
      expect(foundUser!.email).toBe(userData.email);
    });

    it('should return null if user is not found', async () => {
      const foundUser = await userRepository.findById('non-existent-id');
      expect(foundUser).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const userData: UserInterface = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      await userRepository.create(userData);
      const foundUser = await userRepository.findByEmail(userData.email);

      expect(foundUser).toBeDefined();
      expect(foundUser!.email).toBe(userData.email);
    });

    it('should return null if user is not found', async () => {
      const foundUser = await userRepository.findByEmail('non-existent@example.com');
      expect(foundUser).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userData: UserInterface = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const createdUser = await userRepository.create(userData);
      const updatedData = { firstName: 'Jane', lastName: 'Smith' };
      const updatedUser = await userRepository.update(createdUser.id, updatedData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser!.firstName).toBe(updatedData.firstName);
      expect(updatedUser!.lastName).toBe(updatedData.lastName);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const userData: UserInterface = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const createdUser = await userRepository.create(userData);
      const deleteResult = await userRepository.delete(createdUser.id);

      expect(deleteResult).toBe(true);

      const foundUser = await userRepository.findById(createdUser.id);
      expect(foundUser).toBeNull();
    });

    it('should return false if user is not found', async () => {
      const deleteResult = await userRepository.delete('non-existent-id');
      expect(deleteResult).toBe(false);
    });
  });
});