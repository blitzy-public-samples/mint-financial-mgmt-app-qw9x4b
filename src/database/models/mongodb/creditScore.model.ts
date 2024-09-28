import mongoose, { Schema, Document } from 'mongoose';

// Interfaces
export interface IScoreFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface IHistoricalScore {
  score: number;
  date: Date;
}

export interface ICreditScore extends Document {
  userId: string;
  score: number;
  provider: 'Equifax' | 'Experian' | 'TransUnion';
  date: Date;
  factors: IScoreFactor[];
  history: IHistoricalScore[];
}

// Schemas
const ScoreFactorSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  impact: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const HistoricalScoreSchema: Schema = new Schema({
  score: {
    type: Number,
    required: true,
    min: 300,
    max: 850,
  },
  date: {
    type: Date,
    required: true,
  },
});

const CreditScoreSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  score: {
    type: Number,
    required: true,
    min: 300,
    max: 850,
  },
  provider: {
    type: String,
    required: true,
    enum: ['Equifax', 'Experian', 'TransUnion'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  factors: {
    type: [ScoreFactorSchema],
    required: true,
  },
  history: {
    type: [HistoricalScoreSchema],
    default: [],
  },
});

// Model
export const CreditScore = mongoose.model<ICreditScore>('CreditScore', CreditScoreSchema, 'credit_scores');

// Human tasks (commented)
/*
TODO: Human tasks
- Review and adjust the credit score range (300-850) based on the specific credit scoring model used
- Implement data validation to ensure that historical scores are in chronological order
- Consider adding more credit score providers if needed
- Implement a mechanism to automatically update the credit score periodically
- Add indexes for frequently queried fields to improve performance
*/