import { describe, expect, test, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { InvestmentPortfolioRepository } from '../../repositories/mongodb/investmentPortfolio.repository';
import { IInvestmentPortfolio, IHolding, IPerformance } from '../../models/mongodb/investmentPortfolio.model';

let mongoServer: MongoMemoryServer;
let investmentPortfolioRepository: InvestmentPortfolioRepository;

beforeAll(async () => {
  // Set up the in-memory MongoDB server and connect to it
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  investmentPortfolioRepository = new InvestmentPortfolioRepository();
});

afterAll(async () => {
  // Disconnect from the in-memory MongoDB server and stop it
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear the database before each test
  await mongoose.connection.db.collection('investment_portfolios').deleteMany({});
});

describe('InvestmentPortfolioRepository', () => {
  test('should create a new investment portfolio', async () => {
    const mockPortfolio: IInvestmentPortfolio = {
      userId: 'user123',
      name: 'Test Portfolio',
      totalValue: 10000,
      holdings: [],
      performance: {
        allTimeReturn: 5.5,
        annualizedReturn: 2.3,
      },
    };

    const createdPortfolio = await investmentPortfolioRepository.create(mockPortfolio);

    expect(createdPortfolio).toMatchObject(mockPortfolio);
    expect(createdPortfolio._id).toBeDefined();
  });

  test('should find an investment portfolio by ID', async () => {
    const mockPortfolio: IInvestmentPortfolio = {
      userId: 'user123',
      name: 'Test Portfolio',
      totalValue: 10000,
      holdings: [],
      performance: {
        allTimeReturn: 5.5,
        annualizedReturn: 2.3,
      },
    };

    const createdPortfolio = await investmentPortfolioRepository.create(mockPortfolio);
    const foundPortfolio = await investmentPortfolioRepository.findById(createdPortfolio._id);

    expect(foundPortfolio).toMatchObject(mockPortfolio);
  });

  test('should find all investment portfolios for a user', async () => {
    const userId = 'user123';
    const mockPortfolios: IInvestmentPortfolio[] = [
      {
        userId,
        name: 'Portfolio 1',
        totalValue: 10000,
        holdings: [],
        performance: { allTimeReturn: 5.5, annualizedReturn: 2.3 },
      },
      {
        userId,
        name: 'Portfolio 2',
        totalValue: 20000,
        holdings: [],
        performance: { allTimeReturn: 7.5, annualizedReturn: 3.3 },
      },
    ];

    await Promise.all(mockPortfolios.map(portfolio => investmentPortfolioRepository.create(portfolio)));

    const foundPortfolios = await investmentPortfolioRepository.findByUserId(userId);

    expect(foundPortfolios).toHaveLength(2);
    expect(foundPortfolios).toEqual(expect.arrayContaining(mockPortfolios.map(expect.objectContaining)));
  });

  test('should update an investment portfolio', async () => {
    const mockPortfolio: IInvestmentPortfolio = {
      userId: 'user123',
      name: 'Test Portfolio',
      totalValue: 10000,
      holdings: [],
      performance: { allTimeReturn: 5.5, annualizedReturn: 2.3 },
    };

    const createdPortfolio = await investmentPortfolioRepository.create(mockPortfolio);

    const updateData = {
      name: 'Updated Portfolio',
      totalValue: 15000,
    };

    const updatedPortfolio = await investmentPortfolioRepository.update(createdPortfolio._id, updateData);

    expect(updatedPortfolio.name).toBe(updateData.name);
    expect(updatedPortfolio.totalValue).toBe(updateData.totalValue);

    const fetchedPortfolio = await investmentPortfolioRepository.findById(createdPortfolio._id);
    expect(fetchedPortfolio).toMatchObject(updateData);
  });

  test('should delete an investment portfolio', async () => {
    const mockPortfolio: IInvestmentPortfolio = {
      userId: 'user123',
      name: 'Test Portfolio',
      totalValue: 10000,
      holdings: [],
      performance: { allTimeReturn: 5.5, annualizedReturn: 2.3 },
    };

    const createdPortfolio = await investmentPortfolioRepository.create(mockPortfolio);

    const deleteResult = await investmentPortfolioRepository.delete(createdPortfolio._id);
    expect(deleteResult).toBe(true);

    const fetchedPortfolio = await investmentPortfolioRepository.findById(createdPortfolio._id);
    expect(fetchedPortfolio).toBeNull();
  });

  test('should add a holding to an investment portfolio', async () => {
    const mockPortfolio: IInvestmentPortfolio = {
      userId: 'user123',
      name: 'Test Portfolio',
      totalValue: 10000,
      holdings: [],
      performance: { allTimeReturn: 5.5, annualizedReturn: 2.3 },
    };

    const createdPortfolio = await investmentPortfolioRepository.create(mockPortfolio);

    const mockHolding: IHolding = {
      symbol: 'AAPL',
      quantity: 10,
      purchasePrice: 150,
      currentPrice: 160,
    };

    const updatedPortfolio = await investmentPortfolioRepository.addHolding(createdPortfolio._id, mockHolding);

    expect(updatedPortfolio.holdings).toHaveLength(1);
    expect(updatedPortfolio.holdings[0]).toMatchObject(mockHolding);
    expect(updatedPortfolio.totalValue).toBe(mockPortfolio.totalValue + mockHolding.quantity * mockHolding.currentPrice);
  });

  test('should update a holding in an investment portfolio', async () => {
    const mockPortfolio: IInvestmentPortfolio = {
      userId: 'user123',
      name: 'Test Portfolio',
      totalValue: 10000,
      holdings: [
        {
          symbol: 'AAPL',
          quantity: 10,
          purchasePrice: 150,
          currentPrice: 160,
        },
      ],
      performance: { allTimeReturn: 5.5, annualizedReturn: 2.3 },
    };

    const createdPortfolio = await investmentPortfolioRepository.create(mockPortfolio);

    const updatedHolding: Partial<IHolding> = {
      quantity: 15,
      currentPrice: 170,
    };

    const updatedPortfolio = await investmentPortfolioRepository.updateHolding(
      createdPortfolio._id,
      createdPortfolio.holdings[0]._id,
      updatedHolding
    );

    expect(updatedPortfolio.holdings[0].quantity).toBe(updatedHolding.quantity);
    expect(updatedPortfolio.holdings[0].currentPrice).toBe(updatedHolding.currentPrice);
    expect(updatedPortfolio.totalValue).toBe(10000 - 1600 + updatedHolding.quantity * updatedHolding.currentPrice);
  });

  test('should remove a holding from an investment portfolio', async () => {
    const mockPortfolio: IInvestmentPortfolio = {
      userId: 'user123',
      name: 'Test Portfolio',
      totalValue: 10000,
      holdings: [
        {
          symbol: 'AAPL',
          quantity: 10,
          purchasePrice: 150,
          currentPrice: 160,
        },
        {
          symbol: 'GOOGL',
          quantity: 5,
          purchasePrice: 2000,
          currentPrice: 2100,
        },
      ],
      performance: { allTimeReturn: 5.5, annualizedReturn: 2.3 },
    };

    const createdPortfolio = await investmentPortfolioRepository.create(mockPortfolio);

    const updatedPortfolio = await investmentPortfolioRepository.removeHolding(
      createdPortfolio._id,
      createdPortfolio.holdings[0]._id
    );

    expect(updatedPortfolio.holdings).toHaveLength(1);
    expect(updatedPortfolio.holdings[0].symbol).toBe('GOOGL');
    expect(updatedPortfolio.totalValue).toBe(10000 - 1600);
  });

  test('should update the performance data of an investment portfolio', async () => {
    const mockPortfolio: IInvestmentPortfolio = {
      userId: 'user123',
      name: 'Test Portfolio',
      totalValue: 10000,
      holdings: [],
      performance: { allTimeReturn: 5.5, annualizedReturn: 2.3 },
    };

    const createdPortfolio = await investmentPortfolioRepository.create(mockPortfolio);

    const updatedPerformance: IPerformance = {
      allTimeReturn: 8.5,
      annualizedReturn: 3.7,
    };

    const updatedPortfolio = await investmentPortfolioRepository.updatePerformance(createdPortfolio._id, updatedPerformance);

    expect(updatedPortfolio.performance).toMatchObject(updatedPerformance);
  });
});

// TODO: Implement edge case tests for invalid input data
// TODO: Add tests for concurrent operations to ensure data consistency
// TODO: Implement performance tests for operations on large datasets
// TODO: Add tests for error handling and database connection issues