import { Model, Document, Schema } from 'mongoose';
import { Account, AccountType, CreateAccountDTO, UpdateAccountDTO } from '../types/account';

// Interface representing an Account document in MongoDB
export interface AccountDocument extends Document, Account {}

// Mongoose schema for the Account collection
const accountSchema = new Schema<AccountDocument>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(AccountType), required: true },
  balance: { type: Number, required: true },
  currency: { type: String, required: true },
  institutionName: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

// Add indexes for optimized querying
accountSchema.index({ userId: 1 });
accountSchema.index({ type: 1 });

// Mongoose model for the Account collection
export const AccountModel: Model<AccountDocument> = Model<AccountDocument>('Account', accountSchema);

export class AccountModelClass {
  /**
   * Creates a new account
   * @param accountData The data for creating a new account
   * @returns The created account document
   */
  static async createAccount(accountData: CreateAccountDTO): Promise<AccountDocument> {
    try {
      // Validate the input data
      if (!accountData.userId || !accountData.name || !accountData.type || accountData.balance === undefined || !accountData.currency || !accountData.institutionName) {
        throw new Error('Missing required fields for account creation');
      }

      // Create a new account document
      const newAccount = new AccountModel(accountData);

      // Save the account document to the database
      const savedAccount = await newAccount.save();

      return savedAccount;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  /**
   * Updates an existing account
   * @param accountId The ID of the account to update
   * @param updateData The data to update the account with
   * @returns The updated account document or null if not found
   */
  static async updateAccount(accountId: string, updateData: UpdateAccountDTO): Promise<AccountDocument | null> {
    try {
      // Validate the input data
      if (!accountId) {
        throw new Error('Account ID is required for updating an account');
      }

      // Find the account by ID and update it
      const updatedAccount = await AccountModel.findByIdAndUpdate(
        accountId,
        { $set: updateData, lastUpdated: new Date() },
        { new: true, runValidators: true }
      );

      return updatedAccount;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  /**
   * Retrieves an account by its ID
   * @param accountId The ID of the account to retrieve
   * @returns The account document or null if not found
   */
  static async getAccountById(accountId: string): Promise<AccountDocument | null> {
    try {
      // Find the account by ID
      const account = await AccountModel.findById(accountId);

      return account;
    } catch (error) {
      console.error('Error retrieving account by ID:', error);
      throw error;
    }
  }

  /**
   * Retrieves all accounts for a given user
   * @param userId The ID of the user
   * @returns An array of account documents
   */
  static async getAccountsByUserId(userId: string): Promise<AccountDocument[]> {
    try {
      // Find all accounts with the given userId
      const accounts = await AccountModel.find({ userId, isActive: true });

      return accounts;
    } catch (error) {
      console.error('Error retrieving accounts by user ID:', error);
      throw error;
    }
  }

  /**
   * Deletes an account by its ID
   * @param accountId The ID of the account to delete
   * @returns True if the account was deleted, false otherwise
   */
  static async deleteAccount(accountId: string): Promise<boolean> {
    try {
      // Find and delete the account by ID
      const result = await AccountModel.findByIdAndUpdate(accountId, { isActive: false });

      return !!result;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

export default AccountModelClass;