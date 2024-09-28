import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CreditScoreRepository } from '../../repositories/mongodb/creditScore.repository';
import { CreditScore, ICreditScore, IHistoricalScore } from '../../models/mongodb/creditScore.model';

describe('CreditScoreRepository', () => {
  let mongoServer: MongoMemoryServer;
  let creditScoreRepository: CreditScoreRepository;

  beforeAll(async () => {
    await setupTestDatabase();
    creditScoreRepository = new CreditScoreRepository();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await CreditScore.deleteMany({});
  });

  const setupTestDatabase = async (): Promise<void> => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  };

  const teardownTestDatabase = async (): Promise<void> => {
    await mongoose.disconnect();
    await mongoServer.stop();
  };

  const createMockCreditScore = (overrides: Partial<ICreditScore> = {}): ICreditScore => {
    const defaultCreditScore: ICreditScore = {
      userId: new mongoose.Types.ObjectId().toString(),
      score: 750,
      scoreType: 'FICO',
      date: new Date(),
      factors: [
        { name: 'Payment History', impact: 'High' },
        { name: 'Credit Utilization', impact: 'Medium' },
      ],
      history: [],
    };
    return { ...defaultCreditScore, ...overrides };
  };

  describe('createCreditScore', () => {
    it('should create a new credit score', async () => {
      const mockCreditScore = createMockCreditScore();
      const createdCreditScore = await creditScoreRepository.createCreditScore(mockCreditScore);

      expect(createdCreditScore).toBeDefined();
      expect(createdCreditScore.userId).toBe(mockCreditScore.userId);
      expect(createdCreditScore.score).toBe(mockCreditScore.score);

      const savedCreditScore = await CreditScore.findById(createdCreditScore._id);
      expect(savedCreditScore).toBeDefined();
      expect(savedCreditScore?.userId).toBe(mockCreditScore.userId);
    });
  });

  describe('getCreditScoreByUserId', () => {
    it('should retrieve a credit score by user ID', async () => {
      const mockCreditScore = createMockCreditScore();
      await CreditScore.create(mockCreditScore);

      const retrievedCreditScore = await creditScoreRepository.getCreditScoreByUserId(mockCreditScore.userId);

      expect(retrievedCreditScore).toBeDefined();
      expect(retrievedCreditScore?.userId).toBe(mockCreditScore.userId);
      expect(retrievedCreditScore?.score).toBe(mockCreditScore.score);
    });
  });

  describe('updateCreditScore', () => {
    it('should update an existing credit score', async () => {
      const mockCreditScore = createMockCreditScore();
      const createdCreditScore = await CreditScore.create(mockCreditScore);

      const updateData = { score: 800 };
      const updatedCreditScore = await creditScoreRepository.updateCreditScore(createdCreditScore._id, updateData);

      expect(updatedCreditScore).toBeDefined();
      expect(updatedCreditScore?.score).toBe(updateData.score);

      const savedCreditScore = await CreditScore.findById(createdCreditScore._id);
      expect(savedCreditScore?.score).toBe(updateData.score);
    });
  });

  describe('deleteCreditScore', () => {
    it('should delete a credit score', async () => {
      const mockCreditScore = createMockCreditScore();
      const createdCreditScore = await CreditScore.create(mockCreditScore);

      const result = await creditScoreRepository.deleteCreditScore(createdCreditScore._id);

      expect(result).toBe(true);

      const deletedCreditScore = await CreditScore.findById(createdCreditScore._id);
      expect(deletedCreditScore).toBeNull();
    });
  });

  describe('getCreditScoreHistory', () => {
    it('should retrieve credit score history for a user', async () => {
      const mockCreditScore = createMockCreditScore();
      const createdCreditScore = await CreditScore.create(mockCreditScore);

      const historicalScores: IHistoricalScore[] = [
        { score: 740, date: new Date('2023-01-01') },
        { score: 745, date: new Date('2023-02-01') },
        { score: 750, date: new Date('2023-03-01') },
      ];

      await CreditScore.findByIdAndUpdate(createdCreditScore._id, { $push: { history: { $each: historicalScores } } });

      const history = await creditScoreRepository.getCreditScoreHistory(mockCreditScore.userId, 3);

      expect(history).toBeDefined();
      expect(history.length).toBe(3);
      expect(history[0].score).toBe(750);
      expect(history[2].score).toBe(740);
    });
  });

  describe('addHistoricalScore', () => {
    it('should add a historical score to a credit score', async () => {
      const mockCreditScore = createMockCreditScore();
      const createdCreditScore = await CreditScore.create(mockCreditScore);

      const newHistoricalScore: IHistoricalScore = { score: 760, date: new Date() };
      const updatedCreditScore = await creditScoreRepository.addHistoricalScore(createdCreditScore._id, newHistoricalScore);

      expect(updatedCreditScore).toBeDefined();
      expect(updatedCreditScore?.history).toContainEqual(expect.objectContaining(newHistoricalScore));

      const savedCreditScore = await CreditScore.findById(createdCreditScore._id);
      expect(savedCreditScore?.history).toContainEqual(expect.objectContaining(newHistoricalScore));
    });
  });
});

// TODO: Implement edge case tests for each method (e.g., invalid inputs, non-existent records)
// TODO: Add performance tests for methods that may be called frequently or with large datasets
// TODO: Implement integration tests with actual MongoDB instance for full end-to-end testing
// TODO: Add tests for any additional methods or features added to the CreditScoreRepository