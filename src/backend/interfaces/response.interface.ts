/**
 * This file defines the ResponseInterface, which is used to standardize the structure of API responses
 * in the backend of the Mint Replica application. It provides a consistent format for all API responses,
 * including success and error cases.
 */

/**
 * Interface for standardizing the structure of API responses
 */
export interface ResponseInterface {
  /** Indicates whether the API request was successful */
  success: boolean;
  /** Contains the main payload of the response */
  data: any;
  /** A descriptive message about the response */
  message: string;
  /** An array of error objects, if any */
  errors: Array<{ field: string; message: string }>;
  /** The HTTP status code of the response */
  statusCode: number;
}

/**
 * Interface for standardizing error responses
 */
export interface ErrorResponseInterface {
  /** Always false for error responses */
  success: false;
  /** A descriptive error message */
  message: string;
  /** An array of error objects with field and message properties */
  errors: Array<{ field: string; message: string }>;
  /** The HTTP status code of the error response */
  statusCode: number;
}

/**
 * Interface for standardizing success responses
 */
export interface SuccessResponseInterface {
  /** Always true for success responses */
  success: true;
  /** Contains the main payload of the successful response */
  data: any;
  /** A descriptive success message */
  message: string;
  /** The HTTP status code of the success response */
  statusCode: number;
}

// TODO: Review and refine the ResponseInterface properties based on specific API requirements
// TODO: Consider adding more specific types for the 'data' property based on different response types
// TODO: Ensure that all API endpoints in the backend use these response interfaces consistently