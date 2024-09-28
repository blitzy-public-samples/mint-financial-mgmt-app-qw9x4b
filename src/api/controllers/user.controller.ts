import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { HttpStatus } from '../constants/httpStatus';
import { ApiError } from '../utils/ApiError';

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id; // Assuming the user ID is attached to the request by authentication middleware
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
      }

      const userProfile = await this.userService.getUserProfile(userId);
      res.status(HttpStatus.OK).json(userProfile);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id; // Assuming the user ID is attached to the request by authentication middleware
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
      }

      const updateData = req.body; // TODO: Add input validation
      const updatedProfile = await this.userService.updateUserProfile(userId, updateData);
      res.status(HttpStatus.OK).json(updatedProfile);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public getUserPreferences = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id; // Assuming the user ID is attached to the request by authentication middleware
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
      }

      const userPreferences = await this.userService.getUserPreferences(userId);
      res.status(HttpStatus.OK).json(userPreferences);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public updateUserPreferences = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id; // Assuming the user ID is attached to the request by authentication middleware
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
      }

      const preferencesData = req.body; // TODO: Add input validation
      const updatedPreferences = await this.userService.updateUserPreferences(userId, preferencesData);
      res.status(HttpStatus.OK).json(updatedPreferences);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
      }
    }
  };
}

export default UserController;

// TODO: Implement proper error handling for all controller methods
// TODO: Add input validation for updateUserProfile and updateUserPreferences methods
// TODO: Implement rate limiting for API endpoints to prevent abuse