import request from 'supertest';
import mongoose from 'mongoose';
import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import app from '../../app';
import Transaction from '../../models/transaction.model';
import TransactionService from '../../services/transaction.service';
import authMiddleware from '../../middleware/auth';

// Mock the auth middleware
jest.mock('../../middleware/auth', () => {
  return jest.fn((req, res, next) => {
    req.user = { id: 'testUserId', email: 'test@example.com' };
    next();
  });
});

describe('Transaction API Integration Tests', () => {
  const testUser = {
    id: 'testUserId',
    email: 'test@example.com'
  };

  const testTransaction = {
    amount: 100,
    description: 'Test transaction',
    category: 'Food',
    date: '2023-05-01'
  };

  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/mint-replica-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear the transactions collection
    await Transaction.deleteMany({});

    // Create a test user (assuming you have a User model)
    // await User.create(testUser);
  });

  afterAll(async () => {
    // Clear the transactions collection
    await Transaction.deleteMany({});

    // Remove the test user
    // await User.deleteOne({ _id: testUser.id });

    // Close the database connection
    await mongoose.connection.close();
  });

  test('Create a new transaction', async () => {
    const response = await request(app)
      .post('/api/transactions')
      .set('Authorization', 'Bearer test-token')
      .send(testTransaction);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.amount).toBe(testTransaction.amount);
    expect(response.body.description).toBe(testTransaction.description);
    expect(response.body.category).toBe(testTransaction.category);
    expect(response.body.date).toBe(testTransaction.date);

    // Verify that the transaction is saved in the database
    const savedTransaction = await Transaction.findById(response.body._id);
    expect(savedTransaction).toBeTruthy();
  });

  test('Get transactions', async () => {
    // Create multiple test transactions
    await Transaction.create([
      { ...testTransaction, user: testUser.id },
      { ...testTransaction, amount: 200, user: testUser.id },
    ]);

    const response = await request(app)
      .get('/api/transactions')
      .set('Authorization', 'Bearer test-token');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThanOrEqual(2);
    expect(response.body[0]).toHaveProperty('_id');
    expect(response.body[0]).toHaveProperty('amount');
    expect(response.body[0]).toHaveProperty('description');
    expect(response.body[0]).toHaveProperty('category');
    expect(response.body[0]).toHaveProperty('date');
  });

  test('Get transaction by ID', async () => {
    const createdTransaction = await Transaction.create({ ...testTransaction, user: testUser.id });

    const response = await request(app)
      .get(`/api/transactions/${createdTransaction._id}`)
      .set('Authorization', 'Bearer test-token');

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(createdTransaction._id.toString());
    expect(response.body.amount).toBe(createdTransaction.amount);
    expect(response.body.description).toBe(createdTransaction.description);
    expect(response.body.category).toBe(createdTransaction.category);
    expect(response.body.date).toBe(createdTransaction.date);
  });

  test('Update transaction', async () => {
    const createdTransaction = await Transaction.create({ ...testTransaction, user: testUser.id });
    const updatedData = { ...testTransaction, amount: 150, description: 'Updated test transaction' };

    const response = await request(app)
      .put(`/api/transactions/${createdTransaction._id}`)
      .set('Authorization', 'Bearer test-token')
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(createdTransaction._id.toString());
    expect(response.body.amount).toBe(updatedData.amount);
    expect(response.body.description).toBe(updatedData.description);

    // Verify that the transaction is updated in the database
    const updatedTransaction = await Transaction.findById(createdTransaction._id);
    expect(updatedTransaction?.amount).toBe(updatedData.amount);
    expect(updatedTransaction?.description).toBe(updatedData.description);
  });

  test('Delete transaction', async () => {
    const createdTransaction = await Transaction.create({ ...testTransaction, user: testUser.id });

    const response = await request(app)
      .delete(`/api/transactions/${createdTransaction._id}`)
      .set('Authorization', 'Bearer test-token');

    expect(response.status).toBe(200);

    // Verify that the transaction is removed from the database
    const deletedTransaction = await Transaction.findById(createdTransaction._id);
    expect(deletedTransaction).toBeNull();
  });

  test('Transaction categorization', async () => {
    const uncategorizedTransaction = { ...testTransaction, category: undefined };

    const response = await request(app)
      .post('/api/transactions')
      .set('Authorization', 'Bearer test-token')
      .send(uncategorizedTransaction);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('category');
    expect(response.body.category).not.toBe(undefined);
    expect(typeof response.body.category).toBe('string');
  });

  test('Transaction sync', async () => {
    // Mock the external financial data provider
    const mockExternalTransactions = [
      { ...testTransaction, externalId: 'ext1' },
      { ...testTransaction, amount: 200, externalId: 'ext2' },
    ];

    // Mock the TransactionService.syncTransactions method
    TransactionService.syncTransactions = jest.fn().mockResolvedValue(mockExternalTransactions);

    const response = await request(app)
      .post('/api/transactions/sync')
      .set('Authorization', 'Bearer test-token');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(mockExternalTransactions.length);

    // Verify that new transactions are added to the database
    for (const mockTransaction of mockExternalTransactions) {
      const savedTransaction = await Transaction.findOne({ externalId: mockTransaction.externalId });
      expect(savedTransaction).toBeTruthy();
    }

    // Verify that duplicate transactions are not added
    await request(app)
      .post('/api/transactions/sync')
      .set('Authorization', 'Bearer test-token');

    const allTransactions = await Transaction.find({});
    expect(allTransactions.length).toBe(mockExternalTransactions.length);
  });
});