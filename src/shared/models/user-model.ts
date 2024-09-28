import { Model, Document } from 'mongoose';
import { UserType } from '../types';

// Interface representing a user document in the database
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose model for the User collection
export class UserModel {
  private model: Model<IUser>;

  constructor(model: Model<IUser>) {
    this.model = model;
  }

  /**
   * Creates a new user in the database
   * @param userData The user data to create
   * @returns The created user document
   */
  async createUser(userData: UserType): Promise<IUser> {
    // TODO: Implement password hashing
    const newUser = new this.model(userData);
    return await newUser.save();
  }

  /**
   * Finds a user by their email address
   * @param email The email address to search for
   * @returns The found user document or null if not found
   */
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  /**
   * Updates a user's information
   * @param userId The ID of the user to update
   * @param updateData The data to update
   * @returns The updated user document or null if not found
   */
  async updateUser(userId: string, updateData: Partial<UserType>): Promise<IUser | null> {
    // TODO: Implement input validation
    return await this.model.findByIdAndUpdate(userId, updateData, { new: true });
  }

  /**
   * Deletes a user from the database
   * @param userId The ID of the user to delete
   * @returns True if the user was deleted, false otherwise
   */
  async deleteUser(userId: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(userId);
    return result !== null;
  }
}

// TODO: Implement password hashing in the createUser method
// TODO: Add input validation for user data in createUser and updateUser methods
// TODO: Implement proper error handling for database operations
// TODO: Add indexes to the User schema for optimized querying (e.g., email index)