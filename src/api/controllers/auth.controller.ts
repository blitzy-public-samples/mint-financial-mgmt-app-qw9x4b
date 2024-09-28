import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { HttpStatus } from '../constants/httpStatus';
import { AuthRequest } from '../interfaces/request.interface';
import { errorHandler } from '../utils/errorHandler';

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Handles user registration
   * @param req AuthRequest
   * @param res Response
   */
  public register = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const result = await this.authService.register(userData);
      res.status(HttpStatus.CREATED).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  };

  /**
   * Handles user login
   * @param req AuthRequest
   * @param res Response
   */
  public login = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(HttpStatus.OK).json({
        message: 'User logged in successfully',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  };

  /**
   * Handles user logout
   * @param req AuthRequest
   * @param res Response
   */
  public logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      await this.authService.logout(userId);
      res.status(HttpStatus.OK).json({ message: 'User logged out successfully' });
    } catch (error) {
      errorHandler(error, req, res);
    }
  };

  /**
   * Handles token refresh
   * @param req AuthRequest
   * @param res Response
   */
  public refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      res.status(HttpStatus.OK).json({
        message: 'Token refreshed successfully',
        accessToken: result.accessToken
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  };

  /**
   * Handles forgot password request
   * @param req AuthRequest
   * @param res Response
   */
  public forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res.status(HttpStatus.OK).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      errorHandler(error, req, res);
    }
  };

  /**
   * Handles password reset
   * @param req AuthRequest
   * @param res Response
   */
  public resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      res.status(HttpStatus.OK).json({ message: 'Password reset successfully' });
    } catch (error) {
      errorHandler(error, req, res);
    }
  };
}

export default AuthController;

// Human tasks:
// TODO: Implement multi-factor authentication in the login process
// TODO: Add rate limiting to prevent brute-force attacks
// TODO: Implement OAuth 2.0 for third-party authentication