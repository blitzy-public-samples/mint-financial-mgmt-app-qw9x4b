import { AccountModel } from '../models/account.model';
import { PlaidService } from './external/plaid.service';
import { RequestInterface } from '../interfaces/request.interface';
import { ResponseInterface } from '../interfaces/response.interface';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../utils/errors';

export class AccountService {
  private accountModel: AccountModel;
  private plaidService: PlaidService;

  constructor(accountModel: AccountModel, plaidService: PlaidService) {
    this.accountModel = accountModel;
    this.plaidService = plaidService;
  }

  /**
   * Creates a new account for a user
   * @param req - The request object containing account details
   * @returns A promise resolving to the newly created account details
   */
  async createAccount(req: RequestInterface): Promise<ResponseInterface> {
    const accountDetails = req.body;
    
    // TODO: Implement input validation for account creation
    
    const account_id = uuidv4();
    const newAccount = await this.accountModel.create({
      ...accountDetails,
      account_id,
    });

    return {
      status: 201,
      data: newAccount,
      message: 'Account created successfully',
    };
  }

  /**
   * Retrieves all accounts for a user
   * @param req - The request object containing the user_id
   * @returns A promise resolving to the list of user accounts
   */
  async getAccounts(req: RequestInterface): Promise<ResponseInterface> {
    const { user_id } = req.params;
    const accounts = await this.accountModel.findAll({ where: { user_id } });

    return {
      status: 200,
      data: accounts,
      message: 'Accounts retrieved successfully',
    };
  }

  /**
   * Retrieves a specific account by its ID
   * @param req - The request object containing the account_id
   * @returns A promise resolving to the account details
   */
  async getAccountById(req: RequestInterface): Promise<ResponseInterface> {
    const { account_id } = req.params;
    const account = await this.accountModel.findOne({ where: { account_id } });

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    return {
      status: 200,
      data: account,
      message: 'Account retrieved successfully',
    };
  }

  /**
   * Updates an existing account
   * @param req - The request object containing the account_id and update details
   * @returns A promise resolving to the updated account details
   */
  async updateAccount(req: RequestInterface): Promise<ResponseInterface> {
    const { account_id } = req.params;
    const updateDetails = req.body;

    // TODO: Implement input validation for account update

    const [updatedRowsCount, updatedAccounts] = await this.accountModel.update(updateDetails, {
      where: { account_id },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      throw new NotFoundError('Account not found');
    }

    return {
      status: 200,
      data: updatedAccounts[0],
      message: 'Account updated successfully',
    };
  }

  /**
   * Deletes an account
   * @param req - The request object containing the account_id
   * @returns A promise resolving to the deletion confirmation
   */
  async deleteAccount(req: RequestInterface): Promise<ResponseInterface> {
    const { account_id } = req.params;
    const deletedRowsCount = await this.accountModel.destroy({ where: { account_id } });

    if (deletedRowsCount === 0) {
      throw new NotFoundError('Account not found');
    }

    return {
      status: 200,
      data: null,
      message: 'Account deleted successfully',
    };
  }

  /**
   * Syncs account data with the linked financial institution
   * @param req - The request object containing the account_id
   * @returns A promise resolving to the synced account details
   */
  async syncAccount(req: RequestInterface): Promise<ResponseInterface> {
    const { account_id } = req.params;
    const account = await this.accountModel.findOne({ where: { account_id } });

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    try {
      // TODO: Implement rate limiting for account sync operations
      const updatedAccountData = await this.plaidService.fetchAccountData(account.plaid_access_token);
      
      const [updatedRowsCount, updatedAccounts] = await this.accountModel.update(updatedAccountData, {
        where: { account_id },
        returning: true,
      });

      return {
        status: 200,
        data: updatedAccounts[0],
        message: 'Account synced successfully',
      };
    } catch (error) {
      // TODO: Implement error handling for Plaid API integration
      console.error('Error syncing account:', error);
      throw new Error('Failed to sync account with financial institution');
    }
  }
}

// Human tasks:
// TODO: Implement error handling for Plaid API integration
// TODO: Add input validation for account creation and update operations
// TODO: Implement rate limiting for account sync operations