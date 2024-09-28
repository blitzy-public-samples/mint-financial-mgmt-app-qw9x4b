import { injectable, inject } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { AccountModel } from '../models/account.model';
import { FinancialDataProvider } from '../interfaces/financialDataProvider.interface';
import { PlaidService } from './external/plaid.service';

@injectable()
export class AccountService {
  private accountModel: AccountModel;
  private plaidService: PlaidService;

  constructor(
    @inject(AccountModel) accountModel: AccountModel,
    @inject(PlaidService) plaidService: PlaidService
  ) {
    this.accountModel = accountModel;
    this.plaidService = plaidService;
  }

  async createAccount(accountData: any): Promise<Account> {
    try {
      // Validate account data
      this.validateAccountData(accountData);

      // Generate a unique account ID
      const accountId = uuidv4();

      // Create account in the database
      const newAccount = await this.accountModel.create({ ...accountData, id: accountId });

      return newAccount;
    } catch (error) {
      // Log the error and throw a custom error
      console.error('Error creating account:', error);
      throw new Error('Failed to create account');
    }
  }

  async getAccount(accountId: string): Promise<Account | null> {
    try {
      // Validate account ID
      if (!accountId || typeof accountId !== 'string') {
        throw new Error('Invalid account ID');
      }

      // Fetch account from the database
      const account = await this.accountModel.findById(accountId);

      return account;
    } catch (error) {
      console.error('Error fetching account:', error);
      throw new Error('Failed to fetch account');
    }
  }

  async updateAccount(accountId: string, updateData: any): Promise<Account> {
    try {
      // Validate account ID and update data
      if (!accountId || typeof accountId !== 'string') {
        throw new Error('Invalid account ID');
      }
      this.validateAccountData(updateData);

      // Fetch account from the database
      const existingAccount = await this.accountModel.findById(accountId);
      if (!existingAccount) {
        throw new Error('Account not found');
      }

      // Update account with new data
      const updatedAccount = await this.accountModel.update(accountId, updateData);

      return updatedAccount;
    } catch (error) {
      console.error('Error updating account:', error);
      throw new Error('Failed to update account');
    }
  }

  async deleteAccount(accountId: string): Promise<boolean> {
    try {
      // Validate account ID
      if (!accountId || typeof accountId !== 'string') {
        throw new Error('Invalid account ID');
      }

      // Delete account from the database
      const result = await this.accountModel.delete(accountId);

      return result;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw new Error('Failed to delete account');
    }
  }

  async getUserAccounts(userId: string): Promise<Account[]> {
    try {
      // Validate user ID
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
      }

      // Fetch all accounts for the user from the database
      const accounts = await this.accountModel.findByUserId(userId);

      return accounts;
    } catch (error) {
      console.error('Error fetching user accounts:', error);
      throw new Error('Failed to fetch user accounts');
    }
  }

  async syncAccount(accountId: string): Promise<Account> {
    try {
      // Validate account ID
      if (!accountId || typeof accountId !== 'string') {
        throw new Error('Invalid account ID');
      }

      // Fetch account from the database
      const account = await this.accountModel.findById(accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      // Use PlaidService to sync account data
      const syncedData = await this.plaidService.syncAccountData(account.plaidAccessToken);

      // Update account with synced data
      const updatedAccount = await this.accountModel.update(accountId, syncedData);

      return updatedAccount;
    } catch (error) {
      console.error('Error syncing account:', error);
      throw new Error('Failed to sync account');
    }
  }

  async linkAccount(userId: string, publicToken: string): Promise<Account> {
    try {
      // Validate user ID and public token
      if (!userId || typeof userId !== 'string' || !publicToken || typeof publicToken !== 'string') {
        throw new Error('Invalid user ID or public token');
      }

      // Exchange public token for access token using PlaidService
      const accessToken = await this.plaidService.exchangePublicToken(publicToken);

      // Fetch account details from Plaid
      const accountDetails = await this.plaidService.getAccountDetails(accessToken);

      // Create new account in the database
      const newAccount = await this.accountModel.create({
        userId,
        plaidAccessToken: accessToken,
        ...accountDetails,
      });

      return newAccount;
    } catch (error) {
      console.error('Error linking account:', error);
      throw new Error('Failed to link account');
    }
  }

  private validateAccountData(accountData: any): void {
    // Implement validation logic for account data
    // Throw an error if validation fails
  }
}

// Define the Account interface (this should be moved to a separate file in a real project)
interface Account {
  id: string;
  userId: string;
  name: string;
  type: string;
  balance: number;
  plaidAccessToken?: string;
  // Add other necessary properties
}

// Human tasks:
// TODO: Implement error handling and logging for all methods
// TODO: Add input validation for all method parameters
// TODO: Implement rate limiting for account syncing to avoid overloading external APIs
// TODO: Add unit tests for all methods in the AccountService
// TODO: Implement caching mechanism for frequently accessed account data