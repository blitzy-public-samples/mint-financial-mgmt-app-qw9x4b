import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MockProxy, mock } from 'jest-mock-extended';
import { AccountService } from '../../services/account.service';
import { AccountModel } from '../../models/account.model';
import { PlaidService } from '../../services/external/plaid.service';

describe('AccountService', () => {
  let accountService: AccountService;
  let accountModelMock: MockProxy<AccountModel>;
  let plaidServiceMock: MockProxy<PlaidService>;

  beforeEach(() => {
    accountModelMock = mock<AccountModel>();
    plaidServiceMock = mock<PlaidService>();
    accountService = new AccountService(accountModelMock, plaidServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create a new account', async () => {
      const accountData = {
        userId: '123',
        name: 'Test Account',
        type: 'checking',
        balance: 1000,
        institution: 'Test Bank'
      };

      accountModelMock.create.mockResolvedValue(accountData);

      const result = await accountService.createAccount(accountData);

      expect(accountModelMock.create).toHaveBeenCalledWith(accountData);
      expect(result).toEqual(accountData);
    });
  });

  describe('getAccount', () => {
    it('should retrieve an account by id', async () => {
      const accountId = '456';
      const mockAccount = {
        id: accountId,
        userId: '123',
        name: 'Test Account',
        type: 'checking',
        balance: 1000,
        institution: 'Test Bank'
      };

      accountModelMock.findByPk.mockResolvedValue(mockAccount);

      const result = await accountService.getAccount(accountId);

      expect(accountModelMock.findByPk).toHaveBeenCalledWith(accountId);
      expect(result).toEqual(mockAccount);
    });
  });

  describe('updateAccount', () => {
    it('should update an existing account', async () => {
      const accountId = '456';
      const updateData = {
        name: 'Updated Account Name',
        balance: 1500
      };
      const mockAccount = {
        id: accountId,
        userId: '123',
        name: 'Test Account',
        type: 'checking',
        balance: 1000,
        institution: 'Test Bank',
        update: jest.fn().mockResolvedValue({ ...mockAccount, ...updateData })
      };

      accountModelMock.findByPk.mockResolvedValue(mockAccount);

      const result = await accountService.updateAccount(accountId, updateData);

      expect(accountModelMock.findByPk).toHaveBeenCalledWith(accountId);
      expect(mockAccount.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({ ...mockAccount, ...updateData });
    });
  });

  describe('deleteAccount', () => {
    it('should delete an account', async () => {
      const accountId = '456';

      accountModelMock.destroy.mockResolvedValue(1);

      const result = await accountService.deleteAccount(accountId);

      expect(accountModelMock.destroy).toHaveBeenCalledWith({ where: { id: accountId } });
      expect(result).toBe(true);
    });
  });

  describe('getUserAccounts', () => {
    it('should retrieve all accounts for a user', async () => {
      const userId = '123';
      const mockAccounts = [
        { id: '1', userId, name: 'Account 1', type: 'checking', balance: 1000, institution: 'Bank A' },
        { id: '2', userId, name: 'Account 2', type: 'savings', balance: 2000, institution: 'Bank B' }
      ];

      accountModelMock.findAll.mockResolvedValue(mockAccounts);

      const result = await accountService.getUserAccounts(userId);

      expect(accountModelMock.findAll).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('syncAccount', () => {
    it('should sync account data with Plaid', async () => {
      const accountId = '456';
      const mockAccount = {
        id: accountId,
        userId: '123',
        name: 'Test Account',
        type: 'checking',
        balance: 1000,
        institution: 'Test Bank',
        update: jest.fn().mockResolvedValue({ id: accountId, balance: 1100 })
      };
      const syncedData = { balance: 1100 };

      accountModelMock.findByPk.mockResolvedValue(mockAccount);
      plaidServiceMock.syncAccountData.mockResolvedValue(syncedData);

      const result = await accountService.syncAccount(accountId);

      expect(accountModelMock.findByPk).toHaveBeenCalledWith(accountId);
      expect(plaidServiceMock.syncAccountData).toHaveBeenCalledWith(mockAccount);
      expect(mockAccount.update).toHaveBeenCalledWith(syncedData);
      expect(result).toEqual({ id: accountId, balance: 1100 });
    });
  });

  describe('linkAccount', () => {
    it('should link a new account using Plaid', async () => {
      const userId = '123';
      const publicToken = 'public-token';
      const accessToken = 'access-token';
      const accountData = {
        id: 'plaid-account-id',
        name: 'Plaid Account',
        type: 'checking',
        balance: 1000,
        institution: 'Plaid Bank'
      };
      const createdAccount = { ...accountData, id: 'local-account-id' };

      plaidServiceMock.exchangePublicToken.mockResolvedValue(accessToken);
      plaidServiceMock.getAccountDetails.mockResolvedValue(accountData);
      accountModelMock.create.mockResolvedValue(createdAccount);

      const result = await accountService.linkAccount(userId, publicToken);

      expect(plaidServiceMock.exchangePublicToken).toHaveBeenCalledWith(publicToken);
      expect(plaidServiceMock.getAccountDetails).toHaveBeenCalledWith(accessToken);
      expect(accountModelMock.create).toHaveBeenCalledWith({
        userId,
        ...accountData,
        accessToken
      });
      expect(result).toEqual(createdAccount);
    });
  });
});