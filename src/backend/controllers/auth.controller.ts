import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { Request as CustomRequest } from '../interfaces/request.interface';
import { Response as CustomResponse } from '../interfaces/response.interface';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: CustomRequest, res: CustomResponse, next: NextFunction): Promise<void> => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate user input
      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }

      const result = await this.authService.register({ email, password, firstName, lastName });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: CustomRequest, res: CustomResponse, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Validate user input
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: CustomRequest, res: CustomResponse, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(400).json({ message: 'Token is required' });
        return;
      }

      await this.authService.logout(token);
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: CustomRequest, res: CustomResponse, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
      }

      const result = await this.authService.refreshToken(refreshToken);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();

// Human tasks:
// TODO: Implement proper error handling middleware
// TODO: Set up input validation using a library like Joi or express-validator
// TODO: Implement rate limiting for authentication endpoints
// TODO: Set up proper logging for authentication events