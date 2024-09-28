import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account.model';

// Assuming asyncHandler is a middleware for handling async errors
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export class AccountController {
  private accountService: AccountService;

  constructor(accountService: AccountService) {
    this.accountService = accountService;
  }

  @asyncHandler
  public async getAccounts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id; // Assuming the user ID is attached to the request by authentication middleware
      const accounts = await this.accountService.getAccountsByUserId(userId);
      res.status(StatusCodes.OK).json(accounts);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching accounts' });
    }
  }

  @asyncHandler
  public async getAccountById(req: Request, res: Response): Promise<void> {
    try {
      const accountId = req.params.id;
      const userId = req.user.id;
      const account = await this.accountService.getAccountById(accountId, userId);
      if (account) {
        res.status(StatusCodes.OK).json(account);
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Account not found' });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching account' });
    }
  }

  @asyncHandler
  public async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const accountData: Partial<Account> = req.body;
      const newAccount = await this.accountService.createAccount(userId, accountData);
      res.status(StatusCodes.CREATED).json(newAccount);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Error creating account' });
    }
  }

  @asyncHandler
  public async updateAccount(req: Request, res: Response): Promise<void> {
    try {
      const accountId = req.params.id;
      const userId = req.user.id;
      const accountData: Partial<Account> = req.body;
      const updatedAccount = await this.accountService.updateAccount(accountId, userId, accountData);
      if (updatedAccount) {
        res.status(StatusCodes.OK).json(updatedAccount);
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Account not found' });
      }
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Error updating account' });
    }
  }

  @asyncHandler
  public async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const accountId = req.params.id;
      const userId = req.user.id;
      const deleted = await this.accountService.deleteAccount(accountId, userId);
      if (deleted) {
        res.status(StatusCodes.OK).json({ message: 'Account deleted successfully' });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Account not found' });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting account' });
    }
  }

  @asyncHandler
  public async syncAccount(req: Request, res: Response): Promise<void> {
    try {
      const accountId = req.params.id;
      const userId = req.user.id;
      const syncedAccount = await this.accountService.syncAccount(accountId, userId);
      if (syncedAccount) {
        res.status(StatusCodes.OK).json(syncedAccount);
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Account not found' });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error syncing account' });
    }
  }
}

// Human tasks:
// 1. Implement error handling middleware to catch and format errors consistently across all controllers
// 2. Implement input validation middleware using a library like Joi or express-validator
// 3. Set up authentication middleware to ensure user is authenticated before accessing account endpoints
// 4. Implement rate limiting to prevent abuse of the API