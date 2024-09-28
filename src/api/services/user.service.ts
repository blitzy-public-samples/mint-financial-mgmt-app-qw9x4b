import { User } from '../models/user.model';
import { UserRepository } from '../../database/repositories/postgresql/user.repository';
import { AuthService } from './auth.service';
import { EncryptionUtil } from '../utils/encryption.util';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  // Add other user properties as needed
}

export class UserService {
  private userRepository: UserRepository;
  private authService: AuthService;

  constructor(userRepository: UserRepository, authService: AuthService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  async createUser(userData: UserData): Promise<User> {
    // Validate user data
    this.validateUserData(userData);

    // Check if user with email already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Generate UUID for user_id
    const userId = uuidv4();

    // Create user in database
    const newUser = await this.userRepository.create({
      ...userData,
      id: userId,
      password: hashedPassword,
    });

    // Return created user object (excluding sensitive information)
    return this.sanitizeUser(newUser);
  }

  async getUserById(userId: string): Promise<User | null> {
    // Validate userId
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Retrieve user from database
    const user = await this.userRepository.findById(userId);

    // Return user object or null if not found
    return user ? this.sanitizeUser(user) : null;
  }

  async updateUser(userId: string, updateData: Partial<UserData>): Promise<User> {
    // Validate userId and updateData
    if (!userId) {
      throw new Error('User ID is required');
    }
    this.validateUserData(updateData, true);

    // Retrieve user from database
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update user information
    const updatedUser = await this.userRepository.update(userId, updateData);

    // Return updated user object
    return this.sanitizeUser(updatedUser);
  }

  async deleteUser(userId: string): Promise<boolean> {
    // Validate userId
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Delete user from database
    const result = await this.userRepository.delete(userId);

    // Return result of deletion operation
    return result;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    // Validate userId, oldPassword, and newPassword
    if (!userId || !oldPassword || !newPassword) {
      throw new Error('User ID, old password, and new password are required');
    }

    // Retrieve user from database
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new Error('Invalid old password');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in database
    const result = await this.userRepository.updatePassword(userId, hashedNewPassword);

    // Return result of password change operation
    return result;
  }

  async getUserPreferences(userId: string): Promise<object> {
    // Validate userId
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Retrieve user preferences from database
    const preferences = await this.userRepository.getUserPreferences(userId);

    // Return user preferences object
    return preferences;
  }

  async updateUserPreferences(userId: string, preferences: object): Promise<object> {
    // Validate userId and preferences
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!preferences || typeof preferences !== 'object') {
      throw new Error('Invalid preferences object');
    }

    // Update user preferences in database
    const updatedPreferences = await this.userRepository.updateUserPreferences(userId, preferences);

    // Return updated user preferences object
    return updatedPreferences;
  }

  private validateUserData(userData: Partial<UserData>, isUpdate: boolean = false): void {
    if (!isUpdate) {
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }
    }
    // Add more validation rules as needed
  }

  private sanitizeUser(user: User): User {
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    return sanitizedUser;
  }
}

// TODO: Implement proper error handling and logging for each method
// TODO: Add input validation for all methods to ensure data integrity
// TODO: Implement rate limiting for sensitive operations like password changes
// TODO: Add unit tests for all methods in the UserService class
// TODO: Implement proper data sanitization to prevent XSS attacks
// TODO: Review and update security measures for handling sensitive user data