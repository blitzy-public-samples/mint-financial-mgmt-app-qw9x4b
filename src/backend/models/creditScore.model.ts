import { Schema, model, Document } from 'mongoose';

// Interface defining the structure of a credit score document
export interface ICreditScore extends Document {
  userId: Schema.Types.ObjectId;
  score: number;
  provider: string;
  date: Date;
  factors: string[];
}

// Mongoose schema for the CreditScore model
const creditScoreSchema = new Schema<ICreditScore>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    factors: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Mongoose model for CreditScore
export const CreditScoreModel = model<ICreditScore>('CreditScore', creditScoreSchema, 'creditScores');

// List of human tasks
/*
Human tasks:
1. Update src/backend/models/index.ts to include and export the CreditScoreModel (Required)
2. Ensure that the User model is properly defined and exported, as it is referenced in the CreditScore model (Critical)
3. Verify that the credit score range (300-850) is correct for the credit scoring system being used (Required)
4. Consider adding validation for the 'provider' field to ensure only valid credit score providers are accepted (Optional)
*/