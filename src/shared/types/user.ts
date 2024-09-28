/**
 * This file defines the types related to user data in the Mint Replica application.
 * It includes types for user profiles, authentication, and preferences.
 */

/**
 * Represents a user in the Mint Replica application
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents user credentials for authentication
 */
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * Represents user preferences for the application
 */
export interface UserPreferences {
  userId: string;
  currency: string;
  language: string;
  notificationPreferences: NotificationPreferences;
}

/**
 * Represents user notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

/**
 * Represents a user's public profile
 */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Represents the input for updating a user's information
 */
export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: Date;
}

// Human tasks:
// TODO: Review and validate the defined types to ensure they cover all necessary user-related data for the Mint Replica application
// TODO: Consider adding more specific types or enums for fields like 'currency' and 'language' in UserPreferences