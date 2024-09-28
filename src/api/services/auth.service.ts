import bcrypt from 'bcrypt';
import { config } from '../config';
import { User } from '../models/user.model';
import { generateToken, verifyToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/encryption';

class AuthService {
  constructor() {
    // Initialize AuthService
  }

  async register(userData: any): Promise<{ user: any; token: string }> {
    try {
      // Validate user input
      this.validateUserData(userData);

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash the password
      const hashedPassword = await hashPassword(userData.password);

      // Create new user in the database
      const newUser = await User.create({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = generateToken(newUser.id);

      // Return user object (excluding password) and token
      const { password, ...userWithoutPassword } = newUser.toObject();
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      // Compare provided password with stored hash
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Return user object (excluding password) and token
      const { password: _, ...userWithoutPassword } = user.toObject();
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify the refresh token
      const decoded = verifyToken(refreshToken);
      if (!decoded) {
        throw new Error('Invalid refresh token');
      }

      // Generate new access token and refresh token
      const newAccessToken = generateToken(decoded.userId);
      const newRefreshToken = generateToken(decoded.userId, true);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  async logout(token: string): Promise<boolean> {
    try {
      // Add token to blacklist in Redis
      // Note: This is a placeholder. Actual implementation will depend on Redis setup.
      // await redisClient.setex(`blacklist_${token}`, config.jwt.expiresIn, 'true');
      return true;
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      // Check if token is blacklisted in Redis
      // Note: This is a placeholder. Actual implementation will depend on Redis setup.
      // const isBlacklisted = await redisClient.get(`blacklist_${token}`);
      // if (isBlacklisted) {
      //   throw new Error('Token is blacklisted');
      // }

      // Verify token using JWT utility
      const decoded = verifyToken(token);
      if (!decoded) {
        throw new Error('Invalid token');
      }

      return decoded;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify old password
      const isOldPasswordValid = await comparePassword(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new Error('Invalid old password');
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update user's password in the database
      await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

      return true;
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  private validateUserData(userData: any): void {
    // Implement user data validation logic
    // This is a placeholder and should be replaced with actual validation
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }
    // Add more validation as needed
  }
}

export default new AuthService();

// Human tasks:
// TODO: Implement proper error handling and logging
// TODO: Set up Redis for token blacklisting
// TODO: Implement rate limiting for authentication attempts
// TODO: Set up email verification for new user registrations