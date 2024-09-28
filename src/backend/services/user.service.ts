import { User } from '../models/user.model';
import { IRequest } from '../interfaces/request.interface';
import { IResponse } from '../interfaces/response.interface';
import { encryptPassword, comparePassword } from '../utils/encryption.util';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class UserService {
  private userModel: typeof User;

  constructor(userModel: typeof User) {
    this.userModel = userModel;
  }

  async registerUser(req: IRequest): Promise<IResponse> {
    try {
      // Extract user data from the request body
      const { email, password, firstName, lastName } = req.body;

      // Validate user input
      if (!email || !password || !firstName || !lastName) {
        return { success: false, message: 'All fields are required', status: 400 };
      }

      // Check if user already exists
      const existingUser = await this.userModel.findOne({ where: { email } });
      if (existingUser) {
        return { success: false, message: 'User already exists', status: 409 };
      }

      // Encrypt the user's password
      const hashedPassword = await encryptPassword(password);

      // Create a new user in the database
      const newUser = await this.userModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Generate a JWT token for the new user
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

      return {
        success: true,
        message: 'User registered successfully',
        data: { user: newUser, token },
        status: 201,
      };
    } catch (error) {
      console.error('Error in registerUser:', error);
      return { success: false, message: 'Internal server error', status: 500 };
    }
  }

  async loginUser(req: IRequest): Promise<IResponse> {
    try {
      // Extract login credentials from the request body
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return { success: false, message: 'Email and password are required', status: 400 };
      }

      // Find the user in the database
      const user = await this.userModel.findOne({ where: { email } });
      if (!user) {
        return { success: false, message: 'Invalid credentials', status: 401 };
      }

      // Compare the provided password with the stored encrypted password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return { success: false, message: 'Invalid credentials', status: 401 };
      }

      // Generate a JWT token for the authenticated user
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

      return {
        success: true,
        message: 'User logged in successfully',
        data: { user, token },
        status: 200,
      };
    } catch (error) {
      console.error('Error in loginUser:', error);
      return { success: false, message: 'Internal server error', status: 500 };
    }
  }

  async getUserProfile(req: IRequest): Promise<IResponse> {
    try {
      // Extract the user ID from the authenticated request
      const userId = req.user?.id;

      if (!userId) {
        return { success: false, message: 'Unauthorized', status: 401 };
      }

      // Retrieve the user profile from the database
      const user = await this.userModel.findByPk(userId, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        return { success: false, message: 'User not found', status: 404 };
      }

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: { user },
        status: 200,
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return { success: false, message: 'Internal server error', status: 500 };
    }
  }

  async updateUserProfile(req: IRequest): Promise<IResponse> {
    try {
      // Extract the user ID from the authenticated request
      const userId = req.user?.id;

      if (!userId) {
        return { success: false, message: 'Unauthorized', status: 401 };
      }

      // Extract the updated profile data from the request body
      const { firstName, lastName, email } = req.body;

      // Validate the updated profile data
      if (!firstName && !lastName && !email) {
        return { success: false, message: 'No data provided for update', status: 400 };
      }

      // Update the user profile in the database
      const [updatedRowsCount, [updatedUser]] = await this.userModel.update(
        { firstName, lastName, email },
        { where: { id: userId }, returning: true }
      );

      if (updatedRowsCount === 0) {
        return { success: false, message: 'User not found', status: 404 };
      }

      return {
        success: true,
        message: 'User profile updated successfully',
        data: { user: updatedUser },
        status: 200,
      };
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return { success: false, message: 'Internal server error', status: 500 };
    }
  }

  async changePassword(req: IRequest): Promise<IResponse> {
    try {
      // Extract the user ID from the authenticated request
      const userId = req.user?.id;

      if (!userId) {
        return { success: false, message: 'Unauthorized', status: 401 };
      }

      // Extract the current password and new password from the request body
      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return { success: false, message: 'Current password and new password are required', status: 400 };
      }

      // Retrieve the user from the database
      const user = await this.userModel.findByPk(userId);

      if (!user) {
        return { success: false, message: 'User not found', status: 404 };
      }

      // Compare the current password with the stored encrypted password
      const isPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isPasswordValid) {
        return { success: false, message: 'Current password is incorrect', status: 401 };
      }

      // Encrypt the new password
      const hashedNewPassword = await encryptPassword(newPassword);

      // Update the user's password in the database
      await user.update({ password: hashedNewPassword });

      return {
        success: true,
        message: 'Password changed successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error in changePassword:', error);
      return { success: false, message: 'Internal server error', status: 500 };
    }
  }

  async deleteUser(req: IRequest): Promise<IResponse> {
    try {
      // Extract the user ID from the authenticated request
      const userId = req.user?.id;

      if (!userId) {
        return { success: false, message: 'Unauthorized', status: 401 };
      }

      // Delete the user account from the database
      const deletedRowsCount = await this.userModel.destroy({ where: { id: userId } });

      if (deletedRowsCount === 0) {
        return { success: false, message: 'User not found', status: 404 };
      }

      return {
        success: true,
        message: 'User account deleted successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return { success: false, message: 'Internal server error', status: 500 };
    }
  }
}

export default UserService;