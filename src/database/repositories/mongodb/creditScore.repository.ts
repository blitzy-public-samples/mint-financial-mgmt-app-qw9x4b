import mongoose, { Model, Document } from 'mongoose';
import { ICreditScore } from '../../models/mongodb/creditScore.model';

export class CreditScoreRepository {
  private creditScoreModel: Model<ICreditScore & Document>;

  constructor() {
    // Initialize the CreditScore model
    const CreditScoreSchema = new mongoose.Schema({
      userId: { type: String, required: true },
      score: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      provider: { type: String, required: true },
      factors: [{ type: String }],
      history: [{
        score: { type: Number, required: true },
        date: { type: Date, required: true }
      }]
    });

    this.creditScoreModel = mongoose.model<ICreditScore & Document>('CreditScore', CreditScoreSchema);
  }

  async createCreditScore(creditScoreData: ICreditScore): Promise<ICreditScore> {
    try {
      const newCreditScore = new this.creditScoreModel(creditScoreData);
      const savedCreditScore = await newCreditScore.save();
      return savedCreditScore.toObject();
    } catch (error) {
      console.error('Error creating credit score:', error);
      throw error;
    }
  }

  async getCreditScoreByUserId(userId: string): Promise<ICreditScore | null> {
    try {
      const creditScore = await this.creditScoreModel
        .findOne({ userId })
        .sort({ date: -1 })
        .limit(1)
        .exec();
      return creditScore ? creditScore.toObject() : null;
    } catch (error) {
      console.error('Error fetching credit score:', error);
      throw error;
    }
  }

  async updateCreditScore(creditScoreId: string, updateData: Partial<ICreditScore>): Promise<ICreditScore | null> {
    try {
      const updatedCreditScore = await this.creditScoreModel
        .findByIdAndUpdate(creditScoreId, updateData, { new: true })
        .exec();
      return updatedCreditScore ? updatedCreditScore.toObject() : null;
    } catch (error) {
      console.error('Error updating credit score:', error);
      throw error;
    }
  }

  async deleteCreditScore(creditScoreId: string): Promise<boolean> {
    try {
      const result = await this.creditScoreModel.findByIdAndDelete(creditScoreId).exec();
      return !!result;
    } catch (error) {
      console.error('Error deleting credit score:', error);
      throw error;
    }
  }

  async getCreditScoreHistory(userId: string, limit: number): Promise<ICreditScore[]> {
    try {
      const creditScores = await this.creditScoreModel
        .find({ userId })
        .sort({ date: -1 })
        .limit(limit)
        .exec();
      return creditScores.map(score => score.toObject());
    } catch (error) {
      console.error('Error fetching credit score history:', error);
      throw error;
    }
  }

  async addHistoricalScore(creditScoreId: string, historicalScore: { score: number; date: Date }): Promise<ICreditScore | null> {
    try {
      const updatedCreditScore = await this.creditScoreModel
        .findByIdAndUpdate(
          creditScoreId,
          { $push: { history: historicalScore } },
          { new: true }
        )
        .exec();
      return updatedCreditScore ? updatedCreditScore.toObject() : null;
    } catch (error) {
      console.error('Error adding historical score:', error);
      throw error;
    }
  }
}

// Human tasks:
// TODO: Implement error handling and logging for database operations
// TODO: Add input validation for all repository methods
// TODO: Implement pagination for the getCreditScoreHistory method
// TODO: Add a method to calculate credit score trends over time
// TODO: Implement caching mechanism for frequently accessed credit scores