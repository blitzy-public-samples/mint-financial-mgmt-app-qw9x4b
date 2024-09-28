import mongoose from 'mongoose';
import { FinancialInsight, IFinancialInsight } from '../../models/mongodb/financialInsight.model';
import { IRepository } from '../../interfaces/repository.interface';
import { getMongoConnection } from '../../utils/connection';

export interface IFinancialInsightRepository extends IRepository<IFinancialInsight> {
  findByUserId(userId: string): Promise<IFinancialInsight[]>;
  findByType(type: string): Promise<IFinancialInsight[]>;
  findUnreadByUserId(userId: string): Promise<IFinancialInsight[]>;
  markAsRead(id: string): Promise<IFinancialInsight | null>;
  deleteExpired(): Promise<number>;
}

export class FinancialInsightRepository implements IFinancialInsightRepository {
  private model: mongoose.Model<IFinancialInsight>;

  constructor() {
    this.model = getMongoConnection().model<IFinancialInsight>('FinancialInsight', FinancialInsight);
  }

  async create(data: Partial<IFinancialInsight>): Promise<IFinancialInsight> {
    const createdInsight = await this.model.create(data);
    return createdInsight;
  }

  async findById(id: string): Promise<IFinancialInsight | null> {
    return this.model.findById(id);
  }

  async findAll(): Promise<IFinancialInsight[]> {
    return this.model.find();
  }

  async update(id: string, data: Partial<IFinancialInsight>): Promise<IFinancialInsight | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IFinancialInsight | null> {
    return this.model.findByIdAndDelete(id);
  }

  async findByUserId(userId: string): Promise<IFinancialInsight[]> {
    return this.model.find({ userId });
  }

  async findByType(type: string): Promise<IFinancialInsight[]> {
    return this.model.find({ type });
  }

  async findUnreadByUserId(userId: string): Promise<IFinancialInsight[]> {
    return this.model.find({ userId, isRead: false });
  }

  async markAsRead(id: string): Promise<IFinancialInsight | null> {
    return this.model.findByIdAndUpdate(id, { isRead: true }, { new: true });
  }

  async deleteExpired(): Promise<number> {
    const result = await this.model.deleteMany({ expiresAt: { $lt: new Date() } });
    return result.deletedCount;
  }
}

// Export the FinancialInsightRepository class
export default FinancialInsightRepository;