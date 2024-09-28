import { Request } from 'express';

/**
 * Represents the structure of a user object
 */
type UserType = {
  id: string;
  email: string;
  role: string;
};

/**
 * Extends the Express Request interface to include custom properties for the Mint Replica application
 */
export interface RequestInterface extends Request {
  /**
   * The authenticated user making the request
   */
  user: UserType;

  /**
   * URL parameters
   */
  params: Record<string, string>;

  /**
   * Query string parameters
   */
  query: Record<string, string>;

  /**
   * Request body
   */
  body: any;
}

// Human tasks:
// TODO: Verify that the RequestInterface includes all necessary properties for the Mint Replica application
// TODO: Ensure that the UserType definition aligns with the actual user model used in the application