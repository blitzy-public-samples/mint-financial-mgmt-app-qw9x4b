import { Express } from 'express';

// Since we don't have access to the User type from "../types/index",
// we'll define a placeholder type here. In a real scenario, you would
// import this type from the correct location.
interface User {
  // Add properties that you expect a User to have
  id: string;
  email: string;
  // Add other relevant properties
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
  }
}