import { User } from '../models/user.model';
import { generateToken, verifyToken } from '../utils/jwt.util';
import { hashPassword, comparePassword } from '../utils/encryption.util';
import { config } from '../config';
import { HttpException } from 'http-errors';

export class AuthService {
  /**
   * Registers a new user
   * @param userData - User registration data
   * @returns Promise resolving to user object and access token
   */
  async register(userData: any): Promise<{ user: any; accessToken: string }> {
    try {
      // Validate user input
      this.validateUserData(userData);

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new HttpException(400, 'User with this email already exists');
      }

      // Hash the password
      const hashedPassword = await hashPassword(userData.password);

      // Create new user in the database
      const newUser = await User.create({
        ...userData,
        password: hashedPassword,
      });

      // Generate access token
      const accessToken = generateToken({ userId: newUser.id });

      // Return user object (excluding password) and access token
      const { password, ...userWithoutPassword } = newUser.toObject();
      return { user: userWithoutPassword, accessToken };
    } catch (error) {
      throw new HttpException(500, 'Error registering user');
    }
  }

  /**
   * Authenticates a user and returns a token
   * @param email - User's email
   * @param password - User's password
   * @returns Promise resolving to user object and access token
   */
  async login(email: string, password: string): Promise<{ user: any; accessToken: string }> {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new HttpException(401, 'Invalid credentials');
      }

      // Compare provided password with stored hash
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(401, 'Invalid credentials');
      }

      // Generate access token
      const accessToken = generateToken({ userId: user.id });

      // Return user object (excluding password) and access token
      const { password: _, ...userWithoutPassword } = user.toObject();
      return { user: userWithoutPassword, accessToken };
    } catch (error) {
      throw new HttpException(500, 'Error logging in');
    }
  }

  /**
   * Logs out a user by invalidating their token
   * @param token - User's access token
   * @returns Promise resolving to void
   */
  async logout(token: string): Promise<void> {
    try {
      // Verify the token
      const decodedToken = verifyToken(token);

      // Add token to blacklist in Redis
      await this.addTokenToBlacklist(token, decodedToken.exp);

      // Return success message
      return;
    } catch (error) {
      throw new HttpException(500, 'Error logging out');
    }
  }

  /**
   * Refreshes an access token
   * @param refreshToken - User's refresh token
   * @returns Promise resolving to new access token and refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify the refresh token
      const decodedToken = verifyToken(refreshToken);

      // Check if refresh token is blacklisted
      const isBlacklisted = await this.isTokenBlacklisted(refreshToken);
      if (isBlacklisted) {
        throw new HttpException(401, 'Invalid refresh token');
      }

      // Generate new access token and refresh token
      const accessToken = generateToken({ userId: decodedToken.userId });
      const newRefreshToken = generateToken({ userId: decodedToken.userId }, '7d');

      // Return new tokens
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new HttpException(500, 'Error refreshing token');
    }
  }

  /**
   * Verifies an access token
   * @param token - User's access token
   * @returns Promise resolving to decoded token payload
   */
  async verifyAccessToken(token: string): Promise<any> {
    try {
      // Verify the token
      const decodedToken = verifyToken(token);

      // Check if token is blacklisted
      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new HttpException(401, 'Invalid token');
      }

      // Return decoded token payload
      return decodedToken;
    } catch (error) {
      throw new HttpException(401, 'Invalid token');
    }
  }

  /**
   * Validates user input for registration
   * @param userData - User registration data
   */
  private validateUserData(userData: any): void {
    // Implement validation logic here
    // Throw HttpException with appropriate error messages if validation fails
  }

  /**
   * Adds a token to the blacklist in Redis
   * @param token - Token to be blacklisted
   * @param expirationTime - Token expiration time
   */
  private async addTokenToBlacklist(token: string, expirationTime: number): Promise<void> {
    // Implement Redis blacklist logic here
  }

  /**
   * Checks if a token is blacklisted
   * @param token - Token to be checked
   * @returns Promise resolving to boolean indicating if token is blacklisted
   */
  private async isTokenBlacklisted(token: string): Promise<boolean> {
    // Implement Redis blacklist check logic here
    return false;
  }
}

// Human tasks:
// TODO: Implement rate limiting for login attempts to prevent brute force attacks
// TODO: Set up email verification for new user registrations
// TODO: Implement password reset functionality
// TODO: Configure token expiration times in environment variables