import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { Transaction, CreateTransactionDto, UpdateTransactionDto } from '../types';

export class TransactionController {
  private transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  /**
   * Retrieves all transactions for the authenticated user
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async getAllTransactions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id; // Assuming the user ID is attached to the request by authentication middleware
      const transactions = await this.transactionService.getAllTransactions(userId);
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error in getAllTransactions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Retrieves a specific transaction by its ID
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async getTransactionById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const transactionId = req.params.id;
      const transaction = await this.transactionService.getTransactionById(userId, transactionId);
      
      if (transaction) {
        res.status(200).json(transaction);
      } else {
        res.status(404).json({ message: 'Transaction not found' });
      }
    } catch (error) {
      console.error('Error in getTransactionById:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Creates a new transaction for the authenticated user
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const transactionData: CreateTransactionDto = req.body;
      
      // TODO: Implement validation for transactionData

      const newTransaction = await this.transactionService.createTransaction(userId, transactionData);
      res.status(201).json(newTransaction);
    } catch (error) {
      console.error('Error in createTransaction:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Updates an existing transaction
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async updateTransaction(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const transactionId = req.params.id;
      const updatedData: UpdateTransactionDto = req.body;
      
      // TODO: Implement validation for updatedData

      const updatedTransaction = await this.transactionService.updateTransaction(userId, transactionId, updatedData);
      
      if (updatedTransaction) {
        res.status(200).json(updatedTransaction);
      } else {
        res.status(404).json({ message: 'Transaction not found' });
      }
    } catch (error) {
      console.error('Error in updateTransaction:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Deletes a specific transaction
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async deleteTransaction(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const transactionId = req.params.id;
      
      const isDeleted = await this.transactionService.deleteTransaction(userId, transactionId);
      
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Transaction not found' });
      }
    } catch (error) {
      console.error('Error in deleteTransaction:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

// TODO: Implement error handling middleware to catch and process any errors thrown in the controller methods
// TODO: Add input validation using a library like Joi or class-validator to ensure data integrity
// TODO: Implement pagination for the getAllTransactions method to handle large datasets efficiently
// TODO: Add filtering and sorting options for the getAllTransactions method