import mongoose, { Model, Document } from 'mongoose';
import { UserPreference, IUserPreference } from '../../models/mongodb/userPreference.model';

export class UserPreferenceRepository {
  private model: Model<IUserPreference>;

  constructor() {
    this.model = UserPreference;
  }

  /**
   * Creates a new user preference document
   * @param userPreference The user preference data to create
   * @returns A Promise resolving to the created user preference document
   */
  async create(userPreference: IUserPreference): Promise<IUserPreference> {
    try {
      // Validate the input userPreference object
      if (!userPreference || !userPreference.userId) {
        throw new Error('Invalid user preference data');
      }

      // Create a new UserPreference document
      const newUserPreference = new this.model(userPreference);

      // Save the document to the database
      const savedUserPreference = await newUserPreference.save();

      // Return the created document
      return savedUserPreference.toObject();
    } catch (error) {
      console.error('Error creating user preference:', error);
      throw error;
    }
  }

  /**
   * Finds a user preference document by user ID
   * @param userId The ID of the user
   * @returns A Promise resolving to the user preference document or null if not found
   */
  async findByUserId(userId: string): Promise<IUserPreference | null> {
    try {
      // Validate the input userId
      if (!userId) {
        throw new Error('Invalid user ID');
      }

      // Query the database for a UserPreference document with the given userId
      const userPreference = await this.model.findOne({ userId }).exec();

      // Return the found document or null if not found
      return userPreference ? userPreference.toObject() : null;
    } catch (error) {
      console.error('Error finding user preference:', error);
      throw error;
    }
  }

  /**
   * Updates a user preference document
   * @param userId The ID of the user
   * @param updateData The data to update
   * @returns A Promise resolving to the updated user preference document or null if not found
   */
  async update(userId: string, updateData: Partial<IUserPreference>): Promise<IUserPreference | null> {
    try {
      // Validate the input userId and updateData
      if (!userId || !updateData) {
        throw new Error('Invalid update data');
      }

      // Find and update the UserPreference document with the given userId
      const updatedUserPreference = await this.model.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, runValidators: true }
      ).exec();

      // Return the updated document or null if not found
      return updatedUserPreference ? updatedUserPreference.toObject() : null;
    } catch (error) {
      console.error('Error updating user preference:', error);
      throw error;
    }
  }

  /**
   * Deletes a user preference document
   * @param userId The ID of the user
   * @returns A Promise resolving to true if deleted, false if not found
   */
  async delete(userId: string): Promise<boolean> {
    try {
      // Validate the input userId
      if (!userId) {
        throw new Error('Invalid user ID');
      }

      // Find and delete the UserPreference document with the given userId
      const result = await this.model.deleteOne({ userId }).exec();

      // Return true if a document was deleted, false otherwise
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user preference:', error);
      throw error;
    }
  }
}

export default UserPreferenceRepository;

// Human tasks:
// TODO: Implement error handling and logging for database operations
// TODO: Add input validation for all repository methods
// TODO: Consider implementing a caching mechanism for frequently accessed user preferences
// TODO: Implement method to bulk update user preferences for performance optimization