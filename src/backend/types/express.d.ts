import { Express } from 'express-serve-static-core';
import { User } from '../models/user.model'; // Assuming this is the correct path for the User type

declare global {
  namespace Express {
    interface Request {
      user?: User; // The authenticated user object
    }

    interface Response {
      sendSuccess(data: any, message?: string): void;
      sendError(error: Error, statusCode?: number): void;
    }
  }
}

// Export the Express namespace to make the modifications available
export {};

// Human tasks:
// TODO: Review and ensure all necessary custom properties for Request and Response are included
// TODO: Verify that the User type is properly imported and used in the Request interface extension
// TODO: Consider adding any additional custom middleware or properties specific to the Mint Replica application