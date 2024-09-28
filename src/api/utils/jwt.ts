import jwt from 'jsonwebtoken';
import { config } from '../config';

/**
 * Generates a JWT token for a given user ID
 * @param userId - The ID of the user for whom the token is being generated
 * @returns A JWT token as a string
 */
export const generateToken = (userId: string): string => {
  try {
    // Assuming the config file has a JWT_SECRET property
    const token = jwt.sign({ userId }, config.JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Verifies the validity of a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded token payload if valid, null if invalid
 */
export const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    // Assuming the config file has a JWT_SECRET property
    const decoded = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    return null;
  }
};

/**
 * Decodes a JWT token without verifying its signature
 * @param token - The JWT token to decode
 * @returns The decoded token payload
 */
export const decodeToken = (token: string): jwt.JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// List of human tasks
/**
 * Human Tasks:
 * 1. Ensure the JWT secret is properly set in the configuration (Critical)
 * 2. Implement proper error handling for token verification failures (Required)
 * 3. Consider implementing token refresh functionality (Optional)
 */