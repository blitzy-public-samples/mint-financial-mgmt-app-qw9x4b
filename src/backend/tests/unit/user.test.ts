import { UserController } from '../../controllers/user.controller';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthRequest } from '../../interfaces/request.interface';
import { Response } from 'express';

// Mock the UserService
jest.mock('../../services/user.service');

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockUserService = new UserService() as jest.Mocked<UserService>;
    userController = new UserController(mockUserService);

    mockRequest = {
      user: { id: 'testUserId' },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUserProfile: Partial<User> = {
        id: 'testUserId',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserService.getProfile.mockResolvedValue(mockUserProfile as User);

      await userController.getProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(mockUserService.getProfile).toHaveBeenCalledWith('testUserId');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update and return user profile', async () => {
      const updatedProfileData = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const mockUpdatedProfile: Partial<User> = {
        id: 'testUserId',
        email: 'test@example.com',
        ...updatedProfileData,
      };

      mockRequest.body = updatedProfileData;
      mockUserService.updateProfile.mockResolvedValue(mockUpdatedProfile as User);

      await userController.updateProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(mockUserService.updateProfile).toHaveBeenCalledWith('testUserId', updatedProfileData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedProfile);
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account and return success message', async () => {
      mockUserService.deleteAccount.mockResolvedValue(true);

      await userController.deleteAccount(mockRequest as AuthRequest, mockResponse as Response);

      expect(mockUserService.deleteAccount).toHaveBeenCalledWith('testUserId');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Account deleted successfully' });
    });
  });

  describe('changePassword', () => {
    it('should change user password and return success message', async () => {
      const passwordData = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };

      mockRequest.body = passwordData;
      mockUserService.changePassword.mockResolvedValue(true);

      await userController.changePassword(mockRequest as AuthRequest, mockResponse as Response);

      expect(mockUserService.changePassword).toHaveBeenCalledWith('testUserId', passwordData.oldPassword, passwordData.newPassword);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
    });
  });

  describe('getUserPreferences', () => {
    it('should return user preferences', async () => {
      const mockUserPreferences = {
        theme: 'dark',
        language: 'en',
        notifications: true,
      };

      mockUserService.getUserPreferences.mockResolvedValue(mockUserPreferences);

      await userController.getUserPreferences(mockRequest as AuthRequest, mockResponse as Response);

      expect(mockUserService.getUserPreferences).toHaveBeenCalledWith('testUserId');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserPreferences);
    });
  });

  describe('updateUserPreferences', () => {
    it('should update and return user preferences', async () => {
      const updatedPreferences = {
        theme: 'light',
        language: 'es',
        notifications: false,
      };

      mockRequest.body = updatedPreferences;
      mockUserService.updateUserPreferences.mockResolvedValue(updatedPreferences);

      await userController.updateUserPreferences(mockRequest as AuthRequest, mockResponse as Response);

      expect(mockUserService.updateUserPreferences).toHaveBeenCalledWith('testUserId', updatedPreferences);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedPreferences);
    });
  });
});

// TODO: Implement error case tests for each UserController method
// TODO: Add tests for input validation in UserController methods
// TODO: Implement integration tests with actual database connections (Optional)