/**
 * RequestInterface: Standardizes the structure of incoming API requests
 * across different endpoints in the Mint Replica application.
 */
export interface RequestInterface {
  /**
   * The request body containing any data sent with the request.
   * This can vary based on the specific API endpoint.
   */
  body: any;

  /**
   * URL parameters extracted from the request URL.
   * These are typically used for resource identifiers.
   */
  params: Record<string, string>;

  /**
   * Query parameters from the request URL.
   * These are used for filtering, pagination, etc.
   */
  query: Record<string, string>;

  /**
   * HTTP headers included with the request.
   * These can include authentication tokens, content type, etc.
   */
  headers: Record<string, string>;

  /**
   * User information, typically populated after authentication.
   */
  user: {
    id: string;
    email: string;
  };
}

// TODO: Review and refine the RequestInterface properties based on specific API requirements
// TODO: Consider adding more specific types for the 'body' property based on different request types