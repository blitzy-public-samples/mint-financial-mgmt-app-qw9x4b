import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { HttpStatus } from '../../constants/httpStatus';

jest.mock('../../services/auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    } as jest.Mocked<AuthService>;

    authController = new AuthController(mockAuthService);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { user: { id: '1', email: 'test@example.com' }, token: 'jwt_token' };
      
      mockRequest.body = userData;
      mockAuthService.register.mockResolvedValue(expectedResult);

      await authController.register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should handle registration errors', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const error = new Error('Registration failed');
      
      mockRequest.body = userData;
      mockAuthService.register.mockRejectedValue(error);

      await authController.register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should successfully log in a user', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { user: { id: '1', email: 'test@example.com' }, token: 'jwt_token' };
      
      mockRequest.body = loginData;
      mockAuthService.login.mockResolvedValue(expectedResult);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should handle login errors', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const error = new Error('Login failed');
      
      mockRequest.body = loginData;
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('should successfully log out a user', async () => {
      const userId = '1';
      mockRequest.user = { id: userId };
      mockAuthService.logout.mockResolvedValue(true);

      await authController.logout(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.logout).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });

    it('should handle logout errors', async () => {
      const userId = '1';
      const error = new Error('Logout failed');
      
      mockRequest.user = { id: userId };
      mockAuthService.logout.mockRejectedValue(error);

      await authController.logout(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.logout).toHaveBeenCalledWith(userId);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh an access token', async () => {
      const refreshToken = 'refresh_token';
      const expectedResult = { accessToken: 'new_access_token' };
      
      mockRequest.body = { refreshToken };
      mockAuthService.refreshToken.mockResolvedValue(expectedResult);

      await authController.refreshToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should handle refresh token errors', async () => {
      const refreshToken = 'refresh_token';
      const error = new Error('Token refresh failed');
      
      mockRequest.body = { refreshToken };
      mockAuthService.refreshToken.mockRejectedValue(error);

      await authController.refreshToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('forgotPassword', () => {
    it('should successfully initiate the forgot password process', async () => {
      const email = 'test@example.com';
      mockRequest.body = { email };
      mockAuthService.forgotPassword.mockResolvedValue(true);

      await authController.forgotPassword(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(email);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Password reset email sent' });
    });

    it('should handle forgot password errors', async () => {
      const email = 'test@example.com';
      const error = new Error('Forgot password process failed');
      
      mockRequest.body = { email };
      mockAuthService.forgotPassword.mockRejectedValue(error);

      await authController.forgotPassword(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(email);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset a user\'s password', async () => {
      const resetData = { token: 'reset_token', newPassword: 'new_password123' };
      mockRequest.body = resetData;
      mockAuthService.resetPassword.mockResolvedValue(true);

      await authController.resetPassword(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(resetData.token, resetData.newPassword);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Password reset successful' });
    });

    it('should handle reset password errors', async () => {
      const resetData = { token: 'reset_token', newPassword: 'new_password123' };
      const error = new Error('Password reset failed');
      
      mockRequest.body = resetData;
      mockAuthService.resetPassword.mockRejectedValue(error);

      await authController.resetPassword(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(resetData.token, resetData.newPassword);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

// Human tasks:
// 1. Add more edge case scenarios for each authentication method (Optional)
// 2. Implement integration tests for authentication flow (Required)