import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthService } from '../services/auth.service';
import { config } from '../config';

// TODO: Implement the verifyToken function in the jwt.ts utility file
// TODO: Implement the AuthService with a method to fetch user by ID
// TODO: Ensure that the config file includes the necessary JWT secret or public key
// TODO: Review and test the authMiddleware function to ensure it correctly handles various edge cases and security scenarios

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract the JWT token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer <token>"

    // Verify the token
    const decoded = await verifyToken(token);
    if (!decoded) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    // Fetch the user from the database using the user ID in the token
    const user = await AuthService.getUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Attach the user object to the request
    (req as any).user = user;

    // Call the next middleware
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { authMiddleware };