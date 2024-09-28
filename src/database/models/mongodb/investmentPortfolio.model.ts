import mongoose, { Schema, Document } from 'mongoose';

// Interfaces
interface IHolding {
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  value: number;
  assetType: 'stock' | 'bond' | 'etf' | 'mutualFund' | 'crypto' | 'other';
}

interface IPerformance {
  totalReturn: number;
  annualizedReturn: number;
  oneYearReturn?: number;
  threeYearReturn?: number;
  fiveYearReturn?: number;
}

export interface IInvestmentPortfolio extends Document {
  userId: string;
  name: string;
  description: string;
  totalValue: number;
  lastUpdated: Date;
  riskLevel: 'low' | 'medium' | 'high';
  holdings: IHolding[];
  performance: IPerformance;
}

// Schemas
const HoldingSchema: Schema = new Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  value: { type: Number, required: true },
  assetType: { 
    type: String, 
    required: true, 
    enum: ['stock', 'bond', 'etf', 'mutualFund', 'crypto', 'other']
  }
});

const PerformanceSchema: Schema = new Schema({
  totalReturn: { type: Number, required: true },
  annualizedReturn: { type: Number, required: true },
  oneYearReturn: { type: Number },
  threeYearReturn: { type: Number },
  fiveYearReturn: { type: Number }
});

const InvestmentPortfolioSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  totalValue: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  riskLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    required: true 
  },
  holdings: { type: [HoldingSchema], required: true },
  performance: { type: PerformanceSchema, required: true }
});

// Model
export const InvestmentPortfolio = mongoose.model<IInvestmentPortfolio>('InvestmentPortfolio', InvestmentPortfolioSchema, 'investment_portfolios');

// Commented list of human tasks
/*
Human tasks:
1. Review and adjust the 'assetType' enum values based on all possible investment types (Required)
2. Implement data validation for numerical fields to ensure they are non-negative and within reasonable ranges (Required)
3. Consider adding more specific fields for different types of investments (e.g., dividend yield for stocks, maturity date for bonds) (Optional)
4. Implement a mechanism to automatically update 'currentPrice' and 'value' fields periodically (Required)
5. Add indexes for frequently queried fields to improve performance (Optional)
*/