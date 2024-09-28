import jwt from 'jsonwebtoken';
import { config } from '../config';

// JWT secret key and expiration time
const JWT_SECRET = config.env.JWT_SECRET;
const JWT_EXPIRATION = config.env.JWT_EXPIRATION || '1h';

/**
 * Generates a JWT for a given user
 * @param payload - The payload to be encoded in the JWT
 * @returns A promise that resolves to the generated JWT
 */
export const generateToken = (payload: object): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate the payload object
    if (!payload || typeof payload !== 'object') {
      reject(new Error('Invalid payload'));
      return;
    }

    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token as string);
      }
    });
  });
};

/**
 * Verifies the validity of a given JWT
 * @param token - The JWT to verify
 * @returns A promise that resolves to the decoded token payload if valid, null otherwise
 */
export const verifyToken = (token: string): Promise<object | null> => {
  return new Promise((resolve) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        resolve(null);
      } else {
        resolve(decoded as object);
      }
    });
  });
};

/**
 * Decodes a JWT without verifying its signature
 * @param token - The JWT to decode
 * @returns The decoded token payload
 */
export const decodeToken = (token: string): object | null => {
  return jwt.decode(token);
};

/**
 * Generates a new JWT based on an existing valid token
 * @param token - The existing JWT to refresh
 * @returns A promise that resolves to a new JWT if the original token is valid, null otherwise
 */
export const refreshToken = async (token: string): Promise<string | null> => {
  const decoded = await verifyToken(token);
  if (decoded) {
    return generateToken(decoded);
  }
  return null;
};

// List of human tasks
/**
 * Human tasks:
 * 1. Ensure JWT_SECRET is securely stored and not exposed in the codebase (Critical)
 * 2. Review and adjust JWT_EXPIRATION time based on security requirements (Required)
 * 3. Implement proper error handling for token verification failures (Required)
 */