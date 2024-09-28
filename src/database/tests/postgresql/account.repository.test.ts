import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Sequelize } from 'sequelize';
import { AccountRepository, createAccountRepository } from '../../repositories/postgresql/account.repository';
import { AccountModel } from '../../models/postgresql/account.model';
import { Account, AccountType } from '../../../shared/types/account';

let sequelize: Sequelize;
let accountRepository: AccountRepository;

beforeEach(async () => {
  sequelize = new Sequelize('sqlite::memory:');
  await setupTestDatabase();
  accountRepository = createAccountRepository(AccountModel);
});

afterEach(async () => {
  await teardownTestDatabase();
});

async function setupTestDatabase(): Promise<void> {
  await sequelize.authenticate();
  await AccountModel.sync({ force: true });
}

async function teardownTestDatabase(): Promise<void> {
  await sequelize.close();
}

describe('AccountRepository', () => {
  it('should create a new account', async () => {
    const mockAccountData: Partial<Account> = {
      userId: '123',
      name: 'Test Account',
      type: AccountType.CHECKING,
      balance: 1000,
      currency: 'USD',
    };

    const createdAccount = await accountRepository.create(mockAccountData);

    expect(createdAccount).toBeDefined();
    expect(createdAccount.userId).toBe(mockAccountData.userId);
    expect(createdAccount.name).toBe(mockAccountData.name);
    expect(createdAccount.type).toBe(mockAccountData.type);
    expect(createdAccount.balance).toBe(mockAccountData.balance);
    expect(createdAccount.currency).toBe(mockAccountData.currency);
  });

  it('should find an account by ID', async () => {
    const mockAccount = await accountRepository.create({
      userId: '123',
      name: 'Test Account',
      type: AccountType.SAVINGS,
      balance: 2000,
      currency: 'EUR',
    });

    const foundAccount = await accountRepository.findById(mockAccount.id);

    expect(foundAccount).toBeDefined();
    expect(foundAccount?.id).toBe(mockAccount.id);
    expect(foundAccount?.name).toBe(mockAccount.name);
  });

  it('should find accounts by user ID', async () => {
    const userId = '456';
    await accountRepository.create({
      userId,
      name: 'Account 1',
      type: AccountType.CHECKING,
      balance: 1000,
      currency: 'USD',
    });
    await accountRepository.create({
      userId,
      name: 'Account 2',
      type: AccountType.SAVINGS,
      balance: 2000,
      currency: 'USD',
    });

    const userAccounts = await accountRepository.findByUserId(userId);

    expect(userAccounts).toHaveLength(2);
    expect(userAccounts[0].userId).toBe(userId);
    expect(userAccounts[1].userId).toBe(userId);
  });

  it('should update an existing account', async () => {
    const mockAccount = await accountRepository.create({
      userId: '123',
      name: 'Original Account',
      type: AccountType.CHECKING,
      balance: 1000,
      currency: 'USD',
    });

    const updatedData = {
      name: 'Updated Account',
      balance: 1500,
    };

    const updatedAccount = await accountRepository.update(mockAccount.id, updatedData);

    expect(updatedAccount).toBeDefined();
    expect(updatedAccount?.id).toBe(mockAccount.id);
    expect(updatedAccount?.name).toBe(updatedData.name);
    expect(updatedAccount?.balance).toBe(updatedData.balance);
  });

  it('should delete an account', async () => {
    const mockAccount = await accountRepository.create({
      userId: '123',
      name: 'Account to Delete',
      type: AccountType.SAVINGS,
      balance: 500,
      currency: 'USD',
    });

    const deleteResult = await accountRepository.delete(mockAccount.id);
    expect(deleteResult).toBe(true);

    const deletedAccount = await accountRepository.findById(mockAccount.id);
    expect(deletedAccount).toBeNull();
  });

  it('should update account balance', async () => {
    const mockAccount = await accountRepository.create({
      userId: '123',
      name: 'Balance Update Account',
      type: AccountType.CHECKING,
      balance: 1000,
      currency: 'USD',
    });

    const balanceChange = 500;
    const updatedAccount = await accountRepository.updateBalance(mockAccount.id, balanceChange);

    expect(updatedAccount).toBeDefined();
    expect(updatedAccount?.id).toBe(mockAccount.id);
    expect(updatedAccount?.balance).toBe(mockAccount.balance + balanceChange);
  });
});

// Commented list of human tasks
/*
Human tasks:
1. Implement edge case tests for account operations (Required)
2. Add integration tests with a real PostgreSQL database (Optional)
3. Implement performance tests for large datasets (Optional)
*/