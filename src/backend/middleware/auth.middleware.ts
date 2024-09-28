import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.util';
import { AuthService } from '../services/auth.service';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Invalid token format' });
      return;
    }

    try {
      const decoded = await verifyToken(token);
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({ message: 'User not authorized' });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// TODO: Implement proper error handling and logging mechanisms
// TODO: Set up environment variables for JWT secret and token expiration time
// TODO: Implement token refresh mechanism (Optional)