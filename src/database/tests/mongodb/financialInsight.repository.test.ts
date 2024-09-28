import { describe, expect, beforeAll, afterAll, beforeEach, it } from '@jest/globals';
import mongoose from 'mongoose';
import { FinancialInsightRepository } from '../../repositories/mongodb/financialInsight.repository';
import { IFinancialInsight } from '../../models/mongodb/financialInsight.model';
import { getMongoConnection } from '../../utils/connection';

describe('FinancialInsightRepository', () => {
  let financialInsightRepository: FinancialInsightRepository;
  let testMongoConnection: mongoose.Connection;

  beforeAll(async () => {
    // Connect to the test MongoDB database
    testMongoConnection = await getMongoConnection();
    financialInsightRepository = new FinancialInsightRepository(testMongoConnection);
  });

  afterAll(async () => {
    // Close the MongoDB connection
    await testMongoConnection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await testMongoConnection.collection('financialInsights').deleteMany({});
  });

  it('should create a new financial insight', async () => {
    const mockInsight: Partial<IFinancialInsight> = {
      userId: 'user123',
      type: 'spending',
      content: 'You have spent 20% more on dining out this month.',
      isRead: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };

    const createdInsight = await financialInsightRepository.create(mockInsight as IFinancialInsight);

    expect(createdInsight).toHaveProperty('_id');
    expect(createdInsight.userId).toBe(mockInsight.userId);
    expect(createdInsight.type).toBe(mockInsight.type);
    expect(createdInsight.content).toBe(mockInsight.content);
    expect(createdInsight.isRead).toBe(mockInsight.isRead);
  });

  it('should find a financial insight by ID', async () => {
    const mockInsight: Partial<IFinancialInsight> = {
      userId: 'user123',
      type: 'investment',
      content: 'Consider diversifying your portfolio.',
      isRead: false,
    };

    const createdInsight = await financialInsightRepository.create(mockInsight as IFinancialInsight);
    const foundInsight = await financialInsightRepository.findById(createdInsight._id.toString());

    expect(foundInsight).toBeDefined();
    expect(foundInsight?._id.toString()).toBe(createdInsight._id.toString());
  });

  it('should find all financial insights', async () => {
    const mockInsights: Partial<IFinancialInsight>[] = [
      { userId: 'user123', type: 'spending', content: 'Insight 1', isRead: false },
      { userId: 'user123', type: 'saving', content: 'Insight 2', isRead: true },
      { userId: 'user456', type: 'investment', content: 'Insight 3', isRead: false },
    ];

    await Promise.all(mockInsights.map(insight => financialInsightRepository.create(insight as IFinancialInsight)));

    const allInsights = await financialInsightRepository.findAll();

    expect(allInsights).toHaveLength(3);
  });

  it('should update a financial insight', async () => {
    const mockInsight: Partial<IFinancialInsight> = {
      userId: 'user123',
      type: 'spending',
      content: 'Original content',
      isRead: false,
    };

    const createdInsight = await financialInsightRepository.create(mockInsight as IFinancialInsight);
    const updateData = { content: 'Updated content', isRead: true };

    const updatedInsight = await financialInsightRepository.update(createdInsight._id.toString(), updateData);

    expect(updatedInsight).toBeDefined();
    expect(updatedInsight?.content).toBe(updateData.content);
    expect(updatedInsight?.isRead).toBe(updateData.isRead);
  });

  it('should delete a financial insight', async () => {
    const mockInsight: Partial<IFinancialInsight> = {
      userId: 'user123',
      type: 'investment',
      content: 'Insight to be deleted',
      isRead: false,
    };

    const createdInsight = await financialInsightRepository.create(mockInsight as IFinancialInsight);
    const deletedInsight = await financialInsightRepository.delete(createdInsight._id.toString());

    expect(deletedInsight).toBeDefined();
    expect(deletedInsight?._id.toString()).toBe(createdInsight._id.toString());

    const foundInsight = await financialInsightRepository.findById(createdInsight._id.toString());
    expect(foundInsight).toBeNull();
  });

  it('should find financial insights by user ID', async () => {
    const userId = 'user789';
    const mockInsights: Partial<IFinancialInsight>[] = [
      { userId, type: 'spending', content: 'Insight 1', isRead: false },
      { userId, type: 'saving', content: 'Insight 2', isRead: true },
      { userId: 'otherUser', type: 'investment', content: 'Insight 3', isRead: false },
    ];

    await Promise.all(mockInsights.map(insight => financialInsightRepository.create(insight as IFinancialInsight)));

    const userInsights = await financialInsightRepository.findByUserId(userId);

    expect(userInsights).toHaveLength(2);
    expect(userInsights.every(insight => insight.userId === userId)).toBe(true);
  });

  it('should find financial insights by type', async () => {
    const insightType = 'investment';
    const mockInsights: Partial<IFinancialInsight>[] = [
      { userId: 'user1', type: 'spending', content: 'Insight 1', isRead: false },
      { userId: 'user2', type: insightType, content: 'Insight 2', isRead: true },
      { userId: 'user3', type: insightType, content: 'Insight 3', isRead: false },
    ];

    await Promise.all(mockInsights.map(insight => financialInsightRepository.create(insight as IFinancialInsight)));

    const typeInsights = await financialInsightRepository.findByType(insightType);

    expect(typeInsights).toHaveLength(2);
    expect(typeInsights.every(insight => insight.type === insightType)).toBe(true);
  });

  it('should find unread financial insights by user ID', async () => {
    const userId = 'user101';
    const mockInsights: Partial<IFinancialInsight>[] = [
      { userId, type: 'spending', content: 'Insight 1', isRead: false },
      { userId, type: 'saving', content: 'Insight 2', isRead: true },
      { userId, type: 'investment', content: 'Insight 3', isRead: false },
    ];

    await Promise.all(mockInsights.map(insight => financialInsightRepository.create(insight as IFinancialInsight)));

    const unreadInsights = await financialInsightRepository.findUnreadByUserId(userId);

    expect(unreadInsights).toHaveLength(2);
    expect(unreadInsights.every(insight => insight.userId === userId && !insight.isRead)).toBe(true);
  });

  it('should mark a financial insight as read', async () => {
    const mockInsight: Partial<IFinancialInsight> = {
      userId: 'user123',
      type: 'spending',
      content: 'Unread insight',
      isRead: false,
    };

    const createdInsight = await financialInsightRepository.create(mockInsight as IFinancialInsight);
    const markedAsReadInsight = await financialInsightRepository.markAsRead(createdInsight._id.toString());

    expect(markedAsReadInsight).toBeDefined();
    expect(markedAsReadInsight?.isRead).toBe(true);

    const fetchedInsight = await financialInsightRepository.findById(createdInsight._id.toString());
    expect(fetchedInsight?.isRead).toBe(true);
  });

  it('should delete expired financial insights', async () => {
    const currentDate = new Date();
    const expiredDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    const futureDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // 1 day in the future

    const mockInsights: Partial<IFinancialInsight>[] = [
      { userId: 'user1', type: 'spending', content: 'Expired 1', isRead: false, expiresAt: expiredDate },
      { userId: 'user2', type: 'saving', content: 'Not expired', isRead: false, expiresAt: futureDate },
      { userId: 'user3', type: 'investment', content: 'Expired 2', isRead: true, expiresAt: expiredDate },
    ];

    await Promise.all(mockInsights.map(insight => financialInsightRepository.create(insight as IFinancialInsight)));

    const deletedCount = await financialInsightRepository.deleteExpired();

    expect(deletedCount).toBe(2);

    const remainingInsights = await financialInsightRepository.findAll();
    expect(remainingInsights).toHaveLength(1);
    expect(remainingInsights[0].content).toBe('Not expired');
  });
});