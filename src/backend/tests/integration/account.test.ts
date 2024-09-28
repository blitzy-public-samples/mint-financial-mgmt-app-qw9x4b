import { describe, beforeAll, afterAll, beforeEach, afterEach, it, expect } from 'jest';
import { Container } from 'inversify';
import supertest from 'supertest';
import { AccountService } from '../../services/account.service';
import { AccountModel } from '../../models/account.model';
import { PlaidService } from '../../services/external/plaid.service';
import { DatabaseConnection } from '../../config/database';

describe('AccountService Integration Tests', () => {
  let container: Container;
  let accountService: AccountService;
  let app: any; // Replace 'any' with the actual type of your Express app

  beforeAll(async () => {
    await setupTestDatabase();
    container = new Container();
    mockPlaidService();
    app = createTestApp(container); // Implement this function to create a test instance of your app
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(() => {
    accountService = container.get<AccountService>(AccountService);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  async function setupTestDatabase(): Promise<void> {
    // Initialize test database connection
    await DatabaseConnection.connect();
    // Run migrations to set up schema
    await DatabaseConnection.runMigrations();
    // Bind AccountModel to the container
    container.bind<AccountModel>(AccountModel).toSelf();
  }

  async function teardownTestDatabase(): Promise<void> {
    // Close database connection
    await DatabaseConnection.disconnect();
  }

  function mockPlaidService(): void {
    const mockPlaid = {
      getAccounts: jest.fn().mockResolvedValue([
        { id: 'plaid1', name: 'Checking', type: 'depository', balance: 1000 },
        { id: 'plaid2', name: 'Savings', type: 'depository', balance: 5000 },
      ]),
      // Add other necessary mock methods
    };
    container.bind<PlaidService>(PlaidService).toConstantValue(mockPlaid as any);
  }

  async function cleanupTestData(): Promise<void> {
    // Implement cleanup of test data after each test
    await AccountModel.deleteMany({});
  }

  it('should create a new account', async () => {
    const newAccount = {
      userId: 'testUser123',
      institutionName: 'Test Bank',
      accountType: 'checking',
      accountName: 'My Checking',
      balance: 1000,
      currency: 'USD',
    };

    const response = await supertest(app)
      .post('/api/accounts')
      .send(newAccount)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.accountName).toBe(newAccount.accountName);
    expect(response.body.balance).toBe(newAccount.balance);
  });

  it('should retrieve user accounts', async () => {
    const userId = 'testUser123';
    const accounts = await accountService.getUserAccounts(userId);

    expect(Array.isArray(accounts)).toBeTruthy();
    expect(accounts.length).toBeGreaterThan(0);
    accounts.forEach(account => {
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('accountName');
      expect(account).toHaveProperty('balance');
    });
  });

  it('should update account balance', async () => {
    const account = await accountService.createAccount({
      userId: 'testUser123',
      institutionName: 'Test Bank',
      accountType: 'savings',
      accountName: 'My Savings',
      balance: 5000,
      currency: 'USD',
    });

    const updatedBalance = 5500;
    const updatedAccount = await accountService.updateAccountBalance(account.id, updatedBalance);

    expect(updatedAccount.balance).toBe(updatedBalance);
  });

  it('should delete an account', async () => {
    const account = await accountService.createAccount({
      userId: 'testUser123',
      institutionName: 'Test Bank',
      accountType: 'credit',
      accountName: 'My Credit Card',
      balance: 0,
      currency: 'USD',
    });

    await supertest(app)
      .delete(`/api/accounts/${account.id}`)
      .expect(200);

    const deletedAccount = await accountService.getAccountById(account.id);
    expect(deletedAccount).toBeNull();
  });

  it('should sync accounts with Plaid', async () => {
    const userId = 'testUser123';
    const syncedAccounts = await accountService.syncAccountsWithPlaid(userId);

    expect(Array.isArray(syncedAccounts)).toBeTruthy();
    expect(syncedAccounts.length).toBe(2); // Based on our mock Plaid service
    syncedAccounts.forEach(account => {
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('accountName');
      expect(account).toHaveProperty('balance');
      expect(account.userId).toBe(userId);
    });
  });
});

// Human tasks:
// TODO: Implement mock responses for PlaidService methods
// TODO: Set up test data fixtures for different account scenarios
// TODO: Implement cleanup of test data after each test