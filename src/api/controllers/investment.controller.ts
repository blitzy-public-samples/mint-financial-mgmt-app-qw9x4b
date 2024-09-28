import { Request, Response } from 'express';
import { InvestmentService } from '../services/investment.service';
import { InvestmentAccount, InvestmentAsset, InvestmentTransaction, InvestmentPerformance } from '../../shared/types/investment';

class InvestmentController {
  private investmentService: InvestmentService;

  constructor(investmentService: InvestmentService) {
    this.investmentService = investmentService;
  }

  public getInvestmentAccounts = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id; // Assuming user ID is attached to the request by authentication middleware
      const accounts = await this.investmentService.getInvestmentAccounts(userId);
      res.json(accounts);
    } catch (error) {
      console.error('Error in getInvestmentAccounts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getInvestmentAccountById = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = req.params.accountId;
      const account = await this.investmentService.getInvestmentAccountById(accountId);
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ message: 'Investment account not found' });
      }
    } catch (error) {
      console.error('Error in getInvestmentAccountById:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public createInvestmentAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const accountData: Partial<InvestmentAccount> = req.body;
      // TODO: Implement input validation
      const createdAccount = await this.investmentService.createInvestmentAccount(userId, accountData);
      res.status(201).json(createdAccount);
    } catch (error) {
      console.error('Error in createInvestmentAccount:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateInvestmentAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = req.params.accountId;
      const updateData: Partial<InvestmentAccount> = req.body;
      // TODO: Implement input validation
      const updatedAccount = await this.investmentService.updateInvestmentAccount(accountId, updateData);
      if (updatedAccount) {
        res.json(updatedAccount);
      } else {
        res.status(404).json({ message: 'Investment account not found' });
      }
    } catch (error) {
      console.error('Error in updateInvestmentAccount:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deleteInvestmentAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = req.params.accountId;
      const result = await this.investmentService.deleteInvestmentAccount(accountId);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Investment account not found' });
      }
    } catch (error) {
      console.error('Error in deleteInvestmentAccount:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getInvestmentAssets = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = req.params.accountId;
      const assets = await this.investmentService.getInvestmentAssets(accountId);
      res.json(assets);
    } catch (error) {
      console.error('Error in getInvestmentAssets:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public addInvestmentAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = req.params.accountId;
      const assetData: Partial<InvestmentAsset> = req.body;
      // TODO: Implement input validation
      const addedAsset = await this.investmentService.addInvestmentAsset(accountId, assetData);
      res.status(201).json(addedAsset);
    } catch (error) {
      console.error('Error in addInvestmentAsset:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateInvestmentAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      const assetId = req.params.assetId;
      const updateData: Partial<InvestmentAsset> = req.body;
      // TODO: Implement input validation
      const updatedAsset = await this.investmentService.updateInvestmentAsset(assetId, updateData);
      if (updatedAsset) {
        res.json(updatedAsset);
      } else {
        res.status(404).json({ message: 'Investment asset not found' });
      }
    } catch (error) {
      console.error('Error in updateInvestmentAsset:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deleteInvestmentAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      const assetId = req.params.assetId;
      const result = await this.investmentService.deleteInvestmentAsset(assetId);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Investment asset not found' });
      }
    } catch (error) {
      console.error('Error in deleteInvestmentAsset:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getInvestmentTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = req.params.accountId;
      const queryParams = req.query; // This may include date range, transaction type, etc.
      const transactions = await this.investmentService.getInvestmentTransactions(accountId, queryParams);
      res.json(transactions);
    } catch (error) {
      console.error('Error in getInvestmentTransactions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public addInvestmentTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = req.params.accountId;
      const transactionData: Partial<InvestmentTransaction> = req.body;
      // TODO: Implement input validation
      const addedTransaction = await this.investmentService.addInvestmentTransaction(accountId, transactionData);
      res.status(201).json(addedTransaction);
    } catch (error) {
      console.error('Error in addInvestmentTransaction:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getInvestmentPerformance = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = req.params.accountId;
      const assetId = req.query.assetId as string | undefined;
      const queryParams = req.query; // This may include date range
      const performance = await this.investmentService.getInvestmentPerformance(accountId, assetId, queryParams);
      res.json(performance);
    } catch (error) {
      console.error('Error in getInvestmentPerformance:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export default InvestmentController;

// TODO: Implement proper error handling and logging for each controller function
// TODO: Add input validation middleware to ensure data integrity before processing requests
// TODO: Implement pagination for list endpoints (getInvestmentAccounts, getInvestmentAssets, getInvestmentTransactions)
// TODO: Add authentication middleware to protect all endpoints
// TODO: Implement rate limiting to prevent abuse of the API
// TODO: Consider adding endpoints for bulk operations (e.g., adding multiple assets or transactions at once)