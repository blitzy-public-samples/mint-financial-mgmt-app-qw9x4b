import { Request, Response } from 'express';
import { AuthRequest } from '../interfaces/request.interface';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import HttpStatus from 'http-status';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }

      const userProfile = await this.userService.getUserProfile(userId);
      res.status(HttpStatus.OK).json(userProfile);
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving user profile' });
    }
  };

  public updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }

      const updatedProfile = req.body;
      const updatedUser = await this.userService.updateUserProfile(userId, updatedProfile);
      res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error updating user profile' });
    }
  };

  public deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }

      await this.userService.deleteUserAccount(userId);
      res.status(HttpStatus.OK).json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Error in deleteAccount:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting user account' });
    }
  };

  public changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }

      const { oldPassword, newPassword } = req.body;
      await this.userService.changeUserPassword(userId, oldPassword, newPassword);
      res.status(HttpStatus.OK).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error in changePassword:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error changing password' });
    }
  };

  public getUserPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }

      const preferences = await this.userService.getUserPreferences(userId);
      res.status(HttpStatus.OK).json(preferences);
    } catch (error) {
      console.error('Error in getUserPreferences:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving user preferences' });
    }
  };

  public updateUserPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }

      const updatedPreferences = req.body;
      const preferences = await this.userService.updateUserPreferences(userId, updatedPreferences);
      res.status(HttpStatus.OK).json(preferences);
    } catch (error) {
      console.error('Error in updateUserPreferences:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error updating user preferences' });
    }
  };
}

// TODO: Implement proper error handling and logging mechanisms
// TODO: Add input validation for all controller methods
// TODO: Implement rate limiting for sensitive operations like password changes
// TODO: Add unit tests for all controller methods
// TODO: Implement proper authentication middleware to ensure only authorized users can access these endpoints