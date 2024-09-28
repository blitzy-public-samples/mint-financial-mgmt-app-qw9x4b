import mongoose, { Schema, Document } from 'mongoose';
import { mongodbConfig } from '../../config/mongodb.config';

// Interface for the FinancialInsight document
export interface IFinancialInsight extends Document {
  userId: string;
  type: 'spending' | 'saving' | 'investment' | 'budget' | 'goal';
  title: string;
  description: string;
  category: string;
  impact: number;
  createdAt: Date;
  expiresAt?: Date;
  isRead: boolean;
  relatedData: Record<string, any>;
}

// Mongoose schema for financial insights
const FinancialInsightSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['spending', 'saving', 'investment', 'budget', 'goal']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  impact: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedData: {
    type: Object
  }
});

// Create and export the Mongoose model
const FinancialInsight = mongodbConfig.model<IFinancialInsight>('FinancialInsight', FinancialInsightSchema, 'financial_insights');

export default FinancialInsight;

// Human tasks:
// TODO: Review and adjust the 'type' enum values based on all possible insight types
// TODO: Implement data validation for the 'impact' field to ensure it's within a meaningful range
// TODO: Consider adding more specific fields or nested objects in 'relatedData' based on different insight types
// TODO: Implement a mechanism to automatically remove or archive expired insights