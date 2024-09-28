import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';
import { validateRegistration, validateLogin } from '../utils/validation.util';
import { ErrorHandler } from '../utils/errorHandlers';

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Register a new user
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate input
      const validationError = validateRegistration(req.body);
      if (validationError) {
        throw new ErrorHandler(400, validationError);
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new ErrorHandler(400, 'User with this email already exists');
      }

      // Register user
      const newUser = await this.authService.register({ email, password, firstName, lastName });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user: newUser }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log in a user
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      const validationError = validateLogin(req.body);
      if (validationError) {
        throw new ErrorHandler(400, validationError);
      }

      // Authenticate user
      const { user, token } = await this.authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log out a user
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new ErrorHandler(401, 'No token provided');
      }

      await this.authService.logout(token);

      res.status(200).json({
        success: true,
        message: 'User logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh user's access token
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   */
  public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        throw new ErrorHandler(400, 'Refresh token is required');
      }

      const { accessToken, newRefreshToken } = await this.authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { accessToken, refreshToken: newRefreshToken }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;

// Commented list of human tasks
/*
Human tasks:
1. Implement test cases for edge cases and error scenarios (Required)
2. Set up test database and test data fixtures (Required)
3. Implement mocking for external services and dependencies (Required)
4. Add test coverage reporting (Optional)
*/